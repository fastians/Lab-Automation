import type { Device } from "../types";

/**
 * Single liquid handler device with connected modules
 */
export const liquidHandlerDevice: Device = {
  id: "liquid-handler-1",
  name: "Liquid Handler Robot",
  type: "liquid_handler",
  status: "connected",
  lastSeen: new Date().toLocaleTimeString(),
  operations: 3421,
  currentOperation: null,
  firmwareVersion: "v2.4.1",
  serialNumber: "LH-2024-0847",
  model: "LiquidHandler Pro X1",
  uptime: 86400 * 7, // 7 days in seconds
  lastCalibration: "2024-01-10",
  location: "Lab A - Station 3",
  modules: [
    {
      id: "module-1",
      name: "Pipette Module A",
      type: "pipette",
      status: "connected",
      deviceId: "liquid-handler-1",
      lastSeen: new Date().toLocaleTimeString(),
      operations: 1247,
      currentOperation: null,
      firmwareVersion: "v1.8.2",
      serialNumber: "PM-A-2023-1523",
      calibrationDate: "2024-01-08",
      volumeRange: { min: 0.5, max: 1000 },
      accuracy: 0.5, // ±0.5%
    },
    {
      id: "module-2",
      name: "Pipette Module B",
      type: "pipette",
      status: "connected",
      deviceId: "liquid-handler-1",
      lastSeen: new Date().toLocaleTimeString(),
      operations: 892,
      currentOperation: null,
      firmwareVersion: "v1.8.2",
      serialNumber: "PM-B-2023-1524",
      calibrationDate: "2024-01-08",
      volumeRange: { min: 0.5, max: 1000 },
      accuracy: 0.5,
    },
    {
      id: "module-3",
      name: "Plate Reader Module",
      type: "plate_reader",
      status: "connected",
      deviceId: "liquid-handler-1",
      lastSeen: new Date().toLocaleTimeString(),
      operations: 456,
      currentOperation: null,
      firmwareVersion: "v3.1.0",
      serialNumber: "PR-2023-0891",
      calibrationDate: "2024-01-05",
    },
    {
      id: "module-4",
      name: "Gripper Module",
      type: "gripper",
      status: "connected",
      deviceId: "liquid-handler-1",
      lastSeen: new Date().toLocaleTimeString(),
      operations: 234,
      currentOperation: null,
      firmwareVersion: "v2.0.1",
      serialNumber: "GM-2023-0456",
      calibrationDate: "2024-01-12",
    },
  ],
};

/**
 * Initial device (single liquid handler)
 */
export const initialDevices: Device[] = [liquidHandlerDevice];
