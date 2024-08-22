import { AssigneeItem } from '../models/assignee';
import { CameraItem } from '../models/camera';
import { DetectionInstanceItem } from '../models/detection-instance';
import { PlantItem } from '../models/plant';
import { ZoneItem } from '../models/zone';

export const mockAssignees: AssigneeItem[] = [
  { name: "Anna Bianchi", id: 1 },
  { name: "Giorgia Versace", id: 2 },
  { name: "Marta Bergman", id: 3 },
  { name: "Pietro Björn", id: 4 }
];

export const mockPlants: PlantItem[] = [
  { name: "Plant 1", id: 1, address: "Italy", confidenceThreshold: 0.5, detectionInstances: [] },
  { name: "Plant 2", id: 2, address: "Italy", confidenceThreshold: 0.6, detectionInstances: [] },
  { name: "Plant 3", id: 3, address: "Italy", confidenceThreshold: 0.7, detectionInstances: [] }
];

export const mockZones: ZoneItem[] = [
  { name: "Zone 1", id: 1, plantId: 1 },
  { name: "Zone 2", id: 2, plantId: 1 },
  { name: "Zone 3", id: 3, plantId: 2 },
  { name: "Zone 4", id: 4, plantId: 2 },
  { name: "Zone 5", id: 5, plantId: 3 }
];

export const mockCamera: CameraItem[] = [
  { name: "Camera 1", id: 1, ipAddress: "187.20.135.197" },
  { name: "Camera 2", id: 2, ipAddress: "187.20.135.199" },
  { name: "Camera 3", id: 3, ipAddress: "187.20.135.200" }
];

export const mockDetectionInstance: DetectionInstanceItem[] = [
  {
    name: "Detection Instance 1",
    id: 1,
    plantId: 1,
    zoneId: 1,
    assignee: "Luca Bianchi",
    confidenceTheshold: 0.5,
    detectionType: 1,
    classesDetection: ["Helmet", "Vest", "Hairnet", "Goggles", "Earplugs"],
    listCameras: mockCamera,  // Use the mockCamera array here
    isRunning: true,
    timeElapsed: 0
  },
  {
    name: "Detection Instance 2",
    id: 2,
    plantId: 1,
    zoneId: 2,
    assignee: "Mariama Oliveira",
    confidenceTheshold: 0.5,
    detectionType: 2,
    classesDetection: ["Helmet"],
    listCameras: mockCamera,  // Use the mockCamera array here
    isRunning: false,
    timeElapsed: 0
  },
  {
    name: "Detection Instance 3",
    id: 3,
    plantId: 1,
    zoneId: 1,
    assignee: "Minase Serafim",
    confidenceTheshold: 0.5,
    detectionType: 1,
    classesDetection: ["Vest", "Hairnet", "Goggles", "Earplugs"],
    listCameras: mockCamera,  // Use the mockCamera array here
    isRunning: true,
    timeElapsed: 0
  },
  {
    name: "Detection Instance 4",
    id: 4,
    plantId: 2,
    zoneId: 1,
    assignee: "Mariama Oliveira",
    confidenceTheshold: 0.5,
    detectionType: 2,
    classesDetection: ["Helmet", "Vest", "Hairnet", "Goggles", "Earplugs"],
    listCameras: mockCamera,  // Use the mockCamera array here
    isRunning: true,
    timeElapsed: 0
  },
  {
    name: "Detection Instance 5",
    id: 5,
    plantId: 2,
    zoneId: 1,
    assignee: "Luca Bianchi",
    confidenceTheshold: 0.5,
    detectionType: 1,
    classesDetection: ["Helmet", "Earplugs"],
    listCameras: mockCamera,  // Use the mockCamera array here
    isRunning: true,
    timeElapsed: 0
  }
];
