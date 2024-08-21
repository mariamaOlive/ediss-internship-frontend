import { Component, OnInit, inject, WritableSignal, signal, effect, HostListener } from '@angular/core';
import { Router, ActivatedRoute, ParamMap, RouterLink} from '@angular/router';
import { IncidentService } from 'src/app/core/services/incident/incident.service';
import { CommonModule, Location  } from '@angular/common';
import { PlantService } from 'src/app/core/services/plant/plant.service';
import { PlantItem } from 'src/app/core/models/plant';
import { CardModule, ButtonModule, GridModule, BadgeModule, FormModule, PageItemDirective, PageLinkDirective, PaginationComponent } from '@coreui/angular';
import { IconSetService, IconModule } from '@coreui/icons-angular';
import { cilArrowCircleLeft, cilArrowThickLeft, cilArrowLeft } from '@coreui/icons';
import { FormsModule } from '@angular/forms';  // Import FormsModule
import { ChartOptions } from 'chart.js';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { DashboardChartsDataTimeLine } from './dashboard-charts-data-timeline';
import { DashboardChartsDataDonut } from './dashboard-charts-data-donut';
import { IncidentItem } from 'src/app/core/models/incident';


@Component({
  selector: 'app-dashboard-details',
  standalone: true,
  imports: [CardModule, GridModule, CommonModule, IconModule, FormsModule, FormModule, ChartjsComponent, PageItemDirective, PageLinkDirective, PaginationComponent, RouterLink],
  templateUrl: './dashboard-details.component.html',
  styleUrl: './dashboard-details.component.scss'
})
export class DashboardDetailsComponent implements OnInit {
  // readonly #chartsData: DashboardChartsData = inject(DashboardChartsData);

  chartsData:DashboardChartsDataTimeLine | null = null;
  chartsDataDonut:DashboardChartsDataDonut | null = null;
  incidentsList : any[] = []
  plant: PlantItem | null = null;

  selectedInstanceId :string="";

  paginatedIncidents:any = [];
  itemsPerPage = 10; // Number of items to load each time
  currentPage = 1;

  constructor(
    private router: Router, 
    private route: ActivatedRoute,  
    private incidentService: IncidentService,
    private plantService: PlantService,
    private location: Location,
    public iconSet: IconSetService){
      iconSet.icons = {cilArrowCircleLeft, cilArrowThickLeft, cilArrowLeft};
      this.loadMoreIncidents(); // Initial load
    }


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


  ngOnInit():void {
    
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      if (id) {
        this.incidentService.getIncidentsByPlantId(parseInt(id, 10)).subscribe({
          next: incidents => {
            this.incidentsList = incidents;
            this.chartsData = new DashboardChartsDataTimeLine(this.incidentsList);
            this.chartsDataDonut = new DashboardChartsDataDonut(this.incidentsList);

          },
          error: err => {
            console.error('Error fetching incidents:', err);
          }
        });

        this.plantService.getPlantByIdWithZone(parseInt(id, 10)).subscribe({
          next: plant =>{
            this.plant = plant;
            console.log(this.plant);
          },error: err => {
            console.error('Error fetching plant information:', err);
          }
        })
      }
    });
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

  navigateBack(): void {
    this.location.back();
  }


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
}
