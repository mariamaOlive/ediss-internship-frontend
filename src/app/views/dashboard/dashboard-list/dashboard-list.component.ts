import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterLink } from '@angular/router';
import { IconDirective } from '@coreui/icons-angular';
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
  DropdownItemDirective
} from '@coreui/angular';

import { PlantService } from 'src/app/core/services/plant/plant.service';
import { PlantItem } from 'src/app/core/models/plant';


@Component({
  selector: 'app-dashboard-list',
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
    DropdownDividerDirective],
  templateUrl: './dashboard-list.component.html',
  styleUrl: './dashboard-list.component.scss'
})

export class DashboardListComponent implements OnInit {
  
  plantsList: PlantItem[] = [];

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
    });
  }
}
