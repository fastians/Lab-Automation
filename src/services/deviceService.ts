import type { Device, Module } from "../types";

export class DeviceService {
  /**
   * Updates device current operation
   */
  static setCurrentOperation(device: Device, operation: string | null): Device {
    return {
      ...device,
      currentOperation: operation,
    };
  }

  /**
   * Increments device operation count
   */
  static incrementOperations(device: Device): Device {
    return {
      ...device,
      operations: device.operations + 1,
    };
  }

  /**
   * Updates device last seen timestamp
   */
  static updateLastSeen(device: Device): Device {
    return {
      ...device,
      lastSeen: new Date().toLocaleTimeString(),
    };
  }

  /**
   * Updates device status
   */
  static updateStatus(device: Device, status: Device["status"]): Device {
    return {
      ...device,
      status,
    };
  }

  /**
   * Updates module current operation
   */
  static setModuleOperation(device: Device, moduleId: string, operation: string | null): Device {
    return {
      ...device,
      modules: device.modules.map((module) =>
        module.id === moduleId ? { ...module, currentOperation: operation } : module
      ),
    };
  }

  /**
   * Increments module operation count
   */
  static incrementModuleOperations(device: Device, moduleId: string): Device {
    return {
      ...device,
      modules: device.modules.map((module) =>
        module.id === moduleId ? { ...module, operations: module.operations + 1 } : module
      ),
    };
  }

  /**
   * Updates module status
   */
  static updateModuleStatus(device: Device, moduleId: string, status: Module["status"]): Device {
    return {
      ...device,
      modules: device.modules.map((module) =>
        module.id === moduleId ? { ...module, status } : module
      ),
    };
  }

  /**
   * Get module by ID
   */
  static getModule(device: Device, moduleId: string): Module | undefined {
    return device.modules.find((m) => m.id === moduleId);
  }
}

