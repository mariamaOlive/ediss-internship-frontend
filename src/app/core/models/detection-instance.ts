import { CameraItem } from "./camera";

export interface DetectionInstanceItem {
    name: string;
    id: number;
    plantId: number;
    zoneId: number;
    detectionType: number;
    confidenceTheshold: number;
    assignee: string;
    classesDetection: string[];
    // listCameras: CameraItem[];
    camera: CameraItem;
    isRunning: boolean;
    timeElapsed: number;
}
