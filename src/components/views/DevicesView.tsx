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
      <div className="mb-8">
        <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
          Device & Module Management
        </h2>
        <p className="text-slate-400">Monitor and manage connected devices and modules</p>
      </div>
      
      {/* Device List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {devices.map((device) => (
          <div
            key={device.id}
            onClick={() => setSelectedDevice(device.id)}
            className={`group relative bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-sm border-2 rounded-xl p-5 cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl ${
              selectedDevice === device.id 
                ? "border-blue-500 shadow-blue-500/20" 
                : "border-slate-700/50 hover:border-blue-400/50"
            } hover:-translate-y-1`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="font-bold text-lg mb-1 text-slate-100">{device.name}</div>
                  <div className="text-xs text-slate-400 capitalize font-medium">{device.type.replace("_", " ")}</div>
                </div>
                {device.status === "connected" ? (
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center border border-green-500/20">
                    <Wifi className="w-5 h-5 text-green-400" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center border border-slate-600/50">
                    <WifiOff className="w-5 h-5 text-slate-500" />
                  </div>
                )}
              </div>
              
              {device.currentOperation && (
                <div className="text-xs text-blue-400 mb-3 p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  {device.currentOperation}
                </div>
              )}
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Operations:</span>
                  <span className="text-slate-200 font-bold">{device.operations.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Modules:</span>
                  <span className="text-slate-200 font-bold">
                    {device.modules.length} ({device.modules.filter((m) => m.status === "connected").length} connected)
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Device Details with Modules */}
      {selectedDeviceData && (
        <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-slate-100">{selectedDeviceData.name}</h3>
            <button
              onClick={() => setSelectedDevice(null)}
              className="w-8 h-8 rounded-lg bg-slate-700/50 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Device Info */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/30">
              <div className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wide">Device Type</div>
              <div className="font-bold capitalize text-slate-200">{selectedDeviceData.type.replace("_", " ")}</div>
              {selectedDeviceData.model && (
                <div className="text-xs text-slate-400 mt-1">{selectedDeviceData.model}</div>
              )}
            </div>
            <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/30">
              <div className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wide">Status</div>
              <div className={`font-bold ${getStatusTextColor(selectedDeviceData.status)}`}>
                {selectedDeviceData.status}
              </div>
              {selectedDeviceData.uptime && (
                <div className="text-xs text-slate-400 mt-1">
                  Uptime: {Math.floor(selectedDeviceData.uptime / 3600)}h {Math.floor((selectedDeviceData.uptime % 3600) / 60)}m
                </div>
              )}
            </div>
            <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/30">
              <div className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wide">Serial Number</div>
              <div className="font-bold text-slate-200 font-mono text-sm">{selectedDeviceData.serialNumber || "N/A"}</div>
            </div>
            <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/30">
              <div className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wide">Firmware Version</div>
              <div className="font-bold text-slate-200">{selectedDeviceData.firmwareVersion || "N/A"}</div>
            </div>
            <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/30">
              <div className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wide">Total Operations</div>
              <div className="font-bold text-slate-200">{selectedDeviceData.operations.toLocaleString()}</div>
              <div className="text-xs text-slate-400 mt-1">
                {selectedDeviceData.operations > 0 
                  ? `${Math.round(selectedDeviceData.operations / (selectedDeviceData.uptime || 1) * 3600)} ops/hour`
                  : "No operations"}
              </div>
            </div>
            <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/30">
              <div className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wide">Last Calibration</div>
              <div className="font-bold text-slate-200">{selectedDeviceData.lastCalibration || "N/A"}</div>
              {selectedDeviceData.location && (
                <div className="text-xs text-slate-400 mt-1">{selectedDeviceData.location}</div>
              )}
            </div>
          </div>

          {/* Modules Section */}
          <div className="mb-6">
            <h4 className="font-bold mb-4 text-lg flex items-center gap-2">
              <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full" />
              Connected Modules
            </h4>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {selectedDeviceData.modules.map((module) => {
                const ModuleIcon = getModuleIcon(module.type);
                return (
                  <div
                    key={module.id}
                    className="group bg-gradient-to-br from-slate-900/80 to-slate-800/80 border border-slate-700/50 rounded-xl p-4 hover:border-blue-500/50 transition-all hover:-translate-y-0.5 shadow-md hover:shadow-lg"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                        <ModuleIcon className="w-5 h-5 text-blue-400" />
                      </div>
                      {module.status === "connected" ? (
                        <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20">
                          <Wifi className="w-3.5 h-3.5 text-green-400" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-slate-700/50 flex items-center justify-center">
                          <WifiOff className="w-3.5 h-3.5 text-slate-500" />
                        </div>
                      )}
                    </div>
                    <div className="font-bold text-sm mb-1 text-slate-200">{module.name}</div>
                    <div className="text-xs text-slate-400 mb-2 font-medium">{formatModuleType(module.type)}</div>
                    {module.serialNumber && (
                      <div className="text-xs text-slate-500 mb-2 font-mono">SN: {module.serialNumber}</div>
                    )}
                    {module.volumeRange && (
                      <div className="text-xs text-slate-400 mb-2">
                        Range: {module.volumeRange.min}-{module.volumeRange.max}µL
                        {module.accuracy && ` (±${module.accuracy}%)`}
                      </div>
                    )}
                    {module.calibrationDate && (
                      <div className="text-xs text-slate-500 mb-2">Calibrated: {module.calibrationDate}</div>
                    )}
                    {module.currentOperation && (
                      <div className="text-xs text-blue-400 mb-2 p-1.5 bg-blue-500/10 rounded border border-blue-500/20">
                        {module.currentOperation}
                      </div>
                    )}
                    <div className="text-xs text-slate-400">
                      <span className="text-slate-500">Operations:</span> <span className="text-slate-300 font-semibold">{module.operations.toLocaleString()}</span>
                    </div>
                    {module.firmwareVersion && (
                      <div className="text-xs text-slate-500 mt-1">FW: {module.firmwareVersion}</div>
                    )}
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

