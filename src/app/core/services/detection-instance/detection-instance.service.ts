import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DetectionInstanceItem } from '../../models/detection-instance';
import { CameraItem } from '../../models/camera';

@Injectable({
  providedIn: 'root'
})
export class DetectionInstanceService {

  private cameras: CameraItem[] = [
    { name: "Camera 1", id: 1, ipAddress: "187.20.135.197" },
    { name: "Camera 2", id: 2, ipAddress: "187.20.135.199" },
    { name: "Camera 3", id: 3, ipAddress: "187.20.135.200" }
  ];
  
  private dataDetection: DetectionInstanceItem[] = [
    {
      name: "Detection Instance 1",
      id: 1,
      plantId: 1,
      zoneId: 1,
      assignee: "Luca Bianchi",
      confidenceTheshold: 0.5,
      detectionType: 1,
      classesDetection: ["Helmet", "Vest", "Hairnet", "Goggles", "Earplugs"],
      listCameras: this.cameras,
      isRunning: true,
      timeElapsed: 0
    },
    {
      name: "Detection Instance 2",
      id: 2,
      plantId: 1,
      zoneId: 2,
      assignee: "Mariama Oliveira",
      confidenceTheshold: 0.5,
      detectionType: 2,
      classesDetection: ["Helmet"],
      listCameras: this.cameras,
      isRunning: false,
      timeElapsed: 0
    },
    {
      name: "Detection Instance 3",
      id: 3,
      plantId: 1,
      zoneId: 1,
      assignee: "Minase Serafim",
      confidenceTheshold: 0.5,
      detectionType: 1,
      classesDetection: ["Vest", "Hairnet", "Goggles", "Earplugs"],
      listCameras: this.cameras,
      isRunning: true,
      timeElapsed: 0
    },
    {
      name: "Detection Instance 4",
      id: 4,
      plantId: 2,
      zoneId: 1,
      assignee: "Mariama Oliveira",
      confidenceTheshold: 0.5,
      detectionType: 2,
      classesDetection: ["Helmet", "Vest", "Hairnet", "Goggles", "Earplugs"],
      listCameras: this.cameras,
      isRunning: true,
      timeElapsed: 0
    },
    {
      name: "Detection Instance 5",
      id: 5,
      plantId: 2,
      zoneId: 1,
      assignee: "Luca Bianchi",
      confidenceTheshold: 0.5,
      detectionType: 1,
      classesDetection: ["Helmet", "Earplugs"],
      listCameras: this.cameras,
      isRunning: true,
      timeElapsed: 0
    }
  ];

  constructor() { }

  getDetectionInstanceByPlantId(plantId: number):Observable<DetectionInstanceItem[]>{
    return of(this.dataDetection.filter(item => item.plantId === plantId));
  }

  getDetectionInstanceInfo(zoneId: number): Observable<DetectionInstanceItem> {
    const zone = this.dataDetection.find(item => item.id === zoneId);
    if (!zone) {
      throw new Error(`Zone with ID ${zoneId} not found`);
    }
    return of(zone);
  }

  addDetectionInstance(newDetectionInstance: DetectionInstanceItem): Observable<boolean> {
    const existingZone = this.dataDetection.find(zone => zone.id === newDetectionInstance.id);
    if (existingZone) {
      console.error(`Zone with ID ${newDetectionInstance.id} already exists.`);
      return of(false); // Return false indicating failure to add
    } else {
      this.dataDetection.push(newDetectionInstance);
      console.log(`Zone with ID ${newDetectionInstance.id} added.`);
      return of(true); // Return true indicating success
    }
  }

  deleteDetectionInstance(zoneId: number): Observable<boolean> {
    const index = this.dataDetection.findIndex(zone => zone.id === zoneId);

    if (index !== -1) {
      this.dataDetection.splice(index, 1);
      console.log(`Zone with ID ${zoneId} deleted.`);
      return of(true); // Return true indicating successful deletion
    } else {
      console.error(`Zone with ID ${zoneId} not found.`);
      return of(false); // Return false indicating failure to delete
    }
  }
}
