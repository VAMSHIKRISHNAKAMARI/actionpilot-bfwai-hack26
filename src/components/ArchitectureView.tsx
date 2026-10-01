// ============================================================
// ArchitectureView — System architecture diagram
// ============================================================

import { ArrowDown, ExternalLink } from 'lucide-react';

interface NodeProps {
  label: string;
  sub?: string;
  color?: 'amber' | 'green' | 'blue' | 'muted' | 'red';
  tag?: string;
}

function ArchNode({ label, sub, color = 'muted', tag }: NodeProps) {
  const colorMap = {
    amber: 'border-[#92400e] bg-[#1a0e00] text-[#f59e0b]',
    green: 'border-[#14532d] bg-[#061412] text-[#22c55e]',
    blue: 'border-[#1e3a8a] bg-[#050d1a] text-[#60a5fa]',
    red: 'border-[#7f1d1d] bg-[#1a0808] text-[#ef4444]',
    muted: 'border-[#2a2a32] bg-[#141418] text-[#9090a0]',
  };

  return (
    <div className={`rounded border px-4 py-2.5 text-center ${colorMap[color]}`}>
      <div className="text-xs font-mono font-semibold tracking-wider">{label}</div>
      {sub && <div className="text-[10px] opacity-60 mt-0.5 font-mono">{sub}</div>}
      {tag && <div className="text-[9px] mt-1 opacity-50 border border-current rounded px-1 inline-block">{tag}</div>}
    </div>
  );
}

function Arrow() {
  return (
    <div className="flex justify-center py-1">
      <ArrowDown size={14} className="text-[#3a3a44]" />
    </div>
  );
}

export function ArchitectureView() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="mb-8">
          <div className="text-[#5a5a6a] text-[10px] font-mono tracking-widest uppercase mb-2">System Architecture</div>
          <h1 className="text-[#e8e8ec] text-xl font-semibold">ActionPilot Architecture</h1>
          <p className="text-[#5a5a6a] text-xs mt-2 max-w-lg">
            MVP adapter architecture. Designed for future LLM/MCP/API integration.
            All current integrations are deterministic sandbox implementations.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {/* Main flow column */}
          <div className="col-span-2">
            <div className="text-[#3a3a44] text-[10px] font-mono tracking-wider mb-4">EXECUTION FLOW</div>
            <div className="space-y-0">
              <ArchNode label="USER GOAL" sub="Natural language input" color="amber" />
              <Arrow />
              <ArchNode label="PLANNER" sub="demoPlanner.ts · IPlanner interface" color="amber" tag="LLM-READY" />
              <Arrow />
              <ArchNode label="TASK GRAPH" sub="Ordered PlanStep[] with tool routing" color="muted" />
              <Arrow />
              <ArchNode label="TOOL ROUTER" sub="Maps steps → tool adapters" color="muted" />
              <Arrow />

              {/* Tool row */}
              <div className="grid grid-cols-4 gap-2 my-1">
                <ArchNode label="MAIL" sub="mailTool" color="blue" />
                <ArchNode label="CALENDAR" sub="calTool" color="blue" />
                <ArchNode label="FORMS" sub="formsTool" color="blue" />
                <ArchNode label="WEB" sub="webTool" color="blue" />
              </div>
              <Arrow />

              <ArchNode label="EXECUTOR" sub="executor.ts · step state machine" color="muted" />
              <Arrow />
              <ArchNode label="VERIFIER" sub="verifier.ts · output validation" color="green" />
              <Arrow />

              {/* Approval gate */}
              <div className="border-2 border-[#d97706] rounded p-3 bg-[#0d0a00]">
                <div className="text-[#f59e0b] text-[10px] font-mono tracking-wider text-center mb-1">HUMAN APPROVAL GATE</div>
                <div className="text-[#3a3a44] text-[10px] font-mono text-center">Blocks high-impact actions until user approves</div>
                <div className="flex gap-2 justify-center mt-2">
                  <span className="text-[9px] font-mono border border-[#14532d] text-[#22c55e] px-2 py-0.5 rounded">APPROVE → CONTINUE</span>
                  <span className="text-[9px] font-mono border border-[#7f1d1d] text-[#ef4444] px-2 py-0.5 rounded">DENY → STOP</span>
                </div>
              </div>
              <Arrow />

              <ArchNode label="ACTION LOG" sub="ExecutionEvent[] · Proof of Work" color="green" />
            </div>
          </div>

          {/* Side column */}
          <div className="space-y-6">
            {/* Adapter layer */}
            <div>
              <div className="text-[#3a3a44] text-[10px] font-mono tracking-wider mb-3">ADAPTER LAYER · MVP</div>
              <div className="border border-[#2a2a32] rounded p-4 space-y-2">
                {[
                  { label: 'Browser DOM', status: 'sandbox' },
                  { label: 'REST API', status: 'planned' },
                  { label: 'MCP Protocol', status: 'planned' },
                  { label: 'OAuth2 Flows', status: 'planned' },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-[#9090a0] text-xs font-mono">{item.label}</span>
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${
                      item.status === 'sandbox'
                        ? 'border-[#92400e] text-[#d97706]'
                        : 'border-[#2a2a32] text-[#3a3a44]'
                    }`}>
                      {item.status.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Safety model */}
            <div>
              <div className="text-[#3a3a44] text-[10px] font-mono tracking-wider mb-3">SAFETY CLASSIFICATION</div>
              <div className="border border-[#2a2a32] rounded p-4 space-y-3">
                <div>
                  <div className="text-[#22c55e] text-[10px] font-mono mb-2">AUTO-EXECUTE</div>
                  <div className="space-y-1">
                    {['READ', 'SEARCH', 'DRAFT', 'VERIFY'].map(op => (
                      <div key={op} className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-[#22c55e]" />
                        <span className="text-[#5a5a6a] text-[10px] font-mono">{op}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-t border-[#1e1e24] pt-3">
                  <div className="text-[#ef4444] text-[10px] font-mono mb-2">REQUIRES APPROVAL</div>
                  <div className="space-y-1">
                    {['SEND', 'SUBMIT', 'CREATE', 'DELETE'].map(op => (
                      <div key={op} className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-[#ef4444]" />
                        <span className="text-[#5a5a6a] text-[10px] font-mono">{op}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Future integration */}
            <div>
              <div className="text-[#3a3a44] text-[10px] font-mono tracking-wider mb-3">FUTURE INTEGRATION</div>
              <div className="border border-[#1e1e24] rounded p-4 space-y-2">
                {[
                  'Replace IPlanner with LLM call',
                  'Connect real mail via OAuth',
                  'MCP tool adapters',
                  'Streaming execution events',
                  'Multi-agent coordination',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <ExternalLink size={10} className="text-[#3a3a44] mt-0.5 flex-shrink-0" />
                    <span className="text-[#5a5a6a] text-[10px]">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stack */}
        <div className="mt-8 border-t border-[#1e1e24] pt-6">
          <div className="text-[#3a3a44] text-[10px] font-mono tracking-wider mb-4">TECHNOLOGY STACK</div>
          <div className="flex flex-wrap gap-2">
            {['React 19', 'TypeScript', 'Vite', 'Tailwind CSS v4', 'Zustand', 'Lucide Icons', 'Zero external APIs', 'Static build'].map(t => (
              <span key={t} className="px-2.5 py-1 border border-[#2a2a32] rounded text-[#5a5a6a] text-[11px] font-mono">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
