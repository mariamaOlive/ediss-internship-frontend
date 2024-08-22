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
import { DetectionInstanceItem } from 'src/app/core/models/detection-instance';


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
  detectionInstanceList: DetectionInstanceItem[] = [];

  constructor(
    private router: Router, 
    private route: ActivatedRoute, 
    private detectionService: DetectionInstanceService,  
    private location: Location, 
    public iconSet: IconSetService) {

    iconSet.icons = {cilArrowCircleLeft, cilArrowThickLeft, cilArrowLeft, cilOptions};
  }

  // ========================
  // Life Cycle Hooks
  // ========================

  ngOnInit(): void {
    this.loadZonesByPlantId();
  }


  // ========================
  // Service Calls
  // ========================

  loadZonesByPlantId(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      if (id) {
        this.plantId = id;
        this.detectionService.getDetectionInstanceByPlantId(parseInt(id, 10)).subscribe({
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

  deleteDetectionInstance(detectionInstanceId: number): void {
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

  navigateToDetectionInstance(detectionInstanceId: number): void {
    this.router.navigate([`configuration/plants/${this.plantId}/detection-instance/${detectionInstanceId}`]);
  }

  navigateToAddDetectionInstance(): void {
    this.router.navigate([`configuration/plants/${this.plantId}/add-detection-instance`]);
  }

  navigateBack(): void {
    this.location.back();
  }

}
