import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { DetectionInstanceItem } from '../../models/detection-instance';
import { mockDetectionInstance } from '../../mock-data/mock-data';
import { environment } from '../../config/environment';
import { API_ENDPOINTS } from '../../config/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class DetectionInstanceService {
  
  private dataDetection: DetectionInstanceItem[] = mockDetectionInstance;

  constructor(private http: HttpClient) { }

  fetchDetectionInstanceByZoneId(zoneId: number): Observable<DetectionInstanceItem[]> {
    return of(this.dataDetection.filter(item => item.zoneId === zoneId));
  }

  // HTTP request method to get detection instances by plant ID
  // getDetectionInstanceByPlantId(plantId: number): Observable<DetectionInstanceItem[]> {
  //   const apiUrl = `https://api.example.com/detection-instances?plantId=${plantId}`;
  //   return this.http.get<DetectionInstanceItem[]>(apiUrl);
  // }


  getDetectionInstanceInfo(zoneId: number): Observable<DetectionInstanceItem> {
    const zone = this.dataDetection.find(item => item.id === zoneId);
    if (!zone) {
      throw new Error(`Zone with ID ${zoneId} not found`);
    }
    return of(zone);
  }

  // HTTP request method to get detection instance info by zone ID
  // getDetectionInstanceInfo(zoneId: number): Observable<DetectionInstanceItem> {
  //   const apiUrl = `https://api.example.com/detection-instances/${zoneId}`;
  //   return this.http.get<DetectionInstanceItem>(apiUrl);
  // }

  
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

  // HTTP request method to add a detection instance
  // addDetectionInstance(newDetectionInstance: DetectionInstanceItem): Observable<boolean> {
  //   const apiUrl = `https://api.example.com/detection-instances`;
  //   return this.http.post<boolean>(apiUrl, newDetectionInstance);
  // }


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

  // HTTP request method to delete a detection instance
  // deleteDetectionInstance(zoneId: number): Observable<boolean> {
  //   const apiUrl = `https://api.example.com/detection-instances/${zoneId}`;
  //   return this.http.delete<boolean>(apiUrl);
  // }
}
