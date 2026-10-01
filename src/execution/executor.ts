// ============================================================
// ActionPilot — Execution Engine (state-driven, no external APIs)
// ============================================================

import type { Run, PlanStep, ExecutionEvent, ApprovalRequest, VerificationResult } from '../types';

export function makeEventId(): string {
  return `evt-${Math.random().toString(36).slice(2, 9)}`;
}

function makeRunId(): string {
  return `run-${Date.now().toString(36)}`;
}

export function createEvent(
  type: ExecutionEvent['type'],
  label: string,
  opts: Partial<Pick<ExecutionEvent, 'stepId' | 'detail' | 'tool' | 'toolCall'>> = {},
): ExecutionEvent {
  return {
    id: makeEventId(),
    timestamp: Date.now(),
    type,
    label,
    ...opts,
    expanded: false,
  };
}

// Step-level tool call outputs (deterministic per workflow)
export function getStepOutput(step: PlanStep, failureSimulation: boolean): unknown {
  const name = step.toolCall?.name ?? '';
  if (name === 'mail.search') return { matches: 1, candidate: 'Ananya Rao', email: 'ananya.rao@example.com' };
  if (name === 'calendar.query') return { event: 'Interview — Ananya Rao', date: 'Oct 2', time: '14:00', duration: '60min' };
  if (name === 'mail.draft') return { draftId: 'draft-001', wordCount: 82, recipient: 'ananya.rao@example.com' };
  if (name === 'verifier.check') return { valid: true, fields: step.toolCall?.input.fields };
  if (name === 'mail.send') return { messageId: 'sent-001', timestamp: new Date().toISOString(), status: 'delivered' };
  if (name === 'mail.verify_sent') return { found: true, folder: 'sent', messageId: 'sent-001' };
  if (name === 'calendar.read') {
    if (failureSimulation) throw new Error('Sandbox tool timeout');
    return { events: 3, nextFree: 'Tomorrow 15:00' };
  }
  if (name === 'calendar.find_slot') return { slot: 'Tomorrow 15:00–15:30', confidence: 0.97 };
  if (name === 'calendar.draft_event') return { title: 'Follow-up Meeting — Ananya Rao', attendees: 1 };
  if (name === 'calendar.create') return { eventId: 'cal-new-001', created: true };
  if (name === 'calendar.verify') return { exists: true, eventId: 'cal-new-001' };
  if (name === 'forms.load') return { formId: 'form-proj-001', fieldCount: 6, required: 6 };
  if (name === 'forms.prefill') return { filled: 6, skipped: 0 };
  if (name === 'verifier.validate_form') return { valid: true, errors: 0, warnings: 0 };
  if (name === 'forms.summary') return { allValid: true, readyToSubmit: true };
  if (name === 'forms.submit') return { confirmationCode: 'BFWAI-AP-2610', submittedAt: new Date().toISOString() };
  if (name === 'verifier.confirm_submission') return { confirmed: true, code: 'BFWAI-AP-2610' };
  return { success: true };
}

// Generate verification result for a completed step
export function buildVerification(step: PlanStep, output: unknown): VerificationResult {
  const checks: Record<string, { check: string; detail: string }> = {
    'mail.search': { check: 'Candidate email resolved', detail: 'Found: ananya.rao@example.com' },
    'calendar.query': { check: 'Interview event confirmed', detail: 'Oct 2, 14:00–15:00' },
    'mail.draft': { check: 'Draft content valid', detail: '82 words, recipient set' },
    'verifier.check': { check: 'Fields validated', detail: 'All required fields passed' },
    'mail.send': { check: 'Email delivered to sandbox', detail: 'messageId: sent-001' },
    'mail.verify_sent': { check: 'Sent folder confirmed', detail: 'Message found in sent' },
    'calendar.read': { check: 'Calendar accessible', detail: '3 events retrieved' },
    'calendar.find_slot': { check: 'Available slot found', detail: 'Tomorrow 15:00 (97% confidence)' },
    'calendar.draft_event': { check: 'Event draft prepared', detail: 'Attendees: 1' },
    'calendar.create': { check: 'Event created in sandbox', detail: 'eventId: cal-new-001' },
    'calendar.verify': { check: 'Calendar event verified', detail: 'Event confirmed in system' },
    'forms.load': { check: 'Form loaded', detail: '6 fields, all required' },
    'forms.prefill': { check: 'Fields auto-filled', detail: '6/6 completed' },
    'verifier.validate_form': { check: 'Form validation passed', detail: '0 errors, 0 warnings' },
    'forms.summary': { check: 'Summary reviewed', detail: 'Ready to submit' },
    'forms.submit': { check: 'Form submitted', detail: 'Code: BFWAI-AP-2610' },
    'verifier.confirm_submission': { check: 'Submission confirmed', detail: 'Portal acknowledged' },
  };
  const toolName = step.toolCall?.name ?? '';
  const info = checks[toolName] ?? { check: 'Step output verified', detail: String(output) };
  return {
    stepId: step.id,
    passed: true,
    check: info.check,
    detail: info.detail,
    verifiedAt: Date.now(),
  };
}

