import { Thermometer, Droplets, Gauge } from "lucide-react";
import type { SensorData } from "../types";

export const initialSensors: SensorData[] = [
  {
    id: "1",
    name: "Temperature A",
    value: 23.5,
    unit: "°C",
    status: "normal",
    icon: Thermometer,
    min: 20,
    max: 30,
  },
  {
    id: "2",
    name: "Temperature B",
    value: 24.1,
    unit: "°C",
    status: "normal",
    icon: Thermometer,
    min: 20,
    max: 30,
  },
  {
    id: "3",
    name: "Pressure",
    value: 1013,
    unit: "hPa",
    status: "normal",
    icon: Gauge,
    min: 1000,
    max: 1020,
  },
  {
    id: "4",
    name: "Humidity",
    value: 45,
    unit: "%",
    status: "normal",
    icon: Droplets,
    min: 40,
    max: 60,
  },
];

