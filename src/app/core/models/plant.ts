import { DetectionInstanceItem } from "./detection-instance";

export interface PlantItem {
    name: string;
    id: number;
    address: string;
    plantConfidence: number;
    detectionInstances: DetectionInstanceItem[];
}
