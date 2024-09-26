import { Component, ViewChild } from '@angular/core';
import { forkJoin } from 'rxjs';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { CardModule, ButtonModule, GridModule, BadgeModule } from '@coreui/angular';
import { IconSetService, IconModule } from '@coreui/icons-angular';
import { cilArrowCircleLeft, cilArrowThickLeft, cilArrowLeft } from '@coreui/icons';

import { DetectionInstanceItem, DetectionTypeItem } from 'src/app/core/models/detection-instance.model';
import { DetectionInstanceService } from 'src/app/core/services/detection-instance/detection-instance.service';
import { ZoneItem } from 'src/app/core/models/zone.model';
import { ToastMessageComponent } from 'src/app/shared/components/toast-message/toast-message.component';




@Component({
  selector: 'app-detection-instance',
  standalone: true,
  providers: [IconSetService],
  imports: [CardModule, ButtonModule, GridModule, CommonModule, BadgeModule, IconModule, ToastMessageComponent],
  templateUrl: './detection-instance.component.html',
  styleUrl: './detection-instance.component.scss'
})
export class DetectionInstanceComponent {

  detectionInstance: DetectionInstanceItem | null = null;
  detectionTypes: DetectionTypeItem[] = [];
  zone: ZoneItem | null = null;

  // Toast variables
  @ViewChild(ToastMessageComponent) toastComponent!: ToastMessageComponent;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';



  constructor(
    private detectionService: DetectionInstanceService,
    private route: ActivatedRoute,
    public iconSet: IconSetService,
    private location: Location) {

    iconSet.icons = { cilArrowCircleLeft, cilArrowThickLeft, cilArrowLeft };
  }

  // ========================
  // Life Cycle Hooks
  // ========================

  ngOnInit(): void {
    this.loadDetectionInstanceByIdFirstTime();
  }


  // ========================
  // Service Calls
  // ========================

  /**
  * Retrieves the detection ID from the route parameters and calls the function to load the detection instance by ID.
  * @returns void
  */
  private loadDetectionInstanceByIdFirstTime(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      let idString = params.get('detectionId');
      if (idString) {
        let id = parseInt(idString, 10);
        this.loadDetectionInstanceById(id);
      }
    });
  }

  /**
   * Fetches the detection instance and detection types from the service based on the provided detection ID.
   * @returns void
   */
  private loadDetectionInstanceById(id: number) {
    // Use forkJoin to fetch both detection instance and detection types in parallel
    forkJoin({
      detectionInstance: this.detectionService.fetchDetectionInstanceInfo(id),
      detectionTypes: this.detectionService.fetchDetectionTypes()
    }).subscribe({
      next: ({ detectionInstance, detectionTypes }) => {
        this.detectionInstance = detectionInstance;
        this.detectionTypes = detectionTypes;
      },
      error: err => {
        console.error('Error fetching detection instance or types:', err);
      }
    });
  }

  /**
   * Stops the currently loaded detection instance.
   * The instance ID is taken from the currently loaded detection instance.
   */
  stopInstance(): void {
    this.detectionService.stopDetectionInstance(this.detectionInstance?.id).subscribe({
      next: response => {
        if (response) {
          if (this.detectionInstance?.id) {
            this.loadDetectionInstanceById(this.detectionInstance.id)
          }
          this.showToast('Instance Completed successfully', 'success');
          console.log('Instance Completed successfully:', response);
        }
      },
      error: err => {
        console.error('Error stopping instance:', err);
        this.showToast('Error stopping instance', 'error');
      }
    });
  }


  // ========================
  // Navigation Functions
  // ========================

  /**
   * Navigates back to the previous location in the browser history.
   */
  navigateBack(): void {
    this.location.back();
  }

  // ========================
  // Utilities Functions
  // ========================

  /**
  * Triggers toast message
  */
  showToast(message: string, toastType: 'success' | 'error') {
    this.toastMessage = message;
    this.toastType = toastType;
    this.toastComponent.toggleToast();
  }

  /**
   * Returns the name of the detection type for a given detection instance.
   * @param detectionInstance - The detection instance with the detection type to check.
   * @returns The name of the detection type or 'Unknown Detection' if no match is found.
   */
  getDetectionTypeName(detectionInstance: any): string {
    if (!detectionInstance || !detectionInstance.detectionType) {
      return 'Unknown Detection';
    }
    const matchingType = this.detectionTypes.find(type => type.id === detectionInstance.detectionType.id);
    return matchingType ? matchingType.name : 'Unknown Detection';
  }

}
