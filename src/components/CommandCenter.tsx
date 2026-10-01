// ============================================================
// CommandCenter — Hero screen — REDESIGNED
// Better layout, visual workflow cards, run button hierarchy
// ============================================================

import { useState } from 'react';
import { Play, Zap, Calendar, FileText, AlertTriangle, Shield, ChevronRight } from 'lucide-react';
import { useAppStore } from '../state/runStore';
import { useRunOrchestrator } from '../hooks/useRunOrchestrator';
import type { WorkflowId } from '../types';

const WORKFLOWS: {
  id: WorkflowId;
  label: string;
  goal: string;
  description: string;
  icon: React.ReactNode;
  steps: number;
  tools: string[];
  approvalStep: string;
}[] = [
  {
    id: 'interview_followup',
    label: 'Interview Follow-up',
    goal: 'Prepare and send a follow-up email to the candidate after the interview, after I approve the exact message.',
    description: 'Reads inbox + calendar → drafts email → requests approval → sends → verifies',
    icon: <Zap size={16} />,
    steps: 6,
    tools: ['MAIL', 'CAL', 'VERIFY'],
    approvalStep: 'Approve email before sending',
  },
  {
    id: 'meeting_scheduling',
    label: 'Schedule Meeting',
    goal: 'Schedule a follow-up meeting for tomorrow afternoon and prepare the invite.',
    description: 'Reads calendar → finds slot → drafts invite → requests approval → creates event → verifies',
    icon: <Calendar size={16} />,
    steps: 6,
    tools: ['CAL', 'VERIFY'],
    approvalStep: 'Approve invite before creating',
  },
  {
    id: 'project_form',
    label: 'Project Form Submit',
    goal: 'Prepare and submit the project registration form for BFWAI Hack 26.',
    description: 'Loads form → prefills fields → validates → requests approval → submits → verifies',
    icon: <FileText size={16} />,
    steps: 6,
    tools: ['FORMS', 'VERIFY'],
    approvalStep: 'Approve submission before filing',
  },
];

const TOOL_COLOR: Record<string, string> = {
  MAIL: '#1e3a8a',
  CAL: '#3b0764',
  VERIFY: '#14532d',
  FORMS: '#78350f',
};

