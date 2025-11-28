import type { LogEntry } from "../../types";
import { getLogColor } from "../../utils/styleUtils";

interface EventsViewProps {
  logs: LogEntry[];
}

export const EventsView = ({ logs }: EventsViewProps) => {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Event Logs</h2>
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {logs.map((log, idx) => (
            <div key={idx} className={`text-sm border-l-2 pl-3 py-2 ${getLogColor(log.type)}`}>
              <div className="font-mono text-xs text-slate-500 mb-1">{log.timestamp}</div>
              <div>{log.message}</div>
              {log.userId && (
                <div className="text-xs text-slate-500 mt-1">User: {log.userId}</div>
              )}
            </div>
          ))}
          {logs.length === 0 && (
            <div className="text-center text-slate-400 py-8">No events yet</div>
          )}
        </div>
      </div>
    </div>
  );
};

