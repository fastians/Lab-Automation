import type { LucideIcon } from "lucide-react";

export type View = "dashboard" | "devices" | "protocols" | "runs" | "operations" | "events" | "admin" | "wellplates";

export type SensorStatus = "normal" | "warning" | "critical";
export type DeviceStatus = "connected" | "disconnected" | "error";
export type ModuleType = "pipette" | "plate_reader" | "incubator" | "gripper" | "washer";
export type ModuleStatus = "connected" | "disconnected" | "error" | "busy";
export type OperationStatus = "completed" | "in_progress" | "failed" | "queued";
export type ProtocolRunStatus = "queued" | "running" | "completed" | "failed" | "paused" | "cancelled";
export type LogType = "info" | "warning" | "error";
export type WellPlateType = "96" | "384";
export type WellStatus = "empty" | "filled" | "processing" | "error";

export interface SensorData {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: SensorStatus;
  icon: LucideIcon;
  min: number;
  max: number;
}

export interface Module {
  id: string;
  name: string;
  type: ModuleType;
  status: ModuleStatus;
  deviceId: string; // Parent device ID
  lastSeen: string;
  operations: number;
  currentOperation: string | null;
  firmwareVersion?: string;
  serialNumber?: string;
  calibrationDate?: string;
  volumeRange?: { min: number; max: number }; // µL
  accuracy?: number; // ± percentage
}

export interface Device {
  id: string;
  name: string;
  type: "liquid_handler"; // Only liquid handler device
  status: DeviceStatus;
  lastSeen: string;
  operations: number;
  currentOperation: string | null;
  modules: Module[]; // Modules connected to this device
  firmwareVersion?: string;
  serialNumber?: string;
  model?: string;
  uptime?: number; // seconds
  lastCalibration?: string;
  location?: string;
}

export interface ProtocolStep {
  id: string;
  source: string; // Well address (e.g., "A1") or plate reference
  destination: string; // Well address (e.g., "B3") or plate reference
  volume: number;
  sourcePlateId?: string; // Optional plate reference
  destinationPlateId?: string; // Optional plate reference
  mixCycles?: number;
  delayAfter?: number; // seconds
}

export interface ProtocolTemplate {
  id: string;
  name: string;
  description: string;
  steps: ProtocolStep[];
  estimatedTime: number; // minutes
  createdBy: string;
  createdAt: string;
}

export interface ProtocolRun {
  id: string;
  templateId: string;
  templateName: string;
  deviceId: string;
  deviceName: string;
  status: ProtocolRunStatus;
  progress: number;
  currentStep: number;
  totalSteps: number;
  startedAt: string | null;
  completedAt: string | null;
  steps: ProtocolStep[];
  initiatedBy?: string; // User who started the run
}

export interface PipetteOperation {
  id: string;
  timestamp: string;
  deviceId: string;
  deviceName: string;
  moduleId?: string; // Module that performed the operation
  moduleName?: string;
  source: string;
  destination: string;
  volume: number;
  status: OperationStatus;
  protocolRunId?: string;
  initiatedBy?: string; // User who initiated
}

export interface LogEntry {
  timestamp: string;
  message: string;
  type: LogType;
  deviceId?: string;
  protocolRunId?: string;
  userId?: string; // User who triggered the event
}

export interface Well {
  id: string; // e.g., "A1", "B12", etc.
  row: number; // 0-based row index
  col: number; // 0-based column index
  volume: number; // Volume in µL
  status: WellStatus;
  plateId?: string; // Reference to parent plate
}

export interface WellPlate {
  id: string;
  name: string;
  type: WellPlateType;
  rows: number; // Number of rows (8 for 96, 16 for 384)
  cols: number; // Number of columns (12 for 96, 24 for 384)
  wells: Well[][]; // 2D array of wells
  createdAt: string;
  lastModified: string;
}

