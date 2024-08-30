import { Injectable } from '@angular/core';
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
import { getStyle, hexToRgba } from '@coreui/utils';
import { IncidentItem } from 'src/app/core/models/incident.model';
import { IncidentService } from 'src/app/core/services/incident/incident.service';
import { differenceInDays } from 'date-fns';


export class DashboardChartsDataDonut {
  incidentList: IncidentItem[];
  type:any;
  options:any;
  data : any; 
  data1: any;
  data2: any;
  data3: any;
  elements : any;
  highestScaleY:number = 100

  constructor(incidentList: IncidentItem[]) {
    this.incidentList = incidentList;
    this.initMainChart();
  }

  // public mainChart: IChartProps = { type: 'line' };

  public random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  initMainChart(period: string = 'Week') {
    const brandSuccess = getStyle('--cui-success') ?? '#4dbd74';
    const brandInfo = getStyle('--cui-info') ?? '#20a8d8';
    const brandInfoBg = hexToRgba(getStyle('--cui-info') ?? '#20a8d8', 10);
    const brandDanger = getStyle('--cui-danger') ?? '#f86c6b';

    // mainChart
    this.elements = period === 'Month' ? 12 : 7;
    this.data1 = [];
    this.data2 = [];
    this.data3 = [];

    // Treat data of time series
    this.data1 = this.filterIncidentsByTypeAndTimestamp(this.incidentList, "Helmet", 7).length;
    this.data2 = this.filterIncidentsByTypeAndTimestamp(this.incidentList, "Vest", 7).length;
    this.data3 = this.filterIncidentsByTypeAndTimestamp(this.incidentList, "Hairnet", 7).length;


    let labels: string[] = [];
    labels = ["Helmet", "Vest", "Hainet"]

    const colors = [
      {
        // brandInfo
        backgroundColor: brandInfoBg,
        borderColor: brandInfo,
        pointHoverBackgroundColor: brandInfo,
        // borderWidth: 2,
        // fill: true
      },
      {
        // brandSuccess
        backgroundColor: 'transparent',
        borderColor: brandSuccess || '#4dbd74',
        pointHoverBackgroundColor: '#fff'
      },
      {
        // brandDanger
        backgroundColor: 'transparent',
        borderColor: brandDanger || '#f86c6b',
        pointHoverBackgroundColor: brandDanger,
        // borderWidth: 2,
        // borderDash: [8, 5]
      }
    ];

    const datasets: ChartDataset[] = [
      {
        data: [this.data1, this.data2, this.data3],
        backgroundColor: ['#41B883', '#E46651', '#00D8FF']
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
