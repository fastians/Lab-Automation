import { useState, useMemo } from "react";
import { Filter, Search, AlertCircle, Info, AlertTriangle } from "lucide-react";
import type { LogEntry } from "../../types";
import { getLogColor } from "../../utils/styleUtils";

interface EventsViewProps {
  logs: LogEntry[];
}

export const EventsView = ({ logs }: EventsViewProps) => {
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLogs = useMemo(() => {
    let filtered = logs;
    
    if (typeFilter !== "all") {
      filtered = filtered.filter((log) => log.type === typeFilter);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (log) =>
          log.message.toLowerCase().includes(query) ||
          log.deviceId?.toLowerCase().includes(query) ||
          log.protocolRunId?.toLowerCase().includes(query) ||
          log.userId?.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [logs, typeFilter, searchQuery]);

  const statistics = useMemo(() => {
    const total = logs.length;
    const info = logs.filter((l) => l.type === "info").length;
    const warnings = logs.filter((l) => l.type === "warning").length;
    const errors = logs.filter((l) => l.type === "error").length;

    return { total, info, warnings, errors };
  }, [logs]);

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

  const getLogIcon = (type: string) => {
    switch (type) {
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      default:
        return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
          Event Logs
        </h2>
        <p className="text-slate-400">Complete audit trail of all system events</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 shadow-lg">
          <div className="text-xs text-slate-400 mb-1">Total Events</div>
          <div className="text-2xl font-bold">{statistics.total.toLocaleString()}</div>
        </div>
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 shadow-lg">
          <div className="text-xs text-slate-400 mb-1">Info</div>
          <div className="text-2xl font-bold text-blue-400">{statistics.info}</div>
        </div>
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 shadow-lg">
          <div className="text-xs text-slate-400 mb-1">Warnings</div>
          <div className="text-2xl font-bold text-yellow-400">{statistics.warnings}</div>
        </div>
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 shadow-lg">
          <div className="text-xs text-slate-400 mb-1">Errors</div>
          <div className="text-2xl font-bold text-red-400">{statistics.errors}</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search events by message, device, protocol, or user..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-slate-400" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-200 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
          >
            <option value="all">All Types</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
          </select>
        </div>
      </div>

      {/* Event Log */}
      <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-lg">
        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
          {filteredLogs.map((log, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-lg border-l-4 bg-slate-900/50 border-slate-700/30 hover:bg-slate-900/70 transition-colors ${getLogColor(log.type)}`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{getLogIcon(log.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="font-mono text-xs text-slate-500">{formatTimestamp(log.timestamp)}</div>
                    <div className="text-xs text-slate-500 ml-4">{formatTimeAgo(log.timestamp)}</div>
                  </div>
                  <div className="text-sm text-slate-200 mb-2">{log.message}</div>
                  <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                    {log.deviceId && (
                      <span>
                        Device: <span className="text-slate-300 font-mono">{log.deviceId}</span>
                      </span>
                    )}
                    {log.protocolRunId && (
                      <span>
                        Protocol: <span className="text-slate-300 font-mono">{log.protocolRunId}</span>
                      </span>
                    )}
                    {log.userId && (
                      <span>
                        User: <span className="text-slate-300">{log.userId}</span>
                      </span>
                    )}
                  </div>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wide ${
                  log.type === "error" 
                    ? "bg-red-500/20 text-red-400 border border-red-500/30"
                    : log.type === "warning"
                    ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                    : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                }`}>
                  {log.type}
                </div>
              </div>
            </div>
          ))}
          {filteredLogs.length === 0 && (
            <div className="text-center text-slate-400 py-12">
              {searchQuery || typeFilter !== "all" 
                ? "No events match your filters" 
                : "No events yet"}
            </div>
          )}
        </div>
        {filteredLogs.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-700/50 text-sm text-slate-400 text-center">
            Showing {filteredLogs.length} of {logs.length} events
          </div>
        )}
      </div>
    </div>
  );
};
