import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/app/environments/environment';
import { API_ENDPOINTS } from '../../config/api-endpoints';

import { IncidentItem } from '../../models/incident.model';
import { IncidentDataItem } from '../../models/incident-data.model';



@Injectable({
  providedIn: 'root'
})
export class IncidentService {

  constructor(private http: HttpClient) {
  }

/**
 * Fetches a list of incidents based on the plant, type of incident, number of days, and optional zone.
 * If `zoneId` is provided, it filters incidents by the specific zone.
 * If `zoneId` is not provided (null), it fetches incidents for all zones in the plant.
 *
 * @param {number} plantId - The ID of the plant where incidents are to be fetched.
 * @param {number} incidentType - The type of incident to filter (e.g., PPE detection, Pallet detection).
 * @param {number} days - The number of past days to filter incidents.
 * @param {number | null} zoneId - (Optional) The ID of the zone to filter incidents. If null, incidents from all zones will be fetched.
 * @returns {Observable<IncidentDataItem>} An observable that emits the incident data.
 */
  fetchIncidents(plantId: number, incidentType: number, days: number, zoneId:number | null): Observable<IncidentDataItem> {
    if(!zoneId){
      const apiUrl = `${environment.apiUrl}${API_ENDPOINTS.reports}?plant_id=${plantId}&days=${days}&detection_type_id=${incidentType}`;
      return this.http.get<IncidentDataItem>(apiUrl);
    }else{
      const apiUrl = `${environment.apiUrl}${API_ENDPOINTS.reports}?plant_id=${plantId}&zone_id=${zoneId}&days=${days}&detection_type_id=${incidentType}`;
      return this.http.get<IncidentDataItem>(apiUrl);
    }
  }
  
}

