// ============================================================
// ActionPilot — Sandbox Workspace Data
// ============================================================

import type { MailItem, CalendarEvent, FormDefinition } from '../types';

export const SANDBOX_MAIL: MailItem[] = [
  {
    id: 'mail-001',
    from: 'Ananya Rao',
    fromEmail: 'ananya.rao@example.com',
    subject: 'Re: Senior Engineer Interview — Thursday 2pm',
    body: `Hi,

Thank you for the interview opportunity. I'm confirming my availability for Thursday at 2:00 PM.

Looking forward to discussing the role and learning more about your team's work.

Best regards,
Ananya`,
    date: 'Today, 10:14',
    folder: 'inbox',
    tags: ['interview', 'candidate'],
  },
  {
    id: 'mail-002',
    from: 'HR System',
    fromEmail: 'hr@company.example.com',
    subject: 'Interview Scheduled — Ananya Rao | Thu Oct 2 14:00',
    body: `Interview Details:
Candidate: Ananya Rao <ananya.rao@example.com>
Role: Senior Software Engineer
Date: Thursday, October 2, 2026
Time: 2:00 PM – 3:00 PM
Location: Conference Room B / Video Link

Interviewers:
- Priya Menon (Engineering Lead)
- Dev Kumar (CTO)

Notes: Technical round + culture fit.`,
    date: 'Yesterday, 16:30',
    folder: 'inbox',
    tags: ['hr', 'interview'],
  },
  {
    id: 'mail-draft-001',
    from: 'You',
    fromEmail: 'you@company.example.com',
    to: 'Ananya Rao',
    toEmail: 'ananya.rao@example.com',
    subject: 'Interview Follow-up — ActionPilot Demo Co.',
    body: `Dear Ananya,

Thank you for joining us for the interview yesterday. We were genuinely impressed by your depth of experience in distributed systems and your thoughtful approach to system design challenges.

We will be in touch with next steps within the next 2–3 business days. In the meantime, please feel free to reach out if you have any questions.

Warm regards,
Hiring Team
ActionPilot Demo Co.`,
    date: 'Draft',
    folder: 'drafts',
    tags: ['draft', 'interview', 'follow-up'],
  },
  {
    id: 'mail-sent-001',
    from: 'You',
    fromEmail: 'you@company.example.com',
    to: 'Team',
    toEmail: 'team@company.example.com',
    subject: 'Interview Debrief — Ananya Rao',
    body: 'Quick sync: interview went well. Strong candidate. Will discuss Thursday.',
    date: 'Yesterday, 17:45',
    folder: 'sent',
  },
];

export const SANDBOX_CALENDAR: CalendarEvent[] = [
  {
    id: 'cal-001',
    title: 'Interview — Ananya Rao',
    date: 'Thursday, Oct 2',
    time: '2:00 PM',
    duration: '60 min',
    attendees: ['Ananya Rao', 'Priya Menon', 'Dev Kumar'],
    location: 'Conference Room B',
    type: 'interview',
    status: 'confirmed',
  },
  {
    id: 'cal-002',
    title: 'Team Standup',
    date: 'Today',
    time: '9:30 AM',
    duration: '15 min',
    attendees: ['Team'],
    type: 'meeting',
    status: 'confirmed',
  },
  {
    id: 'cal-003',
    title: 'Q4 Planning Review',
    date: 'Friday, Oct 3',
    time: '11:00 AM',
    duration: '90 min',
    attendees: ['Leadership'],
    location: 'Main Conference',
    type: 'review',
    status: 'confirmed',
  },
  {
    id: 'cal-new-001',
    title: 'Follow-up Meeting — Ananya Rao',
    date: 'Tomorrow, Oct 2',
    time: '3:00 PM',
    duration: '30 min',
    attendees: ['Ananya Rao', 'Priya Menon'],
    location: 'Video Call',
    type: 'meeting',
    status: 'tentative',
  },
];

export const SANDBOX_FORM: FormDefinition = {
  id: 'form-proj-001',
  title: 'Project Registration Form',
  description: 'Register your project for the BFWAI Hack 26 submission portal.',
  fields: [
    {
      id: 'field-01',
      label: 'Project Name',
      type: 'text',
      value: 'ActionPilot',
      valid: true,
    },
    {
      id: 'field-02',
      label: 'Team Lead',
      type: 'text',
      value: 'Demo User',
      valid: true,
    },
    {
      id: 'field-03',
      label: 'Contact Email',
      type: 'email',
      value: 'team@actionpilot.demo',
      valid: true,
    },
    {
      id: 'field-04',
      label: 'Problem Statement',
      type: 'select',
      value: 'PS-01 — Autonomous Agents for Everyday Apps',
      valid: true,
    },
    {
      id: 'field-05',
      label: 'Project Summary',
      type: 'textarea',
      value: 'Human-governed cross-app AI execution control center. Translates natural language goals into structured plans with human approval gates.',
      valid: true,
    },
    {
      id: 'field-06',
      label: 'Submission Date',
      type: 'date',
      value: '2026-10-01',
      valid: true,
    },
  ],
};
