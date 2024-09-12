import { Component, OnInit, inject, WritableSignal, signal, effect, HostListener } from '@angular/core';
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

import { IncidentItem } from 'src/app/core/models/incident.model';
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

  formRadio1 = new UntypedFormGroup({
    radio1: new UntypedFormControl('Radio1')
  });


  constructor(
    private route: ActivatedRoute,
    private incidentService: IncidentService,
    private plantService: PlantService,
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
        console.log(incidents);
        this.chartsData = new DashboardChartsDataTimeLine(this.incidentReport, this.days);
        // this.chartsDataDonut = new DashboardChartsDataDonut(this.incidentsList);
        // this.loadMoreIncidents(); // Initial load of paginated data
      },
      error: err => console.error('Error fetching incidents:', err)
    });
  }

  // private loadPlantData(plantId: number): void {
  //   this.plantService.getPlantByIdWithZone(plantId).subscribe({
  //     next: plant => this.plant = plant,
  //     error: err => console.error('Error fetching plant information:', err)
  //   });
  // }

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


  // ========================
  // Navigation Functions
  // ========================

  navigateBack(): void {
    this.location.back();
  }
}
