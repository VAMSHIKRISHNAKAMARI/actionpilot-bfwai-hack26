// ============================================================
// ActionPilot — Core Type Definitions
// ============================================================

export type ToolId = 'mail' | 'calendar' | 'forms' | 'web' | 'verifier' | 'planner' | 'system';

export type StepStatus =
  | 'queued'
  | 'running'
  | 'awaiting_approval'
  | 'completed'
  | 'failed'
  | 'retrying'
  | 'verified'
  | 'denied'
  | 'skipped';

export type RiskLevel = 'low' | 'medium' | 'high';

export interface PlanStep {
  id: string;
  stepNumber: number;
  action: string;
  tool: ToolId;
  description: string;
  status: StepStatus;
  durationMs?: number;
  startedAt?: number;
  completedAt?: number;
  requiresApproval: boolean;
  riskLevel: RiskLevel;
  toolCall?: {
    name: string;
    input: Record<string, unknown>;
    output?: unknown;
  };
  retryCount?: number;
  error?: string;
}

export interface Plan {
  id: string;
  goal: string;
  workflowId: WorkflowId;
  taskType: string;
  estimatedSteps: number;
  steps: PlanStep[];
  generatedAt: number;
}

export interface ApprovalRequest {
  id: string;
  stepId: string;
  action: string;
  tool: ToolId;
  riskLevel: RiskLevel;
  riskDescription: string;
  preview: {
    label: string;
    value: string;
  }[];
  body?: string;
  requestedAt: number;
}

export interface VerificationResult {
  stepId: string;
  passed: boolean;
  check: string;
  detail: string;
  verifiedAt: number;
}

export interface ExecutionEvent {
  id: string;
  timestamp: number;
  type:
    | 'goal_received'
    | 'plan_generated'
    | 'step_started'
    | 'step_completed'
    | 'step_failed'
    | 'step_retrying'
    | 'step_verified'
    | 'approval_requested'
    | 'approved'
    | 'denied'
    | 'verification_passed'
    | 'run_completed'
    | 'run_failed'
    | 'recovery_started'
    | 'recovery_succeeded';
  stepId?: string;
  label: string;
  detail?: string;
  tool?: ToolId;
  toolCall?: {
    name: string;
    input: Record<string, unknown>;
    output?: unknown;
  };
  expanded?: boolean;
}

export type RunStatus =
  | 'idle'
  | 'planning'
  | 'running'
  | 'awaiting_approval'
  | 'completed'
  | 'failed'
  | 'denied';

export type WorkflowId = 'interview_followup' | 'meeting_scheduling' | 'project_form';

export interface Run {
  id: string;
  workflowId: WorkflowId;
  goal: string;
  status: RunStatus;
  plan: Plan | null;
  activeStepId: string | null;
  events: ExecutionEvent[];
  approvalRequest: ApprovalRequest | null;
  verifications: VerificationResult[];
  startedAt: number;
  completedAt?: number;
  stepCount: number;
  approvalCount: number;
  retryCount: number;
  failureSimulation: boolean;
  summary?: RunSummary;
}

export interface RunSummary {
  steps: number;
  executionTimeMs: number;
  approvals: number;
  retries: number;
  verificationPassed: boolean;
  proofAvailable: boolean;
}

// Workspace types
export interface MailItem {
  id: string;
  from: string;
  fromEmail: string;
  to?: string;
  toEmail?: string;
  subject: string;
  body: string;
  date: string;
  folder: 'inbox' | 'drafts' | 'sent';
  tags?: string[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  attendees: string[];
  location?: string;
  type: 'interview' | 'meeting' | 'review' | 'other';
  status: 'confirmed' | 'tentative' | 'cancelled';
}

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'select' | 'textarea' | 'date';
  value: string;
  valid?: boolean;
  error?: string;
}

export interface FormDefinition {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
  submitted?: boolean;
  submittedAt?: string;
  confirmationCode?: string;
}

export type NavSection = 'command' | 'runs' | 'workspaces' | 'architecture' | 'settings';
