import { Component, OnInit, WritableSignal, signal, effect } from '@angular/core';
import { ActivatedRoute, ParamMap, RouterLink } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, FormsModule } from '@angular/forms';
import { CardModule, GridModule, FormModule, PageItemDirective, PageLinkDirective, PaginationComponent, NavModule, TabsModule, ButtonDirective, ButtonGroupComponent, FormCheckLabelDirective } from '@coreui/angular';
import { IconSetService, IconModule } from '@coreui/icons-angular';
import { cilArrowCircleLeft, cilArrowThickLeft, cilArrowLeft } from '@coreui/icons';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { ChartOptions } from 'chart.js';


import { DashboardChartsDataTimeLine } from './dashboard-charts-data-timeline';
import { DashboardChartsDataDonut } from './dashboard-charts-data-donut';

import { IncidentService } from 'src/app/core/services/incident/incident.service';
import { PlantItem } from 'src/app/core/models/plant.model';
import { PlantService } from 'src/app/core/services/plant/plant.service';
import { ZoneService } from 'src/app/core/services/zone/zone.service';
import { ZoneItem } from 'src/app/core/models/zone.model';
import { IncidentDataItem } from 'src/app/core/models/incident-data.model';


@Component({
  selector: 'app-dashboard-details',
  standalone: true,
  imports: [
    CardModule,
    GridModule,
    CommonModule,
    IconModule,
    FormsModule,
    FormModule,
    ChartjsComponent,
    PageItemDirective,
    PageLinkDirective,
    PaginationComponent,
    RouterLink,
    NavModule, 
    TabsModule,
    ReactiveFormsModule,
    ButtonGroupComponent,
    FormCheckLabelDirective,
    ButtonDirective
  ],
  templateUrl: './dashboard-details.component.html',
  styleUrl: './dashboard-details.component.scss'
})
export class DashboardDetailsComponent implements OnInit {

  // Charts Properties
  chartsData: DashboardChartsDataTimeLine | null = null;
  chartsDataDonut: DashboardChartsDataDonut | null = null;
  
  // View Properties
  incidentReport?: IncidentDataItem;
  zoneList: ZoneItem[] = [];
  plant: PlantItem | null = null;
  plantId?: number;
  selectedZone: number = 0;
  selectedInstanceId: string = "";
  paginatedIncidents: any = [];
  itemsPerPage = 10; // Number of items to load each time
  currentPage = 1;
  days: number = 7;
  activeTab: number = 0;
  incidentsEmpty = false; 

  formRadio1 = new UntypedFormGroup({
    radio1: new UntypedFormControl('Radio1')
  });


  constructor(
    private route: ActivatedRoute,
    private incidentService: IncidentService,
    private zoneService: ZoneService,
    private location: Location,
    public iconSet: IconSetService,
    private formBuilder: UntypedFormBuilder) {

    iconSet.icons = { cilArrowCircleLeft, cilArrowThickLeft, cilArrowLeft };
  }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  // ========================
  // Setting up charts
  // ========================

