import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { IconDirective } from '@coreui/icons-angular';
import { CardModule, ButtonModule, GridModule, BadgeModule, FormModule } from '@coreui/angular';
import { cilArrowCircleLeft, cilArrowThickLeft, cilArrowLeft } from '@coreui/icons';
import { IconSetService, IconModule } from '@coreui/icons-angular';

import { CameraItem } from 'src/app/core/models/camera';
import { CameraService } from 'src/app/core/services/camera/camera.service';
import { DetectionInstanceItem } from 'src/app/core/models/detection-instance';
import { DetectionInstanceService } from 'src/app/core/services/detection-instance/detection-instance.service';
import { PlantItem } from 'src/app/core/models/plant.model';
import { PlantService } from 'src/app/core/services/plant/plant.service';
import { ZoneItem } from 'src/app/core/models/zone';
import { ZoneService } from 'src/app/core/services/zone/zone.service';
import { DataTransferService } from 'src/app/core/services/data-transfer/data-transfer.service';



@Component({
  selector: 'app-add-detection-instance',
  standalone: true,
  providers: [IconSetService,],
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
  zone: any = {};

  dropdownListObjects: { item_id: number, item_text: string }[] = [];
  dropdownSettingsObjects = {};

  // New Detection Instance properties
  confidenceThreshold: number = 0;
  detectionInstanceName: string = '';
  forkliftDistance: number = 0;
  selectedDetectionType: string = "1";
  selectedItemsObjects: any[] = [];
  selectedCameraId: number | null = null;
  // selectedItemsCameras: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private detectionService: DetectionInstanceService,
    private zoneService: ZoneService,
    private cameraService: CameraService,
    public iconSet: IconSetService,
    private dataTransferService: DataTransferService
  ) {
    iconSet.icons = { cilArrowCircleLeft, cilArrowThickLeft, cilArrowLeft };
  }


  // ========================
  // Life Cycle Hooks
  // ========================

  ngOnInit() {
    this.getZoneInfo();
    this.loadMultiSelectorObjectDetection();
  }

  // ========================
  // Service Calls
  // ========================

  private getZoneInfo(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const zoneId = params.get('zoneId');
      if (zoneId) {
        this.zoneService.getZoneById(parseInt(zoneId)).subscribe({
          next: zone => {
            this.zone = zone;
            this.confidenceThreshold = this.zone.confidenceThreshold;
          },
          error: err => console.error('Error fetching zones:', err)
        });
      }
    });
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
    // let mappedCameras = this.selectedItemsCameras.map(item => item.item_id);
    // let filteredCameras = this.cameras.filter((item: { id: any; }) => mappedCameras.includes(item.id));
    let mappedObjects = this.selectedItemsObjects.map(item => item.item_text);

    const newDetectionInstance: DetectionInstanceItem = {
      name: this.detectionInstanceName,
      id: Math.floor(Math.random() * 100001),
      plantId: this.zone?.plantId,
      zoneId: this.zone?.id,
      assignee: this.zone.assigneeId,
      confidenceTheshold: this.confidenceThreshold,
      detectionType: parseInt(this.selectedDetectionType),
      classesDetection: mappedObjects,
      camera: { name: "Camera 1", id: 1, ipAddress: "187.20.135.197" },
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

  navigateBack() {
    this.location.back();
  }

}


