import { Wifi, WifiOff, X } from "lucide-react";
import type { Device, PipetteOperation } from "../../types";
import { getModuleIcon, formatModuleType } from "../../utils/moduleUtils";
import { getStatusTextColor } from "../../utils/styleUtils";

interface DevicesViewProps {
  devices: Device[];
  operations: PipetteOperation[];
  selectedDevice: string | null;
  setSelectedDevice: (id: string | null) => void;
}

export const DevicesView = ({
  devices,
  operations,
  selectedDevice,
  setSelectedDevice,
}: DevicesViewProps) => {
  const selectedDeviceData = devices.find((d) => d.id === selectedDevice);

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Device & Module Management</h2>
      
      {/* Device List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {devices.map((device) => (
          <div
            key={device.id}
            onClick={() => setSelectedDevice(device.id)}
            className={`bg-slate-800 border-2 rounded-lg p-4 cursor-pointer transition ${
              selectedDevice === device.id ? "border-blue-500" : "border-slate-700"
            } hover:border-blue-400`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="font-semibold text-lg mb-1">{device.name}</div>
                <div className="text-xs text-slate-400 capitalize">{device.type.replace("_", " ")}</div>
              </div>
              {device.status === "connected" ? (
                <Wifi className="w-5 h-5 text-green-500" />
              ) : (
                <WifiOff className="w-5 h-5 text-slate-500" />
              )}
            </div>
            {device.currentOperation && (
              <div className="text-xs text-blue-400 mb-2">{device.currentOperation}</div>
            )}
            <div className="text-sm text-slate-400 mb-2">
              Operations: {device.operations.toLocaleString()}
            </div>
            <div className="text-sm text-slate-400">
              Modules: {device.modules.length} ({device.modules.filter((m) => m.status === "connected").length} connected)
            </div>
          </div>
        ))}
      </div>

      {/* Device Details with Modules */}
      {selectedDeviceData && (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">{selectedDeviceData.name}</h3>
            <button
              onClick={() => setSelectedDevice(null)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Device Info */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <div className="text-sm text-slate-400 mb-2">Device Type</div>
              <div className="font-semibold capitalize">{selectedDeviceData.type.replace("_", " ")}</div>
            </div>
            <div>
              <div className="text-sm text-slate-400 mb-2">Status</div>
              <div className={`font-semibold ${getStatusTextColor(selectedDeviceData.status)}`}>
                {selectedDeviceData.status}
              </div>
            </div>
            <div>
              <div className="text-sm text-slate-400 mb-2">Total Operations</div>
              <div className="font-semibold">{selectedDeviceData.operations.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-sm text-slate-400 mb-2">Last Seen</div>
              <div className="font-semibold">{selectedDeviceData.lastSeen}</div>
            </div>
          </div>

          {/* Modules Section */}
          <div className="mb-4">
            <h4 className="font-semibold mb-3">Connected Modules</h4>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
              {selectedDeviceData.modules.map((module) => {
                const ModuleIcon = getModuleIcon(module.type);
                return (
                  <div
                    key={module.id}
                    className="bg-slate-900 border border-slate-700 rounded-lg p-3"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <ModuleIcon className="w-5 h-5 text-blue-500" />
                      {module.status === "connected" ? (
                        <Wifi className="w-4 h-4 text-green-500" />
                      ) : (
                        <WifiOff className="w-4 h-4 text-slate-500" />
                      )}
                    </div>
                    <div className="font-semibold text-sm mb-1">{module.name}</div>
                    <div className="text-xs text-slate-400 mb-2">{formatModuleType(module.type)}</div>
                    {module.currentOperation && (
                      <div className="text-xs text-blue-400 mb-2">{module.currentOperation}</div>
                    )}
                    <div className="text-xs text-slate-400">
                      Operations: {module.operations.toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Operations */}
          <div>
            <h4 className="font-semibold mb-2">Recent Operations</h4>
            <div className="space-y-2">
              {operations
                .filter((o) => o.deviceId === selectedDeviceData.id)
                .slice(0, 5)
                .map((op) => (
                  <div
                    key={op.id}
                    className="flex items-center justify-between text-sm bg-slate-900 p-2 rounded"
                  >
                    <span className="font-mono">
                      {op.source} → {op.destination}
                    </span>
                    <div className="flex items-center gap-2">
                      {op.moduleName && (
                        <span className="text-xs text-slate-500">{op.moduleName}</span>
                      )}
                      <span className="text-slate-400">{op.volume}µL</span>
                    </div>
                  </div>
                ))}
              {operations.filter((o) => o.deviceId === selectedDeviceData.id).length === 0 && (
                <div className="text-sm text-slate-400">No operations yet</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
