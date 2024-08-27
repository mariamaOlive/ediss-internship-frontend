import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, ParamMap, RouterModule, RouterLink } from '@angular/router';
import { IconSetService, IconModule } from '@coreui/icons-angular';
import { cilArrowCircleLeft, cilArrowThickLeft, cilArrowLeft, cilOptions } from '@coreui/icons';

import { CardListComponent } from 'src/app/shared/components/card-list/card-list.component';
import { ZoneItem } from 'src/app/core/models/zone';
import { ZoneService } from 'src/app/core/services/zone/zone.service';

@Component({
  selector: 'app-zones-list',
  standalone: true,
  imports: [CardListComponent, IconModule],
  templateUrl: './zones-list.component.html',
  styleUrl: './zones-list.component.scss'
})
export class ZonesListComponent {
  zonesList: ZoneItem[] = [];
  cardList: Array<{ name: string, description: string, id: number }> = [];
  plantId: any = NaN;
  // selectedPlant: string = "";
  // confidenceThreshold: number = 0;

  constructor(
    private router: Router, 
    private route: ActivatedRoute, 
    private zoneService: ZoneService,
    private location: Location, 
    public iconSet: IconSetService) { 
      iconSet.icons = {cilArrowCircleLeft, cilArrowThickLeft, cilArrowLeft, cilOptions}; 
    }

  // ========================
  // Life Cycle Hooks
  // ========================

  ngOnInit(): void {
    this.loadZonesByPlantId();
  }


  // ========================
  // Service Calls
  // ========================

  loadZonesByPlantId(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      if (id) {
        this.plantId = id;
        this.zoneService.fetchZonesByPlantId(parseInt(id, 10)).subscribe({
          next: zones => {
            this.zonesList = zones;
            this.cardList = this.zonesList.map( zone =>({
              name: zone.name,
              description: "",
              id: zone.id
            }));
          },
          error: err => {
            console.error('Error fetching detections instance:', err);
          }
        });
      }
    });
  }


  // ========================
  // Utilities Functions
  // ========================
 
  addNewZone(): void{

  }


  // ========================
  // Navigation Functions
  // ========================

  navigateToDetectionInstanceList(cardId: number): void {
    this.router.navigate([`configuration/plants/${this.plantId}/zones/${cardId}`]);
  }

  // navigateToAddZone(): void {
  //   this.router.navigate([`configuration/plants/${this.plantId}/add-detection-instance`]);
  // }

  navigateBack(): void {
    this.location.back();
  }

}