  public mainChartRef: WritableSignal<any> = signal(undefined);
  #mainChartRefEffect = effect(() => {
    if (this.mainChartRef()) {
      this.setChartStyles();
    }
  });

  public mainChartRefDonut: WritableSignal<any> = signal(undefined);
  #mainChartRefEffectDonut = effect(() => {
    if (this.mainChartRefDonut()) {
      this.setChartStylesDonut();
    }
  });


  setChartStyles() {
    if (this.mainChartRef()) {
      setTimeout(() => {
        const options: ChartOptions = { ...this.chartsData?.options };
        const scales = this.chartsData?.getScales();
        this.mainChartRef().options.scales = { ...options.scales, ...scales };
        this.mainChartRef().update();
      });
    }
  }

  setChartStylesDonut() {
    if (this.mainChartRefDonut()) {
      setTimeout(() => {
        const options: ChartOptions = { ...this.chartsDataDonut?.options };
        const scales = this.chartsDataDonut?.getScales();
        this.mainChartRefDonut().options.scales = { ...options.scales, ...scales };
        this.mainChartRefDonut().update();
      });
    }
  }

  handleChartRef($chartRef: any) {
    if ($chartRef) {
      this.mainChartRef.set($chartRef);
    }
  }
  handleChartRefDounut($chartRef: any) {
    if ($chartRef) {
      this.mainChartRef.set($chartRef);
    }
  }


  // ========================
  // Service Calls
  // ========================

  private loadDashboardData(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.plantId = parseInt(id, 10);
      this.loadPlantZones(this.plantId);
      this.loadIncidentData(this.plantId);
    }else {
      console.error('Invalid plantId:', id);
    }
  }

  private requestIncidents(): void{
    if (this.plantId && !isNaN(this.plantId)) {
      this.loadIncidentData(this.plantId);
    } else {
      console.error('Invalid plantId:', this.plantId);
    }
  }

  private loadIncidentData(plantId: number): void {

    const tab = this.activeTab + 1;
    const nDays = this.days-1;
    this.incidentService.fetchIncidentsByPlant(plantId, tab, nDays).subscribe({
      next: incidents => {
        this.incidentReport = incidents;
        this.checkIncidentsEmpty(incidents);
        console.log(incidents);
        this.chartsData = new DashboardChartsDataTimeLine(this.incidentReport, this.days);
        this.chartsDataDonut = new DashboardChartsDataDonut(this.incidentReport);
      },
      error: err => console.error('Error fetching incidents:', err)
    });
  }

  private loadPlantZones(plantId: number): void {
    this.zoneService.fetchZonesByPlantId(plantId).subscribe({
      next: zones => this.zoneList = zones,
      error: err => console.error('Error fetching zone information:', err)
    });
  }


  // ========================
  // Utility Functions
  // ========================

  setRadioValue(value: string): void {
    this.formRadio1.setValue({ radio1: value });
    
    if (value === 'Radio1') {
      this.days = 7;
    } else if (value === 'Radio2') {
      this.days = 30;
    }

    console.log('Selected value:', this.days);
    this.requestIncidents();
  }

  selectTab(index: number) {
    this.activeTab = index;
    this.requestIncidents();
  }

  checkIncidentsEmpty(incidentReport: IncidentDataItem): void{
    if (incidentReport.incidents_by_type.length === 0 && Object.keys(incidentReport.incidents_timeline).length === 0) {
      this.incidentsEmpty = true; 
    } else {
      this.incidentsEmpty = false; 
    }
  }


  // ========================
  // Navigation Functions
  // ========================

  navigateBack(): void {
    this.location.back();
  }


  mockdata = {
    "incidents_by_type": [
        {
            "type": "helmet",
            "count": 24
        },
        {
            "type": "earplug",
            "count": 28
        },
        {
            "type": "goggles",
            "count": 20
        },
        {
            "type": "vest",
            "count": 18
        },
        {
            "type": "hairnet",
            "count": 16
        }
    ],
    "incidents_timeline": {
        "2024-09-11": {
            "helmet": 3,
            "earplug": 5,
            "goggles": 2,
            "vest": 4,
            "hairnet": 1
        },
        "2024-09-10": {
            "helmet": 4,
            "earplug": 0,
            "goggles": 2,
            "vest": 3,
            "hairnet": 1
        },
        "2024-09-09": {
            "helmet": 5,
            "earplug": 2,
            "goggles": 1,
            "vest": 4,
            "hairnet": 3
        },
        "2024-09-08": {
            "helmet": 1,
            "earplug": 3,
            "goggles": 6,
            "vest": 0,
            "hairnet": 2
        },
        "2024-09-07": {
            "helmet": 2,
            "earplug": 1,
            "goggles": 0,
            "vest": 5,
            "hairnet": 3
        },
        "2024-09-06": {
            "helmet": 6,
            "earplug": 4,
            "goggles": 3,
            "vest": 2,
            "hairnet": 0
        },
        "2024-09-05": {
            "helmet": 0,
            "earplug": 5,
            "goggles": 4,
            "vest": 1,
            "hairnet": 3
        },
        "2024-09-04": {
            "helmet": 3,
            "earplug": 2,
            "goggles": 1,
            "vest": 6,
            "hairnet": 0
        },
        "2024-09-03": {
            "helmet": 1,
            "earplug": 0,
            "goggles": 2,
            "vest": 3,
            "hairnet": 4
        },
        "2024-09-02": {
            "helmet": 4,
            "earplug": 3,
            "goggles": 0,
            "vest": 2,
            "hairnet": 5
        },
        "2024-09-01": {
            "helmet": 6,
            "earplug": 1,
            "goggles": 4,
            "vest": 5,
            "hairnet": 3
        },
        "2024-08-31": {
            "helmet": 2,
            "earplug": 4,
            "goggles": 5,
            "vest": 0,
            "hairnet": 1
        },
        "2024-08-30": {
            "helmet": 3,
            "earplug": 5,
            "goggles": 2,
            "vest": 1,
            "hairnet": 6
        },
        "2024-08-29": {
            "helmet": 1,
            "earplug": 2,
            "goggles": 6,
            "vest": 0,
            "hairnet": 3
        },
        "2024-08-28": {
            "helmet": 4,
            "earplug": 0,
            "goggles": 3,
            "vest": 5,
            "hairnet": 2
        },
        "2024-08-27": {
            "helmet": 5,
            "earplug": 3,
            "goggles": 2,
            "vest": 6,
            "hairnet": 1
        },
        "2024-08-26": {
            "helmet": 6,
            "earplug": 4,
            "goggles": 0,
            "vest": 2,
            "hairnet": 5
        },
        "2024-08-25": {
            "helmet": 1,
            "earplug": 2,
            "goggles": 4,
            "vest": 5,
            "hairnet": 0
        },
        "2024-08-24": {
            "helmet": 2,
            "earplug": 3,
            "goggles": 6,
            "vest": 1,
            "hairnet": 4
        },
        "2024-08-23": {
            "helmet": 3,
            "earplug": 1,
            "goggles": 5,
            "vest": 2,
            "hairnet": 6
        },
        "2024-08-22": {
            "helmet": 4,
            "earplug": 2,
            "goggles": 0,
            "vest": 6,
            "hairnet": 1
        },
        "2024-08-21": {
            "helmet": 0,
            "earplug": 3,
            "goggles": 1,
            "vest": 5,
            "hairnet": 4
        },
        "2024-08-20": {
            "helmet": 2,
            "earplug": 4,
            "goggles": 3,
            "vest": 6,
            "hairnet": 0
        },
        "2024-08-19": {
            "helmet": 1,
            "earplug": 6,
            "goggles": 4,
            "vest": 0,
            "hairnet": 2
        },
        "2024-08-18": {
            "helmet": 5,
            "earplug": 2,
            "goggles": 3,
            "vest": 1,
            "hairnet": 4
        },
        "2024-08-17": {
            "helmet": 4,
            "earplug": 5,
            "goggles": 0,
            "vest": 2,
            "hairnet": 6
        },
        "2024-08-16": {
            "helmet": 3,
            "earplug": 1,
            "goggles": 6,
            "vest": 4,
            "hairnet": 5
        },
        "2024-08-15": {
            "helmet": 6,
            "earplug": 0,
            "goggles": 3,
            "vest": 2,
            "hairnet": 4
        },
        "2024-08-14": {
            "helmet": 1,
            "earplug": 4,
            "goggles": 5,
            "vest": 0,
            "hairnet": 6
        }
    }
}

}
