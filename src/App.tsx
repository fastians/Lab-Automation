import { useState, useMemo, useCallback } from "react";
import type { View } from "./types";
import { initialSensors } from "./data/sensors";
import { initialDevices } from "./data/devices";
import { protocolTemplates } from "./data/protocols";
import { useProtocolSimulation } from "./hooks/useProtocolSimulation";
import { useSensorSimulation } from "./hooks/useSensorSimulation";
import { LabProvider, useLab } from "./contexts/LabContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Sidebar } from "./components/Sidebar";
import { DashboardView } from "./components/views/DashboardView";
import { DevicesView } from "./components/views/DevicesView";
import { ProtocolsView } from "./components/views/ProtocolsView";
import { RunsView } from "./components/views/RunsView";
import { OperationsView } from "./components/views/OperationsView";
import { EventsView } from "./components/views/EventsView";
import { AdminView } from "./components/views/AdminView";
import { WellPlatesView } from "./components/views/WellPlatesView";
import { initialWellPlates } from "./data/wellPlates";

// Inner app component that uses the context
function AppContent() {
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);

  const {
    sensors,
    devices,
    protocolRuns,
    operations,
    logs,
    currentUser,
    isAdmin,
    setSensors,
    setDevices,
    setProtocolRuns,
    setOperations,
    addLog,
    startProtocolRun,
    pauseProtocolRun,
    resumeProtocolRun,
    cancelProtocolRun,
    restartProtocolRun,
    activeRuns,
    isRunning,
  } = useLab();

  // Use simulation hooks
  useProtocolSimulation({
    protocolRuns,
    devices,
    setProtocolRuns,
    setDevices,
    setOperations,
    addLog,
    currentUser,
  });

  useSensorSimulation({
    sensors,
    setSensors,
    addLog,
    isRunning,
  });

  // Memoized view renderer
  const renderView = useCallback(() => {
    switch (currentView) {
      case "dashboard":
        return (
          <DashboardView
            devices={devices}
            protocolRuns={protocolRuns}
            operations={operations}
            sensors={sensors}
          />
        );
      case "devices":
        return (
          <DevicesView
            devices={devices}
            operations={operations}
            selectedDevice={selectedDevice}
            setSelectedDevice={setSelectedDevice}
          />
        );
      case "protocols":
        return (
          <ProtocolsView
            templates={protocolTemplates}
            devices={devices}
            protocolRuns={protocolRuns}
            onStartRun={startProtocolRun}
            isAdmin={isAdmin}
            onNavigate={setCurrentView}
          />
        );
      case "runs":
        return (
          <RunsView
            protocolRuns={protocolRuns}
            operations={operations}
            onPause={pauseProtocolRun}
            onResume={resumeProtocolRun}
            onCancel={cancelProtocolRun}
            onRestart={restartProtocolRun}
          />
        );
      case "operations":
        return <OperationsView operations={operations} />;
      case "events":
        return <EventsView logs={logs} />;
      case "wellplates":
        return <WellPlatesView plates={initialWellPlates} />;
      case "admin":
        return (
          <AdminView
            devices={devices}
            templates={protocolTemplates}
            protocolRuns={protocolRuns}
            operations={operations}
            isAdmin={isAdmin}
          />
        );
      default:
        return null;
    }
  }, [
    currentView,
    devices,
    protocolRuns,
    operations,
    logs,
    selectedDevice,
    isAdmin,
    startProtocolRun,
    pauseProtocolRun,
    resumeProtocolRun,
    cancelProtocolRun,
    restartProtocolRun,
  ]);

  // Memoized active runs count
  const activeRunsCount = useMemo(() => activeRuns.length, [activeRuns]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 via-slate-950 to-slate-950 text-white relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.1),transparent_50%)] pointer-events-none" />
      
      <ErrorBoundary>
        <Sidebar
          currentView={currentView}
          setCurrentView={setCurrentView}
          activeRuns={activeRunsCount}
          isAdmin={isAdmin}
        />
        <div className="ml-64 p-6 relative z-10">{renderView()}</div>
      </ErrorBoundary>
    </div>
  );
}

// Main App component with providers
function App() {
  const [currentUser] = useState("Admin User");
  const [isAdmin] = useState(true);

  return (
    <ErrorBoundary>
      <LabProvider
        initialSensors={initialSensors}
        initialDevices={initialDevices}
        currentUser={currentUser}
        isAdmin={isAdmin}
      >
        <AppContent />
      </LabProvider>
    </ErrorBoundary>
  );
}

export default App;
