import { Injectable } from '@angular/core';
import { ZoneItem } from '../models/zone';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ZoneService {

  private dataZone : ZoneItem[] = [
    new ZoneItem("Zone 1", 1, 1),
    new ZoneItem("Zone 2", 2, 1),
    new ZoneItem("Zone 3", 3, 2),
    new ZoneItem("Zone 4", 4, 2),
    new ZoneItem("Zone 5", 5, 3),
  ]

  constructor() { }


  getZoneById(plantId: number): Observable<ZoneItem> {
    const zoneItem = this.dataZone.find(item => item.id === plantId);
    if (zoneItem) {
      return of(zoneItem);
    } else {
      return throwError(() => new Error('Zone not found'));
    }
  }
  

  getZoneByPlantId(plantId:number):Observable<ZoneItem[]>{
    return of(this.dataZone.filter(item => item.plantId === plantId));
  }


}
