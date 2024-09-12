import {
  ChartData,
  ChartDataset,
  ChartOptions,
  ChartType,
  PluginOptionsByType,
  ScaleOptions,
  TooltipLabelStyle
} from 'chart.js';
import { DeepPartial } from 'chart.js/dist/types/utils';
import { getStyle } from '@coreui/utils';
import { IncidentItem } from 'src/app/core/models/incident.model';
import { IncidentDataItem } from 'src/app/core/models/incident-data.model';


export class DashboardChartsDataDonut {
  type:any;
  options:any;
  data : any; 
  elements : any;
  highestScaleY:number = 100

  constructor(private incidentReport: IncidentDataItem) {
    this.initMainChart();
  }


  public random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  initMainChart() {
   
    const valuesDatasets = this.incidentReport.incidents_by_type.map(entry => entry.count);
    const incidentTypesArray = this.incidentReport.incidents_by_type.map(entry => entry.type);


    let labels: string[] = [];
    labels = incidentTypesArray;

    const colorPalette =[
      "#27aeef", 
      "#b33dc6", 
      "#87bc45", 
      "#f46a9b", 
      "#bdcf32", 
      "#ea5545", 
      "#ef9b20", 
      "#ede15b", 
      "#edbf33"
    ];

    const datasets: ChartDataset[] = [
      {
        data: valuesDatasets,
        backgroundColor: colorPalette.slice(0, valuesDatasets.length)
      }
    ];

    const plugins: DeepPartial<PluginOptionsByType<any>> = {
      legend: {
        display: true
      },
      tooltip: {
        callbacks: {
          labelColor: (context) => ({ backgroundColor: context.dataset.borderColor } as TooltipLabelStyle)
        }
      }
    };

    const scales = this.getScales();

    const options: ChartOptions = {
      maintainAspectRatio: false,
      plugins,
      scales,
      elements: {
        line: {
          tension: 0.4
        },
        point: {
          radius: 0,
          hitRadius: 10,
          hoverRadius: 4,
          hoverBorderWidth: 3
        }
      }
    };

    this.type = 'doughnut';
    this.options = options;
    this.data = {
      datasets,
      labels
    };
  }

  getScales() {
    const colorBorderTranslucent = getStyle('--cui-border-color-translucent');
    const colorBody = getStyle('--cui-body-color');

    const scales: ScaleOptions<any> = {
      // x: {
      //   grid: {
      //     color: colorBorderTranslucent,
      //     drawOnChartArea: false
      //   },
      //   ticks: {
      //     color: colorBody,
      //   }
      // },
      // y: {
      //   border: {
      //     color: colorBorderTranslucent
      //   },
      //   grid: {
      //     color: colorBorderTranslucent,
      //     drawOnChartArea: false
      //   },
      //   max: this.highestScaleY + 1,
      //   beginAtZero: true,
      //   ticks: {
      //     color: colorBody,
      //     maxTicksLimit: 5,
      //     stepSize: 1
      //   }
      // }
    };
    return scales;
  }


  //Organizing Data Functions

  //Filter by type of incident and timestamp
  filterIncidentsByTypeAndTimestamp(
    incidents: IncidentItem[],
    type: string,
    numberDaysAgo: number
  ): IncidentItem[] {

    const startTime = new Date();
    startTime.setDate(startTime.getDate() - numberDaysAgo + 1); // Set the date to 7 days ago
    startTime.setHours(0, 0, 0, 0); // Set the time to the start of that day (midnight)


    return incidents.filter(incident => {
      const isTypeMatch = incident.className === type;
      const isWithinTimeRange = incident.timestamp >= startTime;
      return isTypeMatch && isWithinTimeRange;
    });
  }



}
