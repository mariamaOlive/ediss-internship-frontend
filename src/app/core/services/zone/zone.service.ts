import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { ZoneItem } from '../../models/zone';
import { mockZones } from '../../mock-data/mock-data';
import { API_ENDPOINTS } from '../../config/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class ZoneService {

  private dataZone: ZoneItem[] = mockZones;

  constructor(private http: HttpClient) { }

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

  // HTTP request method to add a zone
  // addZone(newZone: ZoneItem): Observable<boolean> {
  //   const apiUrl = `https://api.example.com/detection-instances`;
  //   return this.http.post<boolean>(apiUrl, newDetectionInstance);
  // }

  getZoneById(zoneId: number): Observable<ZoneItem> {
    const zoneItem = this.dataZone.find(item => item.id === zoneId);
    if (zoneItem) {
      return of(zoneItem);
    } else {
      return throwError(() => new Error('Zone not found'));
    }
  }

  // HTTP request method to get zone by ID
  // getZoneById(zoneId: number): Observable<ZoneItem> {
  //   const apiUrl = `https://api.example.com/zones/${zoneId}`;
  //   return this.http.get<ZoneItem>(apiUrl);
  // }

  // Mock method to get zones by plant ID
  fetchZonesByPlantId(plantId: number): Observable<ZoneItem[]> {
    return of(this.dataZone.filter(item => item.plantId === plantId));
  }

  // HTTP request method to get zones by plant ID
  // getZoneByPlantId(plantId: number): Observable<ZoneItem[]> {
  //   const apiUrl = `https://api.example.com/plants/${plantId}/zones`;
  //   return this.http.get<ZoneItem[]>(apiUrl);
  // }
}
