// ============================================================
// SettingsView — Configuration & project info
// ============================================================

import { useAppStore } from '../state/runStore';
import { AlertTriangle } from 'lucide-react';

export function SettingsView() {
  const { failureSimulation, setFailureSimulation } = useAppStore();

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto px-6 py-8 space-y-8">

        <div>
          <div className="text-[#5a5a6a] text-[10px] font-mono tracking-widest uppercase mb-2">Settings</div>
          <h1 className="text-[#e8e8ec] text-xl font-semibold">Configuration</h1>
        </div>

        {/* Execution */}
        <div>
          <div className="text-[#3a3a44] text-[10px] font-mono tracking-wider mb-3">EXECUTION</div>
          <div className="border border-[#1e1e24] rounded divide-y divide-[#1e1e24]">
            <div className="px-4 py-3 flex items-center justify-between">
              <div>
                <div className="text-[#c8c8d0] text-sm font-medium">Simulate Recoverable Failure</div>
                <div className="text-[#5a5a6a] text-xs mt-0.5">Forces a failure on the first step to demonstrate retry logic</div>
              </div>
              <div
                onClick={() => setFailureSimulation(!failureSimulation)}
                className={`w-10 h-5 rounded-full relative transition-colors cursor-pointer flex-shrink-0 ${
                  failureSimulation ? 'bg-[#92400e]' : 'bg-[#2a2a32]'
                }`}
              >
                <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-transform ${
                  failureSimulation ? 'translate-x-5 bg-[#f59e0b]' : 'translate-x-0.5 bg-[#5a5a6a]'
                }`} />
              </div>
            </div>
          </div>
        </div>

        {/* Sandbox info */}
        <div>
          <div className="text-[#3a3a44] text-[10px] font-mono tracking-wider mb-3">SANDBOX STATUS</div>
          <div className="border border-[#1e1e24] rounded divide-y divide-[#1e1e24]">
            {[
              { label: 'Mail Workspace', value: 'SANDBOX · 4 messages' },
              { label: 'Calendar Workspace', value: 'SANDBOX · 4 events' },
              { label: 'Forms Workspace', value: 'SANDBOX · 1 form' },
              { label: 'Web Workspace', value: 'SANDBOX · static results' },
              { label: 'External APIs', value: 'NONE · zero-API demo' },
              { label: 'Authentication', value: 'NOT REQUIRED' },
            ].map(item => (
              <div key={item.label} className="px-4 py-3 flex items-center justify-between">
                <span className="text-[#9090a0] text-xs">{item.label}</span>
                <span className="text-[#3a3a44] text-[10px] font-mono">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Project info */}
        <div>
          <div className="text-[#3a3a44] text-[10px] font-mono tracking-wider mb-3">PROJECT</div>
          <div className="border border-[#1e1e24] rounded p-4 space-y-2">
            {[
              ['Hackathon', 'BFWAI / Hack 26'],
              ['Problem Statement', 'PS-01 — Autonomous Agents for Everyday Apps'],
              ['Version', '0.1.0'],
              ['Planner', 'Demo (deterministic) · IPlanner interface'],
              ['Build', 'Vite · Static · Zero backend'],
              ['Deployment', 'GitHub Pages ready'],
            ].map(([k, v]) => (
              <div key={k} className="flex items-start gap-4">
                <span className="text-[#3a3a44] text-[10px] font-mono min-w-[140px]">{k}</span>
                <span className="text-[#9090a0] text-xs">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Limitations */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={12} className="text-[#f59e0b]" />
            <div className="text-[#f59e0b] text-[10px] font-mono tracking-wider">KNOWN LIMITATIONS</div>
          </div>
          <div className="border border-[#92400e] bg-[#1a0e00] rounded p-4 space-y-1.5">
            {[
              'All integrations are sandbox demos — no real mail, calendar, or form submissions',
              'Planner is deterministic — does not call any LLM API',
              'No production credentials required or used',
              'No external communications occur',
              'Session state is in-memory — resets on page refresh',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-[#d97706] text-xs mt-0.5">·</span>
                <span className="text-[#9090a0] text-xs">{item}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
