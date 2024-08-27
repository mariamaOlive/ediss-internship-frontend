import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { CardModule, ButtonModule, GridModule, BadgeModule} from '@coreui/angular';
import { IconSetService, IconModule } from '@coreui/icons-angular';
import { cilArrowCircleLeft, cilArrowThickLeft, cilArrowLeft } from '@coreui/icons';

import { DetectionInstanceItem } from 'src/app/core/models/detection-instance';
import { DetectionInstanceService } from 'src/app/core/services/detection-instance/detection-instance.service';
import { ZoneItem } from 'src/app/core/models/zone';
import { ZoneService } from 'src/app/core/services/zone/zone.service';



@Component({
  selector: 'app-detection-instance',
  standalone: true,
  providers: [IconSetService],
  imports: [CardModule, ButtonModule, GridModule, CommonModule, BadgeModule, IconModule],
  templateUrl: './detection-instance.component.html',
  styleUrl: './detection-instance.component.scss'
})
export class DetectionInstanceComponent {

  detectionInstance: DetectionInstanceItem | null = null;
  zone:ZoneItem | null = null;

  constructor(
    private detectionService: DetectionInstanceService, 
    private zoneService: ZoneService, 
    private route: ActivatedRoute, 
    public iconSet: IconSetService, 
    private location: Location) { 

    iconSet.icons = {cilArrowCircleLeft, cilArrowThickLeft, cilArrowLeft};
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

  loadDetectionInstanceById(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      let id = params.get('detectionId');

      if (id) {
        this.detectionService.getDetectionInstanceInfo(parseInt(id, 10)).subscribe(detectionInstance => {
          this.detectionInstance = detectionInstance;
          
          if (this.detectionInstance?.zoneId) {
            this.zoneService.getZoneById(this.detectionInstance.zoneId).subscribe(zone => {
              this.zone = zone;
            });
          }
        });
      }
    })
  }


  // ========================
  // Navigation Functions
  // ========================
  
  navigateBack(): void {
    this.location.back();
  }

}
