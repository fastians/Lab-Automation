import type { WellPlateType, Well, WellPlate, WellStatus } from "../types";

/**
 * Well plate configuration
 */
export const WELL_PLATE_CONFIG: Record<WellPlateType, { rows: number; cols: number; totalWells: number }> = {
  "96": { rows: 8, cols: 12, totalWells: 96 },
  "384": { rows: 16, cols: 24, totalWells: 384 },
};

/**
 * Convert well address (e.g., "A1") to row/col indices
 */
export function parseWellAddress(address: string): { row: number; col: number } | null {
  const match = address.match(/^([A-Z]+)(\d+)$/);
  if (!match) return null;

  const rowStr = match[1];
  const colStr = match[2];

  // Convert row letters to 0-based index (A=0, B=1, ..., Z=25, AA=26, etc.)
  let row = 0;
  for (let i = 0; i < rowStr.length; i++) {
    row = row * 26 + (rowStr.charCodeAt(i) - 64);
  }
  row -= 1; // Convert to 0-based

  const col = parseInt(colStr, 10) - 1; // Convert to 0-based

  return { row, col };
}

/**
 * Convert row/col indices to well address (e.g., "A1")
 */
export function formatWellAddress(row: number, col: number): string {
  // Convert 0-based row to letters (0=A, 1=B, ..., 25=Z, 26=AA, etc.)
  // Supports up to 384-well plates (16 rows: A-P)
  let rowStr = "";
  let rowNum = row + 1; // Convert to 1-based
  while (rowNum > 0) {
    const remainder = (rowNum - 1) % 26;
    rowStr = String.fromCharCode(65 + remainder) + rowStr;
    rowNum = Math.floor((rowNum - 1) / 26);
  }

  return `${rowStr}${col + 1}`;
}

/**
 * Validate well address for a given plate type
 */
export function validateWellAddress(address: string, plateType: WellPlateType): boolean {
  const parsed = parseWellAddress(address);
  if (!parsed) return false;

  const config = WELL_PLATE_CONFIG[plateType];
  return parsed.row >= 0 && parsed.row < config.rows && parsed.col >= 0 && parsed.col < config.cols;
}

/**
 * Create an empty well plate
 */
export function createWellPlate(id: string, name: string, type: WellPlateType): WellPlate {
  const config = WELL_PLATE_CONFIG[type];
  const wells: Well[][] = [];

  for (let row = 0; row < config.rows; row++) {
    wells[row] = [];
    for (let col = 0; col < config.cols; col++) {
      wells[row][col] = {
        id: formatWellAddress(row, col),
        row,
        col,
        volume: 0,
        status: "empty" as WellStatus,
        plateId: id,
      };
    }
  }

  return {
    id,
    name,
    type,
    rows: config.rows,
    cols: config.cols,
    wells,
    createdAt: new Date().toISOString(),
    lastModified: new Date().toISOString(),
  };
}

/**
 * Get well from plate by address
 */
export function getWellByAddress(plate: WellPlate, address: string): Well | null {
  const parsed = parseWellAddress(address);
  if (!parsed) return null;

  if (parsed.row >= plate.rows || parsed.col >= plate.cols) return null;

  return plate.wells[parsed.row]?.[parsed.col] || null;
}

/**
 * Update well volume
 */
export function updateWellVolume(plate: WellPlate, address: string, volume: number): WellPlate {
  const parsed = parseWellAddress(address);
  if (!parsed || parsed.row >= plate.rows || parsed.col >= plate.cols) {
    return plate;
  }

  const newWells = plate.wells.map((row, r) =>
    row.map((well, c) => {
      if (r === parsed.row && c === parsed.col) {
        return {
          ...well,
          volume,
          status: (volume > 0 ? "filled" : "empty") as WellStatus,
        };
      }
      return well;
    })
  );

  return {
    ...plate,
    wells: newWells,
    lastModified: new Date().toISOString(),
  };
}

/**
 * Get plate type display name
 */
export function getPlateTypeDisplayName(type: WellPlateType): string {
  return `${type}-well plate`;
}

/**
 * Get plate dimensions for display
 */
export function getPlateDimensions(type: WellPlateType): string {
  const config = WELL_PLATE_CONFIG[type];
  return `${config.rows} × ${config.cols}`;
}

