import { Injectable } from '@angular/core';
import { ZoneItem } from '../../models/zone';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ZoneService {

  private dataZone: ZoneItem[] = [
    { name: "Zone 1", id: 1, plantId: 1 },
    { name: "Zone 2", id: 2, plantId: 1 },
    { name: "Zone 3", id: 3, plantId: 2 },
    { name: "Zone 4", id: 4, plantId: 2 },
    { name: "Zone 5", id: 5, plantId: 3 }
  ];
  

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
