import { useEffect } from "react";
import type { SensorData, LogEntry } from "../types";
import { LogService } from "../services/logService";

interface UseSensorSimulationProps {
  sensors: SensorData[];
  setSensors: React.Dispatch<React.SetStateAction<SensorData[]>>;
  addLog: (log: LogEntry) => void;
  isRunning: boolean;
}

export const useSensorSimulation = ({
  setSensors,
  addLog,
  isRunning,
}: UseSensorSimulationProps) => {
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSensors((prev) =>
        prev.map((sensor) => {
          const range = sensor.max - sensor.min;
          const variation = (Math.random() - 0.5) * (range * 0.1);
          let newValue = sensor.value + variation;
          newValue = Math.max(sensor.min - 5, Math.min(sensor.max + 5, newValue));

          let status: "normal" | "warning" | "critical" = "normal";
          if (newValue < sensor.min || newValue > sensor.max) {
            status = "warning";
            if (newValue < sensor.min - 3 || newValue > sensor.max + 3) {
              status = "critical";
              addLog(
                LogService.createLog(
                  `${sensor.name} CRITICAL: ${newValue.toFixed(1)}${sensor.unit}`,
                  "error"
                )
              );
            } else {
              addLog(
                LogService.createLog(
                  `${sensor.name} out of range: ${newValue.toFixed(1)}${sensor.unit}`,
                  "warning"
                )
              );
            }
          }

          return { ...sensor, value: newValue, status };
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [isRunning, setSensors, addLog]);
};

