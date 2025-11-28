import type { Device, ProtocolTemplate, ProtocolRun, PipetteOperation } from "../../types";

interface AdminViewProps {
  devices: Device[];
  templates: ProtocolTemplate[];
  protocolRuns: ProtocolRun[];
  operations: PipetteOperation[];
  isAdmin: boolean;
}

export const AdminView = ({
  devices,
  templates,
  protocolRuns,
  operations,
  isAdmin,
}: AdminViewProps) => {
  if (!isAdmin) {
    return <div>Access denied</div>;
  }

  const connectedDevices = devices.filter((d) => d.status === "connected").length;

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Admin Dashboard</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
          <h3 className="text-lg font-semibold mb-4">System Statistics</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-400">Total Devices</span>
              <span className="font-semibold">{devices.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Connected Devices</span>
              <span className="font-semibold text-green-500">{connectedDevices}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Protocol Templates</span>
              <span className="font-semibold">{templates.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Total Runs</span>
              <span className="font-semibold">{protocolRuns.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Total Operations</span>
              <span className="font-semibold">{operations.length}</span>
            </div>
          </div>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-sm transition text-left">
              Manage Devices
            </button>
            <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-sm transition text-left">
              Manage Protocol Templates
            </button>
            <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-sm transition text-left">
              System Settings
            </button>
            <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-sm transition text-left">
              Export Logs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

