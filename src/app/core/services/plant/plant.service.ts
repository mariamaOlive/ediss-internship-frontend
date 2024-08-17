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

  private dataPlant : PlantItem[] = [
    new PlantItem("Plant 1", 1, "Italy", 0.5),
    new PlantItem("Plant 2", 2, "Italy", 0.6),
    new PlantItem("Plant 3", 3, "Italy", 0.7),
  ]

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
