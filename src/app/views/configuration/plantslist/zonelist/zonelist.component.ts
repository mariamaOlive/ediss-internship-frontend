// zonelist.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ZoneService } from 'src/app/core/services/zone.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-zonelist',
  templateUrl: './zonelist.component.html',
  styleUrls: ['./zonelist.component.scss'],
  imports : [CommonModule]
})
export class ZonelistComponent implements OnInit {

  plantId: any = NaN;
  zonesList: any[] = [];  // Assuming zones is an array. Adjust type accordingly.

  constructor(private route: ActivatedRoute, private zoneServ: ZoneService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      if (id) {
        this.plantId = id; //TODO: Check type
        this.zoneServ.getZoneByPlantId(parseInt(id, 10)).subscribe({
          next: zones => {
            this.zonesList = zones;
          },
          error: err => {
            console.error('Error fetching zones:', err);
          }
        });
      }
    });
  }
}