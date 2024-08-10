import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PlantItem } from '../models/plant'

@Injectable({
  providedIn: 'root'
})
export class PlantService {

  private dataPlant : PlantItem[] = [
    new PlantItem("Plant 1", 1, "Italy", 0.5),
    new PlantItem("Plant 2", 2, "Italy", 0.6),
    new PlantItem("Plant 3", 3, "Italy", 0.7),
  ]

  constructor() { }

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

}