export function CommandCenter() {
  const { failureSimulation, setFailureSimulation, currentRun } = useAppStore();
  const { startRun } = useRunOrchestrator();
  const [goalText, setGoalText] = useState('');
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowId | null>(null);
  const [isLaunching, setIsLaunching] = useState(false);

  const isRunning = currentRun?.status === 'running' || currentRun?.status === 'planning' || currentRun?.status === 'awaiting_approval';

  function handleSelectWorkflow(wf: typeof WORKFLOWS[0]) {
    setSelectedWorkflow(wf.id);
    setGoalText(wf.goal);
  }

  async function handleRun() {
    if (!goalText.trim() || isRunning || isLaunching) return;
    const wfId = selectedWorkflow ?? 'interview_followup';
    setIsLaunching(true);
    try {
      await startRun(goalText.trim(), wfId);
    } finally {
      setIsLaunching(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleRun();
    }
  }

  const canRun = goalText.trim() && !isRunning && !isLaunching;

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto px-8 py-10">

        {/* Page header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="text-[#3a3a44] text-[10px] font-mono tracking-widest">ACTIONPILOT</div>
            <div className="h-px flex-1 bg-[#1a1a20]" />
            <div className="text-[#2a2a32] text-[10px] font-mono">BFWAI · HACK 26 · PS-01</div>
          </div>
          <h1 className="text-[26px] font-semibold text-[#e8e8ec] leading-tight tracking-tight mt-4">
            Human-governed execution<br />
            <span style={{ color: '#d97706' }}>for everyday work.</span>
          </h1>
          <p className="text-[#5a5a6a] text-sm mt-3 max-w-md leading-relaxed">
            Give ActionPilot a goal. It plans, routes tools, and pauses for your
            approval before any irreversible action.
          </p>
        </div>

        {/* Two-column layout: workflows + sidebar */}
        <div className="grid grid-cols-5 gap-6 mb-6">

          {/* Workflow cards — 3 cols */}
          <div className="col-span-3 space-y-2">
            <div className="text-[#3a3a44] text-[10px] font-mono tracking-wider mb-3">DEMO WORKFLOWS</div>
            {WORKFLOWS.map(wf => {
              const isSelected = selectedWorkflow === wf.id;
              return (
                <button
                  key={wf.id}
                  onClick={() => handleSelectWorkflow(wf)}
                  disabled={isRunning || isLaunching}
                  className="w-full text-left rounded transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    border: isSelected ? '1px solid #d97706' : '1px solid #1e1e24',
                    background: isSelected ? '#0e0a00' : '#0d0d0f',
                    padding: '14px 16px',
                  }}
                  onMouseEnter={e => {
                    if (!isSelected) (e.currentTarget as HTMLButtonElement).style.borderColor = '#2a2a32';
                  }}
                  onMouseLeave={e => {
                    if (!isSelected) (e.currentTarget as HTMLButtonElement).style.borderColor = '#1e1e24';
                  }}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div
                      className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
                      style={{
                        background: isSelected ? '#1a1000' : '#141418',
                        border: isSelected ? '1px solid #92400e' : '1px solid #1e1e24',
                        color: isSelected ? '#f59e0b' : '#5a5a6a',
                      }}
                    >
                      {wf.icon}
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span
                          className="text-sm font-semibold"
                          style={{ color: isSelected ? '#f59e0b' : '#c8c8d0' }}
                        >
                          {wf.label}
                        </span>
                        <span className="text-[#2a2a32] text-[10px] font-mono">{wf.steps} steps</span>
                      </div>
                      <div className="text-[#5a5a6a] text-xs leading-relaxed mb-2">{wf.description}</div>

                      {/* Tool tags + approval hint */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {wf.tools.map(t => (
                          <span
                            key={t}
                            className="text-[9px] font-mono px-1.5 py-0.5 rounded"
                            style={{
                              border: `1px solid ${TOOL_COLOR[t] ?? '#2a2a32'}`,
                              color: '#5a5a6a',
                            }}
                          >
                            {t}
                          </span>
                        ))}
                        <span className="text-[#2a2a32] text-[9px] font-mono ml-1">· {wf.approvalStep}</span>
                      </div>
                    </div>

                    {isSelected && <ChevronRight size={13} className="text-[#d97706] mt-1 flex-shrink-0" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Safety model panel — 2 cols */}
          <div className="col-span-2">
            <div className="text-[#3a3a44] text-[10px] font-mono tracking-wider mb-3">SAFETY MODEL</div>
            <div
              className="rounded p-4 space-y-4 h-full"
              style={{ border: '1px solid #1e1e24', background: '#0a0a0c' }}
            >
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
                  <div className="text-[#22c55e] text-[10px] font-mono tracking-wider">AUTO-EXECUTE</div>
                </div>
                <div className="space-y-1.5">
                  {['READ', 'SEARCH', 'DRAFT', 'VERIFY', 'VALIDATE'].map(op => (
                    <div key={op} className="flex items-center gap-2">
                      <div className="w-px h-3 bg-[#14532d]" />
                      <span className="text-[#5a5a6a] text-[11px] font-mono">{op}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-[#1a1a20] pt-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ef4444]" />
                  <div className="text-[#ef4444] text-[10px] font-mono tracking-wider">REQUIRES APPROVAL</div>
                </div>
                <div className="space-y-1.5">
                  {['SEND', 'SUBMIT', 'SHARE', 'DELETE', 'CREATE'].map(op => (
                    <div key={op} className="flex items-center gap-2">
                      <div className="w-px h-3 bg-[#7f1d1d]" />
                      <span className="text-[#5a5a6a] text-[11px] font-mono">{op}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-[#1a1a20] pt-3">
                <div className="flex items-center gap-1.5">
                  <Shield size={10} className="text-[#3a3a44]" />
                  <span className="text-[#3a3a44] text-[10px] font-mono">Human-in-the-loop</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Goal input */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[#3a3a44] text-[10px] font-mono tracking-wider">GOAL</div>
            <div className="text-[#2a2a32] text-[10px] font-mono">⌘↵ to run</div>
          </div>
          <textarea
            value={goalText}
            onChange={e => setGoalText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="What do you want ActionPilot to accomplish?"
            rows={3}
            disabled={isRunning || isLaunching}
            className="w-full rounded resize-none transition-colors"
            style={{
              background: '#0d0d0f',
              border: goalText ? '1px solid #3a3a44' : '1px solid #1e1e24',
              color: '#e8e8ec',
              fontSize: '14px',
              padding: '12px 16px',
              fontFamily: 'inherit',
              outline: 'none',
            }}
            onFocus={e => { (e.target as HTMLTextAreaElement).style.borderColor = '#d97706'; }}
            onBlur={e => { (e.target as HTMLTextAreaElement).style.borderColor = goalText ? '#3a3a44' : '#1e1e24'; }}
          />
        </div>

        {/* Action row */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleRun}
            disabled={!canRun}
            className="flex items-center gap-2 rounded font-semibold text-sm tracking-wide transition-all"
            style={{
              background: canRun ? '#d97706' : '#1a1a20',
              color: canRun ? '#0d0d0f' : '#3a3a44',
              padding: '10px 24px',
              border: 'none',
              cursor: canRun ? 'pointer' : 'not-allowed',
              boxShadow: canRun ? '0 0 24px rgba(217,119,6,0.2)' : 'none',
            }}
            onMouseEnter={e => { if (canRun) (e.currentTarget as HTMLButtonElement).style.background = '#b45309'; }}
            onMouseLeave={e => { if (canRun) (e.currentTarget as HTMLButtonElement).style.background = '#d97706'; }}
          >
            <Play size={14} />
            {isLaunching ? 'Launching...' : isRunning ? 'Running...' : 'Run with ActionPilot'}
          </button>

          {/* Failure sim toggle */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <div
              onClick={() => setFailureSimulation(!failureSimulation)}
              className="relative cursor-pointer transition-colors"
              style={{
                width: '32px',
                height: '16px',
                borderRadius: '8px',
                background: failureSimulation ? '#92400e' : '#1e1e24',
              }}
            >
              <div
                className="absolute top-0.5 rounded-full transition-transform"
                style={{
                  width: '12px',
                  height: '12px',
                  transform: failureSimulation ? 'translateX(17px)' : 'translateX(2px)',
                  background: failureSimulation ? '#f59e0b' : '#3a3a44',
                }}
              />
            </div>
            <span className="flex items-center gap-1 text-[11px] font-mono text-[#5a5a6a]">
              {failureSimulation && <AlertTriangle size={10} className="text-[#f59e0b]" />}
              SIMULATE FAILURE
            </span>
          </label>
        </div>

      </div>
    </div>
  );
}
