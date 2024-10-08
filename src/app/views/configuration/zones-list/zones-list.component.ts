import { Component, ViewChild } from '@angular/core';
import { forkJoin } from 'rxjs';
import { CommonModule, Location } from '@angular/common';
import { Router, ActivatedRoute, ParamMap, RouterModule, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IconSetService, IconModule } from '@coreui/icons-angular';
import { cilArrowCircleLeft, cilArrowThickLeft, cilArrowLeft, cilOptions } from '@coreui/icons';
import { IconDirective } from '@coreui/icons-angular';
import {
  GridModule,
  CardModule,
  TemplateIdDirective,
  ThemeDirective,
  ModalModule,
  ButtonCloseDirective,
  ButtonDirective,
  FormModule
} from '@coreui/angular';

import { CardListComponent } from 'src/app/shared/components/card-list/card-list.component';
import { ToastMessageComponent } from 'src/app/shared/components/toast-message/toast-message.component';

import { AssigneeItem } from 'src/app/core/models/assignee.model';
import { AssigneeService } from 'src/app/core/services/assignee/assignee.service';
import { PlantItem } from 'src/app/core/models/plant.model';
import { PlantService } from 'src/app/core/services/plant/plant.service';
import { ZoneItem } from 'src/app/core/models/zone.model';
import { ZoneService } from 'src/app/core/services/zone/zone.service';
import { DataTransferService } from 'src/app/core/services/data-transfer/data-transfer.service';
import { CameraZoneCreateRequest, DetectionInstanceRequest, ZoneCreateRequest } from 'src/app/core/models/api-requests.model';
import { DetectionInstanceService } from 'src/app/core/services/detection-instance/detection-instance.service';


@Component({
  selector: 'app-zones-list',
  standalone: true,
  imports: [
    CommonModule,
    CardListComponent,
    IconModule,
    GridModule,
    CardModule,
    TemplateIdDirective,
    IconDirective,
    ThemeDirective,
    ModalModule,
    ButtonCloseDirective,
    ButtonDirective,
    FormModule,
    FormsModule,
    ToastMessageComponent],
  templateUrl: './zones-list.component.html',
  styleUrl: './zones-list.component.scss'
})
export class ZonesListComponent {

  //Template properties
  assignees: AssigneeItem[] = [];
  cardList: Array<{ name: string, description: string, id: number, message: string }> = [];
  plantId?: number;
  plantInfo?: PlantItem;
  visibleModalAdd = false;
  visibleModalDelete = false;
  zonesList: ZoneItem[] = [];
  zoneToDeleteId: number | null = null;

  //Input properties
  confidenceThreshold: number = 0;
  selectedAssignee: number = NaN;
  zoneName: string = ""
  cameraList: CameraZoneCreateRequest[] = []
  cameraName = ""
  cameraIPAdress = ""
  zoneNameAttempted: boolean = false;
  assigneeAttempted: boolean = false;
  cameraListAttempted: boolean = false;

