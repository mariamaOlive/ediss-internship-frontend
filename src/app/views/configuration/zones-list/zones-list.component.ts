import { Component } from '@angular/core';
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

import { AssigneeItem } from 'src/app/core/models/assignee';
import { AssigneeService } from 'src/app/core/services/assignee/assignee.service';
import { CameraItem } from 'src/app/core/models/camera';
import { ZoneItem } from 'src/app/core/models/zone';
import { ZoneService } from 'src/app/core/services/zone/zone.service';
import { DataTransferService } from 'src/app/core/services/data-transfer/data-transfer.service';



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
    FormsModule],
  templateUrl: './zones-list.component.html',
  styleUrl: './zones-list.component.scss'
})
export class ZonesListComponent {

  //Template properties
  assignees: AssigneeItem[] = [];
  cardList: Array<{ name: string, description: string, id: number }> = [];
  plantId: any = NaN;
  zonesList: ZoneItem[] = [];

  //Input properties
  confidenceThreshold: number = 0;
  selectedAssignee: number = NaN;
  zoneName: string = ""
  cameraList: CameraItem[] = []
  cameraName = ""
  cameraIPAdress = ""


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private zoneService: ZoneService,
    private assigneeService: AssigneeService,
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

  loadAssignees(): void {
    this.assigneeService.getAllAssignees().subscribe({
      next: assignees => this.assignees = assignees,
      error: err => console.error('Error fetching assignees:', err)
    });
  }

  addNewZone(): void {
    const newZone: ZoneItem = {
      name: this.zoneName,
      id: Math.floor(Math.random() * 100001),
      plantId: parseInt(this.plantId),
      cameras: this.cameraList,
      assigneeId: this.selectedAssignee,
      confidenceThreshold: this.confidenceThreshold
    };

    this.zoneService.addZone(newZone).subscribe({
      next: success => {
        if (success) {
          this.loadZonesByPlantId(); // Refresh the list of zones after successful addition
          console.log('Zone added successfully.');
          this.visible = false; // Close modal
          this.resetForm();
          this.loadZonesByPlantId();

        } else {
          console.error('Failed to add zone.');
        }
      },
      error: err => {
        console.error('Error adding zone:', err);
      }
    });
  }

  loadZonesByPlantId(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      if (id) {
        this.plantId = id;
        this.zoneService.fetchZonesByPlantId(parseInt(id, 10)).subscribe({
          next: zones => {
            this.zonesList = zones;
            this.cardList = this.zonesList.map(zone => ({
              name: zone.name,
              description: "",
              id: zone.id
            }));
          },
          error: err => {
            console.error('Error fetching detections instance:', err);
          }
        });
      }
    });
  }


  // ========================
  // Modal Functions
  // ========================

  public visible = false;
  toggleModal() {
    this.loadAssignees();
    this.visible = !this.visible;
  }

  handleModalChange(event: any) {
    this.visible = event;
  }


  // ========================
  // Navigation Functions
  // ========================

  navigateToDetectionInstanceList(cardId: number): void {
    // this.dataTransferService.setData(cardId);
    this.router.navigate([`configuration/plants/${this.plantId}/zones/${cardId}`]);
  }

  navigateBack(): void {
    this.location.back();
  }


  // ========================
  // Utility Functions
  // ========================

  setConfidenceThreshold(value: number): void {
    this.confidenceThreshold = parseFloat((value / 100).toFixed(2));
  }

  // Function to add a new camera to the list
  addCamera(): void {
    if (this.cameraName && this.cameraIPAdress) {
      this.cameraList.push({ name: this.cameraName, ipAddress: this.cameraIPAdress });
      this.cameraName = ''; // Reset the input fields
      this.cameraIPAdress = '';
    } else {
      alert('Please enter both camera name and IP address.');
    }
  }

  // Function to remove a camera from the list
  removeCamera(index: number): void {
    this.cameraList.splice(index, 1);
  }

  resetForm(): void {
    this.zoneName = ''; // Reset the zone name
    this.cameraList = []; // Clear the camera list
    this.selectedAssignee = NaN; // Reset the selected assignee
    this.cameraName = ''; // Reset the camera name input
    this.cameraIPAdress = ''; // Reset the camera IP address input
  }


}
