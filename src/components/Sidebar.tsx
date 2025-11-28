import { Home, Cpu, FileText, Play, List, Activity, Settings, FlaskConical } from "lucide-react";
import type { View } from "../types";

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  activeRuns: number;
  isAdmin: boolean;
}

export const Sidebar = ({ currentView, setCurrentView, activeRuns, isAdmin }: SidebarProps) => {
  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-slate-900 border-r border-slate-800 p-4 overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Activity className="w-6 h-6 text-blue-500" />
          Lab Automation
        </h1>
        <p className="text-xs text-slate-400 mt-1">Dashboard v2.0</p>
      </div>

      <nav className="space-y-2">
        <NavButton
          icon={Home}
          label="Dashboard"
          view="dashboard"
          currentView={currentView}
          onClick={() => setCurrentView("dashboard")}
        />
        <NavButton
          icon={Cpu}
          label="Devices"
          view="devices"
          currentView={currentView}
          onClick={() => setCurrentView("devices")}
        />
        <NavButton
          icon={FileText}
          label="Protocol Templates"
          view="protocols"
          currentView={currentView}
          onClick={() => setCurrentView("protocols")}
        />
        <NavButton
          icon={Play}
          label="Protocol Runs"
          view="runs"
          currentView={currentView}
          onClick={() => setCurrentView("runs")}
          badge={activeRuns > 0 ? activeRuns : undefined}
        />
        <NavButton
          icon={List}
          label="Operations"
          view="operations"
          currentView={currentView}
          onClick={() => setCurrentView("operations")}
        />
        <NavButton
          icon={Activity}
          label="Event Logs"
          view="events"
          currentView={currentView}
          onClick={() => setCurrentView("events")}
        />
        <NavButton
          icon={FlaskConical}
          label="Well Plates"
          view="wellplates"
          currentView={currentView}
          onClick={() => setCurrentView("wellplates")}
        />
        {isAdmin && (
          <NavButton
            icon={Settings}
            label="Admin"
            view="admin"
            currentView={currentView}
            onClick={() => setCurrentView("admin")}
          />
        )}
      </nav>
    </div>
  );
};

interface NavButtonProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  view: View;
  currentView: View;
  onClick: () => void;
  badge?: number;
}

const NavButton = ({ icon: Icon, label, view, currentView, onClick, badge }: NavButtonProps) => {
  const isActive = currentView === view;
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition ${
        isActive ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-800"
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="flex-1 text-left">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">{badge}</span>
      )}
    </button>
  );
};

