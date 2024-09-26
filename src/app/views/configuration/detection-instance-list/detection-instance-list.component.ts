import { Component, OnInit, ViewChild } from '@angular/core';
import { forkJoin } from 'rxjs';
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
import { DetectionInstanceItem, DetectionTypeItem } from 'src/app/core/models/detection-instance.model';
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
  detectionTypes: DetectionTypeItem[] = [];

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

        // Call fetchDetectionInstancesByZoneId and fetchDetectionInstanceById in parallel
        const zoneIdNum = parseInt(zoneId, 10);
        forkJoin({
          detectionInstances: this.detectionService.fetchDetectionInstancesByZoneId(zoneIdNum),
          detectionInstanceTypes: this.detectionService.fetchDetectionTypes() 
        }).subscribe({
          next: ({ detectionInstances, detectionInstanceTypes }) => {
            this.detectionInstanceList = detectionInstances;
            this.detectionTypes = detectionInstanceTypes;
          },
          error: err => {
            console.error('Error fetching detection instances:', err);
          }
        });
      }
    });
  }

  /**
   * Stops a detection instance by its ID.
   * @param detectionInstanceId The ID of the detection instance to stop.
   */
  stopDetectionInstance(detectionInstance: DetectionInstanceItem) {
    this.detectionService.stopDetectionInstance(detectionInstance.id).subscribe({
      next: response => {
        this.showToast('Instance Completed successfully', 'success')
        detectionInstance.isRunning = false;
        console.log('Instance Completed successfully:', response);
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
