import type { WellPlate } from "../types";
import { createWellPlate } from "../utils/wellPlateUtils";

/**
 * Initial well plates for simulation
 */
export const initialWellPlates: WellPlate[] = [
  createWellPlate("plate-1", "Source Plate A", "96"),
  createWellPlate("plate-2", "Destination Plate B", "96"),
  createWellPlate("plate-3", "384-Well Assay Plate", "384"),
];

