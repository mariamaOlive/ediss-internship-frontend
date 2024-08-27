import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule, Router, RouterLink } from '@angular/router';
import { IconDirective } from '@coreui/icons-angular';
import { FormsModule } from '@angular/forms';
import {
  GridModule,
  CardModule,
  DropdownDividerDirective,
  TemplateIdDirective,
  ThemeDirective,
  DropdownComponent,
  ButtonDirective,
  DropdownToggleDirective,
  DropdownMenuDirective,
  DropdownItemDirective,
  ModalModule,
  ButtonCloseDirective,
  FormModule,
  
} from '@coreui/angular';

import { PlantService } from 'src/app/core/services/plant/plant.service';
import { PlantItem } from 'src/app/core/models/plant';
import { CardListComponent } from 'src/app/shared/components/card-list/card-list.component';


@Component({
  selector: 'app-plantslist',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    GridModule, CardModule,
    TemplateIdDirective,
    IconDirective,
    ThemeDirective,
    DropdownComponent,
    ButtonDirective,
    DropdownToggleDirective,
    DropdownMenuDirective,
    DropdownItemDirective,
    RouterLink,
    DropdownDividerDirective,
    ModalModule,
    ButtonCloseDirective,
    FormModule,
    FormsModule, CardListComponent],
  templateUrl: './plants-list.component.html',
  styleUrl: './plants-list.component.scss'
})
export class PlantsListComponent implements OnInit {
  plantsList: PlantItem[] = [];
  cardList:  Array<{ name: string, description: string, id:number}> = [];
  selectedPlant: string = "";
  confidenceThreshold: number = 0;

  constructor(private plantsService: PlantService) { }


  // ========================
  // Life Cycle Hooks
  // ========================

  ngOnInit(): void {
    this.loadPlants();
  }


  // ========================
  // Service Calls
  // ========================

  loadPlants(): void {
    this.plantsService.fetchAllPlants().subscribe(plants => {
      this.plantsList = plants;
      this.cardList = this.plantsList.map( plant =>({
        name: plant.name,
        description: plant.address,
        id: plant.id
      }));
    });
  }

  
  // ========================
  // Modal Functions
  // ========================

  public visible = false;
  toggleModal() {
    this.visible = !this.visible;
  }

  handleModalChange(event: any) {
    this.visible = event;
  }

  
  // ========================
  // Utility Functions
  // ========================

  setConfidenceThreshold(value: number): void {
    this.confidenceThreshold = parseFloat((value / 100).toFixed(2));
  }
}
