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

    const totalWells = selectedPlate.rows * selectedPlate.cols;
    const filledWells = selectedPlate.wells.flat().filter((w) => w.status === "filled").length;
    const emptyWells = selectedPlate.wells.flat().filter((w) => w.status === "empty").length;
    const processingWells = selectedPlate.wells.flat().filter((w) => w.status === "processing").length;
    const totalVolume = selectedPlate.wells.flat().reduce((sum, w) => sum + w.volume, 0);

    return {
      totalWells,
      filledWells,
      emptyWells,
      processingWells,
      totalVolume,
      fillPercentage: (filledWells / totalWells) * 100,
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
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-800 border border-slate-700 rounded-lg p-3">
                    <div className="text-xs text-slate-400 mb-1">Total Wells</div>
                    <div className="text-xl font-bold">{plateStats.totalWells}</div>
                  </div>
                  <div className="bg-slate-800 border border-slate-700 rounded-lg p-3">
                    <div className="text-xs text-slate-400 mb-1">Filled</div>
                    <div className="text-xl font-bold text-blue-400">{plateStats.filledWells}</div>
                  </div>
                  <div className="bg-slate-800 border border-slate-700 rounded-lg p-3">
                    <div className="text-xs text-slate-400 mb-1">Empty</div>
                    <div className="text-xl font-bold text-slate-400">{plateStats.emptyWells}</div>
                  </div>
                  <div className="bg-slate-800 border border-slate-700 rounded-lg p-3">
                    <div className="text-xs text-slate-400 mb-1">Total Volume</div>
                    <div className="text-xl font-bold">{plateStats.totalVolume.toFixed(0)}µL</div>
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
          <h3 className="text-lg font-semibold mb-4">Plate Information</h3>
          {selectedPlate ? (
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 space-y-3">
              <div>
                <div className="text-xs text-slate-400 mb-1">Plate Name</div>
                <div className="font-semibold">{selectedPlate.name}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-1">Type</div>
                <div className="font-semibold">{getPlateTypeDisplayName(selectedPlate.type)}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-1">Dimensions</div>
                <div className="font-semibold">
                  {selectedPlate.rows} × {selectedPlate.cols}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-1">Created</div>
                <div className="text-sm">{new Date(selectedPlate.createdAt).toLocaleDateString()}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-1">Last Modified</div>
                <div className="text-sm">{new Date(selectedPlate.lastModified).toLocaleDateString()}</div>
              </div>
              {selectedWells.size > 0 && (
                <div className="pt-3 border-t border-slate-700">
                  <div className="text-xs text-slate-400 mb-2">Selected Wells</div>
                  <div className="text-sm font-mono space-y-1">
                    {Array.from(selectedWells).slice(0, 10).map((wellId) => (
                      <div key={wellId}>{wellId}</div>
                    ))}
                    {selectedWells.size > 10 && (
                      <div className="text-slate-500">...and {selectedWells.size - 10} more</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-center text-slate-400 text-sm">
              No plate selected
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

