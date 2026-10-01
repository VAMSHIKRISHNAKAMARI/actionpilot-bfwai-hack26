// ============================================================
// ActionPilot — Main Application
// ============================================================

import { useAppStore } from './state/runStore';
import { AppShell } from './components/AppShell';
import { CommandCenter } from './components/CommandCenter';
import { ExecutionWorkspace } from './components/ExecutionWorkspace';
import { WorkspacesView } from './components/WorkspacesView';
import { ArchitectureView } from './components/ArchitectureView';
import { RunsView } from './components/RunsView';
import { SettingsView } from './components/SettingsView';

function MainContent() {
  const { activeSection, currentRun } = useAppStore();

  // Command section: show workspace when run is active, command center when not
  if (activeSection === 'command') {
    const hasActiveRun = currentRun && currentRun.status !== 'idle';
    if (hasActiveRun) {
      return <ExecutionWorkspace />;
    }
    return <CommandCenter />;
  }

  if (activeSection === 'runs')         return <RunsView />;
  if (activeSection === 'workspaces')   return <WorkspacesView />;
  if (activeSection === 'architecture') return <ArchitectureView />;
  if (activeSection === 'settings')     return <SettingsView />;

  return <CommandCenter />;
}

export default function App() {
  return (
    <AppShell>
      <MainContent />
    </AppShell>
  );
}
