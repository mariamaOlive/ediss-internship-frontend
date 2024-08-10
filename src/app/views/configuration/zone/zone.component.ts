import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ZoneItem } from 'src/app/core/models/zone';
import { ZoneService } from 'src/app/core/services/zone.service';
import { CardModule, ButtonModule, GridModule, BadgeModule} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-zone',
  standalone: true,
  imports: [CardModule, ButtonModule, GridModule, CommonModule, BadgeModule, IconDirective],
  templateUrl: './zone.component.html',
  styleUrl: './zone.component.scss'
})
export class ZoneComponent {

  zone: ZoneItem | null = null;
  constructor(private zoneServ: ZoneService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      let id = params.get('zoneId');

      if (id) {
        this.zoneServ.getZoneInfo(parseInt(id, 10)).subscribe(zone => this.zone = zone);
      }
    })

  }

  


}
