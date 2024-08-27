import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { IconDirective } from '@coreui/icons-angular';
import { CardModule, ButtonModule, GridModule, BadgeModule, FormModule } from '@coreui/angular';
import { cilArrowCircleLeft, cilArrowThickLeft, cilArrowLeft } from '@coreui/icons';
import { IconSetService, IconModule } from '@coreui/icons-angular';

import { AssigneeItem } from 'src/app/core/models/assignee';
import { AssigneeService } from 'src/app/core/services/assignee/assignee.service';
import { CameraItem } from 'src/app/core/models/camera';
import { CameraService } from 'src/app/core/services/camera/camera.service';
import { DetectionInstanceItem } from 'src/app/core/models/detection-instance';
import { DetectionInstanceService } from 'src/app/core/services/detection-instance/detection-instance.service';
import { PlantItem } from 'src/app/core/models/plant';
import { PlantService } from 'src/app/core/services/plant/plant.service';
import { ZoneItem } from 'src/app/core/models/zone';
import { ZoneService } from 'src/app/core/services/zone/zone.service';



@Component({
  selector: 'app-add-detection-instance',
  standalone: true,
  providers: [IconSetService, ],
  imports: [
    CardModule, 
    ButtonModule, 
    GridModule, 
    CommonModule, 
    BadgeModule, 
    IconDirective, 
    FormModule, 
    NgMultiSelectDropDownModule, 
    FormsModule,
    IconModule
  ],
  templateUrl: './add-detection-instance.component.html',
  styleUrl: './add-detection-instance.component.scss'
})
export class AddDetectionInstanceComponent implements OnInit {

  // Template Properties
  plantId: number = 0;
  plant: PlantItem | null = null;
  assignees: AssigneeItem[] = [];
  zones: ZoneItem[] = [];
  cameras: CameraItem[] = [];
  
  dropdownListObjects: { item_id: number, item_text: string }[] = [];
  dropdownSettingsObjects = {};
  
  dropdownListCameras: { item_id: number, item_text: string }[] = [];
  dropdownSettingsCameras = {};

  // New Detection Instance properties
  detectionInstanceName: string = '';
  selectedAssignee: string = "";
  selectedZone:string="";
  confidenceThreshold: number = 0;
  selectedDetectionType: string = "1";
  selectedItemsObjects: any[] = [];
  selectedItemsCameras: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private location: Location,  
    private detectionService: DetectionInstanceService, 
    private zoneService: ZoneService, 
    private plantService: PlantService, 
    private assigneeService: AssigneeService, 
    private cameraService: CameraService,
    public iconSet: IconSetService, 
  ) {
    iconSet.icons = {cilArrowCircleLeft, cilArrowThickLeft, cilArrowLeft};
  }

  
  // ========================
  // Life Cycle Hooks
  // ========================

  ngOnInit() {
    this.loadPlantInfo();
    this.loadAssignees();
    this.loadCameras();
    this.loadMultiSelectorObjectDetection();
  }

  // ========================
  // Service Calls
  // ========================

  
  private getZonesByPlant(plantId: number): void {
    this.zoneService.fetchZonesByPlantId(plantId).subscribe({
      next: zones => this.zones = zones,
      error: err => console.error('Error fetching zones:', err)
    });
  }

  private loadAssignees(): void {
    this.assigneeService.getAllAssignees().subscribe({
      next: assignees => this.assignees = assignees,
      error: err => console.error('Error fetching assignees:', err)
    });
  }

  private loadCameras(): void {
    this.cameraService.getAllCameras().subscribe({
      next: cameras => {
        this.cameras = cameras;
        // this.loadMultiSelectorCamera(this.cameras);
      },
      error: err => console.error('Error fetching cameras:', err)
    });
  }

  private loadPlantInfo(): void {
    const id = this.route.snapshot.paramMap.get('plantId');
    if (id) {
      this.plantId = parseInt(id, 10);
      this.plantService.getPlantById(this.plantId).subscribe({
        next: plant => {
          this.plant = plant;
          this.confidenceThreshold = plant.plantConfidence;
          this.getZonesByPlant(this.plantId);
        },
        error: err => console.error('Error fetching plant info:', err)
      });
    }
  }


  // ========================
  // Multi-Selector Functions
  // ========================

  private loadMultiSelector() {
    return {
        singleSelection: false,
        idField: 'item_id',
        textField: 'item_text',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 5,
        allowSearchFilter: false
      
    };
  }

  // private loadMultiSelectorCamera(cameraList: CameraItem[]): void {
  //   this.dropdownListCameras = cameraList.map(camera => {
  //     return { item_id: camera.id, item_text: camera.name };
  //   });
  //   this.selectedItemsCameras = [];
  //   this.dropdownSettingsCameras = this.loadMultiSelector();
  // }

  private loadMultiSelectorObjectDetection(): void {
    //TODO: Get list of items dynamically
    this.dropdownListObjects = [
      { item_id: 1, item_text: 'Helmet' },
      { item_id: 2, item_text: 'Hair Net' },
      { item_id: 3, item_text: 'Goggles' },
      { item_id: 4, item_text: 'Vest' },
      { item_id: 5, item_text: 'Earplugs' }
    ];
  
    this.selectedItemsObjects = [];
    this.dropdownSettingsObjects = this.loadMultiSelector();
  }
  

  // ========================
  // Detection Instance Management
  // ========================

  addNewDetectionInstance(): void {

    //TODO: Remove part of this code when connected to the server
    let mappedCameras = this.selectedItemsCameras.map(item => item.item_id);
    // let filteredCameras = this.cameras.filter((item: { id: any; }) => mappedCameras.includes(item.id));
    let mappedObjects = this.selectedItemsObjects.map(item => item.item_text);

    const newDetectionInstance: DetectionInstanceItem = {
      name: this.detectionInstanceName,
      id: Math.floor(Math.random() * 100001),
      plantId: this.plantId,
      zoneId: parseInt(this.selectedZone),
      assignee: this.selectedAssignee || "Not defined",
      confidenceTheshold: this.confidenceThreshold,
      detectionType: parseInt(this.selectedDetectionType),
      classesDetection: mappedObjects,
      listCameras: [],
      isRunning: true,
      timeElapsed: 0
    };

    this.detectionService.addDetectionInstance(newDetectionInstance).subscribe({
      next: () => {
        console.log('Zone added successfully');
        this.location.back();
      },
      error: err => {
        console.error('Error adding zone:', err);
      }
    });
  }

  // ========================
  // Utility Functions
  // ========================

  setConfidenceThreshold(value: number): void {
    this.confidenceThreshold = parseFloat((value / 100).toFixed(2));
  }


  // ========================
  // Navigation Functions
  // ========================

  navigateBack(){
    this.location.back();
  }

}


