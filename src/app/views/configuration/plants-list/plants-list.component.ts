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
  public visible = false;

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
  
  /**
   * Loads the list of active plants and populates the card list.
   */
  private loadActivePlants(): void {
    this.plantsService.fetchPlants().subscribe(plants => {
      this.plantsListActive = plants;
      this.cardList = this.plantsListActive.map(plant => ({
        name: plant.name,
        description: plant.address,
        id: plant.id
      }));
    });
  }

  /**
   * Loads the list of inactive plants that are not part of the cards and triggers modal.
   * Toggles the visibility of the modal when loading completes.
   */
  private loadInactivePlants(): void {
    this.plantsService.fetchPlants('inactive').subscribe(
      plants => {
        this.plantsListInactive = plants
        this.visible = !this.visible;
      });
  }


  /**
   * Updates the selected plant's confidence threshold and reloads the active plants list.
   */
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

  
   /**
   * Toggles the visibility of the modal and resets the form.
   */
  toggleModal() {
    this.loadInactivePlants();
    this.resetForm();
  }

  /**
   * Handles changes to the modal's visibility.
   * @param event The event emitted when the modal's visibility changes.
   */
  handleModalChange(event: any) {
    this.visible = event;
  }


  // ========================
  // Navigation Functions
  // ========================

  /**
   * Navigates to the zone list view for the selected plant.
   * @param cardId The ID of the plant to navigate to.
   */
  navigateToZoneList(cardId: number): void {
    this.router.navigate([`configuration/plants/${cardId}`]);
  }


  // ========================
  // Utility Functions
  // ========================

  /**
   * Sets the confidence threshold based on a value from an input.
   * @param value The value to set the confidence threshold to.
   */
  setConfidenceThreshold(value: number): void {
    this.confidenceThreshold = parseFloat((value / 100).toFixed(2));
  }

  /**
   * Resets the form fields to their default values.
   */
  private resetForm(): void {
    this.selectedPlant = ''; // Reset the zone name
  }
}
