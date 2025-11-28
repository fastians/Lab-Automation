import type { SensorStatus, DeviceStatus, OperationStatus, ProtocolRunStatus } from "../types";

export const getStatusColor = (status: string): string => {
  switch (status) {
    case "critical":
    case "error":
    case "failed":
      return "text-red-500 bg-red-950 border-red-500";
    case "warning":
      return "text-yellow-500 bg-yellow-950 border-yellow-500";
    case "running":
    case "in_progress":
      return "text-blue-500 bg-blue-950 border-blue-500";
    case "completed":
    case "connected":
      return "text-green-500 bg-green-950 border-green-500";
    default:
      return "text-slate-500 bg-slate-800 border-slate-700";
  }
};

export const getStatusTextColor = (status: SensorStatus | DeviceStatus | OperationStatus | ProtocolRunStatus): string => {
  switch (status) {
    case "critical":
    case "error":
    case "failed":
      return "text-red-500";
    case "warning":
      return "text-yellow-500";
    case "running":
    case "in_progress":
      return "text-blue-500";
    case "completed":
    case "connected":
      return "text-green-500";
    case "cancelled":
      return "text-orange-500";
    default:
      return "text-slate-500";
  }
};

export const getLogColor = (type: "info" | "warning" | "error"): string => {
  switch (type) {
    case "error":
      return "text-red-400 border-l-red-500";
    case "warning":
      return "text-yellow-400 border-l-yellow-500";
    default:
      return "text-slate-400 border-l-blue-500";
  }
};

