import { useEffect, useCallback } from "react";
import type { ProtocolRun, PipetteOperation, Device, LogEntry } from "../types";
import { ProtocolService } from "../services/protocolService";
import { DeviceService } from "../services/deviceService";
import { LogService } from "../services/logService";

interface UseProtocolSimulationProps {
  protocolRuns: ProtocolRun[];
  devices: Device[];
  setProtocolRuns: React.Dispatch<React.SetStateAction<ProtocolRun[]>>;
  setDevices: React.Dispatch<React.SetStateAction<Device[]>>;
  setOperations: React.Dispatch<React.SetStateAction<PipetteOperation[]>>;
  addLog: (log: LogEntry) => void;
  currentUser?: string;
}

export const useProtocolSimulation = ({
  protocolRuns,
  devices,
  setProtocolRuns,
  setDevices,
  setOperations,
  addLog,
  currentUser = "System",
}: UseProtocolSimulationProps) => {
  const executeProtocolStep = useCallback(
    (run: ProtocolRun, stepIndex: number) => {
      try {
        // Find device and select a pipette module for the operation
        const device = devices.find((d) => d.id === run.deviceId);
        const pipetteModule = device?.modules.find((m) => m.type === "pipette" && m.status === "connected");
        
        const { operation, updatedRun } = ProtocolService.executeStep(
          run,
          stepIndex,
          pipetteModule?.id,
          pipetteModule?.name,
          currentUser
        );

        // Add operation
        setOperations((prev) => [operation, ...prev]);

        // Update device and module current operation
        if (device) {
          const operationText = `${operation.source} → ${operation.destination} (${operation.volume}µL)`;
          setDevices((prev) =>
            prev.map((d) => {
              if (d.id === device.id) {
                let updatedDevice = DeviceService.setCurrentOperation(d, operationText);
                if (pipetteModule) {
                  updatedDevice = DeviceService.setModuleOperation(updatedDevice, pipetteModule.id, operationText);
                }
                return updatedDevice;
              }
              return d;
            })
          );
        }

        // Log the operation
        addLog(
          LogService.createLog(
            LogService.formatDeviceLog(
              run.deviceName,
              `Transferring ${operation.volume}µL from ${operation.source} to ${operation.destination}`
            ),
            "info",
            run.deviceId,
            run.id,
            currentUser
          )
        );

        // Simulate operation delay (2 seconds)
        setTimeout(() => {
          // Complete operation
          setOperations((prev) =>
            prev.map((op) =>
              op.id === operation.id ? ProtocolService.completeOperation(op) : op
            )
          );

          // Clear device and module operation
          if (device) {
            setDevices((prev) =>
              prev.map((d) => {
                if (d.id === device.id) {
                  let updatedDevice = DeviceService.setCurrentOperation(DeviceService.incrementOperations(d), null);
                  if (pipetteModule) {
                    updatedDevice = DeviceService.setModuleOperation(updatedDevice, pipetteModule.id, null);
                    updatedDevice = DeviceService.incrementModuleOperations(updatedDevice, pipetteModule.id);
                  }
                  return updatedDevice;
                }
                return d;
              })
            );
          }

          // Update protocol run
          setProtocolRuns((prev) =>
            prev.map((r) => {
              if (r.id === run.id) {
                if (updatedRun.status === "completed") {
                  addLog(
                    LogService.createLog(
                      LogService.formatProtocolLog(run.templateName, "completed successfully"),
                      "info",
                      run.deviceId,
                      run.id,
                      currentUser
                    )
                  );
                }
                return updatedRun;
              }
              return r;
            })
          );
        }, 2000);
      } catch (error) {
        addLog(
          LogService.createLog(
            `Error executing step ${stepIndex} of protocol ${run.templateName}: ${error}`,
            "error",
            run.deviceId,
            run.id,
            currentUser
          )
        );
      }
    },
    [devices, setProtocolRuns, setDevices, setOperations, addLog, currentUser]
  );

  useEffect(() => {
    const activeRuns = protocolRuns.filter((r) => r.status === "running");
    if (activeRuns.length === 0) return;

    const interval = setInterval(() => {
      activeRuns.forEach((run) => {
        if (run.currentStep < run.totalSteps) {
          executeProtocolStep(run, run.currentStep);
        }
      });
    }, 3000); // Execute steps every 3 seconds

    return () => clearInterval(interval);
  }, [protocolRuns, executeProtocolStep]);
};

