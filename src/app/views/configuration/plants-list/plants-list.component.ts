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
  ModalModule,
  ButtonCloseDirective,
  ButtonDirective,
  FormModule
} from '@coreui/angular';
import { finalize } from 'rxjs/operators';

import { CardListComponent } from 'src/app/shared/components/card-list/card-list.component';

import { PlantItem } from 'src/app/core/models/plant.model';
import { PlantService } from 'src/app/core/services/plant/plant.service';



@Component({
  selector: 'app-plantslist',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    GridModule,
    CardModule,
    TemplateIdDirective,
    IconDirective,
    ThemeDirective,
    RouterLink,
    DropdownDividerDirective,
    ModalModule,
    ButtonCloseDirective,
    ButtonDirective,
    FormModule,
    FormsModule,
    CardListComponent],
  templateUrl: './plants-list.component.html',
  styleUrl: './plants-list.component.scss'
})
export class PlantsListComponent implements OnInit {
  plantsListActive: PlantItem[] = [];
  plantsListInactive: PlantItem[] = [];
  cardList: Array<{ name: string, description: string, id: number }> = [];
  selectedPlant: string = "";
  confidenceThreshold: number = 0;

  constructor(private router: Router, private plantsService: PlantService) { }


  // ========================
  // Life Cycle Hooks
  // ========================

  ngOnInit(): void {
    this.loadActivePlants();
  }


  // ========================
  // Service Calls
  // ========================
  
  loadActivePlants(): void {
    this.plantsService.fetchPlants().subscribe(plants => {
      this.plantsListActive = plants;
      this.cardList = this.plantsListActive.map(plant => ({
        name: plant.name,
        description: plant.address,
        id: plant.id
      }));
    });
  }

  loadInactivePlants(): void {
    this.plantsService.fetchPlants('inactive').subscribe(
      plants => {
        this.plantsListInactive = plants
        this.visible = !this.visible;
      });
  }


  updatePlant(): void {
    this.plantsService.updatePlant(parseInt(this.selectedPlant), this.confidenceThreshold).pipe(
      finalize(() => {
        this.loadActivePlants();  
        this.visible = !this.visible;
      })
    ).subscribe({
      next: (response) => {
        console.log('Plant confidence updated successfully:', response);
      },
      error: (error) => {
        console.error('Error updating plant confidence:', error);
      }
    });
  }


  // ========================
  // Modal Functions
  // ========================

  public visible = false;
  toggleModal() {
    this.loadInactivePlants();
    this.resetForm();
  }

  handleModalChange(event: any) {
    this.visible = event;
  }


  // ========================
  // Navigation Functions
  // ========================

  navigateToZoneList(cardId: number): void {
    this.router.navigate([`configuration/plants/${cardId}`]);
  }


  // ========================
  // Utility Functions
  // ========================

  setConfidenceThreshold(value: number): void {
    this.confidenceThreshold = parseFloat((value / 100).toFixed(2));
  }

  resetForm(): void {
    this.selectedPlant = ''; // Reset the zone name
  }
}
