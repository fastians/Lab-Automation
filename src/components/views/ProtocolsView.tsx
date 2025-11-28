import { useMemo } from "react";
import { Clock, Play, FileText, User, Calendar } from "lucide-react";
import type { ProtocolTemplate, Device, View, ProtocolRun } from "../../types";

interface ProtocolsViewProps {
  templates: ProtocolTemplate[];
  devices: Device[];
  protocolRuns?: ProtocolRun[];
  onStartRun: (templateId: string, deviceId: string) => void;
  isAdmin: boolean;
  onNavigate?: (view: View) => void;
}

export const ProtocolsView = ({ templates, devices, protocolRuns = [], onStartRun, isAdmin, onNavigate }: ProtocolsViewProps) => {
  // Get the single connected device
  const connectedDevice = devices.find((d) => d.status === "connected");

  // Calculate statistics for each template
  const templateStats = useMemo(() => {
    return templates.map((template) => {
      const runs = protocolRuns.filter((r) => r.templateId === template.id);
      const completedRuns = runs.filter((r) => r.status === "completed").length;
      const totalVolume = runs
        .filter((r) => r.status === "completed")
        .reduce((sum, run) => {
          return sum + run.steps.reduce((stepSum, step) => stepSum + step.volume, 0);
        }, 0);
      
      return {
        templateId: template.id,
        runCount: runs.length,
        completedCount: completedRuns,
        successRate: runs.length > 0 ? ((completedRuns / runs.length) * 100).toFixed(1) : "100.0",
        totalVolume,
        avgStepsPerRun: runs.length > 0 ? template.steps.length : template.steps.length,
      };
    });
  }, [templates, protocolRuns]);

  const handleStartRun = (templateId: string) => {
    if (connectedDevice) {
      onStartRun(templateId, connectedDevice.id);
      // Navigate to runs view after starting
      if (onNavigate) {
        onNavigate("runs");
      }
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Protocol Templates
          </h2>
          <p className="text-slate-400">Select a protocol to start a new run</p>
        </div>
        {isAdmin && (
          <button className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:-translate-y-0.5">
            + New Template
          </button>
        )}
      </div>
      
      {!connectedDevice && (
        <div className="bg-gradient-to-r from-yellow-900/40 to-amber-900/20 border border-yellow-700/50 rounded-xl p-5 mb-6 backdrop-blur-sm shadow-lg">
          <div className="text-yellow-400 font-bold flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
            No device available
          </div>
          <div className="text-sm text-yellow-300/80 mt-2">Please ensure the Liquid Handler Robot is connected.</div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {templates.map((template) => {
          const stats = templateStats.find((s) => s.templateId === template.id);
          
          return (
            <div key={template.id} className="group relative bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-lg hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-slate-100">{template.name}</h3>
                  {stats && stats.runCount > 0 && (
                    <div className="px-2 py-1 bg-blue-500/20 rounded text-xs font-bold text-blue-400 border border-blue-500/30">
                      {stats.runCount} {stats.runCount === 1 ? "run" : "runs"}
                    </div>
                  )}
                </div>
                <p className="text-sm text-slate-400 mb-5 leading-relaxed">{template.description}</p>
                
                <div className="grid grid-cols-3 gap-3 mb-5 pb-5 border-b border-slate-700/50">
                  <div className="flex flex-col items-center p-3 bg-slate-900/50 rounded-lg border border-slate-700/30">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center mb-2">
                      <FileText className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="text-lg font-bold text-blue-400">{template.steps.length}</div>
                    <div className="text-xs text-slate-500">steps</div>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-slate-900/50 rounded-lg border border-slate-700/30">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-2">
                      <Clock className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div className="text-lg font-bold text-cyan-400">~{template.estimatedTime}</div>
                    <div className="text-xs text-slate-500">minutes</div>
                  </div>
                  {stats && (
                    <div className="flex flex-col items-center p-3 bg-slate-900/50 rounded-lg border border-slate-700/30">
                      <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center mb-2">
                        <Play className="w-4 h-4 text-green-400" />
                      </div>
                      <div className="text-lg font-bold text-green-400">{stats.completedCount}</div>
                      <div className="text-xs text-slate-500">completed</div>
                    </div>
                  )}
                </div>
                
                {stats && stats.runCount > 0 && (
                  <div className="mb-5 p-3 bg-slate-900/50 rounded-lg border border-slate-700/30">
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <div className="text-slate-500 mb-1">Success Rate</div>
                        <div className="font-bold text-green-400">{stats.successRate}%</div>
                      </div>
                      <div>
                        <div className="text-slate-500 mb-1">Total Volume</div>
                        <div className="font-bold text-cyan-400">{(stats.totalVolume / 1000).toFixed(1)}mL</div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="mb-5 p-3 bg-slate-900/30 rounded-lg border border-slate-700/20">
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                    <User className="w-3 h-3" />
                    <span>Created by: <span className="text-slate-300 font-medium">{template.createdBy}</span></span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Calendar className="w-3 h-3" />
                    <span>Created: <span className="text-slate-300 font-medium">{template.createdAt}</span></span>
                  </div>
                </div>
                
                {connectedDevice && (
                  <div className="mb-5 p-3 bg-slate-900/50 rounded-lg border border-slate-700/30">
                    <div className="text-xs text-slate-500 mb-1">Will run on:</div>
                    <div className="text-sm text-slate-300 font-semibold flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                      {connectedDevice.name}
                    </div>
                  </div>
                )}
                
                <div className="flex gap-3">
                  <button
                    onClick={() => handleStartRun(template.id)}
                    disabled={!connectedDevice}
                    className="flex-1 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:-translate-y-0.5 disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    Start Run
                  </button>
                  {isAdmin && (
                    <button className="px-5 py-2.5 bg-slate-700/50 hover:bg-slate-700 rounded-xl font-bold text-sm transition-all border border-slate-600/50 hover:border-slate-600">
                      Edit
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

