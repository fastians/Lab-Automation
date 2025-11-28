import { useMemo } from "react";
import { Shield, Database, Activity, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";
import type { Device, ProtocolTemplate, ProtocolRun, PipetteOperation } from "../../types";

interface AdminViewProps {
  devices: Device[];
  templates: ProtocolTemplate[];
  protocolRuns: ProtocolRun[];
  operations: PipetteOperation[];
  isAdmin: boolean;
}

export const AdminView = ({ devices, templates, protocolRuns, operations, isAdmin }: AdminViewProps) => {
  const systemStats = useMemo(() => {
    const totalDevices = devices.length;
    const connectedDevices = devices.filter((d) => d.status === "connected").length;
    const totalModules = devices.reduce((sum, d) => sum + d.modules.length, 0);
    const connectedModules = devices.reduce((sum, d) => sum + d.modules.filter((m) => m.status === "connected").length, 0);
    
    const totalRuns = protocolRuns.length;
    const completedRuns = protocolRuns.filter((r) => r.status === "completed").length;
    const failedRuns = protocolRuns.filter((r) => r.status === "failed").length;
    const successRate = totalRuns > 0 ? ((completedRuns / totalRuns) * 100).toFixed(1) : "100.0";
    
    const totalOperations = operations.length;
    const completedOps = operations.filter((o) => o.status === "completed").length;
    const failedOps = operations.filter((o) => o.status === "failed").length;
    const opSuccessRate = totalOperations > 0 ? ((completedOps / totalOperations) * 100).toFixed(1) : "100.0";
    
    const totalVolume = operations
      .filter((o) => o.status === "completed")
      .reduce((sum, op) => sum + op.volume, 0);

    return {
      totalDevices,
      connectedDevices,
      totalModules,
      connectedModules,
      totalRuns,
      completedRuns,
      failedRuns,
      successRate,
      totalOperations,
      completedOps,
      failedOps,
      opSuccessRate,
      totalVolume,
    };
  }, [devices, protocolRuns, operations]);

  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <Shield className="w-16 h-16 text-slate-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
        <p className="text-slate-400">You don't have permission to access this area.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent flex items-center gap-3">
          <Shield className="w-8 h-8 text-blue-400" />
          Admin Dashboard
        </h2>
        <p className="text-slate-400">System administration and monitoring</p>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium text-slate-400">System Health</div>
            {systemStats.connectedDevices === systemStats.totalDevices ? (
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
            )}
          </div>
          <div className="text-3xl font-bold mb-1">
            {systemStats.connectedDevices}/{systemStats.totalDevices}
          </div>
          <div className="text-xs text-slate-500">Devices Connected</div>
        </div>

        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium text-slate-400">Protocol Success</div>
            <TrendingUp className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-3xl font-bold mb-1 text-blue-400">{systemStats.successRate}%</div>
          <div className="text-xs text-slate-500">
            {systemStats.completedRuns} completed, {systemStats.failedRuns} failed
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium text-slate-400">Operation Success</div>
            <Activity className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-3xl font-bold mb-1 text-green-400">{systemStats.opSuccessRate}%</div>
          <div className="text-xs text-slate-500">
            {systemStats.completedOps.toLocaleString()} completed
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium text-slate-400">Total Volume</div>
            <Database className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="text-3xl font-bold mb-1 text-cyan-400">{(systemStats.totalVolume / 1000).toFixed(1)}mL</div>
          <div className="text-xs text-slate-500">{systemStats.totalOperations.toLocaleString()} operations</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Device Management */}
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-5 flex items-center gap-2">
            <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full" />
            Device Management
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">Total Devices</span>
                <span className="text-lg font-bold">{systemStats.totalDevices}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Connected</span>
                <span className="text-lg font-bold text-green-400">{systemStats.connectedDevices}</span>
              </div>
            </div>
            <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">Total Modules</span>
                <span className="text-lg font-bold">{systemStats.totalModules}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Connected</span>
                <span className="text-lg font-bold text-green-400">{systemStats.connectedModules}</span>
              </div>
            </div>
            <button className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30">
              Manage Devices
            </button>
          </div>
        </div>

        {/* Protocol Management */}
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-5 flex items-center gap-2">
            <div className="w-1 h-5 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full" />
            Protocol Management
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">Total Templates</span>
                <span className="text-lg font-bold">{templates.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Total Runs</span>
                <span className="text-lg font-bold">{systemStats.totalRuns}</span>
              </div>
            </div>
            <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">Success Rate</span>
                <span className="text-lg font-bold text-green-400">{systemStats.successRate}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Failed Runs</span>
                <span className="text-lg font-bold text-red-400">{systemStats.failedRuns}</span>
              </div>
            </div>
            <button className="w-full px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl font-bold text-sm transition-all shadow-lg shadow-green-500/20 hover:shadow-green-500/30">
              Manage Protocols
            </button>
          </div>
        </div>

        {/* System Statistics */}
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-5 flex items-center gap-2">
            <div className="w-1 h-5 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
            System Statistics
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-700/30">
              <span className="text-sm text-slate-400">Total Operations</span>
              <span className="text-lg font-bold">{systemStats.totalOperations.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-700/30">
              <span className="text-sm text-slate-400">Completed</span>
              <span className="text-lg font-bold text-green-400">{systemStats.completedOps.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-700/30">
              <span className="text-sm text-slate-400">Failed</span>
              <span className="text-lg font-bold text-red-400">{systemStats.failedOps}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-700/30">
              <span className="text-sm text-slate-400">Success Rate</span>
              <span className="text-lg font-bold text-blue-400">{systemStats.opSuccessRate}%</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-5 flex items-center gap-2">
            <div className="w-1 h-5 bg-gradient-to-b from-yellow-500 to-amber-500 rounded-full" />
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 text-left">
              Export System Logs
            </button>
            <button className="w-full px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl font-bold text-sm transition-all shadow-lg shadow-green-500/20 hover:shadow-green-500/30 text-left">
              Backup Configuration
            </button>
            <button className="w-full px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl font-bold text-sm transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 text-left">
              System Diagnostics
            </button>
            <button className="w-full px-4 py-2.5 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 rounded-xl font-bold text-sm transition-all shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/30 text-left">
              Calibration Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
