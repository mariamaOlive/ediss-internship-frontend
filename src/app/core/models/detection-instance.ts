import { CameraItem } from "./camera";

export class DetectionInstanceItem {

    public readonly name: string;
    public readonly id: number;
    public readonly plantId: number;
    public readonly zoneId: number;
    public readonly detectionType: number;
    public readonly confidenceTheshold: number;
    public readonly assignee: string;
    public readonly classesDetection: string[];
    public readonly listCameras: CameraItem[];
    public readonly isRunning: boolean;
    public readonly timeElapsed: number;

    constructor(
        name: string, 
        id: number, 
        plantId: number,
        zoneId: number, 
        assignee: string = 'Unassigned', 
        confidenceTheshold: number,
        detectionType: number,
        classesDetection: string[] = [], 
        listCameras: CameraItem[] = [],
        isRunning: boolean = true,
        timeElapsed: number = 0
    ) {
        this.name = name;
        this.id = id;
        this.plantId = plantId;
        this.zoneId = zoneId;
        this.detectionType = detectionType;
        this.confidenceTheshold = confidenceTheshold;
        this.assignee = assignee;
        this.classesDetection = classesDetection;
        this.listCameras = listCameras;
        this.isRunning = isRunning;
        this.timeElapsed = timeElapsed;
    }
}
