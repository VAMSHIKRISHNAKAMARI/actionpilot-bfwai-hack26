# ActionPilot — AI Execution Control Center

> **BFWAI / Hack 26 · Problem Statement PS-01**  
> Autonomous Agents for Everyday Apps

---

## What It Is

ActionPilot is a **human-governed cross-app AI agent execution control center**.

It is not a chatbot.

You give ActionPilot a **natural-language goal**. It:

```
GOAL → PLAN → TASK GRAPH → TOOL ROUTING → EXECUTION → HUMAN APPROVAL → VERIFICATION → PROOF OF WORK
```

Every high-impact action (send email, create calendar event, submit form) is **blocked until you explicitly approve it**. You see exactly what it will do, with full context, before it acts.

---

## Live Demo

The app runs entirely in-browser with zero external APIs. No credentials required.

```
npm install
npm run dev
# → http://localhost:5173
```

**Try all three demo workflows:**
1. **Interview Follow-up** — reads inbox + calendar → drafts email → requests approval → sends → verifies
2. **Schedule Meeting** — finds available slot → drafts invite → requests approval → creates event → verifies  
3. **Project Form Submit** — loads form → auto-fills fields → validates → requests approval → submits → confirms

---

## Key Features

| Feature | Description |
|---|---|
| **Human Approval Gate** | Every irreversible action presents a full preview — To, Subject, Body, Risk — before executing |
| **Execution Plan** | Step-by-step task graph visible before and during execution |
| **Live Execution Stream** | Real-time step status with tool call inputs and outputs |
| **Proof of Work** | Immutable timestamped event log — every tool call, approval, and verification recorded |
| **Failure Recovery** | Simulated failures trigger safe retry with recovery path |
| **Safety Classification** | READ/SEARCH/DRAFT = auto-execute. SEND/SUBMIT/CREATE/DELETE = requires approval |
| **Deny Path** | Any approval can be denied — execution stops, no external effects |
| **Sandbox Workspaces** | Mail, Calendar, Forms, Web panels — all explorable independently |

---

## Architecture

```
User Goal (natural language)
    ↓
IPlanner interface (demo: deterministic · production: LLM)
    ↓
Task Graph (PlanStep[] with tool routing + risk classification)
    ↓
Tool Adapters: mail · calendar · forms · web · verifier
    ↓
Executor (step state machine)
    ↓
Human Approval Gate ← blocks high-impact actions
    ↓
Verifier (output validation)
    ↓
Action Log (ExecutionEvent[] · Proof of Work)
```

All integrations are **sandbox implementations** — no real email is sent, no real calendar events created. The `IPlanner` interface is designed so the demo planner can be swapped for a real LLM call with no changes to the execution engine.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite |
| State | Zustand |
| Styling | Tailwind CSS v4 |
| Icons | Lucide Icons |
| Fonts | Inter + JetBrains Mono |
| APIs | **Zero external APIs** |
| Backend | **None** — pure static build |
| Deployment | GitHub Pages ready |

---

## Deployment

```bash
npm run build
# Output in /dist — deploy to GitHub Pages, Vercel, Netlify, or any static host
```

For GitHub Pages, set `base` in `vite.config.ts`:
```ts
export default defineConfig({
  base: '/actionpilot/',
  // ...
})
```

---

## Hackathon Honesty Disclosure

- All tool integrations are **sandbox demos** — no real mail, calendar, or form submissions occur
- The planner is **deterministic** — it does not call any LLM API
- No production credentials are required or used
- No external network communications occur during execution
- Session state is **in-memory** — resets on page refresh
- The `IPlanner` interface and adapter pattern are designed for real integration in production

---

## Project Structure

```
src/
├── types.ts              # Core type definitions
├── state/runStore.ts     # Zustand global state
├── execution/executor.ts # Execution engine + tool outputs
├── planner/              # IPlanner interface + demo planner
├── hooks/useRunOrchestrator.ts  # Run lifecycle orchestration
├── data/sandboxData.ts   # Sandbox mail/calendar/forms data
└── components/
    ├── AppShell.tsx       # Navigation + header
    ├── CommandCenter.tsx  # Goal input + workflow selection
    ├── ExecutionWorkspace.tsx  # 3-panel execution view
    ├── ExecutionPlan.tsx  # Left: step graph
    ├── ExecutionStream.tsx # Center: live operation
    ├── ProofOfWork.tsx    # Right: event log
    ├── ApprovalGate.tsx   # Human approval overlay
    ├── WorkspacesView.tsx # Mail/Cal/Forms/Web panels
    ├── ArchitectureView.tsx # System architecture diagram
    ├── RunsView.tsx       # Run history
    └── SettingsView.tsx   # Config + limitations
```

---

*BFWAI Hack 26 · PS-01 Autonomous Agents for Everyday Apps*
