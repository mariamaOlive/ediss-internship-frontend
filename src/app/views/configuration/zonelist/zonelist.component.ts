// zonelist.component.ts
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap, RouterModule, RouterLink,  NavigationStart, NavigationEnd, NavigationError, NavigationCancel } from '@angular/router';
import { ZoneService } from 'src/app/core/services/zone.service';
import { CommonModule } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { RowComponent, ColComponent, CardModule, DropdownDividerDirective, TemplateIdDirective, ThemeDirective, DropdownComponent, ButtonDirective, DropdownToggleDirective, DropdownMenuDirective, DropdownItemDirective } from '@coreui/angular';


@Component({
  standalone: true,
  selector: 'app-zonelist',
  templateUrl: './zonelist.component.html',
  styleUrls: ['./zonelist.component.scss'],
  imports : [ CommonModule, RouterModule ,RowComponent, ColComponent,CardModule, TemplateIdDirective, IconDirective, ThemeDirective, DropdownComponent, ButtonDirective, DropdownToggleDirective, DropdownMenuDirective, DropdownItemDirective, RouterLink, DropdownDividerDirective]
})

export class ZonelistComponent implements OnInit {

  plantId: any = NaN;
  zonesList: any[] = [];  // Assuming zones is an array. Adjust type accordingly.

  constructor(private router: Router, private route: ActivatedRoute, private zoneServ: ZoneService) {

    this.router.events.subscribe(event => {
      // debugger
      if (event instanceof NavigationStart) {
        console.log('NavigationStart:', event);
      } else if (event instanceof NavigationEnd) {
        console.log('NavigationEnd:', event);
      } else if (event instanceof NavigationError) {
        console.error('NavigationError:', event.error);
      } else if (event instanceof NavigationCancel) {
        console.warn('NavigationCancel:', event);
      }
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      if (id) {
        this.plantId = id;
        this.zoneServ.getZonesByPlantId(parseInt(id, 10)).subscribe({
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

  navigateToZone(plantId: string, zoneId: string) {
    this.router.navigate([`configuration/plants/${plantId}/zone/${zoneId}`]);
  }

  onZoneSelect(zoneId: string) {
    const plantId = this.plantId; // This should be dynamically set based on your application's logic
    this.navigateToZone(plantId, zoneId);
  }

}