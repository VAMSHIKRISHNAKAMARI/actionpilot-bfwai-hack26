// ============================================================
// ExecutionPlan — Left panel: numbered steps with statuses
// ============================================================

import { useAppStore } from '../state/runStore';
import { StatusBadge, ToolBadge } from './ui/StatusBadge';
import { Loader2, Clock } from 'lucide-react';

export function ExecutionPlan() {
  const { currentRun } = useAppStore();

  if (!currentRun) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-[#3a3a44] text-xs font-mono text-center">
          <div className="mb-2 opacity-30">
            <div className="w-8 h-8 border border-[#2a2a32] rounded mx-auto" />
          </div>
          No active run
        </div>
      </div>
    );
  }

  const { plan, activeStepId, status } = currentRun;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#1e1e24] flex-shrink-0">
        <div className="text-[#5a5a6a] text-[10px] font-mono tracking-widest uppercase mb-1.5">Execution Plan</div>
        <div className="text-[#e8e8ec] text-sm font-medium leading-snug mb-2" style={{ fontSize: '13px' }}>
          {currentRun.goal.length > 80 ? currentRun.goal.slice(0, 80) + '…' : currentRun.goal}
        </div>
        {plan && (
          <>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[#3a3a44] text-[10px] font-mono">{plan.taskType}</span>
              <span className="text-[#2a2a32]">·</span>
              <span className="text-[#3a3a44] text-[10px] font-mono">{plan.steps.length} STEPS</span>
              <span className="text-[#2a2a32]">·</span>
              <span className={`text-[10px] font-mono ${
                status === 'completed' ? 'text-[#22c55e]'
                : status === 'denied' ? 'text-[#ef4444]'
                : status === 'running' || status === 'planning' ? 'text-[#f59e0b]'
                : status === 'awaiting_approval' ? 'text-[#d97706]'
                : 'text-[#3a3a44]'
              }`}>
                {status.toUpperCase().replace('_', ' ')}
              </span>
            </div>
            {/* Progress bar */}
            {status !== 'planning' && (() => {
              const done = plan.steps.filter(s => s.status === 'completed' || s.status === 'verified').length;
              const pct = Math.round((done / plan.steps.length) * 100);
              return (
                <div className="h-0.5 rounded-full overflow-hidden" style={{ background: '#1a1a20' }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      background: status === 'completed' ? '#22c55e' : status === 'denied' ? '#ef4444' : '#d97706',
                    }}
                  />
                </div>
              );
            })()}
          </>
        )}
      </div>

      {/* Planning state */}
      {status === 'planning' && (
        <div className="px-4 py-6 flex items-center gap-3 flex-shrink-0">
          <Loader2 size={14} className="text-[#d97706] animate-spin-slow" />
          <span className="text-[#9090a0] text-xs font-mono">Generating plan<span className="dot-1">.</span><span className="dot-2">.</span><span className="dot-3">.</span></span>
        </div>
      )}

      {/* Steps list */}
      {plan && (
        <div className="flex-1 overflow-y-auto">
          <div className="py-2">
            {plan.steps.map((step, idx) => {
              const isActive = step.id === activeStepId;
              const isCompleted = step.status === 'completed' || step.status === 'verified';
              const isFailed = step.status === 'failed';
              const isRetrying = step.status === 'retrying';
              const isQueued = step.status === 'queued';
              const isApproval = step.status === 'awaiting_approval';
              const isDenied = step.status === 'denied';
              const isSkipped = step.status === 'skipped';

              return (
                <div
                  key={step.id}
                  className={`
                    relative px-4 py-3 border-b border-[#1a1a20]
                    transition-colors
                    ${isActive ? 'bg-[#141410]' : ''}
                    ${isCompleted ? 'opacity-80' : ''}
                    ${isQueued || isSkipped ? 'opacity-40' : ''}
                  `}
                >
                  {/* Active indicator bar */}
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#d97706]" />
                  )}

                  <div className="flex items-start gap-3">
                    {/* Step number */}
                    <div className={`
                      w-6 h-6 flex-shrink-0 flex items-center justify-center rounded text-[10px] font-mono font-semibold
                      ${isActive && (step.status === 'running' || isRetrying)
                        ? 'bg-[#1a1000] text-[#f59e0b] border border-[#92400e]'
                        : isCompleted ? 'bg-[#061412] text-[#22c55e] border border-[#14532d]'
                        : isFailed ? 'bg-[#1a0808] text-[#ef4444] border border-[#7f1d1d]'
                        : isDenied ? 'bg-[#1a0808] text-[#ef4444] border border-[#7f1d1d]'
                        : isApproval ? 'bg-[#1a1000] text-[#d97706] border border-[#92400e]'
                        : 'bg-[#141418] text-[#3a3a44] border border-[#222228]'
                      }
                    `}>
                      {String(idx + 1).padStart(2, '0')}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`text-xs font-medium ${
                          isActive ? 'text-[#e8e8ec]'
                          : isCompleted ? 'text-[#9090a0]'
                          : isQueued || isSkipped ? 'text-[#3a3a44]'
                          : 'text-[#c8c8d0]'
                        }`}>
                          {step.action}
                        </span>
                        {isActive && (step.status === 'running' || isRetrying) && (
                          <Loader2 size={11} className="text-[#f59e0b] animate-spin-slow" />
                        )}
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <ToolBadge tool={step.tool} />
                        <StatusBadge status={step.status} />
                        {step.durationMs && (
                          <span className="flex items-center gap-1 text-[#3a3a44] text-[10px] font-mono">
                            <Clock size={9} />
                            {step.durationMs < 1000 ? `${step.durationMs}ms` : `${(step.durationMs / 1000).toFixed(1)}s`}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
