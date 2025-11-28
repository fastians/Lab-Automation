import { Pipette, FlaskConical, HardDrive, GripVertical, Droplets } from "lucide-react";
import type { ModuleType } from "../types";
import type { LucideIcon } from "lucide-react";

export const getModuleIcon = (type: ModuleType): LucideIcon => {
  switch (type) {
    case "pipette":
      return Pipette;
    case "plate_reader":
      return FlaskConical;
    case "incubator":
      return HardDrive;
    case "gripper":
      return GripVertical;
    case "washer":
      return Droplets;
    default:
      return Pipette;
  }
};

export const formatModuleType = (type: ModuleType): string => {
  return type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
};


