import React, { createContext, useContext, useCallback, useMemo } from "react";
import type { ReactNode } from "react";
import type {
  SensorData,
  Device,
  ProtocolRun,
  PipetteOperation,
  LogEntry,
} from "../types";
import { ProtocolService } from "../services/protocolService";
import { LogService } from "../services/logService";
import { protocolTemplates } from "../data/protocols";

interface LabContextValue {
  // State
  sensors: SensorData[];
  devices: Device[];
  protocolRuns: ProtocolRun[];
  operations: PipetteOperation[];
  logs: LogEntry[];
  currentUser: string;
  isAdmin: boolean;

  // Actions
  setSensors: React.Dispatch<React.SetStateAction<SensorData[]>>;
  setDevices: React.Dispatch<React.SetStateAction<Device[]>>;
  setProtocolRuns: React.Dispatch<React.SetStateAction<ProtocolRun[]>>;
  setOperations: React.Dispatch<React.SetStateAction<PipetteOperation[]>>;
  addLog: (log: LogEntry) => void;
  startProtocolRun: (templateId: string, deviceId: string) => void;
  pauseProtocolRun: (runId: string) => void;
  resumeProtocolRun: (runId: string) => void;
  cancelProtocolRun: (runId: string) => void;
  restartProtocolRun: (runId: string) => void;

  // Computed values
  connectedDevices: Device[];
  totalModules: number;
  connectedModules: number;
  activeRuns: ProtocolRun[];
  isRunning: boolean;
  totalOperations: number;
}

const LabContext = createContext<LabContextValue | undefined>(undefined);

interface LabProviderProps {
  children: ReactNode;
  initialSensors: SensorData[];
  initialDevices: Device[];
  currentUser?: string;
  isAdmin?: boolean;
}

export const LabProvider = ({
  children,
  initialSensors,
  initialDevices,
  currentUser = "System",
  isAdmin = false,
}: LabProviderProps) => {
  const [sensors, setSensors] = React.useState<SensorData[]>(initialSensors);
  const [devices, setDevices] = React.useState<Device[]>(initialDevices);
  const [protocolRuns, setProtocolRuns] = React.useState<ProtocolRun[]>([]);
  const [operations, setOperations] = React.useState<PipetteOperation[]>([]);
  const [logs, setLogs] = React.useState<LogEntry[]>([
    LogService.createLog("System initialized", "info"),
    LogService.createLog(LogService.formatUserAction(currentUser, "logged in"), "info", undefined, undefined, currentUser),
  ]);

  // Memoized computed values
  const connectedDevices = useMemo(
    () => devices.filter((d) => d.status === "connected"),
    [devices]
  );

  const totalModules = useMemo(
    () => devices.reduce((sum, d) => sum + d.modules.length, 0),
    [devices]
  );

  const connectedModules = useMemo(
    () => devices.reduce((sum, d) => sum + d.modules.filter((m) => m.status === "connected").length, 0),
    [devices]
  );

  const activeRuns = useMemo(
    () => protocolRuns.filter((r) => r.status === "running"),
    [protocolRuns]
  );

  const isRunning = useMemo(() => activeRuns.length > 0, [activeRuns]);

  const totalOperations = useMemo(
    () => operations.filter((o) => o.status === "completed").length,
    [operations]
  );

  // Memoized callbacks
  const addLog = useCallback(
    (log: LogEntry) => {
      setLogs((prev) => [log, ...prev.slice(0, 99)]);
    },
    []
  );

  const startProtocolRun = useCallback(
    (templateId: string, deviceId: string) => {
      const template = protocolTemplates.find((t) => t.id === templateId);
      const device = devices.find((d) => d.id === deviceId);

      if (!template || !device) {
        addLog(
          LogService.createLog(
            "Failed to start protocol: Template or device not found",
            "error",
            undefined,
            undefined,
            currentUser
          )
        );
        return;
      }

      const newRun = ProtocolService.createRun(template, device, currentUser);
      const startedRun = ProtocolService.startRun(newRun);

      setProtocolRuns((prev) => [startedRun, ...prev]);
      addLog(
        LogService.createLog(
          LogService.formatUserAction(currentUser, `started protocol "${template.name}" on ${device.name}`),
          "info",
          deviceId,
          startedRun.id,
          currentUser
        )
      );
    },
    [devices, addLog, currentUser]
  );

  const pauseProtocolRun = useCallback(
    (runId: string) => {
      setProtocolRuns((prev) =>
        prev.map((run) =>
          run.id === runId ? ProtocolService.pauseRun(run) : run
        )
      );
      addLog(
        LogService.createLog(
          `Protocol run paused`,
          "warning",
          undefined,
          runId,
          currentUser
        )
      );
    },
    [addLog, currentUser]
  );

  const resumeProtocolRun = useCallback(
    (runId: string) => {
      setProtocolRuns((prev) =>
        prev.map((run) =>
          run.id === runId ? ProtocolService.resumeRun(run) : run
        )
      );
      addLog(
        LogService.createLog(
          `Protocol run resumed`,
          "info",
          undefined,
          runId,
          currentUser
        )
      );
    },
    [addLog, currentUser]
  );

  const cancelProtocolRun = useCallback(
    (runId: string) => {
      setProtocolRuns((prev) =>
        prev.map((run) =>
          run.id === runId
            ? { ...run, status: "cancelled", completedAt: new Date().toISOString() }
            : run
        )
      );
      addLog(
        LogService.createLog(
          `Protocol run stopped by ${currentUser}`,
          "warning",
          undefined,
          runId,
          currentUser
        )
      );
    },
    [addLog, currentUser]
  );

  const restartProtocolRun = useCallback(
    (runId: string) => {
      setProtocolRuns((prev) =>
        prev.map((run) => {
          if (run.id === runId && (run.status === "cancelled" || run.status === "completed")) {
            const restartedRun = ProtocolService.startRun({
              ...run,
              status: "queued",
              progress: 0,
              currentStep: 0,
              startedAt: null,
              completedAt: null,
            });
            addLog(
              LogService.createLog(
                LogService.formatUserAction(currentUser, `restarted protocol "${run.templateName}"`),
                "info",
                run.deviceId,
                runId,
                currentUser
              )
            );
            return restartedRun;
          }
          return run;
        })
      );
    },
    [addLog, currentUser]
  );

  const value = useMemo<LabContextValue>(
    () => ({
      sensors,
      devices,
      protocolRuns,
      operations,
      logs,
      currentUser,
      isAdmin,
      setSensors,
      setDevices,
      setProtocolRuns,
      setOperations,
      addLog,
      startProtocolRun,
      pauseProtocolRun,
      resumeProtocolRun,
      cancelProtocolRun,
      restartProtocolRun,
      connectedDevices,
      totalModules,
      connectedModules,
      activeRuns,
      isRunning,
      totalOperations,
    }),
    [
      sensors,
      devices,
      protocolRuns,
      operations,
      logs,
      currentUser,
      isAdmin,
      addLog,
      startProtocolRun,
      pauseProtocolRun,
      resumeProtocolRun,
      cancelProtocolRun,
      connectedDevices,
      totalModules,
      connectedModules,
      activeRuns,
      isRunning,
      totalOperations,
    ]
  );

  return <LabContext.Provider value={value}>{children}</LabContext.Provider>;
};

export const useLab = () => {
  const context = useContext(LabContext);
  if (context === undefined) {
    throw new Error("useLab must be used within a LabProvider");
  }
  return context;
};

