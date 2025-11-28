import { useMemo } from "react";
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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Protocol Runs</h2>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-sm transition">
          + Start New Run
        </button>
      </div>

      {/* Well Plate Visualization - Always shown at top */}
      <div className="mb-6 bg-slate-800 border border-slate-700 rounded-lg p-4">
        <div className="mb-3">
          <h3 className="text-lg font-semibold">
            {displayPlate.type}-Well Plate
          </h3>
        </div>
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

