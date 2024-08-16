import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { DetectionInstanceItem } from 'src/app/core/models/detection-instance';
import { DetectionInstanceService } from 'src/app/core/services/detection-instance.service';
import { CardModule, ButtonModule, GridModule, BadgeModule} from '@coreui/angular';
import { IconSetService, IconModule } from '@coreui/icons-angular';
import { cilArrowCircleLeft, cilArrowThickLeft, cilArrowLeft } from '@coreui/icons';
import { CommonModule, Location } from '@angular/common';

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


  constructor(private detectionServ: DetectionInstanceService, private route: ActivatedRoute, public iconSet: IconSetService, private location: Location) { 
    iconSet.icons = {cilArrowCircleLeft, cilArrowThickLeft, cilArrowLeft};
  }
  

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      let id = params.get('detectionId');

      if (id) {
        this.detectionServ.getDetectionInstanceInfo(parseInt(id, 10)).subscribe(detectionInstance => this.detectionInstance = detectionInstance);
      }
    })

  }


  navigateBack(): void {
    this.location.back();
  }

  


}
