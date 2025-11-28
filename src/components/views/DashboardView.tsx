import type { Device, ProtocolRun, PipetteOperation } from "../../types";

interface DashboardViewProps {
  devices: Device[];
  protocolRuns: ProtocolRun[];
  operations: PipetteOperation[];
}

export const DashboardView = ({ devices, protocolRuns, operations }: DashboardViewProps) => {
  const activeRuns = protocolRuns.filter((r) => r.status === "running").length;
  const totalOperations = operations.filter((o) => o.status === "completed").length;

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-1">Device Status</div>
          <div className="text-3xl font-bold">
            {devices.filter((d) => d.status === "connected").length}/{devices.length}
          </div>
          <div className="text-xs text-slate-500 mt-1">Connected</div>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-1">Total Modules</div>
          <div className="text-3xl font-bold">
            {devices.reduce((sum, d) => sum + d.modules.length, 0)}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {devices.reduce((sum, d) => sum + d.modules.filter((m) => m.status === "connected").length, 0)} connected
          </div>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-1">Active Runs</div>
          <div className="text-3xl font-bold">{activeRuns}</div>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-1">Total Operations</div>
          <div className="text-3xl font-bold">{totalOperations}</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
          <h3 className="text-lg font-semibold mb-4">Recent Operations</h3>
          <div className="space-y-2">
            {operations.slice(0, 5).map((op) => (
              <div key={op.id} className="flex items-center justify-between text-sm">
                <span className="font-mono">
                  {op.source} → {op.destination}
                </span>
                <span className="text-slate-400">{op.volume}µL</span>
              </div>
            ))}
            {operations.length === 0 && (
              <div className="text-sm text-slate-400">No operations yet</div>
            )}
          </div>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
          <h3 className="text-lg font-semibold mb-4">Active Protocol Runs</h3>
          <div className="space-y-3">
            {protocolRuns
              .filter((r) => r.status === "running")
              .map((run) => (
                <div key={run.id}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">{run.templateName}</span>
                    <span className="text-sm text-slate-400">{run.progress}%</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all"
                      style={{ width: `${run.progress}%` }}
                    />
                  </div>
                  {run.initiatedBy && (
                    <div className="text-xs text-slate-400 mt-1">Initiated by: {run.initiatedBy}</div>
                  )}
                </div>
              ))}
            {activeRuns === 0 && (
              <div className="text-sm text-slate-400">No active runs</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

