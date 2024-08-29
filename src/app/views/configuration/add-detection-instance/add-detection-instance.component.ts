import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { IconDirective } from '@coreui/icons-angular';
import { CardModule, ButtonModule, GridModule, BadgeModule, FormModule } from '@coreui/angular';
import { cilArrowCircleLeft, cilArrowThickLeft, cilArrowLeft } from '@coreui/icons';
import { IconSetService, IconModule } from '@coreui/icons-angular';

import { DetectionInstanceService } from 'src/app/core/services/detection-instance/detection-instance.service';
import { DetectionTypeItem } from 'src/app/core/models/detection-instance';
import { ZoneItem } from 'src/app/core/models/zone';
import { ZoneService } from 'src/app/core/services/zone/zone.service';
import { DataTransferService } from 'src/app/core/services/data-transfer/data-transfer.service';
import { DetectionInstanceRequest, Recording } from 'src/app/core/models/api-requests.model';
import { ScenarioItem } from 'src/app/core/models/scenario.model';



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
  zone: ZoneItem | undefined = undefined;
  detectionTypesList: DetectionTypeItem[] | undefined = undefined;

  dropdownListObjects: { item_id: number, item_text: string }[] = [];
  dropdownSettingsObjects = {};

  // New Detection Instance properties
  confidenceThreshold: number = 0;
  detectionInstanceName: string = '';
  forkliftDistance: number = 0;
  selectedDetectionType: number = 1;
  selectedItemsObjects: any[] = [];
  selectedCameraId: number | undefined = undefined;
  // selectedItemsCameras: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private detectionService: DetectionInstanceService,
    private zoneService: ZoneService,
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
    this.getDetectionTypes();
    this.loadMultiSelectorObjectDetection();
  }

  // ========================
  // Service Calls
  // ========================

  addNewDetectionInstance(): void {

    let mappedObjects = this.selectedItemsObjects.map(item => {
      return {id: item.item_id, name: item.item_text, description: ""};
    });

    const newDetectionInstance: DetectionInstanceRequest = {
      recording: {
        name: this.detectionInstanceName,
        zone_id: this.zone?.id,
        assignee_id: this.zone?.assignee_id,
        confidence: this.confidenceThreshold,
        detection_type_id: 1,
        camera_id: this.selectedCameraId,
        status: true,
      }, 
      scenarios: mappedObjects
    };

    debugger
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

  private getDetectionTypes(): void {
    this.detectionService.fetchDetectionTypes().subscribe({
      next: detectionTypes => this.detectionTypesList = detectionTypes,
      error: err => console.error('Error fetching assignees:', err)
    })
  }

  private getZoneInfo(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const zoneId = params.get('zoneId');
      if (zoneId) {
        this.zoneService.fetchZoneById(parseInt(zoneId)).subscribe({
          next: zone => {
            this.zone = zone;
            this.confidenceThreshold = this.zone.zoneconfidence;
            debugger
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


