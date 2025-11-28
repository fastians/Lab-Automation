import type { WellPlate } from "../types";
import { createWellPlate } from "../utils/wellPlateUtils";

/**
 * Initial well plates for simulation
 */
export const initialWellPlates: WellPlate[] = [
  createWellPlate("plate-1", "96-Well Plate", "96"),
  createWellPlate("plate-2", "384-Well Plate", "384"),
];

