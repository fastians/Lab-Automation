import { useMemo, useState } from "react";
import { Filter, Download, Search } from "lucide-react";
import type { PipetteOperation } from "../../types";
import { getStatusTextColor } from "../../utils/styleUtils";

interface OperationsViewProps {
  operations: PipetteOperation[];
}

export const OperationsView = ({ operations }: OperationsViewProps) => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOperations = useMemo(() => {
    let filtered = operations;
    
    if (statusFilter !== "all") {
      filtered = filtered.filter((op) => op.status === statusFilter);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (op) =>
          op.source.toLowerCase().includes(query) ||
          op.destination.toLowerCase().includes(query) ||
          op.deviceName.toLowerCase().includes(query) ||
          op.moduleName?.toLowerCase().includes(query) ||
          op.volume.toString().includes(query)
      );
    }
    
    return filtered;
  }, [operations, statusFilter, searchQuery]);

  const statistics = useMemo(() => {
    const total = operations.length;
    const completed = operations.filter((o) => o.status === "completed").length;
    const failed = operations.filter((o) => o.status === "failed").length;
    const inProgress = operations.filter((o) => o.status === "in_progress").length;
    const totalVolume = operations
      .filter((o) => o.status === "completed")
      .reduce((sum, op) => sum + op.volume, 0);
    const avgVolume = completed > 0 ? totalVolume / completed : 0;

    return {
      total,
      completed,
      failed,
      inProgress,
      successRate: total > 0 ? ((completed / total) * 100).toFixed(1) : "100.0",
      totalVolume,
      avgVolume,
    };
  }, [operations]);

  const formatTimeAgo = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const seconds = Math.floor(diff / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
          Operations Log
        </h2>
        <p className="text-slate-400">Complete history of all pipette operations</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 shadow-lg">
          <div className="text-xs text-slate-400 mb-1">Total</div>
          <div className="text-2xl font-bold">{statistics.total.toLocaleString()}</div>
        </div>
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 shadow-lg">
          <div className="text-xs text-slate-400 mb-1">Completed</div>
          <div className="text-2xl font-bold text-green-400">{statistics.completed.toLocaleString()}</div>
        </div>
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 shadow-lg">
          <div className="text-xs text-slate-400 mb-1">Failed</div>
          <div className="text-2xl font-bold text-red-400">{statistics.failed}</div>
        </div>
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 shadow-lg">
          <div className="text-xs text-slate-400 mb-1">Success Rate</div>
          <div className="text-2xl font-bold text-blue-400">{statistics.successRate}%</div>
        </div>
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 shadow-lg">
          <div className="text-xs text-slate-400 mb-1">Total Volume</div>
          <div className="text-2xl font-bold text-cyan-400">{(statistics.totalVolume / 1000).toFixed(1)}mL</div>
        </div>
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 shadow-lg">
          <div className="text-xs text-slate-400 mb-1">Avg Volume</div>
          <div className="text-2xl font-bold text-purple-400">{statistics.avgVolume.toFixed(0)}µL</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by source, destination, device, module, or volume..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-200 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="in_progress">In Progress</option>
            <option value="failed">Failed</option>
            <option value="queued">Queued</option>
          </select>
        </div>
        <button className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:-translate-y-0.5 flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Operations Table */}
      <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50 border-b border-slate-700/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-400">Time</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-400">Device</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-400">Module</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-400">Source</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-400">Destination</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-400">Volume</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-400">Status</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-400">Initiated By</th>
              </tr>
            </thead>
            <tbody>
              {filteredOperations.map((op) => (
                <tr key={op.id} className="border-b border-slate-700/30 hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="text-sm font-mono text-slate-300">{formatTimestamp(op.timestamp)}</div>
                    <div className="text-xs text-slate-500">{formatTimeAgo(op.timestamp)}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-slate-200">{op.deviceName}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-slate-400">{op.moduleName || "-"}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-mono text-blue-400">{op.source}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-mono text-green-400">{op.destination}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-semibold text-cyan-400">{op.volume}µL</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusTextColor(op.status)}`}>
                      {op.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-slate-400">{op.initiatedBy || "System"}</div>
                  </td>
                </tr>
              ))}
              {filteredOperations.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-slate-400">
                    {searchQuery || statusFilter !== "all" 
                      ? "No operations match your filters" 
                      : "No operations yet"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {filteredOperations.length > 0 && (
          <div className="px-4 py-3 bg-slate-900/30 border-t border-slate-700/50 text-sm text-slate-400">
            Showing {filteredOperations.length} of {operations.length} operations
          </div>
        )}
      </div>
    </div>
  );
};
