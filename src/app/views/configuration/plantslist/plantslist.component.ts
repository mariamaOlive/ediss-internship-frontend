import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PlantService } from 'src/app/core/services/plant.service';

@Component({
  selector: 'app-plantslist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './plantslist.component.html',
  styleUrl: './plantslist.component.scss'
})
export class PlantslistComponent implements OnInit {
  plantsList : any[] = []

    constructor(private plantsServ : PlantService){}

    ngOnInit():void {
      this.plantsServ.getAllPlants().subscribe(plants=>{
        this.plantsList = plants;
      }
      );
    }
}
