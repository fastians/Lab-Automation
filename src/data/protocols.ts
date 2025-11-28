import type { ProtocolTemplate } from "../types";

export const protocolTemplates: ProtocolTemplate[] = [
  {
    id: "1",
    name: "Standard Dilution Series (96-well)",
    description: "Creates a 1:2 dilution series across 8 wells on a 96-well plate",
    steps: [
      { id: "1", source: "A1", destination: "B1", volume: 100, sourcePlateId: "plate-1", destinationPlateId: "plate-2" },
      { id: "2", source: "B1", destination: "C1", volume: 50, sourcePlateId: "plate-2", destinationPlateId: "plate-2" },
      { id: "3", source: "C1", destination: "D1", volume: 50, sourcePlateId: "plate-2", destinationPlateId: "plate-2" },
      { id: "4", source: "D1", destination: "E1", volume: 50, sourcePlateId: "plate-2", destinationPlateId: "plate-2" },
      { id: "5", source: "E1", destination: "F1", volume: 50, sourcePlateId: "plate-2", destinationPlateId: "plate-2" },
    ],
    estimatedTime: 5,
    createdBy: "Admin",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Multi-Well Transfer (96-well)",
    description: "Transfer on 96-well format",
    steps: [
      { id: "1", source: "A1", destination: "A1", volume: 50, sourcePlateId: "plate-1", destinationPlateId: "plate-2" },
      { id: "2", source: "A2", destination: "A2", volume: 50, sourcePlateId: "plate-1", destinationPlateId: "plate-2" },
      { id: "3", source: "A3", destination: "A3", volume: 50, sourcePlateId: "plate-1", destinationPlateId: "plate-2" },
      { id: "4", source: "A4", destination: "A4", volume: 50, sourcePlateId: "plate-1", destinationPlateId: "plate-2" },
    ],
    estimatedTime: 3,
    createdBy: "Admin",
    createdAt: "2024-01-14",
  },
  {
    id: "3",
    name: "384-Well Plate Transfer",
    description: "High-throughput transfer on 384-well plate format",
    steps: [
      { id: "1", source: "A1", destination: "A1", volume: 25, sourcePlateId: "plate-2", destinationPlateId: "plate-2" },
      { id: "2", source: "A2", destination: "A2", volume: 25, sourcePlateId: "plate-2", destinationPlateId: "plate-2" },
      { id: "3", source: "A3", destination: "A3", volume: 25, sourcePlateId: "plate-2", destinationPlateId: "plate-2" },
      { id: "4", source: "A4", destination: "A4", volume: 25, sourcePlateId: "plate-2", destinationPlateId: "plate-2" },
      { id: "5", source: "A5", destination: "A5", volume: 25, sourcePlateId: "plate-2", destinationPlateId: "plate-2" },
    ],
    estimatedTime: 4,
    createdBy: "Admin",
    createdAt: "2024-01-13",
  },
];

