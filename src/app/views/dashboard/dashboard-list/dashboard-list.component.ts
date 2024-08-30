import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule, Router, RouterLink } from '@angular/router';
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

import { CardListComponent } from 'src/app/shared/components/card-list/card-list.component';

import { PlantService } from 'src/app/core/services/plant/plant.service';
import { PlantItem } from 'src/app/core/models/plant.model';


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
    DropdownDividerDirective,
    CardListComponent],
  templateUrl: './dashboard-list.component.html',
  styleUrl: './dashboard-list.component.scss'
})

export class DashboardListComponent implements OnInit {
  
  plantsList: PlantItem[] = [];
  cardList: Array<{ name: string, description: string, id: number }> = [];

  constructor(private router: Router, private plantsService: PlantService) { }

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
    this.plantsService.fetchPlants().subscribe(plants => {
      this.plantsList = plants;
      this.cardList = this.plantsList.map(plant => ({
        name: plant.name,
        description: plant.address,
        id: plant.id
      }));
    });
  }


  // ========================
  // Navigation Functions
  // ========================

  navigateToDashboardDetails(cardId: number): void {
    this.router.navigate([`dashboard/plants/${cardId}`]);
  }

}
