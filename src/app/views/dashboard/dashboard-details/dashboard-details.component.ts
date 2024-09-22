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

/**
 * The DashboardDetailsComponent is responsible for rendering the dashboard details of a specific plant.
 * It fetches incident report and manages the display of data in differents chart types.
 */
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
  selectedZone: number | null = null;
  selectedInstanceId: string = "";
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

  /**
   * Loads the dashboard data including the plant zones and incident data for the selected plant.
   * Retrieves the plant ID from the route parameters.
   */
  private loadDashboardData(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.plantId = parseInt(id, 10);
      this.loadPlantZones(this.plantId);
      this.requestIncidents();
    } else {
      console.error('Invalid plantId:', id);
    }
  }

  /**
   * Requests incidents based on the selected plant ID, zone, and time period.
   */
  private requestIncidents(): void {
    if (this.plantId && !isNaN(this.plantId)) {
      this.loadIncidentData(this.plantId);
    } else {
      console.error('Invalid plantId:', this.plantId);
    }
  }

  /**
   * Fetches incident data from the IncidentService for the specified plant and zone.
   * Configures the chart data for both time series and donut charts.
   * 
   * @param plantId - The ID of the plant to fetch incidents for
   */
  private loadIncidentData(plantId: number): void {
    const tab = this.activeTab + 1;
    const nDays = this.days - 1;

    this.incidentService.fetchIncidents(plantId, tab, nDays, this.selectedZone).subscribe({
      next: incidents => {
        this.incidentReport = incidents;
        this.checkIncidentsEmpty(incidents);
        this.chartsData = new DashboardChartsDataTimeLine(this.incidentReport, this.days);
        this.chartsDataDonut = new DashboardChartsDataDonut(this.incidentReport);
      },
      error: err => console.error('Error fetching incidents:', err)
    });
  }

  /**
   * Fetches the zones for a given plant ID.
   * 
   * @param plantId - The ID of the plant to fetch zones for
   */
  private loadPlantZones(plantId: number): void {
    this.zoneService.fetchZonesByPlantId(plantId).subscribe({
      next: zones => this.zoneList = zones,
      error: err => console.error('Error fetching zone information:', err)
    });
  }


  // ========================
  // Utility Functions
  // ========================

  /**
   * Updates the number of days (7 or 30 days) based on the selected radio button value.
   * Triggers a request to fetch incidents after the change.
   * 
   * @param value - The selected radio button value ('Radio1' for 7 days, 'Radio2' for 30 days)
   */
  setRadioValue(value: string): void {
    this.formRadio1.setValue({ radio1: value });

    if (value === 'Radio1') {
      this.days = 7;
    } else if (value === 'Radio2') {
      this.days = 30;
    } else if (value === 'Radio3') {
      this.days = 2;
    }
    this.requestIncidents();
  }

  /**
   * Updates the selected tab index and fetches incidents for the selected tab.
   * 
   * @param index - The index of the selected tab
   */
  selectTab(index: number) {
    this.activeTab = index;
    this.requestIncidents();
  }

  /**
   * Checks whether the incident report is empty and updates the `incidentsEmpty` flag.
   * 
   * @param incidentReport - The incident report to check for emptiness
   */
  checkIncidentsEmpty(incidentReport: IncidentDataItem): void {
    if (incidentReport.incidents_by_type.length === 0 && Object.keys(incidentReport.incidents_timeline).length === 0) {
      this.incidentsEmpty = true;
    } else {
      this.incidentsEmpty = false;
    }
  }

  /**
   * Triggered when the zone selection changes. Requests new incident data based on the selected zone.
   */
  onZoneChange(): void {
    this.requestIncidents();
  }

  /**
   * Open a modal that shows the details of the incidents.
   */
  checkDetailsIncidents(): void {
    //TODO: Open modal and show incidents
  }


  // ========================
  // Navigation Functions
  // ========================

  /**
   * Navigates back to the previous page in the application.
   */
  navigateBack(): void {
    this.location.back();
  }

}
