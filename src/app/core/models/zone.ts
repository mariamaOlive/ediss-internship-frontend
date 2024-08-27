import { CameraItem } from "./camera";

export interface ZoneItem {
    name: string;
    id: number;
    plantId: number;
    cameras: CameraItem[];
    assigneeId: number;
    confidenceThreshold: number;
}
