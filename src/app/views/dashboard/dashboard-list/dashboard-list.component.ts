import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
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
  DropdownItemDirective, 
  AlertComponent
} from '@coreui/angular';

import { CardListComponent } from 'src/app/shared/components/card-list/card-list.component';
import { ToastMessageComponent } from 'src/app/shared/components/toast-message/toast-message.component';

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
    CardListComponent,
    ToastMessageComponent,
    AlertComponent],
  templateUrl: './dashboard-list.component.html',
  styleUrl: './dashboard-list.component.scss'
})

export class DashboardListComponent implements OnInit {
  showNoPlantsMessage = true;
  plantsList: PlantItem[] = [];
  cardList: Array<{ name: string, description: string, id: number }> = [];

  // Toast variables
  @ViewChild(ToastMessageComponent) toastComponent!: ToastMessageComponent;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

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

  /**
   * Fetches the list of plants from the `PlantService`.
   */
  loadPlants(): void {
    this.plantsService.fetchPlants().subscribe({
      next: plants => {
        if (plants.length === 0) {
          this.showNoPlantsMessage = true;
        } else {
          this.showNoPlantsMessage = false;
          this.plantsList = plants;
          this.cardList = this.plantsList.map(plant => ({
            name: plant.name,
            description: plant.address,
            id: plant.id
          }));
        }
      },
      error: err => {
        if (err.status === 404) {
          this.showNoPlantsMessage = true; // Show message for 404 error
          console.warn('No plants found (404).');
        } else {
          console.error('Error fetching plants:', err); // Log other errors
          this.showToast('Error fetching plants', 'error');
        }
      }
    });
  }


  // ========================
  // Navigation Functions
  // ========================

  /**
   * Navigates to the dashboard details page for a specific plant.
   * @param cardId - The ID of the plant to navigate to.
   */
  navigateToDashboardDetails(cardId: number): void {
    this.router.navigate([`dashboard/plants/${cardId}`]);
  }


  // ========================
  // Utility Functions
  // ========================

  /**
  * Triggers toast message.
  */
  showToast(message: string, toastType: 'success' | 'error') {
    this.toastMessage = message;
    this.toastType = toastType;
    this.toastComponent.toggleToast();
  }

}
