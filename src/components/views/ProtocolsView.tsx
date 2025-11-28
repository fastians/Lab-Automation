import type { ProtocolTemplate, Device, View } from "../../types";

interface ProtocolsViewProps {
  templates: ProtocolTemplate[];
  devices: Device[];
  onStartRun: (templateId: string, deviceId: string) => void;
  isAdmin: boolean;
  onNavigate?: (view: View) => void;
}

export const ProtocolsView = ({ templates, devices, onStartRun, isAdmin, onNavigate }: ProtocolsViewProps) => {
  // Get the single connected device
  const connectedDevice = devices.find((d) => d.status === "connected");

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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Protocol Templates</h2>
        {isAdmin && (
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-sm transition">
            + New Template
          </button>
        )}
      </div>
      
      {!connectedDevice && (
        <div className="bg-yellow-900/50 border border-yellow-700 rounded-lg p-4 mb-6">
          <div className="text-yellow-400 font-semibold">No device available</div>
          <div className="text-sm text-yellow-300/70 mt-1">Please ensure the Liquid Handler Robot is connected.</div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {templates.map((template) => (
          <div key={template.id} className="bg-slate-800 border border-slate-700 rounded-lg p-5">
            <h3 className="text-lg font-semibold mb-2">{template.name}</h3>
            <p className="text-sm text-slate-400 mb-4">{template.description}</p>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-slate-400">{template.steps.length} steps</span>
              <span className="text-sm text-slate-400">~{template.estimatedTime} min</span>
            </div>
            <div className="mb-4">
              <div className="text-xs text-slate-400 mb-2">Created by: {template.createdBy}</div>
              <div className="text-xs text-slate-400">Created: {template.createdAt}</div>
            </div>
            {connectedDevice && (
              <div className="mb-3 text-xs text-slate-500">
                Will run on: <span className="text-slate-400">{connectedDevice.name}</span>
              </div>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => handleStartRun(template.id)}
                disabled={!connectedDevice}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed rounded-lg font-semibold text-sm transition"
              >
                Start Run
              </button>
              {isAdmin && (
                <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold text-sm transition">
                  Edit
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

