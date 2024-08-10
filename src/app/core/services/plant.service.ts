import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlantService {

  private dataPlant : any[] = [
    {id: 1, name: "Plant 1", address:"Italy"},
    {id: 2, name: "Plant 2", address:"Italy"},
    {id: 3, name: "Plant 3", address:"Italy"},
  ]

  constructor() { }

  getAllPlants(){
    return of(this.dataPlant);
  }
}
