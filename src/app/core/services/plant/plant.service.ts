import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { PlantItem } from '../../models/plant';
import { mockPlants } from '../../mock-data/mock-data';
import { DetectionInstanceService } from '../detection-instance/detection-instance.service';

@Injectable({
  providedIn: 'root'
})
export class PlantService {

  private dataPlant: PlantItem[] = mockPlants;

  constructor(
    private detectionService: DetectionInstanceService,
    private http: HttpClient
  ) { }


  getAllPlants(): Observable<PlantItem[]> {
    return of(this.dataPlant);
  }

  // HTTP request method to get all plants
  // getAllPlants(): Observable<PlantItem[]> {
  //   const apiUrl = `https://api.example.com/plants`;
  //   return this.http.get<PlantItem[]>(apiUrl);
  // }


  getPlantById(plantId: number): Observable<PlantItem> {
    const plant = this.dataPlant.find(item => item.id === plantId);
    if (!plant) {
      throw new Error(`Plant with ID ${plantId} not found`);
    }
    return of(plant);
  }

  // HTTP request method to get plant by ID
  // getPlantById(plantId: number): Observable<PlantItem> {
  //   const apiUrl = `https://api.example.com/plants/${plantId}`;
  //   return this.http.get<PlantItem>(apiUrl);
  // }


  getPlantByIdWithZone(plantId: number): Observable<PlantItem> {
    const plant = this.dataPlant.find(item => item.id === plantId);
    if (!plant) {
      throw new Error(`Plant with ID ${plantId} not found`);
    }
    this.detectionService.getDetectionInstanceByPlantId(plantId).subscribe({
      next: detectionInstances => {
        plant.detectionInstances = detectionInstances;
      },
      error: err => {
        console.error('Error fetching detection instances:', err);
      }
    });
    return of(plant);
  }

  // HTTP request method to get plant by ID with its detection instances
  // getPlantByIdWithZone(plantId: number): Observable<PlantItem> {
  //   const apiUrl = `https://api.example.com/plants/${plantId}/with-detection-instances`;
  //   return this.http.get<PlantItem>(apiUrl);
  // }
}
