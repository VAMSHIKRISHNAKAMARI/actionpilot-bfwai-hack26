// ============================================================
// ActionPilot — Demo Planner (deterministic, zero-API-key)
// Implements the Planner interface so a real LLM can replace it later.
// ============================================================

import type { Plan, PlanStep, WorkflowId } from '../types';

/** Interface a future LLM-backed planner would implement */
export interface IPlanner {
  generatePlan(goal: string, workflowId: WorkflowId): Promise<Plan>;
}

function makeId(): string {
  return Math.random().toString(36).slice(2, 10);
}

function makeStep(
  stepNumber: number,
  action: string,
  tool: PlanStep['tool'],
  description: string,
  requiresApproval: boolean,
  riskLevel: PlanStep['riskLevel'],
  toolCallName: string,
  toolInput: Record<string, unknown>,
): PlanStep {
  return {
    id: `step-${makeId()}`,
    stepNumber,
    action,
    tool,
    description,
    status: 'queued',
    requiresApproval,
    riskLevel,
    toolCall: { name: toolCallName, input: toolInput },
    retryCount: 0,
  };
}

// ——— Workflow definitions ———

function planInterviewFollowup(goal: string): Plan {
  const steps: PlanStep[] = [
    makeStep(1, 'Find candidate', 'mail', 'Search inbox for interview candidate email', false, 'low', 'mail.search', { query: 'interview', folder: 'inbox' }),
    makeStep(2, 'Read interview details', 'calendar', 'Read calendar for interview event', false, 'low', 'calendar.query', { filter: 'type=interview', date: 'today-1d' }),
    makeStep(3, 'Draft follow-up email', 'mail', 'Generate personalized follow-up draft', false, 'low', 'mail.draft', { template: 'interview_followup', recipient: 'ananya.rao@example.com' }),
    makeStep(4, 'Verify recipient + content', 'verifier', 'Validate email address and draft content', false, 'low', 'verifier.check', { fields: ['recipient', 'subject', 'body'] }),
    makeStep(5, 'Send email', 'mail', 'Send the approved follow-up email', true, 'high', 'mail.send', { to: 'ananya.rao@example.com', subject: 'Interview Follow-up — ActionPilot Demo Co.' }),
    makeStep(6, 'Confirm sent state', 'mail', 'Verify email appears in Sent folder', false, 'low', 'mail.verify_sent', { messageId: 'draft-001' }),
  ];
  return {
    id: `plan-${makeId()}`,
    goal,
    workflowId: 'interview_followup',
    taskType: 'Communication',
    estimatedSteps: steps.length,
    steps,
    generatedAt: Date.now(),
  };
}

function planMeetingScheduling(goal: string): Plan {
  const steps: PlanStep[] = [
    makeStep(1, 'Read calendar', 'calendar', 'Fetch today\'s calendar events', false, 'low', 'calendar.read', { date: 'today' }),
    makeStep(2, 'Detect available slot', 'calendar', 'Find open slot tomorrow afternoon', false, 'low', 'calendar.find_slot', { date: 'tomorrow', preferredTime: 'afternoon' }),
    makeStep(3, 'Prepare invite', 'calendar', 'Draft meeting invite for Ananya Rao', false, 'low', 'calendar.draft_event', { attendees: ['ananya.rao@example.com'], duration: '30min' }),
    makeStep(4, 'Validate attendees', 'verifier', 'Verify attendee email and availability', false, 'low', 'verifier.check', { fields: ['attendees', 'time', 'duration'] }),
    makeStep(5, 'Create calendar event', 'calendar', 'Schedule the event in sandbox calendar', true, 'high', 'calendar.create', { title: 'Follow-up Meeting — Ananya Rao', time: '15:00', attendees: ['ananya.rao@example.com'] }),
    makeStep(6, 'Verify event created', 'verifier', 'Confirm event appears in calendar', false, 'low', 'calendar.verify', { eventId: 'cal-new-001' }),
  ];
  return {
    id: `plan-${makeId()}`,
    goal,
    workflowId: 'meeting_scheduling',
    taskType: 'Scheduling',
    estimatedSteps: steps.length,
    steps,
    generatedAt: Date.now(),
  };
}

function planProjectForm(goal: string): Plan {
  const steps: PlanStep[] = [
    makeStep(1, 'Load form', 'forms', 'Fetch project registration form schema', false, 'low', 'forms.load', { formId: 'form-proj-001' }),
    makeStep(2, 'Prepare fields', 'forms', 'Auto-fill fields from workspace context', false, 'low', 'forms.prefill', { source: 'workspace' }),
    makeStep(3, 'Validate fields', 'verifier', 'Run field validation rules', false, 'low', 'verifier.validate_form', { formId: 'form-proj-001' }),
    makeStep(4, 'Review summary', 'forms', 'Present validation summary for review', false, 'low', 'forms.summary', { showErrors: true }),
    makeStep(5, 'Submit form', 'forms', 'Submit form to sandbox portal', true, 'high', 'forms.submit', { formId: 'form-proj-001', confirmationExpected: true }),
    makeStep(6, 'Verify submission', 'verifier', 'Confirm submission received + code', false, 'low', 'verifier.confirm_submission', { formId: 'form-proj-001' }),
  ];
  return {
    id: `plan-${makeId()}`,
    goal,
    workflowId: 'project_form',
    taskType: 'Data Entry',
    estimatedSteps: steps.length,
    steps,
    generatedAt: Date.now(),
  };
}

// ——— Demo Planner implementation ———

export const demoPlannerImpl: IPlanner = {
  async generatePlan(goal: string, workflowId: WorkflowId): Promise<Plan> {
    // Simulated network latency for realism
    await new Promise(r => setTimeout(r, 800));
    switch (workflowId) {
      case 'interview_followup': return planInterviewFollowup(goal);
      case 'meeting_scheduling': return planMeetingScheduling(goal);
      case 'project_form': return planProjectForm(goal);
    }
  },
};