// Build approval request for a step that requires it
export function buildApprovalRequest(step: PlanStep, run: Run): ApprovalRequest {
  const previews: Record<string, ApprovalRequest['preview']> = {
    'mail.send': [
      { label: 'TO', value: 'Ananya Rao <ananya.rao@example.com>' },
      { label: 'SUBJECT', value: 'Interview Follow-up — ActionPilot Demo Co.' },
    ],
    'calendar.create': [
      { label: 'EVENT', value: 'Follow-up Meeting — Ananya Rao' },
      { label: 'TIME', value: 'Tomorrow, Oct 2 · 3:00–3:30 PM' },
      { label: 'ATTENDEES', value: 'Ananya Rao, Priya Menon' },
    ],
    'forms.submit': [
      { label: 'FORM', value: 'Project Registration — BFWAI Hack 26' },
      { label: 'PROJECT', value: 'ActionPilot' },
      { label: 'TEAM LEAD', value: 'Demo User' },
      { label: 'PROBLEM STATEMENT', value: 'PS-01' },
    ],
  };

  const bodies: Record<string, string> = {
    'mail.send': `Dear Ananya,

Thank you for joining us for the interview yesterday. We were genuinely impressed by your depth of experience in distributed systems and your thoughtful approach to system design challenges.

We will be in touch with next steps within the next 2–3 business days. In the meantime, please feel free to reach out if you have any questions.

Warm regards,
Hiring Team
ActionPilot Demo Co.`,
    'calendar.create': `Meeting invite will be sent to:\n• ananya.rao@example.com\n• priya.menon@company.example.com\n\nThis action creates a calendar event in the sandbox workspace.`,
    'forms.submit': `All 6 form fields validated successfully.\nSubmitting to BFWAI Hack 26 portal (sandbox).\n\nConfirmation code will be issued upon submission.`,
  };

  const risks: Record<string, string> = {
    'mail.send': 'This action sends an external communication.',
    'calendar.create': 'This action creates a calendar event and sends invites.',
    'forms.submit': 'This action submits a form to an external system.',
  };

  void run; // suppress unused warning

  const toolName = step.toolCall?.name ?? '';
  return {
    id: `appr-${Math.random().toString(36).slice(2, 9)}`,
    stepId: step.id,
    action: step.action,
    tool: step.tool,
    riskLevel: step.riskLevel,
    riskDescription: risks[toolName] ?? 'This action has external effects.',
    preview: previews[toolName] ?? [{ label: 'ACTION', value: step.action }],
    body: bodies[toolName],
    requestedAt: Date.now(),
  };
}

export function initRun(
  workflowId: Run['workflowId'],
  goal: string,
  failureSimulation: boolean,
): Run {
  return {
    id: makeRunId(),
    workflowId,
    goal,
    status: 'idle',
    plan: null,
    activeStepId: null,
    events: [],
    approvalRequest: null,
    verifications: [],
    startedAt: Date.now(),
    stepCount: 0,
    approvalCount: 0,
    retryCount: 0,
    failureSimulation,
  };
}
