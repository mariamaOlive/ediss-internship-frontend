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
import { IncidentDataItem } from 'src/app/core/models/incident-data.model';


export class DashboardChartsDataTimeLine {
  type: any;
  options: any;
  data: any;
  elements: any;
  highestScaleY: number = 100

  constructor(private incident: IncidentDataItem, private days: number) {
    this.initMainChart(this.days);
  }


  initMainChart(days: number) {
    const brandSuccess = getStyle('--cui-success') ?? '#4dbd74';
    const brandInfo = getStyle('--cui-info') ?? '#20a8d8';
    const brandInfoBg = hexToRgba(getStyle('--cui-info') ?? '#20a8d8', 10);
    const brandDanger = getStyle('--cui-danger') ?? '#f86c6b';

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

    // Empty datasets to start fresh
    let datasets: any[] = [];

    const incidentTypesArray = this.incident.incidents_by_type.map(entry => entry.type);


    // // Loop through each incident type and prepare its dataset
    incidentTypesArray.forEach((type, index) => {

      // Helper function to generate last N days including today
      function getLastNDays(days: number): string[] {
        const today = new Date();
        return Array.from({ length: days }, (_, i) => {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          return date.toISOString().split('T')[0]; // Format date as 'yyyy-mm-dd'
        });
      }

      // Number of days to check, including today
      const daysToCheck = this.days;

      // Generate the last N days dynamically
      const expectedDates = getLastNDays(daysToCheck);

      debugger

      // Extract and ensure missing dates have a value of 0
      const numberIncidentsArray = expectedDates.map(date => {
        const entry = this.incident.incidents_timeline[date];
        return entry ? (entry[type] || 0) : 0;
      });

      // Reverse the array to maintain your original logic
      numberIncidentsArray.reverse();

      // Add to the datasets
      datasets.push({
        data: numberIncidentsArray,
        label: type,
        ...colors[0]
      });
    });

    this.highestScaleY = this.getHighestValue(...datasets.map(dataset => dataset.data));

    const labels = this.generateXLabels(this.days);

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

    this.type = 'line';
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
      x: {
        grid: {
          color: colorBorderTranslucent,
          drawOnChartArea: false
        },
        ticks: {
          color: colorBody
        }
      },
      y: {
        border: {
          color: colorBorderTranslucent
        },
        grid: {
          color: colorBorderTranslucent
        },
        max: this.highestScaleY + 1,
        beginAtZero: true,
        ticks: {
          color: colorBody,
          maxTicksLimit: 5,
          stepSize: 1
        }
      }
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

  //Count Number of incidents by date
  countIncidentsByDay(incidents: IncidentItem[], numberDaysAgo: number): number[] {
    let arrayCount = Array(numberDaysAgo).fill(0);
    for (var incident of incidents) {
      const today = new Date();
      const daysDifference = differenceInDays(today, incident.timestamp);
      arrayCount[daysDifference] += 1;
    }

    return arrayCount.reverse() //Make today the last date;
  }

  getHighestValue(...arrays: number[][]): number {
    // Flatten all arrays into one array using the spread operator
    const combinedArray = arrays.flat();

    // Use Math.max to find the highest value in the combined array
    const highestValue = Math.max(...combinedArray);
    return highestValue;
  }

  generateXLabels(days: number): string[] {
    const week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
    // Get today's date
    const today = new Date();
    const todayIndex = today.getDay(); // Sunday - Saturday : 0 - 6
  
    // Generate labels for today and the last 'n' days
    const labels = [];
    for (let i = 0; i < days; i++) {
      const dayIndex = (todayIndex - i + 7 * Math.ceil(i / 7)) % 7;
      labels.unshift(week[dayIndex]);
    }
  
    return labels;
  }


}
