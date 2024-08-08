import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ZoneService } from 'src/app/core/services/zone.service';

@Component({
  selector: 'app-zone',
  standalone: true,
  imports: [],
  templateUrl: './zone.component.html',
  styleUrl: './zone.component.scss'
})
export class ZoneComponent {

  zone: any = {};
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
