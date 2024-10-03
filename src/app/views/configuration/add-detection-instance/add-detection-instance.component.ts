import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { IconDirective } from '@coreui/icons-angular';
import { CardModule, ButtonModule, GridModule, BadgeModule, FormModule } from '@coreui/angular';
import { cilArrowCircleLeft, cilArrowThickLeft, cilArrowLeft } from '@coreui/icons';
import { IconSetService, IconModule } from '@coreui/icons-angular';
import { catchError, forkJoin, of, throwError } from 'rxjs';

import { ToastMessageComponent } from 'src/app/shared/components/toast-message/toast-message.component';

import { DetectionInstanceService } from 'src/app/core/services/detection-instance/detection-instance.service';
import { ScenarioService } from 'src/app/core/services/scenario/scenario.service'
import { DetectionTypeItem } from 'src/app/core/models/detection-instance.model';
import { ZoneItem } from 'src/app/core/models/zone.model';
import { ZoneService } from 'src/app/core/services/zone/zone.service';
import { CreateDetectionInstanceRequest, DetectionInstanceRequest, Recording } from 'src/app/core/models/api-requests.model';
import { ScenarioItem } from 'src/app/core/models/scenario.model';
import { ToastService } from 'src/app/core/services/toast/toast.service';


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
    IconModule,
    ToastMessageComponent
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
  detectionInstanceAttempted: boolean = false;
  ppeAttempted: boolean = false;
  cameraAttempted: boolean = false;

  //Camera variable
  selectedCamera: any = null;
  selectedCameraAvailable: boolean = false;
  websocket: WebSocket | null = null;

  @ViewChild('cameraCanvas', { static: false }) cameraCanvas!: ElementRef;

  // Toast variables
  @ViewChild(ToastMessageComponent) toastComponent!: ToastMessageComponent;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private detectionService: DetectionInstanceService,
    private zoneService: ZoneService,
    public iconSet: IconSetService,
    private scenarioService: ScenarioService
  ) {
    iconSet.icons = { cilArrowCircleLeft, cilArrowThickLeft, cilArrowLeft };
  }

  onCameraSelect(camera: any) {
    this.selectedCamera = camera;
    this.cameraAttempted = true;

    // Always attempt to connect via WebSocket to determine actual availability
    this.selectedCameraAvailable = false; // Set as unavailable initially
    this.connectToCameraStream(camera.id);
  }

  connectToCameraStream(cameraId: number) {
    // Close any existing WebSocket connection
    this.disconnectFromCameraStream();

    // Connect to the new WebSocket endpoint
    const wsUrl = `ws://localhost:8000/ws/camera/${cameraId}`;
    this.websocket = new WebSocket(wsUrl);

    this.websocket.onopen = () => {
      // WebSocket opened successfully, marking camera as available
      this.selectedCameraAvailable = true;
    };

    this.websocket.onmessage = (event) => {
      // Handle the incoming data (e.g., camera feed frames)
      this.drawCameraFrame(event.data);
    };

    this.websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.selectedCameraAvailable = false; // Set to unavailable if there's an error
    };

    this.websocket.onclose = () => {
      // If the WebSocket connection closes unexpectedly, set the camera to unavailable
      this.selectedCameraAvailable = false;
    };
  }

  disconnectFromCameraStream() {
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }
  }

  drawCameraFrame(data: Blob) {
    if (!this.cameraCanvas) {
      return;
    }

    const canvas = this.cameraCanvas.nativeElement as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      const image = new Image();
      image.src = URL.createObjectURL(data);
      image.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      };
    }
  }

  ngOnDestroy() {
    // Close the WebSocket connection when the component is destroyed
    this.disconnectFromCameraStream();
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
    this.detectionInstanceAttempted = true;
    this.ppeAttempted = true;
    this.cameraAttempted = true;

    // Validate the form fields
    const isDetectionNameValid = !!this.detectionInstanceName;
    const isPPEValid = this.selectedDetectionType !== 1 || (this.selectedItemsObjects && this.selectedItemsObjects.length > 0);
    const isCameraSelected = !!this.selectedCameraId;

    // If any of the fields are invalid, stop the function here
    if (!isDetectionNameValid || !isPPEValid || !isCameraSelected) {
      return;
    }

    let mappedObjects = this.selectedItemsObjects.map(item => {
      return { id: item.item_id, name: item.item_text, description: "" };
    });

    if (!this.zone || !this.zone.assignee_id || !this.selectedCameraId ||
      (this.selectedDetectionType === 1 && this.selectedItemsObjects.length === 0)) {
      console.log('Zone, Assignee ID, and Camera ID must all be defined.')
      return;
    }

    const newDetectionInstance: CreateDetectionInstanceRequest = {
      recording: {
        name: this.detectionInstanceName,
        zone_id: this.zone.id,
        assignee_id: this.zone.assignee_id,
        confidence: Math.round(this.confidenceThreshold),
        detection_type: this.selectedDetectionType,
        camera_id: this.selectedCameraId,
        status: true,
      },
      scenarios: mappedObjects
    };

    this.detectionService.addDetectionInstance(newDetectionInstance).subscribe({
      next: () => {
        this.showToast('Detection added successfully', 'success');
        console.log('Detection added successfully');
        this.location.back();
      },
      error: err => {
        this.showToast('Error adding instance', 'error')
        console.error('Error adding instance', err);
      }
    });
  }

  /**
   * Loads zone information based on the `zoneId` route parameter.
   * If an error occurs, navigates back to the previous page.
   */
  private loadZoneInfo(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const zoneId = params.get('zoneId');
      if (zoneId) {
        const parsedZoneId = parseInt(zoneId);

        // Using forkJoin to make both API calls in parallel
        forkJoin({
          zone: this.zoneService.fetchZoneById(parsedZoneId),
          detectionInstances: this.detectionService.fetchDetectionInstancesByZoneId(parsedZoneId).pipe(
            catchError(err => {
              // Handle specific error for detection instances
              if (err.status === 404) {
                console.log('Detection instances not found, ignoring error.');
                return of([]); // Return an empty array if detection instances are not found
              }
              // Re-throw other errors to be handled by the error block in the subscribe
              return throwError(() => err);
            })
          )
        }).subscribe({
          next: result => {
            this.zone = result.zone;
            this.confidenceThreshold = this.zone.zoneconfidence;
            let detectionInstances = result.detectionInstances.filter(item => item.isRunning)
            this.zone.cameras.forEach(camera => camera.status = true);

            for (const instance of detectionInstances) {
              const cameraId = instance.cameraId;
              const cameraActive = this.zone.cameras.find(item => item.id === cameraId);
              if (cameraActive) {
                cameraActive.status = false;
              }
            }
          },
          error: err => {
            console.error('Error fetching zone or detection instances:', err);
            this.showToast('Error loading zone or detection instances information', 'error');
          }
        });
      }
    });
  }


  /**
   * Loads detection types from the service and assigns them to `detectionTypesList`.
   * If an error occurs, navigates back to the previous page.
   */
  private loadDetectionTypes(): void {
    this.detectionService.fetchDetectionTypes().subscribe({
      next: detectionTypes => this.detectionTypesList = detectionTypes,
      error: err => {
        console.error('Error fetching detection types:', err);
        this.showToast('Error loading detection types', "error");
      }
    });
  }

  /**
   * Loads scenarios from the service and sets up the multi-selector.
   * If an error occurs, navigates back to the previous page.
   */
  private loadScenarios(): void {
    this.scenarioService.fetchScenarios().subscribe({
      next: scenarios => {
        const scenariosList = scenarios;
        this.loadMultiSelectorObjectDetection(scenariosList);
      },
      error: err => {
        console.error('Error fetching scenarios:', err);
        this.showToast('Error fetching scenarios', "error")
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
  // Navigation Functions
  // ========================

  /**
   * Navigates back to the previous page.
   */
  navigateBack() {
    this.location.back();
  }


  // ========================
  // Utility Functions
  // ========================

  /**
  * Triggers toast message
  */
  showToast(message: string, toastType: 'success' | 'error') {
    this.toastMessage = message;
    this.toastType = toastType;
    this.toastComponent.toggleToast();
  }
}


