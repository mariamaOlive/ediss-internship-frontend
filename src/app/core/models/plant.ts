import { DetectionInstanceItem } from "./detection-instance";

export class PlantItem {
    public readonly name: string;
    public readonly id: number;
    public readonly address: string;
    public readonly confidenceThreshold: number;
    private _detectionInstances: DetectionInstanceItem[];

    constructor(
        name: string, 
        id: number, 
        address: string, 
        confidenceThreshold: number, 
        detectionInstances: DetectionInstanceItem[] = []
    ) {
        this.name = name;
        this.id = id;
        this.address = address;
        this.confidenceThreshold = confidenceThreshold;
        this._detectionInstances = detectionInstances;
    }

    // Getter for detection instances
    public get detectionInstances(): DetectionInstanceItem[] {
        return this._detectionInstances;
    }

    // Setter for detection instances
    public set detectionInstances(instances: DetectionInstanceItem[]) {
        this._detectionInstances = instances;
    }
}
