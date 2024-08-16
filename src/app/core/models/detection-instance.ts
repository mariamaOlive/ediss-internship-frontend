import { CameraItem } from "./camera";

export class DetectionInstanceItem {
  
  // Properties
  public name: string;
  public id: number;
  public plantId: number;
  public zoneId: number;
  public assignee: string;
  public detectionType: number;
  public classesDetection: string[];
  public listCameras: CameraItem[];
  public isRunning: boolean;
  public confidenceTheshold: number;
  public timeElapsed:number;

  constructor(
    name: string, 
    id: number, 
    plantId: number,
    zoneId: number, 
    assignee: string, 
    confidenceTheshold : number,
    detectionType: number,
    classesDetection: string[] = [], 
    listCameras: CameraItem[] = [],
    isRunning = true,
    timeElapsed:number = 0
  ) {
    this.name = name;
    this.id = id;
    this.plantId = plantId;
    this.zoneId = zoneId;
    this.assignee = assignee;
    this.confidenceTheshold = confidenceTheshold;
    this.detectionType = detectionType;
    this.classesDetection = classesDetection;
    this.listCameras = listCameras;
    this.isRunning = isRunning;
    this.timeElapsed = timeElapsed;
  }
}
