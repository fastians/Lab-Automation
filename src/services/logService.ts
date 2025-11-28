import type { LogEntry, LogType } from "../types";

export class LogService {
  /**
   * Creates a new log entry
   */
  static createLog(
    message: string,
    type: LogType = "info",
    deviceId?: string,
    protocolRunId?: string,
    userId?: string
  ): LogEntry {
    return {
      timestamp: new Date().toLocaleTimeString(),
      message,
      type,
      deviceId,
      protocolRunId,
      userId,
    };
  }

  /**
   * Formats log message with context
   */
  static formatDeviceLog(deviceName: string, message: string): string {
    return `[${deviceName}] ${message}`;
  }

  static formatProtocolLog(protocolName: string, message: string): string {
    return `Protocol "${protocolName}": ${message}`;
  }

  static formatUserAction(userName: string, action: string): string {
    return `${userName} ${action}`;
  }
}

