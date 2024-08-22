import { Component, OnInit, inject, WritableSignal, signal, effect, HostListener } from '@angular/core';
import { ActivatedRoute, ParamMap, RouterLink } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule, ButtonModule, GridModule, BadgeModule, FormModule, PageItemDirective, PageLinkDirective, PaginationComponent } from '@coreui/angular';
import { IconSetService, IconModule } from '@coreui/icons-angular';
import { cilArrowCircleLeft, cilArrowThickLeft, cilArrowLeft } from '@coreui/icons';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { ChartOptions } from 'chart.js';

import { DashboardChartsDataTimeLine } from './dashboard-charts-data-timeline';
import { DashboardChartsDataDonut } from './dashboard-charts-data-donut';

import { IncidentItem } from 'src/app/core/models/incident';
import { PlantItem } from 'src/app/core/models/plant';
import { IncidentService } from 'src/app/core/services/incident/incident.service';
import { PlantService } from 'src/app/core/services/plant/plant.service';


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
    RouterLink],
  templateUrl: './dashboard-details.component.html',
  styleUrl: './dashboard-details.component.scss'
})
export class DashboardDetailsComponent implements OnInit {

  // Charts Properties
  chartsData: DashboardChartsDataTimeLine | null = null;
  chartsDataDonut: DashboardChartsDataDonut | null = null;
  
  // View Properties
  incidentsList: IncidentItem[] = []
  plant: PlantItem | null = null;
  selectedInstanceId: string = "";
  paginatedIncidents: any = [];
  itemsPerPage = 10; // Number of items to load each time
  currentPage = 1;

  constructor(
    private route: ActivatedRoute,
    private incidentService: IncidentService,
    private plantService: PlantService,
    private location: Location,
    public iconSet: IconSetService) {

    iconSet.icons = { cilArrowCircleLeft, cilArrowThickLeft, cilArrowLeft };
    this.loadMoreIncidents(); 
  }

  ngOnInit(): void {
    this.loadAccidents();
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

  private loadAccidents(): void {
    const plantId = this.route.snapshot.paramMap.get('id');
    if (plantId) {
      const id = parseInt(plantId, 10);
      this.loadIncidentData(id);
      this.loadPlantData(id);
    }
  }

  private loadIncidentData(plantId: number): void {
    this.incidentService.getIncidentsByPlantId(plantId).subscribe({
      next: incidents => {
        this.incidentsList = incidents;
        this.chartsData = new DashboardChartsDataTimeLine(this.incidentsList);
        this.chartsDataDonut = new DashboardChartsDataDonut(this.incidentsList);
        this.loadMoreIncidents(); // Initial load of paginated data
      },
      error: err => console.error('Error fetching incidents:', err)
    });
  }

  private loadPlantData(plantId: number): void {
    this.plantService.getPlantByIdWithZone(plantId).subscribe({
      next: plant => this.plant = plant,
      error: err => console.error('Error fetching plant information:', err)
    });
  }


  // ========================
  // Utility Functions
  // ========================

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any): void {
    const pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
    const max = document.documentElement.scrollHeight;

    if (pos >= max) {
      this.loadMoreIncidents();
    }
  }

  loadMoreIncidents() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const newIncidents = this.incidentsList.slice(startIndex, startIndex + this.itemsPerPage);
    this.paginatedIncidents = [...this.paginatedIncidents, ...newIncidents];
    this.currentPage++;
  }


  // ========================
  // Navigation Functions
  // ========================

  navigateBack(): void {
    this.location.back();
  }
}
