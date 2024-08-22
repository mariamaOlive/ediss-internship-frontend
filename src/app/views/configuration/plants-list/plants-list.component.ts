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
  FormModule
} from '@coreui/angular';

import { PlantService } from 'src/app/core/services/plant/plant.service';
import { PlantItem } from 'src/app/core/models/plant';


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
    FormsModule],
  templateUrl: './plants-list.component.html',
  styleUrl: './plants-list.component.scss'
})
export class PlantsListComponent implements OnInit {
  plantsList: PlantItem[] = [];
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
    this.plantsService.getAllPlants().subscribe(plants => {
      this.plantsList = plants;
    });
  }

  
  // ========================
  // Utility Functions
  // ========================

  setConfidenceThreshold(value: number): void {
    this.confidenceThreshold = parseFloat((value / 100).toFixed(2));
  }
}
