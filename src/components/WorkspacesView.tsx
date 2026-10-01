// ============================================================
// WorkspacesView — Sandbox mail, calendar, forms, web panels
// ============================================================

import { useState } from 'react';
import { Mail, Calendar, FileText, Globe, Inbox, Send, FileIcon } from 'lucide-react';
import { SANDBOX_MAIL, SANDBOX_CALENDAR, SANDBOX_FORM } from '../data/sandboxData';
import type { MailItem } from '../types';

type WorkspaceTab = 'mail' | 'calendar' | 'forms' | 'web';

const TABS: { id: WorkspaceTab; label: string; icon: React.ReactNode }[] = [
  { id: 'mail',     label: 'Mail',     icon: <Mail size={13} /> },
  { id: 'calendar', label: 'Calendar', icon: <Calendar size={13} /> },
  { id: 'forms',    label: 'Forms',    icon: <FileText size={13} /> },
  { id: 'web',      label: 'Web',      icon: <Globe size={13} /> },
];

function SandboxTag() {
  return (
    <span className="px-1.5 py-0.5 text-[10px] font-mono text-[#d97706] border border-[#92400e] bg-[#1a0e00] rounded tracking-wider">
      SANDBOX
    </span>
  );
}

function MailPanel() {
  const [selectedId, setSelectedId] = useState<string | null>(SANDBOX_MAIL[0]?.id ?? null);
  const [folder, setFolder] = useState<MailItem['folder']>('inbox');

  const filtered = SANDBOX_MAIL.filter(m => m.folder === folder);
  const selected = SANDBOX_MAIL.find(m => m.id === selectedId);

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-56 flex-shrink-0 border-r border-[#1e1e24] flex flex-col">
        {/* Folder tabs */}
        <div className="p-2 border-b border-[#1e1e24] flex gap-1">
          {(['inbox', 'drafts', 'sent'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFolder(f)}
              className={`
                flex items-center gap-1 px-2 py-1 rounded text-[11px] font-mono transition-colors
                ${folder === f ? 'bg-[#1a1a20] text-[#e8e8ec]' : 'text-[#5a5a6a] hover:text-[#9090a0]'}
              `}
            >
              {f === 'inbox' ? <Inbox size={10} /> : f === 'sent' ? <Send size={10} /> : <FileIcon size={10} />}
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Mail list */}
        <div className="flex-1 overflow-y-auto">
          {filtered.map(mail => (
            <div
              key={mail.id}
              onClick={() => setSelectedId(mail.id)}
              className={`
                px-3 py-3 border-b border-[#1a1a20] cursor-pointer transition-colors
                ${selectedId === mail.id ? 'bg-[#1a1a20]' : 'hover:bg-[#141418]'}
              `}
            >
              <div className="text-xs font-medium text-[#c8c8d0] truncate">{mail.from}</div>
              <div className="text-[11px] text-[#9090a0] truncate mt-0.5">{mail.subject}</div>
              <div className="text-[10px] text-[#3a3a44] font-mono mt-1">{mail.date}</div>
              {mail.tags && (
                <div className="flex gap-1 mt-1 flex-wrap">
                  {mail.tags.map(t => (
                    <span key={t} className="text-[9px] font-mono text-[#3a3a44] border border-[#222228] px-1 rounded">{t}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mail content */}
      <div className="flex-1 overflow-y-auto p-5">
        {selected ? (
          <>
            <div className="mb-4 pb-4 border-b border-[#1e1e24]">
              <h3 className="text-[#e8e8ec] text-sm font-semibold mb-3">{selected.subject}</h3>
              <div className="space-y-1 text-xs">
                <div className="flex gap-2">
                  <span className="text-[#3a3a44] font-mono w-14">FROM</span>
                  <span className="text-[#9090a0]">{selected.from} &lt;{selected.fromEmail}&gt;</span>
                </div>
                {selected.to && (
                  <div className="flex gap-2">
                    <span className="text-[#3a3a44] font-mono w-14">TO</span>
                    <span className="text-[#9090a0]">{selected.to} &lt;{selected.toEmail}&gt;</span>
                  </div>
                )}
                <div className="flex gap-2">
                  <span className="text-[#3a3a44] font-mono w-14">DATE</span>
                  <span className="text-[#9090a0] font-mono">{selected.date}</span>
                </div>
              </div>
            </div>
            <pre className="text-[#c8c8d0] text-xs leading-relaxed whitespace-pre-wrap font-sans">{selected.body}</pre>
          </>
        ) : (
          <div className="text-[#3a3a44] text-xs font-mono">Select a message</div>
        )}
      </div>
    </div>
  );
}

function CalendarPanel() {
  const today = SANDBOX_CALENDAR.filter(e => e.date === 'Today');
  const upcoming = SANDBOX_CALENDAR.filter(e => e.date !== 'Today');

  const typeColor: Record<string, string> = {
    interview: 'border-[#1e3a8a] bg-[#050d1a] text-[#60a5fa]',
    meeting: 'border-[#3b0764] bg-[#0a0519] text-[#a78bfa]',
    review: 'border-[#064e3b] bg-[#041a12] text-[#34d399]',
    other: 'border-[#2a2a32] bg-[#141418] text-[#9090a0]',
  };

  function EventCard({ event }: { event: typeof SANDBOX_CALENDAR[0] }) {
    return (
      <div className={`border rounded p-3 mb-2 ${typeColor[event.type]}`}>
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm font-medium">{event.title}</div>
            <div className="text-[11px] font-mono mt-1 opacity-70">
              {event.date} · {event.time} · {event.duration}
            </div>
          </div>
          <span className={`text-[9px] font-mono px-1.5 py-0.5 border rounded ${
            event.status === 'confirmed' ? 'border-[#14532d] text-[#22c55e]'
            : event.status === 'tentative' ? 'border-[#92400e] text-[#f59e0b]'
            : 'border-[#7f1d1d] text-[#ef4444]'
          }`}>
            {event.status.toUpperCase()}
          </span>
        </div>
        <div className="text-[10px] mt-2 opacity-60">
          {event.attendees.join(', ')}
        </div>
        {event.location && (
          <div className="text-[10px] mt-0.5 opacity-50 font-mono">{event.location}</div>
        )}
      </div>
    );
  }

  return (
    <div className="p-5 overflow-y-auto h-full">
      <div className="mb-5">
        <div className="text-[#5a5a6a] text-[10px] font-mono tracking-wider mb-3">TODAY</div>
        {today.map(e => <EventCard key={e.id} event={e} />)}
        {today.length === 0 && <div className="text-[#3a3a44] text-xs font-mono">No events today</div>}
      </div>
      <div>
        <div className="text-[#5a5a6a] text-[10px] font-mono tracking-wider mb-3">UPCOMING</div>
        {upcoming.map(e => <EventCard key={e.id} event={e} />)}
      </div>
    </div>
  );
}

function FormsPanel() {
  const form = SANDBOX_FORM;
  return (
    <div className="p-5 overflow-y-auto h-full">
      <div className="mb-4">
        <h3 className="text-[#e8e8ec] text-sm font-semibold">{form.title}</h3>
        <p className="text-[#5a5a6a] text-xs mt-1">{form.description}</p>
      </div>
      <div className="space-y-3">
        {form.fields.map(field => (
          <div key={field.id} className="border border-[#1e1e24] rounded p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[#5a5a6a] text-[10px] font-mono tracking-wider">{field.label.toUpperCase()}</span>
              {field.valid !== undefined && (
                <span className={`text-[10px] font-mono ${field.valid ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                  {field.valid ? '✓ VALID' : '✗ INVALID'}
                </span>
              )}
            </div>
            <div className="text-[#c8c8d0] text-xs">{field.value}</div>
          </div>
        ))}
      </div>
      {form.submitted && (
        <div className="mt-4 border border-[#14532d] bg-[#061412] rounded p-3">
          <div className="text-[#22c55e] text-xs font-mono font-medium">SUBMITTED</div>
          <div className="text-[#9090a0] text-[11px] mt-1 font-mono">Code: {form.confirmationCode}</div>
        </div>
      )}
    </div>
  );
}

function WebPanel() {
  return (
    <div className="p-5 overflow-y-auto h-full">
      <div className="border border-[#1e1e24] rounded overflow-hidden">
        <div className="bg-[#141418] border-b border-[#1e1e24] px-3 py-2 flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-[#2a2a32]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#2a2a32]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#2a2a32]" />
          </div>
          <div className="flex-1 bg-[#0d0d0f] border border-[#222228] rounded px-2 py-0.5 text-[10px] font-mono text-[#5a5a6a]">
            sandbox.actionpilot.demo/search
          </div>
          <SandboxTag />
        </div>
        <div className="p-4 bg-[#0d0d0f]">
          <div className="text-[#3a3a44] text-[10px] font-mono mb-3">SANDBOX SEARCH RESULTS</div>
          <div className="space-y-3">
            {[
              { title: 'BFWAI Hack 26 — Problem Statements', url: 'hack26.bfwai.demo/ps', snippet: 'PS-01: Autonomous Agents for Everyday Apps...' },
              { title: 'ActionPilot Project Repository', url: 'github.demo/actionpilot', snippet: 'Human-governed cross-app AI execution control center.' },
              { title: 'Demo Org — HR Portal', url: 'hr.company.example.com', snippet: 'Interview management · Candidate tracking · Scheduling' },
            ].map((r, i) => (
              <div key={i} className="pb-3 border-b border-[#1e1e24] last:border-0">
                <div className="text-[#60a5fa] text-xs font-medium mb-0.5">{r.title}</div>
                <div className="text-[#3a3a44] text-[10px] font-mono mb-1">{r.url}</div>
                <div className="text-[#9090a0] text-[11px]">{r.snippet}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function WorkspacesView() {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('mail');

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 border-b border-[#1e1e24] flex-shrink-0 flex items-center gap-4">
        <div className="text-[#5a5a6a] text-[10px] font-mono tracking-widest uppercase">Connected Workspaces</div>
        <SandboxTag />
      </div>

      {/* Tab bar */}
      <div className="border-b border-[#1e1e24] flex-shrink-0">
        <div className="flex">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-5 py-2.5 text-xs font-medium border-b-2 transition-colors
                ${activeTab === tab.id
                  ? 'border-[#d97706] text-[#e8e8ec]'
                  : 'border-transparent text-[#5a5a6a] hover:text-[#9090a0]'
                }
              `}
            >
              <span className={activeTab === tab.id ? 'text-[#d97706]' : ''}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Panel */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'mail'     && <MailPanel />}
        {activeTab === 'calendar' && <CalendarPanel />}
        {activeTab === 'forms'    && <FormsPanel />}
        {activeTab === 'web'      && <WebPanel />}
      </div>
    </div>
  );
}
