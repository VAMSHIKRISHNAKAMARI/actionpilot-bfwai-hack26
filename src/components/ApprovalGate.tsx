// ============================================================
// ApprovalGate — Full-screen approval surface — REDESIGNED
// ============================================================

import { useState } from 'react';
import { Shield, AlertTriangle, X, CheckCircle2, Lock } from 'lucide-react';
import { useAppStore } from '../state/runStore';
import { useRunOrchestrator } from '../hooks/useRunOrchestrator';

export function ApprovalGate() {
  const { currentRun } = useAppStore();
  const { resumeAfterApproval } = useRunOrchestrator();
  const [isProcessing, setIsProcessing] = useState(false);

  const approvalRequest = currentRun?.approvalRequest;
  if (!approvalRequest || currentRun?.status !== 'awaiting_approval') return null;

  async function handleApprove() {
    setIsProcessing(true);
    await resumeAfterApproval(true);
    setIsProcessing(false);
  }

  async function handleDeny() {
    setIsProcessing(true);
    await resumeAfterApproval(false);
    setIsProcessing(false);
  }

  const isHighRisk = approvalRequest.riskLevel === 'high';

  return (
    // Full overlay — covers the ENTIRE app including sidebar
    <div className="fixed inset-0 z-50 flex animate-fade-in" style={{ background: 'rgba(5,5,7,0.92)' }}>
      {/* Left gutter — keeps visual balance */}
      <div className="w-52 flex-shrink-0 hidden lg:block" />

      {/* Center gate — takes the rest */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div
          className="w-full max-w-xl animate-slide-in-up"
          style={{
            border: '1px solid #d97706',
            background: '#0a0a0c',
            borderRadius: '4px',
            boxShadow: '0 0 60px rgba(217,119,6,0.12), 0 20px 40px rgba(0,0,0,0.8)',
          }}
        >
          {/* Amber top accent bar */}
          <div style={{ height: '3px', background: 'linear-gradient(90deg, #d97706, #f59e0b, #d97706)', borderRadius: '4px 4px 0 0' }} />

          {/* Header */}
          <div className="px-6 pt-5 pb-4 border-b border-[#1e1e24]">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded flex items-center justify-center bg-[#1a0e00] border border-[#92400e]">
                <Lock size={12} className="text-[#d97706]" />
              </div>
              <span className="text-[#d97706] text-[11px] font-mono tracking-widest">ACTION REQUIRES YOUR APPROVAL</span>
            </div>
            <h2 className="text-[#e8e8ec] text-xl font-semibold tracking-tight">
              {approvalRequest.action}
            </h2>
            <p className="text-[#5a5a6a] text-xs mt-1 font-mono">
              Step {currentRun?.plan?.steps.findIndex(s => s.id === approvalRequest.stepId)! + 1} of {currentRun?.plan?.steps.length} · Paused for review
            </p>
          </div>

          {/* Preview fields — metadata table */}
          <div className="px-6 py-4 border-b border-[#1e1e24] space-y-3">
            {approvalRequest.preview.map(item => (
              <div key={item.label} className="flex items-baseline gap-4">
                <span className="text-[#3a3a44] text-[10px] font-mono tracking-wider w-16 flex-shrink-0">{item.label}</span>
                <span className="text-[#c8c8d0] text-sm font-medium">{item.value}</span>
              </div>
            ))}
          </div>

          {/* Body content — expanded height */}
          {approvalRequest.body && (
            <div className="px-6 py-4 border-b border-[#1e1e24]">
              <div className="text-[#3a3a44] text-[10px] font-mono tracking-wider mb-2">CONTENT PREVIEW</div>
              <pre
                className="text-[#9090a0] text-xs leading-relaxed whitespace-pre-wrap font-mono rounded p-3"
                style={{
                  background: '#070709',
                  border: '1px solid #1a1a20',
                  maxHeight: '200px',
                  overflowY: 'auto',
                  fontSize: '11px',
                  lineHeight: '1.7',
                }}
              >
                {approvalRequest.body}
              </pre>
            </div>
          )}

          {/* Risk banner */}
          <div
            className="mx-6 mt-4 mb-2 flex items-center gap-3 rounded px-4 py-3"
            style={{
              border: isHighRisk ? '1px solid #7f1d1d' : '1px solid #92400e',
              background: isHighRisk ? '#120808' : '#100b00',
            }}
          >
            <AlertTriangle size={14} className={isHighRisk ? 'text-[#ef4444]' : 'text-[#f59e0b]'} />
            <div>
              <div className={`text-[10px] font-mono tracking-wider font-semibold ${isHighRisk ? 'text-[#ef4444]' : 'text-[#f59e0b]'}`}>
                {approvalRequest.riskLevel.toUpperCase()}-IMPACT ACTION
              </div>
              <div className="text-[#5a5a6a] text-[11px] mt-0.5">{approvalRequest.riskDescription}</div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="px-6 py-5 flex items-center gap-3">
            <button
              onClick={handleDeny}
              disabled={isProcessing}
              className="flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-all disabled:opacity-40"
              style={{ border: '1px solid #2a2a32', color: '#9090a0', background: 'transparent' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#7f1d1d'; (e.currentTarget as HTMLButtonElement).style.color = '#ef4444'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#2a2a32'; (e.currentTarget as HTMLButtonElement).style.color = '#9090a0'; }}
            >
              <X size={13} />
              Deny
            </button>

            <div className="flex-1" />

            <div className="text-[#2a2a32] text-[10px] font-mono">
              {new Date().toLocaleTimeString('en-US', { hour12: false })}
            </div>

            <button
              onClick={handleApprove}
              disabled={isProcessing}
              className="flex items-center gap-2 px-7 py-2.5 rounded font-semibold text-sm tracking-wide transition-all disabled:cursor-not-allowed"
              style={{
                background: isProcessing ? '#14532d' : '#16a34a',
                color: 'white',
                boxShadow: '0 0 24px rgba(22,163,74,0.25)',
                border: 'none',
              }}
              onMouseEnter={e => { if (!isProcessing) (e.currentTarget as HTMLButtonElement).style.background = '#15803d'; }}
              onMouseLeave={e => { if (!isProcessing) (e.currentTarget as HTMLButtonElement).style.background = '#16a34a'; }}
            >
              <CheckCircle2 size={14} />
              {isProcessing ? 'Processing...' : 'Approve & Continue'}
            </button>
          </div>

          {/* Shield footer */}
          <div className="px-6 pb-4 flex items-center gap-2">
            <Shield size={10} className="text-[#2a2a32]" />
            <span className="text-[#2a2a32] text-[10px] font-mono">No action has been taken yet · Sandbox mode · Zero external effects</span>
          </div>
        </div>
      </div>
    </div>
  );
}
