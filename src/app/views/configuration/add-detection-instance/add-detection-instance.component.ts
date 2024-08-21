import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { DetectionInstanceService } from 'src/app/core/services/detection-instance/detection-instance.service';
import { CameraItem } from 'src/app/core/models/camera';
import { DetectionInstanceItem } from 'src/app/core/models/detection-instance';
import { CardModule, ButtonModule, GridModule, BadgeModule, FormModule } from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { PlantService } from 'src/app/core/services/plant/plant.service';
import { ZoneService } from 'src/app/core/services/zone/zone.service';
import { AssigneeService } from 'src/app/core/services/assignee/assignee.service';
import { CameraService } from 'src/app/core/services/camera/camera.service';
import { PlantItem } from 'src/app/core/models/plant';
import { cilArrowCircleLeft, cilArrowThickLeft, cilArrowLeft } from '@coreui/icons';
import { IconSetService, IconModule } from '@coreui/icons-angular';
import { ZoneItem } from 'src/app/core/models/zone';


@Component({
  selector: 'app-add-detection-instance',
  standalone: true,
  providers: [IconSetService],
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
  // Properties
  plantId: any = NaN;
  plant: PlantItem | null = null;
  assignees: any;
  zones: any;
  cameras: any;

  dropdownListObjects: any[] = [];
  dropdownSettingsObjects = {};

  dropdownListCameras: any[] = [];
  dropdownSettingsCameras = {};

  // New Zone properties
  detectionInstanceName: string = '';
  selectedAssignee: string = "";
  selectedZone:string="";
  confidenceThreshold: number = 0;
  selectedDetectionType: string = "1";
  selectedItemsObjects: any[] = [];
  selectedItemsCameras: any[] = [];

  constructor(
    private router: Router, 
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

  // Lifecycle Hook
  ngOnInit() {
    this.getPlantInfo();
    this.getAvailableAssignees();
    this.getAvailableCameras();
    this.loadMultiSelectorObjectDetection();
  }

  // Service Calls

  private getPlantInfo(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('plantId');
      if (id) {
        this.plantId = parseInt(id, 10);
        this.plantService.getPlantById(parseInt(id, 10)).subscribe({
          next: plant => {
            this.plant = plant;
            this.confidenceThreshold = this.plant.confidenceThreshold;
            this.getZonesByPlant(parseInt(id, 10));
          },
          error: err => {
            console.error('Error fetching plant info:', err);
          }
        });
      }
    });
  }

  private getZonesByPlant(plantId: number): void {
    this.zoneService.getZoneByPlantId(plantId).subscribe({
      next: zones => {
        this.zones = zones;
      },
      error: err => {
        console.error('Error fetching zones:', err);
      }
    });
  }

  private getAvailableAssignees(): void {
    this.assigneeService.getAllAssignees().subscribe({
      next: assignees => {
        this.assignees = assignees;
      },
      error: err => {
        console.error('Error fetching assignees:', err);
      }
    });
  }

  private getAvailableCameras(): void {
    this.cameraService.getAllCameras().subscribe({
      next: cameras => {
        this.cameras = cameras;
        this.loadMultiSelectorCamera(this.cameras);
      },
      error: err => {
        console.error('Error fetching cameras:', err);
      }
    });
  }

  // Multi-Selector Functions
  
  private loadMultiSelectorObjectDetection(): void {
    this.dropdownListObjects = [
      { item_id: 1, item_text: 'Helmet' },
      { item_id: 2, item_text: 'Hair Net' },
      { item_id: 3, item_text: 'Goggles' },
      { item_id: 4, item_text: 'Vest' },
      { item_id: 5, item_text: 'Earplugs' }
    ];

    this.selectedItemsObjects = [];

    this.dropdownSettingsObjects = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: false
    };
  }

  private loadMultiSelectorCamera(cameraList: any): void {
    this.dropdownListCameras = cameraList.map((camera: { id: any; name: any; }) => {
      return { item_id: camera.id, item_text: camera.name };
    });

    this.selectedItemsCameras = [];

    this.dropdownSettingsCameras = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: false
    };
  }

  // Event Handlers

  onItemSelect(item: any): void {
    console.log(item);
  }

  onSelectAll(items: any): void {
    console.log(items);
  }

  // Zone Management

  addNewDetectionInstance(): void {

    //TODO: Remove part of this code when connected to the server
    let mappedCameras = this.selectedItemsCameras.map(item => item.item_id);
    let filteredCameras = this.cameras.filter((item: { id: any; }) => mappedCameras.includes(item.id));
    let mappedObjects = this.selectedItemsObjects.map(item => item.item_text);

    const newZone: DetectionInstanceItem = new DetectionInstanceItem(
      this.detectionInstanceName, 
      Math.floor(Math.random() * 100001), 
      this.plantId,
      parseInt(this.selectedZone),
      this.selectedAssignee || "Not defined", 
      this.confidenceThreshold,  
      parseInt(this.selectedDetectionType), 
      mappedObjects,
      filteredCameras,
      true
    );

    this.detectionService.addDetectionInstance(newZone).subscribe({
      next: () => {
        console.log('Zone added successfully');
        this.location.back();
      },
      error: err => {
        console.error('Error adding zone:', err);
      }
    });
  }

  // Utility Functions

  updateConfidenceThreshold(value: number): void {
    this.confidenceThreshold = parseFloat((value / 100).toFixed(2));
  }

  navigateBack(){
    this.location.back();
  }

}


