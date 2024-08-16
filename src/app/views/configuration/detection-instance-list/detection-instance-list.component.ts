import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap, RouterModule, RouterLink, NavigationStart, NavigationEnd, NavigationError, NavigationCancel } from '@angular/router';
import { DetectionInstanceService } from 'src/app/core/services/detection-instance.service';
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
  detectionInstanceList: DetectionInstanceItem[] = [];  // Assuming zones is an array. Adjust type accordingly.
  tooltipText = 'Vivamus sagittis lacus vel augue laoreet rutrum faucibus.';

  constructor(private router: Router, private route: ActivatedRoute, private detectionServ: DetectionInstanceService, private location: Location, public iconSet: IconSetService) {
    iconSet.icons = {cilArrowCircleLeft, cilArrowThickLeft, cilArrowLeft, cilOptions};
    // this.router.events.subscribe(event => {
    //   // debugger
    //   if (event instanceof NavigationStart) {
    //     console.log('NavigationStart:', event);
    //   } else if (event instanceof NavigationEnd) {
    //     console.log('NavigationEnd:', event);
    //   } else if (event instanceof NavigationError) {
    //     console.error('NavigationError:', event.error);
    //   } else if (event instanceof NavigationCancel) {
    //     console.warn('NavigationCancel:', event);
    //   }
    // });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      if (id) {
        this.plantId = id;
        this.detectionServ.getZonesByPlantId(parseInt(id, 10)).subscribe({
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

  navigateToDetectionInstance(detectionInstanceId: number) {
    this.router.navigate([`configuration/plants/${this.plantId}/detection-instance/${detectionInstanceId}`]);
  }

  navigateToAddDetectionInstance() {
    this.router.navigate([`configuration/plants/${this.plantId}/add-detection-instance`]);
  }


  deleteDetectionInstance(detectionInstanceId: number): void {
    this.detectionServ.deleteZone(detectionInstanceId).subscribe({
      next: () => {
        //TODO: Change logic when connect to server
        this.detectionInstanceList = this.detectionInstanceList.filter(instance => instance.id !== detectionInstanceId);
      },
      error: err => {
        console.error('Error deleting detection instance:', err);
      }
    });
  }


  navigateBack(){
    this.location.back();
  }

}
