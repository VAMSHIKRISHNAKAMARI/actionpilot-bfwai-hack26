// ============================================================
// ExecutionStream — Center panel — REDESIGNED
// Stronger completion state, better empty states, New Run CTA
// ============================================================

import { useAppStore } from '../state/runStore';
import { ToolBadge, StatusBadge } from './ui/StatusBadge';
import { Loader2, CheckCircle2, XCircle, RefreshCw, AlertOctagon, RotateCcw, Zap } from 'lucide-react';
import type { PlanStep } from '../types';

function ToolCallDisplay({ step }: { step: PlanStep }) {
  if (!step.toolCall) return null;
  return (
    <div className="mt-4 space-y-2">
      <div className="text-[#3a3a44] text-[10px] font-mono tracking-wider">TOOL CALL</div>
      <div
        className="rounded p-3 space-y-2.5"
        style={{ background: '#07070a', border: '1px solid #1a1a22' }}
      >
        <div className="flex items-center gap-2">
          <span className="text-[#5a5a6a] text-[10px] font-mono">FN</span>
          <span className="text-[#d97706] text-xs font-mono font-medium">{step.toolCall.name}</span>
        </div>
        {Object.keys(step.toolCall.input).length > 0 && (
          <div>
            <div className="text-[#2a2a32] text-[10px] font-mono mb-1.5 tracking-wider">INPUT</div>
            <div className="space-y-1">
              {Object.entries(step.toolCall.input).map(([k, v]) => (
                <div key={k} className="flex gap-3">
                  <span className="text-[#5a5a6a] text-[10px] font-mono min-w-[72px] flex-shrink-0">{k}</span>
                  <span className="text-[#9090a0] text-[10px] font-mono">{String(v)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {step.toolCall.output !== undefined && (
          <div>
            <div className="text-[#2a2a32] text-[10px] font-mono mb-1.5 tracking-wider">OUTPUT</div>
            <div className="text-[#22c55e] text-[10px] font-mono whitespace-pre-wrap leading-relaxed">
              {typeof step.toolCall.output === 'object'
                ? JSON.stringify(step.toolCall.output, null, 2)
                : String(step.toolCall.output)
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function ExecutionStream() {
  const { currentRun, setActiveSection, addToHistory, setCurrentRun } = useAppStore();

  function handleNewRun() {
    if (currentRun) addToHistory(currentRun);
    setCurrentRun(null);
    setActiveSection('command');
  }

  if (!currentRun) {
    return (
      <div className="h-full flex items-center justify-center bg-[#0d0d0f]">
        <div className="text-center">
          <div className="w-10 h-10 rounded border border-[#1e1e24] flex items-center justify-center mx-auto mb-3">
            <Zap size={18} className="text-[#2a2a32]" />
          </div>
          <div className="text-[#2a2a32] text-[11px] font-mono tracking-wider">SELECT A WORKFLOW TO BEGIN</div>
        </div>
      </div>
    );
  }

  const { plan, activeStepId, status } = currentRun;
  const activeStep = plan?.steps.find(s => s.id === activeStepId);

  // ── PLANNING ──────────────────────────────────────────────
  if (status === 'planning') {
    return (
      <div className="h-full bg-[#0d0d0f] flex flex-col items-center justify-center gap-5">
        <Loader2 size={22} className="text-[#d97706] animate-spin-slow" />
        <div className="text-center">
          <div className="text-[#9090a0] text-sm font-mono mb-1">Generating execution plan</div>
          <div className="text-[#3a3a44] text-xs font-mono">
            Analysing goal<span className="dot-1">.</span><span className="dot-2">.</span><span className="dot-3">.</span>
          </div>
        </div>
      </div>
    );
  }

  // ── COMPLETED ─────────────────────────────────────────────
  if (status === 'completed') {
    const s = currentRun.summary;
    return (
      <div className="h-full bg-[#0d0d0f] flex flex-col items-center justify-center px-8 animate-fade-in">
        {/* Icon */}
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mb-5"
          style={{ background: '#061412', border: '2px solid #14532d', boxShadow: '0 0 32px rgba(34,197,94,0.15)' }}
        >
          <CheckCircle2 size={26} className="text-[#22c55e]" />
        </div>

        {/* Title */}
        <div className="text-[#22c55e] text-base font-mono font-semibold tracking-wider mb-1">TASK COMPLETED</div>
        <div className="text-[#5a5a6a] text-xs font-mono mb-6">All steps verified · Proof of work available</div>

        {/* Metrics grid */}
        {s && (
          <div
            className="w-full max-w-xs rounded grid grid-cols-3 divide-x divide-[#1e1e24] mb-6"
            style={{ border: '1px solid #1e1e24', background: '#0a0a0c' }}
          >
            {[
              { label: 'STEPS', value: String(s.steps), color: '#e8e8ec' },
              { label: 'APPROVALS', value: String(s.approvals), color: '#d97706' },
              { label: 'TIME', value: `${(s.executionTimeMs / 1000).toFixed(1)}s`, color: '#e8e8ec' },
            ].map(({ label, value, color }) => (
              <div key={label} className="px-4 py-3 text-center">
                <div className="text-[#3a3a44] text-[9px] font-mono tracking-wider mb-1">{label}</div>
                <div className="font-mono font-semibold text-sm" style={{ color }}>{value}</div>
              </div>
            ))}
          </div>
        )}

        {/* Verification badge */}
        <div className="flex items-center gap-2 mb-6 px-3 py-1.5 rounded"
          style={{ border: '1px solid #14532d', background: '#061412' }}
        >
          <CheckCircle2 size={12} className="text-[#22c55e]" />
          <span className="text-[#22c55e] text-[10px] font-mono tracking-wider">VERIFICATION PASSED</span>
          <span className="text-[#1e3a2a] mx-1">·</span>
          <span className="text-[#22c55e] text-[10px] font-mono tracking-wider">PROOF AVAILABLE →</span>
        </div>

        {/* New run CTA */}
        <button
          onClick={handleNewRun}
          className="flex items-center gap-2 px-5 py-2 rounded text-xs font-mono transition-all"
          style={{ border: '1px solid #2a2a32', color: '#5a5a6a', background: 'transparent' }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = '#d97706';
            (e.currentTarget as HTMLButtonElement).style.color = '#d97706';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = '#2a2a32';
            (e.currentTarget as HTMLButtonElement).style.color = '#5a5a6a';
          }}
        >
          <RotateCcw size={12} />
          New Run
        </button>
      </div>
    );
  }

  // ── DENIED ────────────────────────────────────────────────
  if (status === 'denied') {
    return (
      <div className="h-full bg-[#0d0d0f] flex flex-col items-center justify-center px-8 animate-fade-in">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mb-5"
          style={{ background: '#120808', border: '2px solid #7f1d1d' }}
        >
          <XCircle size={26} className="text-[#ef4444]" />
        </div>
        <div className="text-[#ef4444] text-base font-mono font-semibold tracking-wider mb-1">EXECUTION STOPPED</div>
        <div className="text-[#5a5a6a] text-xs font-mono mb-6">Action denied by user · No external effects occurred</div>
        <div
          className="flex items-center gap-2 mb-6 px-3 py-1.5 rounded text-[10px] font-mono text-[#3a3a44]"
          style={{ border: '1px solid #1e1e24' }}
        >
          Sandbox state unchanged · Safe to retry
        </div>
        <button
          onClick={handleNewRun}
          className="flex items-center gap-2 px-5 py-2 rounded text-xs font-mono transition-all"
          style={{ border: '1px solid #2a2a32', color: '#5a5a6a', background: 'transparent' }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = '#d97706';
            (e.currentTarget as HTMLButtonElement).style.color = '#d97706';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = '#2a2a32';
            (e.currentTarget as HTMLButtonElement).style.color = '#5a5a6a';
          }}
        >
          <RotateCcw size={12} />
          New Run
        </button>
      </div>
    );
  }

  // ── FAILURE / RETRY ───────────────────────────────────────
  const failedStep = plan?.steps.find(s => s.status === 'failed' || s.status === 'retrying');
  if (failedStep && status !== 'awaiting_approval') {
    const isRetrying = failedStep.status === 'retrying';
    return (
      <div className="h-full bg-[#0d0d0f] flex flex-col p-6 gap-4 overflow-y-auto animate-fade-in">
        {/* Failure block */}
        <div className="rounded p-4" style={{ border: '1px solid #7f1d1d', background: '#0d0404' }}>
          <div className="flex items-center gap-2 mb-3">
            <AlertOctagon size={14} className="text-[#ef4444]" />
            <span className="text-[#ef4444] text-[10px] font-mono font-semibold tracking-wider">FAILURE DETECTED</span>
          </div>
          <div className="text-[#c8c8d0] text-sm font-medium mb-1">{failedStep.action}</div>
          <div className="text-[#ef4444] text-[11px] font-mono">{failedStep.error ?? 'Sandbox tool timeout'}</div>
        </div>

        {/* Recovery block */}
        <div className="rounded p-4" style={{ border: '1px solid #92400e', background: '#0a0700' }}>
          <div className="flex items-center gap-2 mb-2">
            <RefreshCw size={13} className={`text-[#f59e0b] ${isRetrying ? 'animate-spin-slow' : ''}`} />
            <span className="text-[#f59e0b] text-[10px] font-mono font-semibold tracking-wider">
              {isRetrying ? 'SAFE RETRY IN PROGRESS' : 'RECOVERY COMPLETE'}
            </span>
          </div>
          {isRetrying ? (
            <div className="text-[#5a5a6a] text-xs font-mono">
              Retrying<span className="dot-1">.</span><span className="dot-2">.</span><span className="dot-3">.</span>
              <span className="ml-2 text-[#3a3a44]">No external state was modified</span>
            </div>
          ) : (
            <div className="text-[#5a5a6a] text-xs font-mono">Retry succeeded · Execution resumed</div>
          )}
        </div>

        {/* Recovery chain */}
        <div className="space-y-1">
          {[
            { label: 'FAILURE DETECTED', done: true, color: '#ef4444' },
            { label: 'SAFE RETRY AVAILABLE', done: true, color: '#f59e0b' },
            { label: isRetrying ? 'RETRYING...' : 'RETRY SUCCEEDED', done: !isRetrying, color: isRetrying ? '#5a5a6a' : '#22c55e' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: item.done ? item.color : '#2a2a32' }} />
              <span className="text-[10px] font-mono" style={{ color: item.done ? item.color : '#2a2a32' }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!activeStep && status !== 'awaiting_approval') {
    return (
      <div className="h-full bg-[#0d0d0f] flex items-center justify-center">
        <div className="text-[#3a3a44] text-xs font-mono">Waiting for execution...</div>
      </div>
    );
  }

  const step = activeStep;
  if (!step) return null;

  // ── ACTIVE STEP ───────────────────────────────────────────
  return (
    <div className="h-full bg-[#0d0d0f] overflow-y-auto p-6 animate-fade-in">
      {/* Step label */}
      <div className="flex items-center gap-2 mb-4">
        <ToolBadge tool={step.tool} />
        <StatusBadge status={step.status} />
        {step.status === 'running' && (
          <div className="ml-auto flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] dot-1" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] dot-2" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] dot-3" />
          </div>
        )}
      </div>

      {/* Step title */}
      <h2 className="text-[#e8e8ec] text-base font-semibold mb-1 leading-snug">{step.action}</h2>
      <p className="text-[#5a5a6a] text-xs mb-5 leading-relaxed">{step.description}</p>

      {/* Sandbox notice */}
      {step.status === 'running' && (
        <div className="flex items-center gap-2 mb-4 text-[#3a3a44] text-[10px] font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] animate-pulse-amber" />
          Executing in sandbox · No external effects
        </div>
      )}

      {/* Tool call details */}
      <ToolCallDisplay step={step} />

      {/* Verification badge */}
      {step.status === 'verified' && (
        <div className="mt-5 flex items-center gap-2 rounded p-3"
          style={{ background: '#061412', border: '1px solid #14532d' }}
        >
          <CheckCircle2 size={14} className="text-[#22c55e]" />
          <div>
            <div className="text-[#22c55e] text-[10px] font-mono font-semibold tracking-wider">STATE VERIFIED</div>
            <div className="text-[#3a3a44] text-[10px] font-mono mt-0.5">Output validated · Event logged</div>
          </div>
        </div>
      )}
    </div>
  );
}
