import type { PipetteOperation } from "../../types";
import { getStatusTextColor } from "../../utils/styleUtils";

interface OperationsViewProps {
  operations: PipetteOperation[];
}

export const OperationsView = ({ operations }: OperationsViewProps) => {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Operations Log</h2>
      <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-900">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Timestamp</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Device</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Module</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Source</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Destination</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Volume</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Initiated By</th>
            </tr>
          </thead>
          <tbody>
            {operations.map((op) => (
              <tr key={op.id} className="border-t border-slate-700">
                <td className="px-4 py-3 text-sm font-mono">{op.timestamp}</td>
                <td className="px-4 py-3 text-sm">{op.deviceName}</td>
                <td className="px-4 py-3 text-sm text-slate-400">{op.moduleName || "-"}</td>
                <td className="px-4 py-3 text-sm font-mono">{op.source}</td>
                <td className="px-4 py-3 text-sm font-mono">{op.destination}</td>
                <td className="px-4 py-3 text-sm">{op.volume}µL</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${getStatusTextColor(op.status)}`}>
                    {op.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-slate-400">{op.initiatedBy || "System"}</td>
              </tr>
            ))}
            {operations.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                  No operations yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

