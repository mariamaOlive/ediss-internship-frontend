import { CameraItem } from "./camera";

export class DetectionInstanceItem {
  
  // Properties
  public name: string;
  public id: number;
  public plantId: number;
  public assignee: string;
  public palletDetection: boolean;
  public classesDetection: string[];
  public listCameras: CameraItem[];
  public isRunning: boolean;
  public confidenceTheshold: number;

  constructor(
    name: string, 
    id: number, 
    plantId: number, 
    assignee: string, 
    confidenceTheshold : number,
    palletDetection: boolean,
    classesDetection: string[] = [], 
    listCameras: CameraItem[] = [],
    isRunning = true,
  ) {
    this.name = name;
    this.id = id;
    this.plantId = plantId;
    this.assignee = assignee;
    this.confidenceTheshold = confidenceTheshold;
    this.palletDetection = palletDetection;
    this.classesDetection = classesDetection;
    this.listCameras = listCameras;
    this.isRunning = isRunning;
  }
}
