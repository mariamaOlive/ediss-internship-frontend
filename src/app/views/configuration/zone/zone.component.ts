import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ZoneItem } from 'src/app/core/models/zone';
import { ZoneService } from 'src/app/core/services/zone.service';
import { CardModule, ButtonModule, GridModule, BadgeModule} from '@coreui/angular';
import { IconSetService, IconModule } from '@coreui/icons-angular';
import { cilArrowCircleLeft, cilArrowThickLeft, cilArrowLeft } from '@coreui/icons';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-zone',
  standalone: true,
  providers: [IconSetService],
  imports: [CardModule, ButtonModule, GridModule, CommonModule, BadgeModule, IconModule],
  templateUrl: './zone.component.html',
  styleUrl: './zone.component.scss'
})
export class ZoneComponent {

  zone: ZoneItem | null = null;


  constructor(private zoneServ: ZoneService, private route: ActivatedRoute, public iconSet: IconSetService, private location: Location) { 
    iconSet.icons = {cilArrowCircleLeft, cilArrowThickLeft, cilArrowLeft};
  }
  

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      let id = params.get('zoneId');

      if (id) {
        this.zoneServ.getZoneInfo(parseInt(id, 10)).subscribe(zone => this.zone = zone);
      }
    })

  }


  navigateBack(): void {
    this.location.back();
  }

  


}
