import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DetectionInstanceItem } from '../models/detection-instance';
import { CameraItem } from '../models/camera';

@Injectable({
  providedIn: 'root'
})
export class DetectionInstanceService {

  private cameras: CameraItem[] = [new CameraItem("Camera 1", 1, "187.20.135.197"), new CameraItem("Camera 2", 2, "187.20.135.199"), new CameraItem("Camera 3", 3, "187.20.135.200")]

  private dataZone : DetectionInstanceItem[] = [
    new DetectionInstanceItem("Zone 1", 1, 1, "Luca Bianchi",0.5,true, ["Helmet", "Vest", "Hairnet", "Goggles", "Earplugs"], this.cameras),
    new DetectionInstanceItem("Zone 2", 2, 1, "Mariama Oliveira",0.5,true, ["Helmet"], this.cameras, false),
    new DetectionInstanceItem("Zone 3", 3, 1, "Minase Serafim",0.5,false, ["Vest", "Hairnet", "Goggles", "Earplugs"], this.cameras),
    new DetectionInstanceItem("Zone 4", 4, 2, "Mariama Oliveira",0.5,false, ["Helmet", "Vest", "Hairnet", "Goggles", "Earplugs"], this.cameras),
    new DetectionInstanceItem("Zone 5", 5, 2, "Luca Bianchi",0.5,true, ["Helmet", "Earplugs"], this.cameras)
  ]

  constructor() { }

  getDetectionInstanceByPlantId(plantId: number):Observable<DetectionInstanceItem[]>{
    return of(this.dataZone.filter(item => item.plantId === plantId));
  }

  getDetectionInstanceInfo(zoneId: number): Observable<DetectionInstanceItem> {
    const zone = this.dataZone.find(item => item.id === zoneId);
    if (!zone) {
      throw new Error(`Zone with ID ${zoneId} not found`);
    }
    return of(zone);
  }

  addDetectionInstance(newDetectionInstance: DetectionInstanceItem): Observable<boolean> {
    const existingZone = this.dataZone.find(zone => zone.id === newDetectionInstance.id);
    if (existingZone) {
      console.error(`Zone with ID ${newDetectionInstance.id} already exists.`);
      return of(false); // Return false indicating failure to add
    } else {
      this.dataZone.push(newDetectionInstance);
      console.log(`Zone with ID ${newDetectionInstance.id} added.`);
      return of(true); // Return true indicating success
    }
  }

  deleteDetectionInstance(zoneId: number): Observable<boolean> {
    const index = this.dataZone.findIndex(zone => zone.id === zoneId);

    if (index !== -1) {
      this.dataZone.splice(index, 1);
      console.log(`Zone with ID ${zoneId} deleted.`);
      return of(true); // Return true indicating successful deletion
    } else {
      console.error(`Zone with ID ${zoneId} not found.`);
      return of(false); // Return false indicating failure to delete
    }
  }
}
