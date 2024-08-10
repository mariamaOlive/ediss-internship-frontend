import { CameraItem } from "./camera";

export class ZoneItem {
  // Properties
  public name: string;
  public id: number;
  public plantId: number;
  public assignee: string;
  public classesDetection: string[];
  public listCameras: CameraItem[];
  public isRunning: boolean;

  constructor(
    name: string, 
    id: number, 
    plantId: number, 
    assignee: string, 
    classesDetection: string[] = [], 
    listCameras: CameraItem[] = [],
    isRunning = true
  ) {
    this.name = name;
    this.id = id;
    this.plantId = plantId;
    this.assignee = assignee;
    this.classesDetection = classesDetection;
    this.listCameras = listCameras;
    this.isRunning = isRunning;
  }
}
