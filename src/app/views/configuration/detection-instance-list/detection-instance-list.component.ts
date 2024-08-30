import { Component, OnInit } from '@angular/core';
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
    IconModule
  ],
  templateUrl: './detection-instance-list.component.html',
  styleUrl: './detection-instance-list.component.scss'
})
export class DetectionInstanceListComponent implements OnInit {

  plantId: any = NaN;
  zoneId: any = NaN;
  detectionInstanceList: DetectionInstanceItem[] = [];

  constructor(
    private router: Router, 
    private route: ActivatedRoute, 
    private detectionService: DetectionInstanceService, 
    private dataTransferService: DataTransferService, 
    private location: Location, 
    public iconSet: IconSetService) {

    iconSet.icons = {cilArrowCircleLeft, cilArrowThickLeft, cilArrowLeft, cilOptions};
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

  deleteDetectionInstance(detectionInstanceId?: number): void {
    this.detectionService.deleteDetectionInstance(detectionInstanceId).subscribe({
      next: () => {
        //TODO: Change logic when connect to server
        this.detectionInstanceList = this.detectionInstanceList.filter(instance => instance.id !== detectionInstanceId);
      },
      error: err => {
        console.error('Error deleting detection instance:', err);
      }
    });
  }

  // ========================
  // Navigation Functions
  // ========================

  navigateToDetectionInstance(detectionInstanceId?: number): void {
    this.router.navigate([`configuration/plants/${this.plantId}/zones/${this.zoneId}/detection-instance/${detectionInstanceId}`]);
  }

  navigateToAddDetectionInstance(): void {
    this.dataTransferService.setData(this.zoneId);
    this.router.navigate([`configuration/plants/${this.plantId}/zones/${this.zoneId}/add-detection-instance`]);
  }

  navigateBack(): void {
    this.location.back();
  }


  // ========================
  // Utilities Functions
  // ========================

  stopDetectionInstance(detectionInstanceId?: number){

  }

}
