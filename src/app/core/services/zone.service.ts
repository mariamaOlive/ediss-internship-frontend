import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ZoneItem } from '../models/zone';
import { CameraItem } from '../models/camera';

@Injectable({
  providedIn: 'root'
})
export class ZoneService {

  private cameras: CameraItem[] = [new CameraItem("Camera 1", 1, "187.20.135.197"), new CameraItem("Camera 1", 1, "187.20.135.199"), new CameraItem("Camera 1", 1, "187.20.135.200")]

  private dataZone : ZoneItem[] = [
    new ZoneItem("Zone 1", 1, 1, "Luca Bianchi", ["Helmet", "Vest", "Hairnet", "Goggles", "Earplugs"], this.cameras),
    new ZoneItem("Zone 2", 2, 1, "Mariama Oliveira", ["Helmet"], this.cameras),
    new ZoneItem("Zone 3", 3, 1, "Minase Serafim", ["Vest", "Hairnet", "Goggles", "Earplugs"], this.cameras),
    new ZoneItem("Zone 4", 4, 2, "Mariama Oliveira", ["Helmet", "Vest", "Hairnet", "Goggles", "Earplugs"], this.cameras),
    new ZoneItem("Zone 5", 5, 2, "Luca Bianchi", ["Helmet", "Earplugs"], this.cameras)
  ]

  constructor() { }

  getZonesByPlantId(plantId: number){
    return of(this.dataZone.filter(item => item.plantId === plantId));
  }

  getZoneInfo(zoneId: number){
    return of(this.dataZone.find(item => item.id === zoneId));
  }

  addZone(newZone: ZoneItem): Observable<boolean> {
    const existingZone = this.dataZone.find(zone => zone.id === newZone.id);
    if (existingZone) {
      console.error(`Zone with ID ${newZone.id} already exists.`);
      return of(false); // Return false indicating failure to add
    } else {
      this.dataZone.push(newZone);
      console.log(`Zone with ID ${newZone.id} added.`);
      return of(true); // Return true indicating success
    }
  }

  deleteZone(zoneId: number): Observable<boolean> {
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
