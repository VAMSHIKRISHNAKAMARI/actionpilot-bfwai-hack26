// ============================================================
// ActionPilot — Global Run Store (Zustand)
// ============================================================

import { create } from 'zustand';
import type { Run, NavSection, WorkflowId, ExecutionEvent } from '../types';

interface AppState {
  // Navigation
  activeSection: NavSection;
  setActiveSection: (s: NavSection) => void;

  // Current run
  currentRun: Run | null;
  setCurrentRun: (run: Run | null) => void;
  updateRun: (updater: (run: Run) => Run) => void;

  // Past runs
  runHistory: Run[];
  addToHistory: (run: Run) => void;

  // Failure simulation toggle
  failureSimulation: boolean;
  setFailureSimulation: (v: boolean) => void;

  // Expand/collapse proof-of-work events
  toggleEventExpanded: (eventId: string) => void;

  // Reset
  resetRun: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  activeSection: 'command',
  setActiveSection: (s) => set({ activeSection: s }),

  currentRun: null,
  setCurrentRun: (run) => set({ currentRun: run }),
  updateRun: (updater) => {
    const { currentRun } = get();
    if (!currentRun) return;
    set({ currentRun: updater(currentRun) });
  },

  runHistory: [],
  addToHistory: (run) =>
    set((s) => ({ runHistory: [run, ...s.runHistory].slice(0, 10) })),

  failureSimulation: false,
  setFailureSimulation: (v) => set({ failureSimulation: v }),

  toggleEventExpanded: (eventId) => {
    const { currentRun } = get();
    if (!currentRun) return;
    set({
      currentRun: {
        ...currentRun,
        events: currentRun.events.map((e: ExecutionEvent) =>
          e.id === eventId ? { ...e, expanded: !e.expanded } : e,
        ),
      },
    });
  },

  resetRun: () => set({ currentRun: null }),
}));
