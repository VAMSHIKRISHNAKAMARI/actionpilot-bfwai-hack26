// ============================================================
// StatusBadge — unified status pill component
// ============================================================

import type { StepStatus } from '../../types';

const STATUS_CONFIG: Record<StepStatus, { label: string; color: string; dot: string }> = {
  queued:            { label: 'QUEUED',           color: 'text-[#5a5a6a] bg-[#1a1a20] border-[#2a2a32]', dot: 'bg-[#3a3a44]' },
  running:           { label: 'RUNNING',          color: 'text-[#f59e0b] bg-[#1a1408] border-[#92400e]', dot: 'bg-[#f59e0b] animate-pulse-amber' },
  awaiting_approval: { label: 'AWAITING APPROVAL', color: 'text-[#d97706] bg-[#1a1000] border-[#92400e]', dot: 'bg-[#d97706]' },
  completed:         { label: 'COMPLETED',        color: 'text-[#22c55e] bg-[#0a1a0e] border-[#14532d]', dot: 'bg-[#22c55e]' },
  failed:            { label: 'FAILED',           color: 'text-[#ef4444] bg-[#1a0808] border-[#7f1d1d]', dot: 'bg-[#ef4444]' },
  retrying:          { label: 'RETRYING',         color: 'text-[#f59e0b] bg-[#1a1000] border-[#92400e]', dot: 'bg-[#f59e0b] animate-spin-slow' },
  verified:          { label: 'VERIFIED',         color: 'text-[#22c55e] bg-[#061412] border-[#14532d]', dot: 'bg-[#22c55e]' },
  denied:            { label: 'DENIED',           color: 'text-[#ef4444] bg-[#1a0808] border-[#7f1d1d]', dot: 'bg-[#ef4444]' },
  skipped:           { label: 'SKIPPED',          color: 'text-[#3a3a44] bg-[#141418] border-[#222228]', dot: 'bg-[#3a3a44]' },
};

interface Props {
  status: StepStatus;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'sm' }: Props) {
  const cfg = STATUS_CONFIG[status];
  const textSize = size === 'sm' ? 'text-[10px]' : 'text-xs';
  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded border font-mono font-medium tracking-wider ${textSize} ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

// Tool badge
const TOOL_LABELS: Record<string, { label: string; color: string }> = {
  mail:     { label: 'MAIL',     color: 'text-[#60a5fa] border-[#1e3a8a] bg-[#050d1a]' },
  calendar: { label: 'CAL',     color: 'text-[#a78bfa] border-[#3b0764] bg-[#0a0519]' },
  forms:    { label: 'FORMS',   color: 'text-[#34d399] border-[#064e3b] bg-[#041a12]' },
  web:      { label: 'WEB',     color: 'text-[#fb923c] border-[#7c2d12] bg-[#1a0a04]' },
  verifier: { label: 'VERIFY',  color: 'text-[#9090a0] border-[#2a2a32] bg-[#141418]' },
  planner:  { label: 'PLANNER', color: 'text-[#d97706] border-[#92400e] bg-[#1a0e00]' },
  system:   { label: 'SYS',     color: 'text-[#5a5a6a] border-[#222228] bg-[#0d0d0f]' },
};

export function ToolBadge({ tool }: { tool: string }) {
  const cfg = TOOL_LABELS[tool] ?? { label: tool.toUpperCase(), color: 'text-[#9090a0] border-[#2a2a32] bg-[#141418]' };
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded border font-mono text-[10px] font-medium tracking-wider ${cfg.color}`}>
      {cfg.label}
    </span>
  );
}
