import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators'; 
import { PlantItem } from '../../models/plant'
import { DetectionInstanceItem } from '../../models/detection-instance';
import { DetectionInstanceService } from '../detection-instance/detection-instance.service';

@Injectable({
  providedIn: 'root'
})
export class PlantService {

  private dataPlant: PlantItem[] = [
    {
      name: "Plant 1",
      id: 1,
      address: "Italy",
      confidenceThreshold: 0.5,
      detectionInstances: [] // Initialize with an empty array or populate as needed
    },
    {
      name: "Plant 2",
      id: 2,
      address: "Italy",
      confidenceThreshold: 0.6,
      detectionInstances: [] // Initialize with an empty array or populate as needed
    },
    {
      name: "Plant 3",
      id: 3,
      address: "Italy",
      confidenceThreshold: 0.7,
      detectionInstances: [] // Initialize with an empty array or populate as needed
    }
  ];
  

  constructor(private detectionService: DetectionInstanceService) { }

  getAllPlants(){
    return of(this.dataPlant);
  }

  getPlantById(plantId:number): Observable<PlantItem>{
    const plant = this.dataPlant.find(item => item.id === plantId);
    if (!plant) {
      throw new Error(`Zone with ID ${plantId} not found`);
    }

    return of(plant);
  }

  getPlantByIdWithZone(plantId:number): Observable<PlantItem>{
    const plant = this.dataPlant.find(item => item.id === plantId);
    // debugger
    if (!plant) {
      throw new Error(`Plant with ID ${plantId} not found`);
    }
    this.detectionService.getDetectionInstanceByPlantId(plantId).subscribe({
      next: detectionInstances =>{
        plant.detectionInstances = detectionInstances;
      },
      error: err => {
        console.error('Error fetching detections instance:', err);
      }
    })

    return of(plant);
  }

}
