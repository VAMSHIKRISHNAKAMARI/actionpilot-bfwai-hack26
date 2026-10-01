// ============================================================
// ProofOfWork — Right panel: event timeline — REDESIGNED
// Larger event rows, more readable detail, better tool identity
// ============================================================

import { useAppStore } from '../state/runStore';
import { ToolBadge } from './ui/StatusBadge';
import { ChevronDown, ChevronRight, FileText } from 'lucide-react';

function formatTimestamp(ts: number): string {
  return new Date(ts).toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

// Map event types to semantic meaning
const EVENT_STYLE: Record<string, { dot: string; label: string; muted: boolean }> = {
  goal_received:       { dot: '#5a5a6a', label: 'text-[#9090a0]',   muted: true },
  plan_generated:      { dot: '#5a5a6a', label: 'text-[#9090a0]',   muted: true },
  step_started:        { dot: '#f59e0b', label: 'text-[#f59e0b]',   muted: false },
  step_completed:      { dot: '#3a3a44', label: 'text-[#5a5a6a]',   muted: true },
  step_failed:         { dot: '#ef4444', label: 'text-[#ef4444]',   muted: false },
  step_retrying:       { dot: '#f59e0b', label: 'text-[#f59e0b]',   muted: false },
  step_verified:       { dot: '#22c55e', label: 'text-[#22c55e]',   muted: false },
  approval_requested:  { dot: '#d97706', label: 'text-[#d97706]',   muted: false },
  approved:            { dot: '#22c55e', label: 'text-[#22c55e]',   muted: false },
  denied:              { dot: '#ef4444', label: 'text-[#ef4444]',   muted: false },
  verification_passed: { dot: '#22c55e', label: 'text-[#22c55e]',   muted: false },
  run_completed:       { dot: '#22c55e', label: 'text-[#22c55e]',   muted: false },
  run_failed:          { dot: '#ef4444', label: 'text-[#ef4444]',   muted: false },
  recovery_started:    { dot: '#f59e0b', label: 'text-[#f59e0b]',   muted: false },
  recovery_succeeded:  { dot: '#22c55e', label: 'text-[#22c55e]',   muted: false },
};

export function ProofOfWork() {
  const { currentRun, toggleEventExpanded } = useAppStore();

  if (!currentRun) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <FileText size={18} className="text-[#1e1e24] mx-auto mb-2" />
          <div className="text-[#2a2a32] text-[10px] font-mono">No events</div>
        </div>
      </div>
    );
  }

  const { events } = currentRun;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#1e1e24] flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="text-[#5a5a6a] text-[10px] font-mono tracking-widest uppercase">Proof of Work</div>
          {events.length > 0 && (
            <div
              className="text-[10px] font-mono px-1.5 py-0.5 rounded tabular-nums"
              style={{ color: '#d97706', border: '1px solid #92400e', background: '#1a0e00' }}
            >
              {events.length}
            </div>
          )}
        </div>
        <div className="text-[#2a2a32] text-[10px] font-mono mt-0.5">
          {events.length === 0 ? 'Awaiting events...' : 'Immutable audit log'}
        </div>
      </div>

      {/* Events list */}
      <div className="flex-1 overflow-y-auto">
        {events.length === 0 && (
          <div className="px-4 py-8 text-center">
            <div className="text-[#1e1e24] text-[10px] font-mono">Events will appear here during execution</div>
          </div>
        )}

        <div className="py-1">
          {events.map((event, idx) => {
            const isLast = idx === events.length - 1;
            const style = EVENT_STYLE[event.type] ?? { dot: '#3a3a44', label: 'text-[#9090a0]', muted: true };
            const hasDetails = !!(event.detail || event.toolCall);

            return (
              <div key={event.id} className="animate-slide-in-up">
                <div
                  className={`relative flex items-start gap-3 px-4 py-2.5 transition-colors ${
                    hasDetails ? 'cursor-pointer' : ''
                  }`}
                  style={{ background: event.expanded ? '#0d0d0f' : undefined }}
                  onClick={() => hasDetails && toggleEventExpanded(event.id)}
                  onMouseEnter={e => { if (hasDetails) (e.currentTarget as HTMLDivElement).style.background = '#101012'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = event.expanded ? '#0d0d0f' : ''; }}
                >
                  {/* Vertical timeline line */}
                  {!isLast && (
                    <div
                      className="absolute"
                      style={{
                        left: '19px',
                        top: '22px',
                        bottom: 0,
                        width: '1px',
                        background: '#1a1a22',
                      }}
                    />
                  )}

                  {/* Dot */}
                  <div
                    className="flex-shrink-0 mt-1"
                    style={{
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      background: style.dot,
                      marginTop: '5px',
                    }}
                  />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Time + tool */}
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[#2a2a32] text-[10px] font-mono tabular-nums flex-shrink-0">
                        {formatTimestamp(event.timestamp)}
                      </span>
                      {event.tool && <ToolBadge tool={event.tool} />}
                    </div>

                    {/* Label */}
                    <div className={`text-xs font-medium leading-snug ${style.label}`}>
                      {event.label}
                    </div>

                    {/* Detail preview (collapsed) */}
                    {event.detail && !event.expanded && (
                      <div className="text-[#3a3a44] text-[10px] font-mono mt-1 truncate">
                        {event.detail}
                      </div>
                    )}
                  </div>

                  {/* Expand chevron */}
                  {hasDetails && (
                    <div className="flex-shrink-0 mt-1">
                      {event.expanded
                        ? <ChevronDown size={10} className="text-[#3a3a44]" />
                        : <ChevronRight size={10} className="text-[#2a2a32]" />
                      }
                    </div>
                  )}
                </div>

                {/* Expanded detail panel */}
                {event.expanded && (
                  <div
                    className="mx-4 mb-2 ml-8 rounded p-3 text-[10px] font-mono space-y-2 animate-slide-in-up"
                    style={{ background: '#07070a', border: '1px solid #1a1a22' }}
                  >
                    {event.detail && (
                      <div className="text-[#9090a0] leading-relaxed">{event.detail}</div>
                    )}
                    {event.toolCall && (
                      <>
                        <div className="text-[#3a3a44] pt-1 tracking-wider">TOOL · {event.toolCall.name}</div>
                        {Object.entries(event.toolCall.input).map(([k, v]) => (
                          <div key={k} className="flex gap-3">
                            <span className="text-[#5a5a6a] min-w-[64px] flex-shrink-0">{k}</span>
                            <span className="text-[#9090a0]">{String(v)}</span>
                          </div>
                        ))}
                        {event.toolCall.output !== undefined && (
                          <div
                            className="pt-1 leading-relaxed"
                            style={{ color: '#22c55e', borderTop: '1px solid #1a1a22', paddingTop: '6px', marginTop: '4px' }}
                          >
                            {typeof event.toolCall.output === 'object'
                              ? JSON.stringify(event.toolCall.output, null, 1)
                              : String(event.toolCall.output)
                            }
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
