import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlantService {

  private dataPlant : any[] = [
    {id: 1, name: "Plant 1"},
    {id: 2, name: "Plant 2"},
    {id: 3, name: "Plant 3"},
  ]

  constructor() { }

  getAllPlants(){
    return of(this.dataPlant);
  }
}
