import { AssigneeItem } from "./assignee.model";
import { CameraItem } from "./camera.model";
import { ScenarioItem } from "./scenario.model";
import { ZoneItem } from "./zone.model";

export interface DetectionInstanceItem {
    name: string;
    id?: number;
    zone?: ZoneItem;
    detectionType?: DetectionTypeItem;
    confidenceTheshold: number;
    assignee?: AssigneeItem;
    classesDetection?: ScenarioItem[];
    cameraId?: number;
    camera?: CameraItem;
    isRunning?: boolean;
    starttime: string; 
    endtime?: string; 
    timeElapsed?: number;
    incidents: any[];
}

export interface DetectionTypeItem {
    id: number;
    name: string;
    description: string;
}



