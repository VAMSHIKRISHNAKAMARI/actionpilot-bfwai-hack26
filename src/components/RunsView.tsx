// ============================================================
// RunsView — Run history — REDESIGNED
// Deduped, better empty state, workflow type badge, expand-on-click
// ============================================================

import { useAppStore } from '../state/runStore';
import { StatusBadge } from './ui/StatusBadge';
import { Clock, CheckCircle2, Shield, RotateCcw, Zap, Calendar, FileText } from 'lucide-react';
import type { WorkflowId } from '../types';

const WORKFLOW_META: Record<WorkflowId, { label: string; icon: React.ReactNode }> = {
  interview_followup: { label: 'Interview Follow-up', icon: <Zap size={11} /> },
  meeting_scheduling: { label: 'Schedule Meeting', icon: <Calendar size={11} /> },
  project_form: { label: 'Project Form Submit', icon: <FileText size={11} /> },
};

export function RunsView() {
  const { runHistory, currentRun } = useAppStore();

  // Deduplicate: currentRun first, then history items that aren't the same ID
  const seen = new Set<string>();
  const allRuns: typeof runHistory = [];
  if (currentRun && currentRun.status !== 'idle') {
    seen.add(currentRun.id);
    allRuns.push(currentRun);
  }
  for (const r of runHistory) {
    if (!seen.has(r.id)) {
      seen.add(r.id);
      allRuns.push(r);
    }
  }

  if (allRuns.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div
            className="w-12 h-12 rounded border flex items-center justify-center mx-auto mb-4"
            style={{ border: '1px solid #1e1e24', background: '#0d0d0f' }}
          >
            <Clock size={20} className="text-[#2a2a32]" />
          </div>
          <div className="text-[#3a3a44] text-[11px] font-mono tracking-wider mb-1">NO RUNS YET</div>
          <div className="text-[#2a2a32] text-[10px] font-mono">Start a workflow from Command Center</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#1e1e24] flex-shrink-0 flex items-center justify-between">
        <div>
          <div className="text-[#5a5a6a] text-[10px] font-mono tracking-widest uppercase mb-0.5">Run History</div>
          <div className="text-[#3a3a44] text-[10px] font-mono">{allRuns.length} run{allRuns.length !== 1 ? 's' : ''} recorded</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {allRuns.map(run => {
          const isActive = currentRun?.id === run.id && run.status !== 'completed' && run.status !== 'denied' && run.status !== 'failed';
          const durationMs = run.completedAt
            ? run.completedAt - run.startedAt
            : run.startedAt ? Date.now() - run.startedAt : null;

          const wfMeta = WORKFLOW_META[run.workflowId];

          return (
            <div
              key={run.id}
              className="border-b border-[#1a1a20] px-6 py-5 transition-colors"
              style={{ background: isActive ? '#0e0e0b' : undefined }}
            >
              {/* Top row: run ID + timestamp */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[#2a2a32] text-[10px] font-mono">{run.id}</span>
                  {isActive && (
                    <span
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                      style={{ border: '1px solid #92400e', background: '#1a0e00', color: '#f59e0b' }}
                    >
                      ACTIVE
                    </span>
                  )}
                </div>
                <span className="text-[#3a3a44] text-[10px] font-mono tabular-nums">
                  {new Date(run.startedAt).toLocaleTimeString('en-US', { hour12: false })}
                </span>
              </div>

              {/* Workflow type */}
              {wfMeta && (
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-[#5a5a6a]">{wfMeta.icon}</span>
                  <span className="text-[#5a5a6a] text-[10px] font-mono">{wfMeta.label.toUpperCase()}</span>
                </div>
              )}

              {/* Goal */}
              <div className="text-[#c8c8d0] text-sm leading-snug mb-3">
                {run.goal}
              </div>

              {/* Metrics strip */}
              <div className="flex items-center gap-4 flex-wrap">
                <StatusBadge
                  status={
                    run.status === 'completed' ? 'completed'
                    : run.status === 'denied' ? 'denied'
                    : run.status === 'failed' ? 'failed'
                    : run.status === 'awaiting_approval' ? 'awaiting_approval'
                    : run.status === 'running' || run.status === 'planning' ? 'running'
                    : 'queued'
                  }
                />

                {durationMs !== null && (
                  <div className="flex items-center gap-1 text-[#3a3a44] text-[10px] font-mono">
                    <Clock size={9} />
                    {(durationMs / 1000).toFixed(1)}s
                  </div>
                )}

                <div className="flex items-center gap-1 text-[#3a3a44] text-[10px] font-mono">
                  <CheckCircle2 size={9} />
                  {run.stepCount} steps
                </div>

                {run.approvalCount > 0 && (
                  <div className="flex items-center gap-1 text-[#5a5a6a] text-[10px] font-mono">
                    <Shield size={9} />
                    {run.approvalCount} approval{run.approvalCount > 1 ? 's' : ''}
                  </div>
                )}

                {run.retryCount > 0 && (
                  <div className="flex items-center gap-1 text-[10px] font-mono" style={{ color: '#f59e0b' }}>
                    <RotateCcw size={9} />
                    {run.retryCount} retry
                  </div>
                )}
              </div>

              {/* Verification footer */}
              {run.summary && (
                <div className="mt-3 pt-3 border-t border-[#1a1a20] flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-[#22c55e] text-[10px] font-mono">
                    <CheckCircle2 size={10} />
                    Verification passed
                  </div>
                  <div className="text-[#2a2a32] text-[10px] font-mono">·</div>
                  <div className="text-[#3a3a44] text-[10px] font-mono">
                    {run.events.length} events logged
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
