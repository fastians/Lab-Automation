import { useMemo } from "react";
import { AlertCircle, CheckCircle2, Clock, TrendingUp } from "lucide-react";
import type { Device, ProtocolRun, PipetteOperation, SensorData } from "../../types";

interface DashboardViewProps {
  devices: Device[];
  protocolRuns: ProtocolRun[];
  operations: PipetteOperation[];
  sensors?: SensorData[];
}

export const DashboardView = ({ devices, protocolRuns, operations, sensors = [] }: DashboardViewProps) => {
  const activeRuns = protocolRuns.filter((r) => r.status === "running").length;
  const totalOperations = operations.filter((o) => o.status === "completed").length;
  const failedOperations = operations.filter((o) => o.status === "failed").length;
  const successRate = totalOperations > 0 
    ? ((totalOperations / (totalOperations + failedOperations)) * 100).toFixed(1)
    : "100.0";
  
  const totalVolume = useMemo(() => 
    operations
      .filter((o) => o.status === "completed")
      .reduce((sum, op) => sum + op.volume, 0),
    [operations]
  );

  const avgOperationTime = useMemo(() => {
    const completedOps = operations.filter((o) => o.status === "completed");
    if (completedOps.length === 0) return 0;
    // Simulate: assume 2 seconds per operation
    return 2.0;
  }, [operations]);

  const operationsPerHour = useMemo(() => {
    if (totalOperations === 0) return 0;
    // Estimate based on total operations and average time
    return Math.round((3600 / avgOperationTime) * (totalOperations / Math.max(protocolRuns.length, 1)));
  }, [totalOperations, avgOperationTime, protocolRuns.length]);

  const systemHealth = useMemo(() => {
    const connectedDevices = devices.filter((d) => d.status === "connected").length;
    const totalDevices = devices.length;
    const criticalSensors = sensors.filter((s) => s.status === "critical").length;
    const warningSensors = sensors.filter((s) => s.status === "warning").length;
    
    if (criticalSensors > 0 || connectedDevices === 0) return "critical";
    if (warningSensors > 0 || connectedDevices < totalDevices) return "warning";
    return "healthy";
  }, [devices, sensors]);

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
          Dashboard Overview
        </h2>
        <p className="text-slate-400">Real-time monitoring and system status</p>
      </div>
      
      {/* System Health Banner */}
      {systemHealth !== "healthy" && (
        <div className={`mb-6 p-4 rounded-xl border-2 ${
          systemHealth === "critical" 
            ? "bg-red-900/20 border-red-700/50" 
            : "bg-yellow-900/20 border-yellow-700/50"
        }`}>
          <div className="flex items-center gap-3">
            <AlertCircle className={`w-5 h-5 ${
              systemHealth === "critical" ? "text-red-400" : "text-yellow-400"
            }`} />
            <div>
              <div className={`font-bold ${
                systemHealth === "critical" ? "text-red-400" : "text-yellow-400"
              }`}>
                {systemHealth === "critical" ? "System Critical" : "System Warning"}
              </div>
              <div className="text-sm text-slate-300 mt-1">
                {systemHealth === "critical" 
                  ? "Immediate attention required"
                  : "Some components need attention"}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="group relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-lg hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-slate-400">Device Status</div>
              {devices.filter((d) => d.status === "connected").length === devices.length ? (
                <CheckCircle2 className="w-4 h-4 text-green-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-yellow-400" />
              )}
            </div>
            <div className="text-4xl font-bold mb-1">
              {devices.filter((d) => d.status === "connected").length}/{devices.length}
            </div>
            <div className="text-xs text-slate-500 font-medium">Connected</div>
          </div>
        </div>
        
        <div className="group relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-lg hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative">
            <div className="text-sm font-medium text-slate-400 mb-2">Total Modules</div>
            <div className="text-4xl font-bold mb-1">
              {devices.reduce((sum, d) => sum + d.modules.length, 0)}
            </div>
            <div className="text-xs text-slate-500 font-medium">
              {devices.reduce((sum, d) => sum + d.modules.filter((m) => m.status === "connected").length, 0)} connected
            </div>
          </div>
        </div>
        
        <div className="group relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-lg hover:shadow-xl hover:shadow-green-500/10 transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-slate-400">Success Rate</div>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-4xl font-bold mb-1">{successRate}%</div>
            <div className="text-xs text-slate-500 font-medium">
              {failedOperations > 0 ? `${failedOperations} failed` : "No failures"}
            </div>
          </div>
        </div>
        
        <div className="group relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-lg hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative">
            <div className="text-sm font-medium text-slate-400 mb-2">Total Volume</div>
            <div className="text-4xl font-bold mb-1">{(totalVolume / 1000).toFixed(1)}mL</div>
            <div className="text-xs text-slate-500 font-medium">
              {totalOperations.toLocaleString()} operations
            </div>
          </div>
        </div>
      </div>

      {/* Additional Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="group relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-lg hover:shadow-xl hover:shadow-green-500/10 transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative">
            <div className="text-sm font-medium text-slate-400 mb-2">Active Runs</div>
            <div className="text-4xl font-bold mb-1">{activeRuns}</div>
            <div className="text-xs text-slate-500 font-medium">In progress</div>
          </div>
        </div>
        
        <div className="group relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-lg hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative">
            <div className="text-sm font-medium text-slate-400 mb-2">Throughput</div>
            <div className="text-4xl font-bold mb-1">{operationsPerHour}</div>
            <div className="text-xs text-slate-500 font-medium">Ops/hour</div>
          </div>
        </div>
        
        <div className="group relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-lg hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative">
            <div className="text-sm font-medium text-slate-400 mb-2">Avg Operation Time</div>
            <div className="text-4xl font-bold mb-1">{avgOperationTime.toFixed(1)}s</div>
            <div className="text-xs text-slate-500 font-medium">Per operation</div>
          </div>
        </div>
        
        <div className="group relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-lg hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative">
            <div className="text-sm font-medium text-slate-400 mb-2">Total Operations</div>
            <div className="text-4xl font-bold mb-1">{totalOperations.toLocaleString()}</div>
            <div className="text-xs text-slate-500 font-medium">Completed</div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Sensor Monitoring */}
        {sensors.length > 0 && (
          <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-5 flex items-center gap-2">
              <div className="w-1 h-5 bg-gradient-to-b from-yellow-500 to-amber-500 rounded-full" />
              Environmental Sensors
            </h3>
            <div className="space-y-3">
              {sensors.map((sensor) => {
                const SensorIcon = sensor.icon;
                const percentage = ((sensor.value - sensor.min) / (sensor.max - sensor.min)) * 100;
                const isWarning = sensor.status === "warning" || sensor.status === "critical";
                
                return (
                  <div key={sensor.id} className="p-3 bg-slate-900/50 rounded-lg border border-slate-700/30">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <SensorIcon className={`w-4 h-4 ${isWarning ? "text-yellow-400" : "text-blue-400"}`} />
                        <span className="text-sm font-medium text-slate-300">{sensor.name}</span>
                      </div>
                      <span className={`text-sm font-bold ${
                        isWarning ? "text-yellow-400" : "text-slate-200"
                      }`}>
                        {sensor.value}{sensor.unit}
                      </span>
                    </div>
                    <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          isWarning 
                            ? "bg-gradient-to-r from-yellow-500 to-amber-500"
                            : "bg-gradient-to-r from-blue-500 to-cyan-500"
                        }`}
                        style={{ width: `${Math.min(Math.max(percentage, 0), 100)}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-1 text-xs text-slate-500">
                      <span>Min: {sensor.min}{sensor.unit}</span>
                      <span>Max: {sensor.max}{sensor.unit}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Recent Operations */}
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold mb-5 flex items-center gap-2">
            <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full" />
            Recent Operations
          </h3>
          <div className="space-y-3">
            {operations.slice(0, 5).map((op) => {
              const timeAgo = useMemo(() => {
                const diff = Date.now() - new Date(op.timestamp).getTime();
                const seconds = Math.floor(diff / 1000);
                if (seconds < 60) return `${seconds}s ago`;
                const minutes = Math.floor(seconds / 60);
                if (minutes < 60) return `${minutes}m ago`;
                const hours = Math.floor(minutes / 60);
                return `${hours}h ago`;
              }, [op.timestamp]);
              
              return (
                <div key={op.id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-700/30 hover:border-blue-500/30 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-sm text-slate-300">
                      <span className="text-blue-400">{op.source}</span>
                      <span className="mx-2 text-slate-500">→</span>
                      <span className="text-green-400">{op.destination}</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">{timeAgo}</div>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    <span className="text-sm font-semibold text-cyan-400">{op.volume}µL</span>
                    {op.status === "completed" && (
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                    )}
                  </div>
                </div>
              );
            })}
            {operations.length === 0 && (
              <div className="text-sm text-slate-400 text-center py-4">No operations yet</div>
            )}
          </div>
        </div>
        
        {/* Active Protocol Runs */}
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold mb-5 flex items-center gap-2">
            <div className="w-1 h-5 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full" />
            Active Protocol Runs
          </h3>
          <div className="space-y-4">
            {protocolRuns
              .filter((r) => r.status === "running")
              .map((run) => {
                const timeRemaining = useMemo(() => {
                  if (!run.startedAt) return "Calculating...";
                  const elapsed = Date.now() - new Date(run.startedAt).getTime();
                  const totalEstimated = run.totalSteps * 2000; // 2s per step
                  const remaining = totalEstimated - elapsed;
                  if (remaining <= 0) return "Finishing...";
                  const minutes = Math.floor(remaining / 60000);
                  const seconds = Math.floor((remaining % 60000) / 1000);
                  return `${minutes}m ${seconds}s`;
                }, [run.startedAt, run.totalSteps]);
                
                return (
                  <div key={run.id} className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/30">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-slate-200">{run.templateName}</span>
                      <span className="text-sm font-bold text-green-400">{run.progress}%</span>
                    </div>
                    <div className="h-2.5 bg-slate-700/50 rounded-full overflow-hidden shadow-inner mb-2">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500 shadow-lg shadow-green-500/30"
                        style={{ width: `${run.progress}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Step {run.currentStep} of {run.totalSteps}</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{timeRemaining}</span>
                      </div>
                    </div>
                    {run.initiatedBy && (
                      <div className="text-xs text-slate-400 mt-2">Initiated by: <span className="text-slate-300">{run.initiatedBy}</span></div>
                    )}
                  </div>
                );
              })}
            {activeRuns === 0 && (
              <div className="text-sm text-slate-400 text-center py-4">No active runs</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
