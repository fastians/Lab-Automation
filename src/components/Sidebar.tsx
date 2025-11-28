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
    <div className="fixed left-0 top-0 h-full w-64 bg-slate-900/95 backdrop-blur-xl border-r border-slate-800/50 p-6 overflow-y-auto z-20 shadow-2xl">
      <div className="mb-8 pb-6 border-b border-slate-800/50">
        <h1 className="text-2xl font-bold flex items-center gap-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Activity className="w-5 h-5 text-white" />
          </div>
          Lab Automation
        </h1>
        <p className="text-xs text-slate-400 mt-2 font-medium">Dashboard v2.0</p>
      </div>

      <nav className="space-y-1.5">
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
      className={`group relative w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
        isActive
          ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/25"
          : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
      }`}
    >
      <Icon className={`w-5 h-5 transition-transform ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
      <span className="flex-1 text-left font-medium">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
          isActive 
            ? "bg-white/20 text-white" 
            : "bg-blue-600 text-white shadow-md shadow-blue-500/30"
        }`}>
          {badge}
        </span>
      )}
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
      )}
    </button>
  );
};

