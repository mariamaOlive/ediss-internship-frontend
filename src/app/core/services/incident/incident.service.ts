import { Injectable } from '@angular/core';
import { IncidentItem } from '../../models/incident'
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IncidentService {
  private incident: IncidentItem[] = []


  constructor() { 
    this.incident = this.generateIncidentItems();
  }

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

  getIncidentsByPlantId(plantId: number):Observable<IncidentItem[]>{
    return of(this.incident.filter(item => item.plantId === plantId));
  }

}
