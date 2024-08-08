// zonelist.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, RouterModule, RouterLink } from '@angular/router';
import { ZoneService } from 'src/app/core/services/zone.service';
import { CommonModule } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { RowComponent, ColComponent, CardModule, DropdownDividerDirective, TemplateIdDirective, ThemeDirective, DropdownComponent, ButtonDirective, DropdownToggleDirective, DropdownMenuDirective, DropdownItemDirective } from '@coreui/angular';


@Component({
  standalone: true,
  selector: 'app-zonelist',
  templateUrl: './zonelist.component.html',
  styleUrls: ['./zonelist.component.scss'],
  imports : [CommonModule, RouterModule ,RowComponent, ColComponent,CardModule, TemplateIdDirective, IconDirective, ThemeDirective, DropdownComponent, ButtonDirective, DropdownToggleDirective, DropdownMenuDirective, DropdownItemDirective, RouterLink, DropdownDividerDirective]
})

export class ZonelistComponent implements OnInit {

  plantId: any = NaN;
  zonesList: any[] = [];  // Assuming zones is an array. Adjust type accordingly.

  constructor(private route: ActivatedRoute, private zoneServ: ZoneService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      if (id) {
        this.plantId = id;
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