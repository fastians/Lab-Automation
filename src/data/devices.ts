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
    },
  ],
};

/**
 * Initial device (single liquid handler)
 */
export const initialDevices: Device[] = [liquidHandlerDevice];
