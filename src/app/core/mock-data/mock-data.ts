import { AssigneeItem } from '../models/assignee.model';
import { CameraItem } from '../models/camera.model';
import { DetectionInstanceItem } from '../models/detection-instance.model';
import { PlantItem } from '../models/plant.model';
import { ZoneItem } from '../models/zone.model';

export const mockAssignees: AssigneeItem[] = [
  // { name: "Anna Bianchi", id: 1 },
  // { name: "Giorgia Versace", id: 2 },
  // { name: "Marta Bergman", id: 3 },
  // { name: "Pietro Björn", id: 4 }
];

export const mockPlants: PlantItem[] = [
  { name: "Plant 1", id: 1, address: "Italy", plantConfidence: 0.5, plantstatus: true },
  { name: "Plant 2", id: 2, address: "Italy", plantConfidence: 0.6, plantstatus: true },
  { name: "Plant 3", id: 3, address: "Italy", plantConfidence: 0.7, plantstatus: true }
];


export const mockCamera: CameraItem[] = [
//   { name: "Camera 1", id: 1, ipAddress: "187.20.135.197" },
//   { name: "Camera 2", id: 2, ipAddress: "187.20.135.199" },
//   { name: "Camera 3", id: 3, ipAddress: "187.20.135.200" },
//   { name: "Camera 4", id: 4, ipAddress: "187.20.135.201" },
//   { name: "Camera 5", id: 5, ipAddress: "187.20.135.202" }
];


export const mockZones: ZoneItem[] = [
  // {
  //   title: "Zone 1",
  //   id: 1,
  //   plant_id: 1,
  //   cameras: [mockCamera[0], mockCamera[1]], // Use mock cameras
  //   assigneeId: 1, // Assign to "Anna Bianchi"
  //   zoneconfidence: 0.8,
  //   zonestatus:"active",
  //   description:"" 
  // },
  // {
  //   title: "Zone 2",
  //   id: 2,
  //   plant_id: 1,
  //   cameras: [mockCamera[2]], // Use a different camera
  //   assigneeId: 2, // Assign to "Giorgia Versace"
  //   zoneconfidence: 0.6,
  //   zonestatus:"active",
  //   description:"" 
  // },
  // {
  //   title: "Zone 3",
  //   id: 3,
  //   plant_id: 2,
  //   cameras: [mockCamera[1], mockCamera[2]], // Use mock cameras
  //   assigneeId: 3, // Assign to "Marta Bergman"
  //   zoneconfidence: 0.7,
  //   zonestatus:"active",
  //   description:"" 
  // },
  // {
  //   title: "Zone 4",
  //   id: 4,
  //   plant_id: 2,
  //   cameras: [mockCamera[0]], // Use a different camera
  //   assigneeId: 4, // Assign to "Pietro Björn"
  //   zoneconfidence: 0.9,
  //   zonestatus:"active",
  //   description:"" 
  // },
  // {
  //   title: "Zone 5",
  //   id: 5,
  //   plant_id: 3,
  //   cameras: [mockCamera[1], mockCamera[2]], // Use mock cameras
  //   assigneeId: 1, // Assign to "Anna Bianchi"
  //   zoneconfidence: 0.85,
  //   zonestatus:"active",
  //   description:"" 
  // }
];



export const mockDetectionInstance: DetectionInstanceItem[] = [
  // {
  //   name: "Detection Instance 1",
  //   id: 1,
  //   plantId: 1,
  //   zoneId: 1,
  //   assignee: "Luca Bianchi",
  //   confidenceTheshold: 0.5,
  //   detectionType: 1,
  //   classesDetection: ["Helmet", "Vest", "Hairnet", "Goggles", "Earplugs"],
  //   camera: mockCamera[0],  // Use the first camera from Zone 1
  //   isRunning: true,
  //   timeElapsed: 12323
  // },
  // {
  //   name: "Detection Instance 2",
  //   id: 2,
  //   plantId: 1,
  //   zoneId: 2,
  //   assignee: "Mariama Oliveira",
  //   confidenceTheshold: 0.5,
  //   detectionType: 2,
  //   classesDetection: ["Helmet"],
  //   camera: mockCamera[2],  // Use the camera from Zone 2
  //   isRunning: false,
  //   timeElapsed: 345
  // },
  // {
  //   name: "Detection Instance 3",
  //   id: 3,
  //   plantId: 1,
  //   zoneId: 1,
  //   assignee: "Minase Serafim",
  //   confidenceTheshold: 0.5,
  //   detectionType: 1,
  //   classesDetection: ["Vest", "Hairnet", "Goggles", "Earplugs"],
  //   camera: mockCamera[1],  // Use the second camera from Zone 1
  //   isRunning: true,
  //   timeElapsed: 678
  // },
  // {
  //   name: "Detection Instance 4",
  //   id: 4,
  //   plantId: 2,
  //   zoneId: 3,
  //   assignee: "Mariama Oliveira",
  //   confidenceTheshold: 0.5,
  //   detectionType: 2,
  //   classesDetection: ["Helmet", "Vest", "Hairnet", "Goggles", "Earplugs"],
  //   camera: mockCamera[2],  // Use a camera from Zone 3
  //   isRunning: true,
  //   timeElapsed: 555
  // },
  // {
  //   name: "Detection Instance 5",
  //   id: 5,
  //   plantId: 2,
  //   zoneId: 4,
  //   assignee: "Luca Bianchi",
  //   confidenceTheshold: 0.5,
  //   detectionType: 1,
  //   classesDetection: ["Helmet", "Earplugs"],
  //   camera: mockCamera[0],  // Use the camera from Zone 4
  //   isRunning: true,
  //   timeElapsed: 99999
  // }
];