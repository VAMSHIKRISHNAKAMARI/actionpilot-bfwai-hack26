// ============================================================
// ExecutionWorkspace — three-panel layout when run is active
// ============================================================

import { ExecutionPlan } from './ExecutionPlan';
import { ExecutionStream } from './ExecutionStream';
import { ProofOfWork } from './ProofOfWork';
import { ApprovalGate } from './ApprovalGate';
import { useAppStore } from '../state/runStore';

export function ExecutionWorkspace() {
  const { currentRun } = useAppStore();
  const showApproval = currentRun?.status === 'awaiting_approval' && currentRun.approvalRequest;

  return (
    <div className="h-full flex relative overflow-hidden">
      {/* Left: Execution Plan — narrow */}
      <div className="w-64 flex-shrink-0 border-r border-[#1e1e24] flex flex-col overflow-hidden">
        <ExecutionPlan />
      </div>

      {/* Center: Live Execution — wide */}
      <div className="flex-1 flex flex-col overflow-hidden border-r border-[#1e1e24] relative">
        <ExecutionStream />
      </div>

      {/* Right: Proof of Work — narrow */}
      <div className="w-64 flex-shrink-0 flex flex-col overflow-hidden">
        <ProofOfWork />
      </div>

      {/* Approval gate overlay */}
      {showApproval && <ApprovalGate />}
    </div>
  );
}
