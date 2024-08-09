// zonelist.component.ts
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap, RouterModule, RouterLink,  NavigationStart, NavigationEnd, NavigationError, NavigationCancel } from '@angular/router';
import { ZoneService } from 'src/app/core/services/zone.service';
import { CommonModule } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { RowComponent, ColComponent, CardModule, DropdownDividerDirective, TemplateIdDirective, ThemeDirective, DropdownComponent, ButtonDirective, DropdownToggleDirective, DropdownMenuDirective, DropdownItemDirective } from '@coreui/angular';
import { ZoneItem } from 'src/app/core/models/zone';


@Component({
  standalone: true,
  selector: 'app-zonelist',
  templateUrl: './zonelist.component.html',
  styleUrls: ['./zonelist.component.scss'],
  imports : [ CommonModule, RouterModule ,RowComponent, ColComponent,CardModule, TemplateIdDirective, IconDirective, ThemeDirective, DropdownComponent, ButtonDirective, DropdownToggleDirective, DropdownMenuDirective, DropdownItemDirective, RouterLink, DropdownDividerDirective]
})

export class ZonelistComponent implements OnInit {

  plantId: any = NaN;
  zonesList: ZoneItem[] = [];  // Assuming zones is an array. Adjust type accordingly.

  constructor(private router: Router, private route: ActivatedRoute, private zoneServ: ZoneService) {

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

  navigateToZone(zoneId: number) {
    this.router.navigate([`configuration/plants/${this.plantId}/zone/${zoneId}`]);
  }

  navigateToAddZone(){
    this.router.navigate([`configuration/plants/${this.plantId}/add-zone`]);
  }


  deleteZone(zoneId: number): void {
    this.zoneServ.deleteZone(zoneId).subscribe({
      next: () => {
        //TODO: Change logic when connect to server
        this.zonesList = this.zonesList.filter(zone => zone.id !== zoneId);
      },
      error: err => {
        console.error('Error deleting zone:', err);
      }
    });
  }


}