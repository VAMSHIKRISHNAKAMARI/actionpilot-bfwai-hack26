// ============================================================
// ActionPilot — useRunOrchestrator Hook
// Drives the full execution state machine for a workflow run.
// ============================================================

import { useCallback, useRef } from 'react';
import { useAppStore } from '../state/runStore';
import { demoPlannerImpl } from '../planner/demoPlanner';
import {
  createEvent,
  getStepOutput,
  buildVerification,
  buildApprovalRequest,
  initRun,
} from '../execution/executor';
import type { Run, PlanStep, WorkflowId } from '../types';

const STEP_BASE_DELAY = 1200; // ms between steps

function delay(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}

export function useRunOrchestrator() {
  const { updateRun, setCurrentRun, addToHistory, failureSimulation, setActiveSection } = useAppStore();
  const abortRef = useRef(false);
  const runRef = useRef<Run | null>(null);

  // Helper: push event and update store
  const pushEvent = useCallback((event: ReturnType<typeof createEvent>) => {
    updateRun(run => ({ ...run, events: [...run.events, event] }));
  }, [updateRun]);

  // Helper: update a step's status
  const updateStep = useCallback((stepId: string, patch: Partial<PlanStep>) => {
    updateRun(run => ({
      ...run,
      plan: run.plan ? {
        ...run.plan,
        steps: run.plan.steps.map(s => s.id === stepId ? { ...s, ...patch } : s),
      } : null,
    }));
  }, [updateRun]);

  const startRun = useCallback(async (goal: string, workflowId: WorkflowId) => {
    abortRef.current = false;

    // Initialize run
    const run = initRun(workflowId, goal, failureSimulation);
    runRef.current = run;
    setCurrentRun({ ...run, status: 'planning' });
    setActiveSection('command');

    // Add goal received event
    updateRun(r => ({
      ...r,
      status: 'planning',
      events: [createEvent('goal_received', 'Goal received', { detail: goal })],
    }));

    await delay(600);
    if (abortRef.current) return;

    // Generate plan
    const plan = await demoPlannerImpl.generatePlan(goal, workflowId);
    updateRun(r => ({
      ...r,
      plan,
      status: 'running',
      events: [...r.events, createEvent('plan_generated', 'Plan generated', { detail: `${plan.steps.length} steps planned` })],
    }));

    await delay(500);
    if (abortRef.current) return;

    // Execute each step
    for (const step of plan.steps) {
      if (abortRef.current) break;

      // Mark step running
      const startTime = Date.now();
      updateStep(step.id, { status: 'running', startedAt: startTime });
      updateRun(r => ({ ...r, activeStepId: step.id }));

      pushEvent(createEvent('step_started', `${step.action}`, {
        stepId: step.id,
        tool: step.tool,
        toolCall: step.toolCall ? { name: step.toolCall.name, input: step.toolCall.input } : undefined,
      }));

      await delay(STEP_BASE_DELAY);
      if (abortRef.current) break;

      // Failure simulation: fail the FIRST low-risk step in the run once
      const shouldFail = failureSimulation && step.stepNumber === 1 && !step.requiresApproval;

      if (shouldFail) {
        // Simulate failure
        updateStep(step.id, { status: 'failed', error: 'Sandbox tool timeout' });
        pushEvent(createEvent('step_failed', `${step.action} — failed`, {
          stepId: step.id,
          tool: step.tool,
          detail: 'Sandbox tool timeout',
        }));

        await delay(1000);
        if (abortRef.current) break;

        // Recovery: retry
        pushEvent(createEvent('recovery_started', 'Retry initiated', { stepId: step.id, detail: 'Safe retry available' }));
        updateStep(step.id, { status: 'retrying', retryCount: 1 });
        updateRun(r => ({ ...r, retryCount: r.retryCount + 1 }));

        await delay(1400);
        if (abortRef.current) break;

        pushEvent(createEvent('recovery_succeeded', 'Retry succeeded', { stepId: step.id }));
      }

      // Approval gate
      if (step.requiresApproval) {
        updateStep(step.id, { status: 'awaiting_approval' });
        updateRun(r => {
          const approvalReq = buildApprovalRequest(step, r);
          return {
            ...r,
            status: 'awaiting_approval',
            approvalRequest: approvalReq,
            events: [...r.events, createEvent('approval_requested', `Approval required — ${step.action}`, {
              stepId: step.id,
              tool: step.tool,
            })],
          };
        });
        // Execution pauses here — waiting for user action via approveStep / denyStep
        return;
      }

      // Compute output
      let output: unknown;
      try {
        output = getStepOutput(step, false);
      } catch {
        output = { error: 'step failed' };
      }

      const durationMs = Date.now() - startTime;

      // Complete step
      updateStep(step.id, {
        status: 'completed',
        completedAt: Date.now(),
        durationMs,
        toolCall: step.toolCall ? { ...step.toolCall, output } : undefined,
      });

      // Verification for non-trivial steps
      const verification = buildVerification(step, output);
      updateRun(r => ({
        ...r,
        stepCount: r.stepCount + 1,
        verifications: [...r.verifications, verification],
      }));

      updateStep(step.id, { status: 'verified' });
      pushEvent(createEvent('step_verified', `${step.action} — verified`, {
        stepId: step.id,
        tool: step.tool,
        toolCall: step.toolCall ? { name: step.toolCall.name, input: step.toolCall.input, output } : undefined,
        detail: verification.detail,
      }));

      await delay(300);
    }
  }, [failureSimulation, setCurrentRun, updateRun, updateStep, pushEvent, setActiveSection]);

  const resumeAfterApproval = useCallback(async (approved: boolean) => {
    if (abortRef.current) return;

    const store = useAppStore.getState();
    const run = store.currentRun;
    if (!run || !run.plan || !run.approvalRequest) return;

    const stepId = run.approvalRequest.stepId;
    const stepIndex = run.plan.steps.findIndex(s => s.id === stepId);
    const step = run.plan.steps[stepIndex];
    if (!step) return;

    if (!approved) {
      // Denied
      updateStep(stepId, { status: 'denied' });
      updateRun(r => ({
        ...r,
        status: 'denied',
        approvalRequest: null,
        activeStepId: null,
        approvalCount: r.approvalCount + 1,
        completedAt: Date.now(),
        events: [...r.events, createEvent('denied', `${step.action} — denied by user`, { stepId, tool: step.tool })],
      }));
      // Mark remaining steps skipped
      updateRun(r => ({
        ...r,
        plan: r.plan ? {
          ...r.plan,
          steps: r.plan.steps.map((s, i) => i > stepIndex ? { ...s, status: 'skipped' as const } : s),
        } : null,
      }));
      addToHistory({ ...useAppStore.getState().currentRun! });
      return;
    }

    // Approved — execute the approved step
    updateStep(stepId, { status: 'running' });
    updateRun(r => ({
      ...r,
      status: 'running',
      approvalRequest: null,
      approvalCount: r.approvalCount + 1,
      events: [...r.events, createEvent('approved', `${step.action} — approved by user`, { stepId, tool: step.tool })],
    }));

    await delay(1200);

    const output = getStepOutput(step, false);
    const durationMs = 1200;
    updateStep(stepId, {
      status: 'completed',
      completedAt: Date.now(),
      durationMs,
      toolCall: step.toolCall ? { ...step.toolCall, output } : undefined,
    });

    pushEvent(createEvent('step_completed', `${step.action} — completed`, {
      stepId,
      tool: step.tool,
      toolCall: step.toolCall ? { name: step.toolCall.name, input: step.toolCall.input, output } : undefined,
    }));

    const verification = buildVerification(step, output);
    updateRun(r => ({
      ...r,
      stepCount: r.stepCount + 1,
      verifications: [...r.verifications, verification],
    }));
    updateStep(stepId, { status: 'verified' });

    pushEvent(createEvent('step_verified', `${step.action} — verified`, {
      stepId,
      tool: step.tool,
      detail: verification.detail,
    }));

    await delay(500);

    // Continue remaining steps
    const remainingSteps = run.plan.steps.slice(stepIndex + 1);
    for (const s of remainingSteps) {
      if (abortRef.current) break;

      const startTime = Date.now();
      updateStep(s.id, { status: 'running', startedAt: startTime });
      updateRun(r => ({ ...r, activeStepId: s.id }));

      pushEvent(createEvent('step_started', `${s.action}`, {
        stepId: s.id,
        tool: s.tool,
        toolCall: s.toolCall ? { name: s.toolCall.name, input: s.toolCall.input } : undefined,
      }));

      await delay(STEP_BASE_DELAY);
      if (abortRef.current) break;

      const out = getStepOutput(s, false);
      const dur = Date.now() - startTime;
      updateStep(s.id, {
        status: 'completed',
        completedAt: Date.now(),
        durationMs: dur,
        toolCall: s.toolCall ? { ...s.toolCall, output: out } : undefined,
      });

      const v = buildVerification(s, out);
      updateRun(r => ({
        ...r,
        stepCount: r.stepCount + 1,
        verifications: [...r.verifications, v],
      }));
      updateStep(s.id, { status: 'verified' });

      pushEvent(createEvent('step_verified', `${s.action} — verified`, {
        stepId: s.id,
        tool: s.tool,
        toolCall: s.toolCall ? { name: s.toolCall.name, input: s.toolCall.input, output: out } : undefined,
        detail: v.detail,
      }));

      await delay(300);
    }

    // Finalize
    const finalRun = useAppStore.getState().currentRun!;
    const summary = {
      steps: finalRun.plan?.steps.length ?? 0,
      executionTimeMs: Date.now() - finalRun.startedAt,
      approvals: finalRun.approvalCount,
      retries: finalRun.retryCount,
      verificationPassed: true,
      proofAvailable: true,
    };

    updateRun(r => ({
      ...r,
      status: 'completed',
      activeStepId: null,
      completedAt: Date.now(),
      summary,
      events: [...r.events, createEvent('run_completed', 'Run completed — all steps verified', { detail: 'Proof of work available' })],
    }));

    addToHistory({ ...useAppStore.getState().currentRun! });
  }, [updateRun, updateStep, pushEvent, addToHistory]);

  const abortRun = useCallback(() => {
    abortRef.current = true;
  }, []);

  return { startRun, resumeAfterApproval, abortRun };
}
