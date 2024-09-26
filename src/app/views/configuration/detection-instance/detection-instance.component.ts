import { Component, ViewChild } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { CardModule, ButtonModule, GridModule, BadgeModule } from '@coreui/angular';
import { IconSetService, IconModule } from '@coreui/icons-angular';
import { cilArrowCircleLeft, cilArrowThickLeft, cilArrowLeft } from '@coreui/icons';

import { DetectionInstanceItem } from 'src/app/core/models/detection-instance.model';
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
    this.loadDetectionInstanceById();
  }


  // ========================
  // Service Calls
  // ========================

  /**
   * Loads the detection instance information by its ID.
   * The ID is retrieved from the route parameters.
   */
  private loadDetectionInstanceById(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      let id = params.get('detectionId');

      if (id) {
        this.detectionService.fetchDetectionInstanceInfo(parseInt(id, 10)).subscribe(detectionInstance => {
          this.detectionInstance = detectionInstance;
        });
      }
    })
  }

  /**
   * Stops the currently loaded detection instance.
   * The instance ID is taken from the currently loaded detection instance.
   */
  stopInstance(): void {
    this.detectionService.stopDetectionInstance(this.detectionInstance?.id).subscribe({
      next: response => {
        if(this.detectionInstance){
          this.detectionInstance.isRunning = false;
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

}
