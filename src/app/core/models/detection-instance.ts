import { AssigneeItem } from "./assignee";
import { CameraItem } from "./camera";
import { ScenarioItem } from "./scenario.model";
import { ZoneItem } from "./zone";

export interface DetectionInstanceItem {
    name: string;
    id: number;
    zone?: ZoneItem;
    detectionType?: DetectionTypeItem;
    confidenceTheshold: number;
    assignee?: AssigneeItem;
    classesDetection?: ScenarioItem[];
    camera?: CameraItem;
    isRunning: boolean;
    timeElapsed?: number;
}

export interface DetectionTypeItem {
    id: number;
    name: string;
    description: string;
}



