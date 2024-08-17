import { Component, OnInit, inject, WritableSignal, signal, effect} from '@angular/core';
import { Router, ActivatedRoute, ParamMap} from '@angular/router';
import { IncidentService } from 'src/app/core/services/incident/incident.service';
import { CommonModule, Location  } from '@angular/common';
import { PlantService } from 'src/app/core/services/plant/plant.service';
import { PlantItem } from 'src/app/core/models/plant';
import { CardModule, ButtonModule, GridModule, BadgeModule, FormModule} from '@coreui/angular';
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
  imports: [CardModule, GridModule, CommonModule, IconModule, FormsModule, FormModule, ChartjsComponent],
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
  

  constructor(
    private router: Router, 
    private route: ActivatedRoute,  
    private incidentServ: IncidentService,
    private plantService: PlantService,
    private location: Location,
    public iconSet: IconSetService){
      iconSet.icons = {cilArrowCircleLeft, cilArrowThickLeft, cilArrowLeft};
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

  // initCharts(): void {
  //   this.mainChart = this.#chartsData.mainChart;
  // }

  ngOnInit():void {
    
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      if (id) {
        // this.plantId = id;
        this.incidentServ.getIncidentsByPlantId(parseInt(id, 10)).subscribe({
          next: incidents => {
            this.incidentsList = incidents;
            // console.log(this.incidentsList);
            // this.mainChart.incidentsList = this.incidentsList;
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
}
