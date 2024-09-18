import { Component, ViewChild } from '@angular/core';
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
import { CameraZoneCreateRequest, ZoneCreateRequest } from 'src/app/core/models/api-requests.model';



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
  cardList: Array<{ name: string, description: string, id: number }> = [];
  plantId?: number;
  plantInfo?: PlantItem;
  visible = false;
  zonesList: ZoneItem[] = [];


  //Input properties
  confidenceThreshold: number = 0;
  selectedAssignee: number = NaN;
  zoneName: string = ""
  cameraList: CameraZoneCreateRequest[] = []
  cameraName = ""
  cameraIPAdress = ""

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
      this.showErrorToast('Plant ID not defined.');
      throw new Error('Plant ID not defined.');
    }

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
      next: success => {
        if (success) {
          this.loadZonesByPlantId(); // Refresh the list of zones after successful addition
          console.log('Zone added successfully.');
          this.showSuccessToast('Zone added successfully.');
          this.visible = false; // Close modal
          this.resetForm();
          this.loadZonesByPlantId();

        } else {
          this.showErrorToast('Failed to add zone.');
          console.error('Failed to add zone.');
        }
      },
      error: err => {
        this.showErrorToast('Error adding zone.');
        console.error('Error adding zone:', err);
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
        this.showErrorToast('Error fetching assignees.');
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
        this.zoneService.fetchZonesByPlantId(parseInt(id, 10)).subscribe({
          next: zones => {
            this.zonesList = zones;
            this.cardList = this.zonesList.map(zone => ({
              name: zone.title,
              description: "",
              id: zone.id
            }));
          },
          error: err => {
            this.showErrorToast('Error fetching Zones.');
            console.error('Error fetching Zones:', err);
          }
        });
      }
    });
  }


  // ========================
  // Modal Functions
  // ========================

  /**
   * Toggles the visibility of the modal and loads the list of assignees.
   */
  toggleModal() {
    this.resetForm();
    this.loadAssignees();
    this.loadPlantInfo();
    this.visible = !this.visible;
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
  }

  /**
  * Triggers sucess toast message
  */
  showSuccessToast(message: string) {
    this.toastMessage = message;
    this.toastType = 'success';
    this.toastComponent.toggleToast();
  }

  /**
  * Triggers error toast message
  */
  showErrorToast(message: string) {
    this.toastMessage = message;
    this.toastType = 'error';
    this.toastComponent.toggleToast();
  }


}
