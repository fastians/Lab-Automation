import { useState, useMemo } from "react";
import type { WellPlate, Well } from "../../types";
import { WellPlateVisualization } from "../WellPlateVisualization";
import { getPlateTypeDisplayName } from "../../utils/wellPlateUtils";
import { FlaskConical } from "lucide-react";

interface WellPlatesViewProps {
  plates: WellPlate[];
  onPlateUpdate?: (plate: WellPlate) => void;
}

export const WellPlatesView = ({ plates }: WellPlatesViewProps) => {
  const [selectedPlateId, setSelectedPlateId] = useState<string | null>(plates[0]?.id || null);
  const [selectedWells, setSelectedWells] = useState<Set<string>>(new Set());

  const selectedPlate = useMemo(
    () => plates.find((p) => p.id === selectedPlateId),
    [plates, selectedPlateId]
  );

  const handleWellClick = (well: Well) => {
    setSelectedWells((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(well.id)) {
        newSet.delete(well.id);
      } else {
        newSet.add(well.id);
      }
      return newSet;
    });
  };

  const plateStats = useMemo(() => {
    if (!selectedPlate) return null;

    const allWells = selectedPlate.wells.flat();
    const totalWells = selectedPlate.rows * selectedPlate.cols;
    const filledWells = allWells.filter((w) => w.status === "filled").length;
    const emptyWells = allWells.filter((w) => w.status === "empty").length;
    const processingWells = allWells.filter((w) => w.status === "processing").length;
    const errorWells = allWells.filter((w) => w.status === "error").length;
    const totalVolume = allWells.reduce((sum, w) => sum + w.volume, 0);
    const avgVolume = filledWells > 0 ? totalVolume / filledWells : 0;
    const maxVolume = Math.max(...allWells.map((w) => w.volume), 0);
    const minVolume = Math.min(...allWells.filter((w) => w.volume > 0).map((w) => w.volume), Infinity);

    return {
      totalWells,
      filledWells,
      emptyWells,
      processingWells,
      errorWells,
      totalVolume,
      avgVolume,
      maxVolume,
      minVolume: minVolume === Infinity ? 0 : minVolume,
      fillPercentage: (filledWells / totalWells) * 100,
      utilizationRate: (filledWells / totalWells) * 100,
    };
  }, [selectedPlate]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold flex items-center gap-2">
          <FlaskConical className="w-8 h-8" />
          Well Plate Management
        </h2>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Plate List */}
        <div className="lg:col-span-1">
          <h3 className="text-lg font-semibold mb-4">Plates</h3>
          <div className="space-y-2">
            {plates.map((plate) => (
              <div
                key={plate.id}
                onClick={() => {
                  setSelectedPlateId(plate.id);
                  setSelectedWells(new Set());
                }}
                className={`p-3 rounded-lg cursor-pointer transition ${
                  selectedPlateId === plate.id
                    ? "bg-blue-600 text-white"
                    : "bg-slate-800 border border-slate-700 hover:bg-slate-700"
                }`}
              >
                <div className="font-semibold">{plate.name}</div>
                <div className="text-xs opacity-75">{getPlateTypeDisplayName(plate.type)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Plate Visualization */}
        <div className="lg:col-span-2">
          {selectedPlate ? (
            <>
              <WellPlateVisualization
                plate={selectedPlate}
                selectedWells={selectedWells}
                onWellClick={handleWellClick}
                size="md"
              />
              {plateStats && (
                <div className="mt-4 space-y-4">
                  {/* Primary Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 shadow-lg">
                      <div className="text-xs text-slate-400 mb-1 font-medium">Total Wells</div>
                      <div className="text-2xl font-bold">{plateStats.totalWells}</div>
                    </div>
                    <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 shadow-lg">
                      <div className="text-xs text-slate-400 mb-1 font-medium">Filled</div>
                      <div className="text-2xl font-bold text-blue-400">{plateStats.filledWells}</div>
                      <div className="text-xs text-slate-500 mt-1">{plateStats.fillPercentage.toFixed(1)}%</div>
                    </div>
                    <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 shadow-lg">
                      <div className="text-xs text-slate-400 mb-1 font-medium">Empty</div>
                      <div className="text-2xl font-bold text-slate-400">{plateStats.emptyWells}</div>
                    </div>
                    <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 shadow-lg">
                      <div className="text-xs text-slate-400 mb-1 font-medium">Total Volume</div>
                      <div className="text-2xl font-bold text-cyan-400">{(plateStats.totalVolume / 1000).toFixed(2)}mL</div>
                      <div className="text-xs text-slate-500 mt-1">{plateStats.totalVolume.toFixed(0)}µL</div>
                    </div>
                  </div>
                  
                  {/* Secondary Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 shadow-lg">
                      <div className="text-xs text-slate-400 mb-1 font-medium">Processing</div>
                      <div className="text-xl font-bold text-yellow-400">{plateStats.processingWells}</div>
                    </div>
                    {plateStats.errorWells > 0 && (
                      <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 shadow-lg">
                        <div className="text-xs text-slate-400 mb-1 font-medium">Errors</div>
                        <div className="text-xl font-bold text-red-400">{plateStats.errorWells}</div>
                      </div>
                    )}
                    <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 shadow-lg">
                      <div className="text-xs text-slate-400 mb-1 font-medium">Avg Volume</div>
                      <div className="text-xl font-bold text-purple-400">{plateStats.avgVolume.toFixed(0)}µL</div>
                    </div>
                    <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 shadow-lg">
                      <div className="text-xs text-slate-400 mb-1 font-medium">Volume Range</div>
                      <div className="text-sm font-bold text-slate-300">
                        {plateStats.minVolume > 0 ? `${plateStats.minVolume.toFixed(0)}-${plateStats.maxVolume.toFixed(0)}µL` : "N/A"}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-12 text-center text-slate-400">
              Select a plate to view
            </div>
          )}
        </div>

        {/* Plate Info */}
        <div className="lg:col-span-1">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full" />
            Plate Information
          </h3>
          {selectedPlate ? (
            <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-xl p-5 space-y-4 shadow-lg">
              <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700/30">
                <div className="text-xs text-slate-500 mb-1 font-medium uppercase tracking-wide">Plate Name</div>
                <div className="font-bold text-slate-200">{selectedPlate.name}</div>
              </div>
              <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700/30">
                <div className="text-xs text-slate-500 mb-1 font-medium uppercase tracking-wide">Type</div>
                <div className="font-bold text-slate-200">{getPlateTypeDisplayName(selectedPlate.type)}</div>
              </div>
              <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700/30">
                <div className="text-xs text-slate-500 mb-1 font-medium uppercase tracking-wide">Dimensions</div>
                <div className="font-bold text-slate-200">
                  {selectedPlate.rows} × {selectedPlate.cols}
                </div>
                <div className="text-xs text-slate-500 mt-1">{selectedPlate.rows * selectedPlate.cols} total wells</div>
              </div>
              <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700/30">
                <div className="text-xs text-slate-500 mb-1 font-medium uppercase tracking-wide">Created</div>
                <div className="text-sm text-slate-300">{new Date(selectedPlate.createdAt).toLocaleDateString()}</div>
                <div className="text-xs text-slate-500 mt-1">{new Date(selectedPlate.createdAt).toLocaleTimeString()}</div>
              </div>
              <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700/30">
                <div className="text-xs text-slate-500 mb-1 font-medium uppercase tracking-wide">Last Modified</div>
                <div className="text-sm text-slate-300">{new Date(selectedPlate.lastModified).toLocaleDateString()}</div>
                <div className="text-xs text-slate-500 mt-1">{new Date(selectedPlate.lastModified).toLocaleTimeString()}</div>
              </div>
              {plateStats && (
                <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700/30">
                  <div className="text-xs text-slate-500 mb-1 font-medium uppercase tracking-wide">Utilization</div>
                  <div className="text-sm font-bold text-blue-400">{plateStats.utilizationRate.toFixed(1)}%</div>
                  <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden mt-2">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all"
                      style={{ width: `${plateStats.utilizationRate}%` }}
                    />
                  </div>
                </div>
              )}
              {selectedWells.size > 0 && (
                <div className="pt-4 border-t border-slate-700/50">
                  <div className="text-xs text-slate-400 mb-3 font-medium uppercase tracking-wide">Selected Wells</div>
                  <div className="text-sm font-mono space-y-1 max-h-48 overflow-y-auto">
                    {Array.from(selectedWells).slice(0, 10).map((wellId) => {
                      const well = selectedPlate.wells.flat().find((w) => w.id === wellId);
                      return (
                        <div key={wellId} className="flex items-center justify-between p-1.5 bg-slate-900/50 rounded">
                          <span className="text-slate-300">{wellId}</span>
                          {well && (
                            <span className="text-xs text-slate-500">{well.volume.toFixed(0)}µL</span>
                          )}
                        </div>
                      );
                    })}
                    {selectedWells.size > 10 && (
                      <div className="text-slate-500 text-xs pt-2">...and {selectedWells.size - 10} more</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 text-center text-slate-400 text-sm shadow-lg">
              No plate selected
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

