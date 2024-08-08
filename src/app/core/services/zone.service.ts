import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ZoneService {

  private dataZone : any[] = [
    {id: 1, name: "Zone 1", plant_id: 1},
    {id: 2, name: "Zone 2", plant_id: 1},
    {id: 3, name: "Zone 3", plant_id: 1},
    {id: 4, name: "Zone 4", plant_id: 2},
    {id: 5, name: "Zone 5", plant_id: 2},
  ]

  constructor() { }

  getZonesByPlantId(plantId: number){
    return of(this.dataZone.filter(item => item.plant_id === plantId));
  }

  getZoneInfo(zoneId: number){
    return of(this.dataZone.find(item => item.id === zoneId));
  }
}
