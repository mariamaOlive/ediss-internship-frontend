import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { API_ENDPOINTS } from '../../config/api-endpoints';

import { IncidentItem } from '../../models/incident.model';
@Injectable({
  providedIn: 'root'
})
export class IncidentService {
  private incident: IncidentItem[] = [];

  constructor(private http: HttpClient) {
    this.incident = this.generateIncidentItems();
  }


  getIncidentsByPlantId(plantId: number): Observable<IncidentItem[]> {
    return of(this.incident.filter(item => item.plantId === plantId));
  }

  // getIncidentsByPlantId(plantId: number): Observable<IncidentItem[]> {
  //   const apiUrl = `https://api.example.com/incidents?plantId=${plantId}`;
  //   return this.http.get<IncidentItem[]>(apiUrl);
  // }



//TODO: Remove incident generator
getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

generateIncidentItems(): IncidentItem[] {
  const generateRandomDate = (start: Date, end: Date): Date => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  };

  const classNames = ["Helmet", "Hairnet", "Vest"];
  const incidents: IncidentItem[] = [];

  const now = new Date();
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(now.getDate() - 14);

  for (let i = 1; i <= 200; i++) {
    const randomDate = generateRandomDate(twoWeeksAgo, now);
    const randomClassName = classNames[Math.floor(Math.random() * classNames.length)];
    const detectionInstanceId = this.getRandomInt(1, 3); 
    const incident: IncidentItem = {
      id: i,
      recordingId: i,
      detectionInstanceId: detectionInstanceId,
      plantId: 1,
      timestamp: randomDate,
      className: randomClassName
  };
  
  incidents.push(incident);
  
  }

  return incidents;
}


}

