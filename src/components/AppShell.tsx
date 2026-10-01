// ============================================================
// AppShell — Navigation + top bar container
// ============================================================

import { useState, useEffect } from 'react';
import {
  LayoutDashboard, Play, Database, GitBranch, Settings,
  AlertTriangle, ChevronRight
} from 'lucide-react';
import { useAppStore } from '../state/runStore';
import type { NavSection } from '../types';

const NAV_ITEMS: { id: NavSection; label: string; icon: React.ReactNode }[] = [
  { id: 'command',      label: 'Command Center', icon: <LayoutDashboard size={15} /> },
  { id: 'runs',         label: 'Runs',           icon: <Play size={15} /> },
  { id: 'workspaces',   label: 'Workspaces',     icon: <Database size={15} /> },
  { id: 'architecture', label: 'Architecture',   icon: <GitBranch size={15} /> },
  { id: 'settings',     label: 'Settings',       icon: <Settings size={15} /> },
];

function useClock() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { activeSection, setActiveSection, currentRun, failureSimulation } = useAppStore();
  const time = useClock();

  const runStatus = currentRun?.status;
  const runStatusLabel = runStatus
    ? runStatus === 'awaiting_approval' ? 'AWAITING APPROVAL'
    : runStatus === 'completed' ? 'COMPLETED'
    : runStatus === 'denied' ? 'DENIED'
    : runStatus === 'running' ? 'RUNNING'
    : runStatus === 'planning' ? 'PLANNING'
    : runStatus === 'failed' ? 'FAILED'
    : 'IDLE'
    : 'IDLE';

  const runStatusColor = runStatus === 'running' || runStatus === 'planning' ? 'text-[#f59e0b]'
    : runStatus === 'completed' ? 'text-[#22c55e]'
    : runStatus === 'awaiting_approval' ? 'text-[#d97706]'
    : runStatus === 'denied' || runStatus === 'failed' ? 'text-[#ef4444]'
    : 'text-[#5a5a6a]';

  return (
    <div className="flex h-screen bg-[#0d0d0f] overflow-hidden">
      {/* Left Rail */}
      <aside className="w-52 flex-shrink-0 flex flex-col border-r border-[#1e1e24] bg-[#0d0d0f]">
        {/* Logo */}
        <div className="px-4 py-4 border-b border-[#1e1e24]">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 bg-[#d97706] rounded-sm flex items-center justify-center flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1L12 4V10L7 13L2 10V4L7 1Z" stroke="#0d0d0f" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M7 4L9.5 7L7 10L4.5 7L7 4Z" fill="#0d0d0f" />
              </svg>
            </div>
            <div>
              <div className="text-[#e8e8ec] font-semibold text-sm leading-tight tracking-tight">ActionPilot</div>
              <div className="text-[#5a5a6a] text-[10px] font-mono tracking-wider">v0.1.0</div>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-2 overflow-y-auto">
          {NAV_ITEMS.map(item => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`
                  w-full flex items-center gap-2.5 px-4 py-2.5 text-left transition-colors
                  ${isActive
                    ? 'bg-[#1a1a20] text-[#e8e8ec] border-r-2 border-[#d97706]'
                    : 'text-[#9090a0] hover:text-[#c8c8d0] hover:bg-[#141418]'
                  }
                `}
              >
                <span className={isActive ? 'text-[#d97706]' : ''}>{item.icon}</span>
                <span className="text-[13px] font-medium">{item.label}</span>
                {isActive && <ChevronRight size={12} className="ml-auto text-[#3a3a44]" />}
              </button>
            );
          })}
        </nav>

        {/* Bottom status */}
        <div className="border-t border-[#1e1e24] p-4 space-y-2.5">
          {/* Active run indicator */}
          {currentRun && currentRun.status !== 'idle' && (
            <div className="pb-2.5 border-b border-[#1a1a20]">
              <div className="text-[#3a3a44] text-[9px] font-mono tracking-wider mb-1">ACTIVE RUN</div>
              <div className="text-[#5a5a6a] text-[10px] font-mono truncate">{currentRun.id}</div>
            </div>
          )}
          {failureSimulation && (
            <div className="flex items-center gap-1.5">
              <AlertTriangle size={11} className="text-[#f59e0b]" />
              <span className="text-[#f59e0b] text-[10px] font-mono">FAILURE SIM ON</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
            <span className="text-[#3a3a44] text-[10px] font-mono">SANDBOX MODE</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#1e1e24]" />
            <span className="text-[#2a2a32] text-[10px] font-mono">ZERO APIS</span>
          </div>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-10 flex items-center px-4 gap-4 border-b border-[#1e1e24] bg-[#0d0d0f] flex-shrink-0">
          <span className="text-[#5a5a6a] text-[11px] font-mono">WORKSPACE</span>
          <span className="text-[#3a3a44]">·</span>
          <span className="text-[#9090a0] text-[11px] font-mono">DEMO ORG</span>

          <div className="ml-auto flex items-center gap-4">
            {/* Run status */}
            <div className={`flex items-center gap-1.5 ${runStatusColor}`}>
              {(runStatus === 'running' || runStatus === 'planning') && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] animate-pulse-amber" />
              )}
              <span className="text-[10px] font-mono tracking-wider">{runStatusLabel}</span>
            </div>

            <div className="w-px h-3 bg-[#2a2a32]" />

            {/* Sandbox indicator */}
            <div className="flex items-center gap-1.5 bg-[#1a1000] border border-[#92400e] rounded px-2 py-0.5">
              <span className="text-[#d97706] text-[10px] font-mono tracking-wider">SANDBOX</span>
            </div>

            {/* PS-01 */}
            <div className="text-[#3a3a44] text-[10px] font-mono">PS-01</div>

            {/* Clock */}
            <span className="text-[#5a5a6a] text-[11px] font-mono tabular-nums">
              {time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
