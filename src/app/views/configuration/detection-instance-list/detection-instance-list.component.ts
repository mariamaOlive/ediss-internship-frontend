import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap, RouterModule, RouterLink } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { IconSetService, IconModule } from '@coreui/icons-angular';
import { cilArrowCircleLeft, cilArrowThickLeft, cilArrowLeft, cilOptions } from '@coreui/icons';
import {
  GridModule,
  CardModule,
  DropdownDividerDirective,
  TemplateIdDirective,
  ThemeDirective,
  DropdownComponent,
  ButtonDirective,
  DropdownToggleDirective,
  DropdownMenuDirective,
  DropdownItemDirective,
  TooltipModule
} from '@coreui/angular';

import { DetectionInstanceService } from 'src/app/core/services/detection-instance/detection-instance.service';
import { DetectionInstanceItem } from 'src/app/core/models/detection-instance.model';
import { DataTransferService } from 'src/app/core/services/data-transfer/data-transfer.service';
import { ToastService } from 'src/app/core/services/toast/toast.service';
import { ToastMessageComponent } from 'src/app/shared/components/toast-message/toast-message.component';



@Component({
  selector: 'app-detection-instance-list',
  standalone: true,
  providers: [IconSetService],
  imports: [
    CommonModule,
    RouterModule,
    GridModule,
    CardModule,
    TemplateIdDirective,
    ThemeDirective,
    DropdownComponent,
    ButtonDirective,
    DropdownToggleDirective,
    DropdownMenuDirective,
    DropdownItemDirective,
    RouterLink,
    DropdownDividerDirective,
    TooltipModule,
    IconModule,
    ToastMessageComponent
  ],
  templateUrl: './detection-instance-list.component.html',
  styleUrl: './detection-instance-list.component.scss'
})
export class DetectionInstanceListComponent implements OnInit {

  plantId: any = NaN;
  zoneId: any = NaN;
  detectionInstanceList: DetectionInstanceItem[] = [];

  // Toast variables
  @ViewChild(ToastMessageComponent) toastComponent!: ToastMessageComponent;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private detectionService: DetectionInstanceService,
    private dataTransferService: DataTransferService,
    private location: Location,
    public iconSet: IconSetService) {

    iconSet.icons = { cilArrowCircleLeft, cilArrowThickLeft, cilArrowLeft, cilOptions };
  }

  // ========================
  // Life Cycle Hooks
  // ========================

  ngOnInit(): void {
    this.loadDetectionInstancesByZoneId();
  }


  // ========================
  // Service Calls
  // ========================

  /**
   * Loads detection instances by the zone ID from the route parameters.
   */
  loadDetectionInstancesByZoneId(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const plantId = params.get('plantId');
      const zoneId = params.get('zoneId');
      if (plantId && zoneId) {
        this.zoneId = zoneId;
        this.plantId = plantId;
        this.detectionService.fetchDetectionInstancesByZoneId(parseInt(zoneId, 10)).subscribe({
          next: detectionInstances => {
            this.detectionInstanceList = detectionInstances;
          },
          error: err => {
            console.error('Error fetching detections instance:', err);
          }
        });
      }
    });
  }

  /**
   * Stops a detection instance by its ID.
   * @param detectionInstanceId The ID of the detection instance to stop.
   */
  stopDetectionInstance(detectionInstanceId?: number) {
    this.detectionService.stopDetectionInstance(detectionInstanceId).subscribe({
      next: response => {
        this.showToast('Instance stopped successfully', 'success')
        console.log('Instance stopped successfully:', response);
      },
      error: err => {
        this.showToast('Error stopping instance', 'error')
        console.error('Error stopping instance:', err);
      }
    });
  }

  // ========================
  // Navigation Functions
  // ========================

  /**
  * Navigates to the details page of a specific detection instance.
  * @param detectionInstanceId The ID of the detection instance to navigate to.
  */
  navigateToDetectionInstance(detectionInstanceId?: number): void {
    this.router.navigate([`configuration/plants/${this.plantId}/zones/${this.zoneId}/detection-instance/${detectionInstanceId}`]);
  }

  /**
   * Navigates to the page for adding a new detection instance.
   */
  navigateToAddDetectionInstance(): void {
    this.dataTransferService.setData(this.zoneId);
    this.router.navigate([`configuration/plants/${this.plantId}/zones/${this.zoneId}/add-detection-instance`]);
  }

  /**
   * Navigates back to the previous page.
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
    // debugger
  }

}
