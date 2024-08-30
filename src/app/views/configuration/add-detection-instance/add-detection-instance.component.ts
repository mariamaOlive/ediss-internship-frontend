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
import { ScenarioService } from 'src/app/core/services/scenario/scenario.service'
import { DetectionTypeItem } from 'src/app/core/models/detection-instance.model';
import { ZoneItem } from 'src/app/core/models/zone.model';
import { ZoneService } from 'src/app/core/services/zone/zone.service';
import { CreateDetectionInstanceRequest, DetectionInstanceRequest, Recording } from 'src/app/core/models/api-requests.model';
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

  // View variables
  zone?: ZoneItem;
  detectionTypesList?: DetectionTypeItem[];
  dropdownListObjects: { item_id: number, item_text: string }[] = [];
  dropdownSettingsObjects = {};
  
  // Input variables
  confidenceThreshold = 0;
  detectionInstanceName = '';
  selectedDetectionType = 1;
  selectedItemsObjects: any[] = [];
  selectedCameraId?: number;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private detectionService: DetectionInstanceService,
    private zoneService: ZoneService,
    public iconSet: IconSetService,
    private scenarioService: ScenarioService,
  ) {
    iconSet.icons = { cilArrowCircleLeft, cilArrowThickLeft, cilArrowLeft };
  }


  // ========================
  // Life Cycle Hooks
  // ========================

  ngOnInit() {
    this.loadZoneInfo();
    this.loadDetectionTypes();
    this.loadScenarios();
  }

  // ========================
  // Service Calls
  // ========================

  /**
   * Adds a new detection instance based on the form data.
   * Throws an error if `zone`, `assignee_id`, or `selectedCameraId` is not defined.
   */
  addNewDetectionInstance(): void {

    let mappedObjects = this.selectedItemsObjects.map(item => {
      return {id: item.item_id, name: item.item_text, description: ""};
    });

    if (!this.zone || !this.zone.assignee_id || !this.selectedCameraId) {
      throw new Error('Zone, Assignee ID, and Camera ID must all be defined.');
    }

    const newDetectionInstance: CreateDetectionInstanceRequest = {
      recording: {
        name: this.detectionInstanceName,
        zone_id: this.zone.id,
        assignee_id: this.zone.assignee_id,
        confidence: Math.round(this.confidenceThreshold*100),
        detection_type: this.selectedDetectionType,
        camera_id: this.selectedCameraId,
        status: true,
      }, 
      scenarios: mappedObjects
    };

    this.detectionService.addDetectionInstance(newDetectionInstance).subscribe({
      next: () => {
        console.log('Detection added successfully');
        this.location.back();
      },
      error: err => {
        console.error('Error adding zone:', err);
      }
    });
  }

  /**
   * Loads detection types from the service and assigns them to `detectionTypesList`.
   */
  private loadDetectionTypes(): void {
    this.detectionService.fetchDetectionTypes().subscribe({
      next: detectionTypes => this.detectionTypesList = detectionTypes,
      error: err => console.error('Error fetching assignees:', err)
    })
  }

  /**
   * Loads scenarios from the service and sets up the multi-selector.
   */
  private loadScenarios(): void {
    this.scenarioService.fetchScenarios().subscribe({
      next: scenarios => {
        const scenariosList = scenarios
        this.loadMultiSelectorObjectDetection(scenariosList);
      },
      error: err => console.error('Error fetching assignees:', err)
    })
  }

  /**
   * Loads zone information based on the `zoneId` route parameter.
   */
  private loadZoneInfo(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const zoneId = params.get('zoneId');
      if (zoneId) {
        this.zoneService.fetchZoneById(parseInt(zoneId)).subscribe({
          next: zone => {
            this.zone = zone;
            this.confidenceThreshold = this.zone.zoneconfidence;
          },
          error: err => console.error('Error fetching zones:', err)
        });
      }
    });
  }


  // ========================
  // Multi-Selector Functions
  // ========================

  /**
   * Sets up the multi-selector dropdown with scenarios.
   * @param scenarios The list of scenarios to populate the dropdown.
   */
  private setupMultiSelector() {
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

  /**
   * Returns the configuration settings for the multi-selector dropdown.
   * @returns The settings object for the multi-selector dropdown.
   */
  private loadMultiSelectorObjectDetection(scenarios: ScenarioItem[]): void {
    
    this.dropdownListObjects = scenarios.map(scenario => ({
      item_id: scenario.id,
      item_text: scenario.name
    }));

    this.selectedItemsObjects = [];
    this.dropdownSettingsObjects = this.setupMultiSelector();
  }


  // ========================
  // Utility Functions
  // ========================

  /**
   * Sets the confidence threshold based on a value.
   * @param value The value to set the confidence threshold to.
   */
  setConfidenceThreshold(value: number): void {
    this.confidenceThreshold = parseFloat((value / 100).toFixed(2));
  }


  // ========================
  // Navigation Functions
  // ========================

  /**
   * Navigates back to the previous page.
   */
  navigateBack() {
    this.location.back();
  }

}


