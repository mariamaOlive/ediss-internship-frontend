import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { PlantItem } from '../../models/plant';
import { mockPlants } from '../../mock-data/mock-data';
import { environment } from 'src/app/environments/environment';
import { API_ENDPOINTS } from '../../config/api-endpoints';
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


  // HTTP request method to get all plants
  fetchAllPlants(): Observable<PlantItem[]> {
    const apiUrl = `${environment.apiUrl}${API_ENDPOINTS.plants}`;
    return this.http.get<PlantItem[]>(apiUrl);
  }


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
