import { DetectionInstanceItem } from "./detection-instance";

export class PlantItem{
    constructor(public name : string, public id: number, public address: string, public confidenceThreshold:number, public detectionInstances:DetectionInstanceItem[] = []){
    } 
}

