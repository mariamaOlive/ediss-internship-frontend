import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
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
import { ToastMessageComponent } from 'src/app/shared/components/toast-message/toast-message.component';

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
    CardListComponent,
    ToastMessageComponent
  ],
  templateUrl: './plants-list.component.html',
  styleUrl: './plants-list.component.scss'
})
export class PlantsListComponent implements OnInit {

  // View variables
  plantsListActive: PlantItem[] = [];
  plantsListInactive: PlantItem[] = [];
  cardList: Array<{ name: string, description: string, id: number }> = [];
  selectedPlant: string = "";
  confidenceThreshold: number = 0;
  visibleModal = false;

  // Toast variables
  @ViewChild(ToastMessageComponent) toastComponent!: ToastMessageComponent;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

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
        this.visibleModal = !this.visibleModal;
      });
  }


  /**
   * Updates the selected plant's confidence threshold and reloads the active plants list.
   */
  updatePlant(): void {

    // Validate if a plant is selected and the confidence level is within range
    if (this.selectedPlant === '' || this.confidenceThreshold < 0 || this.confidenceThreshold > 100) {
      console.error('Please select a valid plant and ensure confidence level is between 0 and 100.');
      return;  // Prevent the function from proceeding
    }

    // Update on the service
    this.plantsService.updatePlant(parseInt(this.selectedPlant), this.confidenceThreshold).pipe(
      finalize(() => {
        this.loadActivePlants();
        this.visibleModal = !this.visibleModal;
      })
    ).subscribe({
      next: (response) => {
        console.log('Plant confidence updated successfully:', response);
        this.showSuccessToast();
      },
      error: (error) => {
        console.error('Error updating plant confidence:', error);
        this.showErrorToast();
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
    this.visibleModal = event;
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
   * Resets the form fields to their default values.
   */
  private resetForm(): void {
    this.selectedPlant = ''; // Reset the zone name
    this.confidenceThreshold = 0; // Reset confidence threshold
  }


  /**
  * Triggers sucess toast message
  */
  showSuccessToast() {
    this.toastMessage = 'Plant was successfully added!';
    this.toastType = 'success';
    this.toastComponent.toggleToast();
  }

  /**
  * Triggers error toast message
  */
  showErrorToast() {
    this.toastMessage = 'An error occurred!';
    this.toastType = 'error';
    this.toastComponent.toggleToast();
  }


}
