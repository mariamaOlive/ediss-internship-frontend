import { CameraItem } from "./camera";

export interface ZoneItem {
    title: string;
    id: number;
    description: string;
    plant_id: number;
    cameras: CameraItem[];
    assignee_id: number;
    zoneconfidence: number;
    zonestatus: string;
}


