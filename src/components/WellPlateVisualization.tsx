import { memo, useMemo } from "react";
import type { WellPlate, Well, PipetteOperation } from "../types";
import { parseWellAddress } from "../utils/wellPlateUtils";

interface WellPlateVisualizationProps {
  plate: WellPlate;
  selectedWells?: Set<string>;
  onWellClick?: (well: Well) => void;
  showVolume?: boolean;
  size?: "sm" | "md" | "lg";
  activeOperation?: PipetteOperation | null; // Current operation being animated
}

export const WellPlateVisualization = memo(
  ({ plate, selectedWells, onWellClick, showVolume = true, size = "md", activeOperation }: WellPlateVisualizationProps) => {
    const sizeClasses = useMemo(() => {
      switch (size) {
        case "sm":
          return {
            container: "p-2",
            well: "text-[6px]",
            grid: "gap-0.5",
          };
        case "md":
          return {
            container: "p-4",
            well: "text-[8px]",
            grid: "gap-1",
          };
        case "lg":
          return {
            container: "p-6",
            well: "text-xs",
            grid: "gap-1.5",
          };
        default:
          return {
            container: "p-4",
            well: "text-[8px]",
            grid: "gap-1",
          };
      }
    }, [size]);

    // Helper function to check if well is source/destination
    const isWellSource = (well: Well, operation: PipetteOperation | null | undefined): boolean => {
      if (!operation || operation.status !== "in_progress") return false;
      const sourceAddr = parseWellAddress(operation.source);
      return sourceAddr ? sourceAddr.row === well.row && sourceAddr.col === well.col : false;
    };

    const isWellDestination = (well: Well, operation: PipetteOperation | null | undefined): boolean => {
      if (!operation || operation.status !== "in_progress") return false;
      const destAddr = parseWellAddress(operation.destination);
      return destAddr ? destAddr.row === well.row && destAddr.col === well.col : false;
    };

    const getWellColor = (well: Well): string => {
      if (isWellSource(well, activeOperation)) {
        return "bg-cyan-600 border-cyan-300 ring-2 ring-cyan-400 ring-opacity-75 animate-pulse";
      }
      if (isWellDestination(well, activeOperation)) {
        return "bg-green-600 border-green-300 ring-2 ring-green-400 ring-opacity-75";
      }
      if (selectedWells?.has(well.id)) {
        return "bg-purple-600 border-purple-400";
      }
      switch (well.status) {
        case "filled":
          return "bg-blue-600 border-blue-400";
        case "processing":
          return "bg-yellow-600 border-yellow-400 animate-pulse";
        case "error":
          return "bg-red-600 border-red-400";
        default:
          return "bg-slate-700 border-slate-600";
      }
    };

    return (
      <div className={`bg-slate-800 border border-slate-700 rounded-lg ${sizeClasses.container}`}>
        <div className="mb-3">
          <h3 className="text-lg font-semibold">
            {plate.type}-Well Plate
          </h3>
        </div>

        <div
          className={`grid ${sizeClasses.grid} bg-slate-900 rounded-lg p-2 relative`}
          style={{ gridTemplateColumns: `repeat(${plate.cols}, minmax(0, 1fr))` }}
        >
          {/* Animated transfer line */}
          {activeOperation && activeOperation.status === "in_progress" && (() => {
            const sourceAddr = parseWellAddress(activeOperation.source);
            const destAddr = parseWellAddress(activeOperation.destination);
            if (!sourceAddr || !destAddr) return null;
            
            // Calculate positions (approximate, would need actual well positions for precise)
            const sourceRow = sourceAddr.row;
            const sourceCol = sourceAddr.col;
            const destRow = destAddr.row;
            const destCol = destAddr.col;
            
            // Only show line if both wells are on the same plate
            const sourceWell = plate.wells[sourceRow]?.[sourceCol];
            const destWell = plate.wells[destRow]?.[destCol];
            
            if (!sourceWell || !destWell) return null;
            
            return (
              <svg
                className="absolute inset-0 pointer-events-none z-10"
                style={{ padding: '0.5rem' }}
              >
                <defs>
                  <linearGradient id="transferGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#10b981" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
                  </linearGradient>
                </defs>
                <line
                  x1={`${((sourceCol + 0.5) / plate.cols) * 100}%`}
                  y1={`${((sourceRow + 0.5) / plate.rows) * 100}%`}
                  x2={`${((destCol + 0.5) / plate.cols) * 100}%`}
                  y2={`${((destRow + 0.5) / plate.rows) * 100}%`}
                  stroke="url(#transferGradient)"
                  strokeWidth="3"
                  strokeDasharray="5,5"
                  className="animate-pulse"
                  style={{
                    animation: 'dash 1s linear infinite',
                  }}
                />
                <style>{`
                  @keyframes dash {
                    to {
                      stroke-dashoffset: -10;
                    }
                  }
                `}</style>
              </svg>
            );
          })()}
          
          {plate.wells.map((row) =>
            row.map((well) => {
              const isSource = activeOperation?.status === "in_progress" && 
                parseWellAddress(activeOperation.source)?.row === well.row &&
                parseWellAddress(activeOperation.source)?.col === well.col;
              const isDest = activeOperation?.status === "in_progress" && 
                parseWellAddress(activeOperation.destination)?.row === well.row &&
                parseWellAddress(activeOperation.destination)?.col === well.col;
              
              return (
                <div
                  key={well.id}
                  className={`aspect-square w-full rounded-full border-2 transition-all cursor-pointer hover:scale-110 ${getWellColor(
                    well
                  )} ${sizeClasses.well} flex items-center justify-center overflow-hidden relative`}
                  onClick={() => onWellClick?.(well)}
                  title={`${well.id}: ${well.volume.toFixed(0)}µL`}
                  style={{ minWidth: 0, minHeight: 0 }}
                >
                  {isSource && (
                    <div className="absolute inset-0 rounded-full bg-cyan-400 opacity-30 animate-ping"></div>
                  )}
                  {isDest && (
                    <div className="absolute inset-0 rounded-full bg-green-400 opacity-20 animate-pulse"></div>
                  )}
                  {showVolume && well.volume > 0 && (
                    <span className="text-white opacity-70 font-mono truncate relative z-10">{well.volume.toFixed(0)}</span>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="flex gap-4 mt-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-600 border border-blue-400 rounded-full"></div>
            <span>Filled</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-slate-700 border border-slate-600 rounded-full"></div>
            <span>Empty</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-600 border border-yellow-400 rounded-full"></div>
            <span>Processing</span>
          </div>
          {selectedWells && selectedWells.size > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-600 border border-purple-400 rounded-full"></div>
              <span>Selected ({selectedWells.size})</span>
            </div>
          )}
        </div>
      </div>
    );
  }
);

WellPlateVisualization.displayName = "WellPlateVisualization";

