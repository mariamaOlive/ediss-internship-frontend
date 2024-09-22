import { DetectionInstanceRequest } from "./api-requests.model";
import { CameraItem } from "./camera.model";

export interface ZoneItem {
    title: string;
    id: number;
    description: string;
    plant_id: number;
    cameras: CameraItem[];
    assignee_id: number;
    zoneconfidence: number;
    zonestatus: string;
    detectionInstances?: DetectionInstanceRequest[];
}


