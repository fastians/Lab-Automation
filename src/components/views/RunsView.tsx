import { useMemo } from "react";
import { Clock, TrendingUp, CheckCircle2, XCircle, PauseCircle } from "lucide-react";
import type { ProtocolRun, PipetteOperation } from "../../types";
import { ProtocolRunCard } from "../memoized/ProtocolRunCard";
import { WellPlateVisualization } from "../WellPlateVisualization";
import { initialWellPlates } from "../../data/wellPlates";

interface RunsViewProps {
  protocolRuns: ProtocolRun[];
  operations: PipetteOperation[];
  onPause?: (runId: string) => void;
  onResume?: (runId: string) => void;
  onCancel?: (runId: string) => void;
  onRestart?: (runId: string) => void;
}

export const RunsView = ({ protocolRuns, operations, onPause, onResume, onCancel, onRestart }: RunsViewProps) => {
  // Find active operation (in_progress)
  const activeOperation = useMemo(() => {
    return operations.find((op) => op.status === "in_progress") || null;
  }, [operations]);

  // Statistics
  const statistics = useMemo(() => {
    const total = protocolRuns.length;
    const running = protocolRuns.filter((r) => r.status === "running").length;
    const completed = protocolRuns.filter((r) => r.status === "completed").length;
    const failed = protocolRuns.filter((r) => r.status === "failed").length;
    const cancelled = protocolRuns.filter((r) => r.status === "cancelled").length;
    const paused = protocolRuns.filter((r) => r.status === "paused").length;
    
    const completedRuns = protocolRuns.filter((r) => r.status === "completed" && r.startedAt && r.completedAt);
    let avgDuration = 0;
    if (completedRuns.length > 0) {
      const totalDuration = completedRuns.reduce((sum, r) => {
        const duration = new Date(r.completedAt!).getTime() - new Date(r.startedAt!).getTime();
        return sum + duration;
      }, 0);
      avgDuration = totalDuration / completedRuns.length / 1000 / 60; // minutes
    }

    return {
      total,
      running,
      completed,
      failed,
      cancelled,
      paused,
      avgDuration,
    };
  }, [protocolRuns]);

  // Find the plate for the active operation or use default
  const displayPlate = useMemo(() => {
    if (activeOperation) {
      // Try to find plate by source or destination plate ID from protocol steps
      const activeRun = protocolRuns.find((r) => r.id === activeOperation.protocolRunId);
      if (activeRun) {
        const currentStep = activeRun.steps[activeRun.currentStep - 1];
        if (currentStep) {
          // Use destination plate if available, otherwise source plate
          const plateId = currentStep.destinationPlateId || currentStep.sourcePlateId;
          if (plateId) {
            const foundPlate = initialWellPlates.find((p) => p.id === plateId);
            if (foundPlate) return foundPlate;
          }
        }
      }
    }
    
    // Default to first plate (or destination plate from most recent run)
    if (protocolRuns.length > 0) {
      const latestRun = protocolRuns[0];
      if (latestRun.steps.length > 0) {
        const firstStep = latestRun.steps[0];
        const plateId = firstStep.destinationPlateId || firstStep.sourcePlateId;
        if (plateId) {
          const foundPlate = initialWellPlates.find((p) => p.id === plateId);
          if (foundPlate) return foundPlate;
        }
      }
    }
    
    return initialWellPlates[0]; // Default to first plate
  }, [activeOperation, protocolRuns]);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Protocol Runs
          </h2>
          <p className="text-slate-400">Monitor active and completed protocol executions</p>
        </div>
        <button className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:-translate-y-0.5">
          + Start New Run
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 shadow-lg">
          <div className="text-xs text-slate-400 mb-1">Total Runs</div>
          <div className="text-2xl font-bold">{statistics.total}</div>
        </div>
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 shadow-lg">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <TrendingUp className="w-3 h-3 text-green-400" />
            Running
          </div>
          <div className="text-2xl font-bold text-green-400">{statistics.running}</div>
        </div>
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 shadow-lg">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <CheckCircle2 className="w-3 h-3 text-blue-400" />
            Completed
          </div>
          <div className="text-2xl font-bold text-blue-400">{statistics.completed}</div>
        </div>
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 shadow-lg">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <PauseCircle className="w-3 h-3 text-yellow-400" />
            Paused
          </div>
          <div className="text-2xl font-bold text-yellow-400">{statistics.paused}</div>
        </div>
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 shadow-lg">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <XCircle className="w-3 h-3 text-red-400" />
            Failed
          </div>
          <div className="text-2xl font-bold text-red-400">{statistics.failed}</div>
        </div>
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 shadow-lg">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Clock className="w-3 h-3 text-purple-400" />
            Avg Duration
          </div>
          <div className="text-2xl font-bold text-purple-400">
            {statistics.avgDuration > 0 ? `${statistics.avgDuration.toFixed(1)}m` : "N/A"}
          </div>
        </div>
      </div>

      {/* Well Plate Visualization - Always shown at top */}
      <div className="mb-6 max-w-xl mx-auto">
        <WellPlateVisualization
          plate={displayPlate}
          activeOperation={activeOperation}
          size="md"
          showVolume={true}
        />
      </div>

      <div className="space-y-4">
        {protocolRuns.map((run) => (
          <ProtocolRunCard
            key={run.id}
            run={run}
            onPause={onPause}
            onResume={onResume}
            onCancel={onCancel}
            onRestart={onRestart}
          />
        ))}
        {protocolRuns.length === 0 && (
          <div className="text-center text-slate-400 py-12">No protocol runs yet</div>
        )}
      </div>
    </div>
  );
};