  // Toast variables
  @ViewChild(ToastMessageComponent) toastComponent!: ToastMessageComponent;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private assigneeService: AssigneeService,
    private plantService: PlantService,
    private zoneService: ZoneService,
    private detectionInstanceService: DetectionInstanceService,
    private location: Location,
    private dataTransferService: DataTransferService,
    public iconSet: IconSetService) {
    iconSet.icons = { cilArrowCircleLeft, cilArrowThickLeft, cilArrowLeft, cilOptions };
  }

  // ========================
  // Life Cycle Hooks
  // ========================

  ngOnInit(): void {
    this.loadZonesByPlantId();
  }


  // ========================
  // Service Calls
  // ========================



  /**
   * Adds a new zone using the current form data.
   * Refreshes the list of zones after successful addition.
   */
  addNewZone(): void {

    if (!this.plantId) {
      this.showToast('Plant ID not defined.', 'error');
      console.log('Plant ID not defined.');
      return;
    }

    this.zoneNameAttempted = true;
    this.assigneeAttempted = true;
    this.cameraListAttempted = true;

    if (this.zoneName && this.selectedAssignee && this.cameraList.length > 0) {

      const newZone: ZoneCreateRequest = {
        title: this.zoneName,
        plant_id: this.plantId,
        cameras: this.cameraList,
        assignee_id: this.selectedAssignee,
        zoneconfidence: this.confidenceThreshold,
        status: 'active',
        description: ""
      };

      this.zoneService.addZone(newZone).subscribe({
        next: newZone => {
          if (newZone) {
            console.log('Zone added successfully.');
            this.showToast('Detection Zone added successfully.', 'success');
            this.navigateToDetectionInstanceList(newZone.id);
            // this.loadZonesByPlantId(); // Refresh the list of zones after successful addition
            // this.visibleModalAdd = false; // Close modal
            // this.resetForm();
          } else {
            this.showToast('Failed to add zone.', 'error');
            console.error('Failed to add zone.');
          }
        },
        error: err => {
          this.showToast('Error adding zone.', 'error');
          console.error('Error adding zone:', err);
        }
      });
    }
  }

  /**
  * Deletes the zone from the server.
  */
  deleteZone(): void {
    if (this.zoneToDeleteId)
      this.zoneService.deleteZone(this.zoneToDeleteId).subscribe({
        next: success => {
          this.loadZonesByPlantId();
          this.showToast("The zone was successfully deleted", 'success');
        },
        error: err => {
          this.showToast('Error deleting zone.', 'error');
          console.error('Error deleting zone:', err);
        },
        complete: () => {
          this.toggleModalDelete();
          this.zoneToDeleteId = null;
        }
      });
  }

  /**
  * Loads the list of assignees from the server.
  */
  loadAssignees(): void {
    this.assigneeService.fetchAllAssignees().subscribe({
      next: assignees => this.assignees = assignees,
      error: err => {
        this.showToast('Error fetching assignees.', 'error');
        console.error('Error fetching assignees:', err);
      }
    });
  }

  /**
  * Loads the plant info from the server.
  */
  loadPlantInfo(): void {
    this.plantService.fetchPlants().subscribe({
      next: plants => {
        this.plantInfo = plants.find(item => item.id === this.plantId);
        if (this.plantInfo?.plantConfidence) {
          this.confidenceThreshold = this.plantInfo?.plantConfidence;
        }
      }
    })
  }

  /**
  * Loads the list of zones by the plant ID from the route parameters.
  */
  loadZonesByPlantId(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      if (id) {
        this.plantId = parseInt(id, 10);
        this.zoneService.fetchZonesByPlantId(this.plantId).subscribe({
          next: zones => {
            this.zonesList = zones;
            this.cardList = this.zonesList.map(zone => ({
              name: zone.title,
              description: "",
              id: zone.id,
              message: ""  // This will later hold the detection instance information if needed
            }));
  
            // Fetch detection instances for each zone
            const detectionInstancesRequests = this.zonesList.map(zone =>
              this.detectionInstanceService.fetchDetectionInstancesByZoneIdSimple(zone.id)
            );
  
            forkJoin(detectionInstancesRequests).subscribe({
              next: (detectionInstancesList: DetectionInstanceRequest[][]) => {
                this.zonesList = this.zonesList.map((zone, index) => ({
                  ...zone,
                  detectionInstances: (detectionInstancesList[index] || []).filter(instance => instance.recording.status === true) // Add only if status is true
                }));
                
                // Optionally, update the card list with detection instance information
                this.cardList = this.cardList.map((card, index) => ({
                  ...card,
                  message: `Active detections: ${this.zonesList[index].detectionInstances?.length || 0}`
                }));
              },
              error: err => {
                console.error('Error fetching detection instances:', err);
              }
            });
          },
          error: err => {
            console.error('Error fetching Zones:', err);
            this.zonesList = [];
            this.cardList = [];
          }
        });
      }
    });
  }
  


  // ========================
  // Modal Functions
  // ========================

  /**
   * Toggles the visibility of the modal that adds a new zone.
   */
  toggleModalAdd() {
    this.resetForm();
    this.loadAssignees();
    this.loadPlantInfo();
    this.visibleModalAdd = !this.visibleModalAdd;
  }

  /**
   * Handles changes to the modal's visibility.
   * @param event The event emitted when the modal's visibility changes.
   */
  handleModalChange(event: any) {
    this.visibleModalAdd = event;
  }

  /**
   * Toggles the visibility of the modal that confirms deleting a zone.
   */
  toggleModalDelete() {
    this.visibleModalDelete = !this.visibleModalDelete;
  }

  /**
   * Triggers when the button close is activated of the deleting zone.
   */
  closeModalDelete() {
    this.zoneToDeleteId = null;
  }


  // ========================
  // Navigation Functions
  // ========================

  /**
   * Navigates to the detection instance list for the selected zone.
   * @param cardId The ID of the selected zone.
   */
  navigateToDetectionInstanceList(cardId: number): void {
    // this.dataTransferService.setData(cardId);
    this.router.navigate([`configuration/plants/${this.plantId}/zones/${cardId}`]);
  }

  /**
   * Navigates back to the previous page.
   */
  navigateBack(): void {
    this.location.back();
  }


  // ========================
  // Utility Functions
  // ========================

  /**
   * Adds a new camera to the list of cameras for the zone.
   */
  addCamera(): void {
    if (this.cameraName && this.cameraIPAdress) {
      this.cameraList.push({ name: this.cameraName, ipaddress: this.cameraIPAdress, description: "" });
      this.cameraName = ''; // Reset the input fields
      this.cameraIPAdress = '';
    } else {
      alert('Please enter both camera name and IP address.');
    }
  }

  /**
   * Removes a camera from the list of cameras for the zone.
   * @param index The index of the camera to remove.
   */
  removeCamera(index: number): void {
    this.cameraList.splice(index, 1);
  }

  /**
   * Resets the form fields to their default values.
   */
  resetForm(): void {
    this.zoneName = ''; // Reset the zone name
    this.cameraList = []; // Clear the camera list
    this.selectedAssignee = NaN; // Reset the selected assignee
    this.cameraName = ''; // Reset the camera name input
    this.cameraIPAdress = ''; // Reset the camera IP address input
    this.zoneNameAttempted = false;
    this.assigneeAttempted = false;
    this.cameraListAttempted = false;
  }

  /**
  * Triggers toast message
  */
  showToast(message: string, toastType: 'success' | 'error') {
    this.toastMessage = message;
    this.toastType = toastType;
    this.toastComponent.toggleToast();
  }

  /**
  * Handles the action emitted by the CardListComponent's dropdown.
  *
  * @param {Object} event - The event object containing the selected card's ID and action.
  * @param {number} event.cardId - The ID of the card that the dropdown action was triggered for.
  * @param {string} event.action - The action selected from the dropdown menu (e.g., 'inactivate').
  */
  handleDropdownAction(event: { cardId: number, action: string }): void {
    const { cardId, action } = event;

    switch (action) {
      case 'delete':
        this.zoneToDeleteId = cardId;
        this.toggleModalDelete();
        break;
      default:
        console.log(`Unknown action: ${action} for card with ID: ${cardId}`);
    }
  }

}
