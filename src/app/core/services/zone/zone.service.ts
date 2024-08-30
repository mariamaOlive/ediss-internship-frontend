import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { ZoneItem } from '../../models/zone.model';
import { mockZones } from '../../mock-data/mock-data';
import { environment } from 'src/app/environments/environment';
import { API_ENDPOINTS } from '../../config/api-endpoints';
import { ZoneCreateRequest } from '../../models/api-requests.model';

@Injectable({
  providedIn: 'root'
})
export class ZoneService {

  constructor(private http: HttpClient) { }

  // HTTP request method to add a zone
  addZone(newZone: ZoneCreateRequest): Observable<any> {
    const apiUrl = `${environment.apiUrl}${API_ENDPOINTS.zones}`;
    return this.http.post<any>(apiUrl, newZone);
  }

  // HTTP request method to get zone by its ID
  fetchZoneById(zoneId?: number): Observable<ZoneItem> {
    const apiUrl = `${environment.apiUrl}${API_ENDPOINTS.zones}/${zoneId}`;
    return this.http.get<ZoneItem>(apiUrl);
  }

  // HTTP request method to get zones by plant ID
  fetchZonesByPlantId(plantId: number): Observable<ZoneItem[]> {
    const apiUrl = `${environment.apiUrl}${API_ENDPOINTS.plants}${API_ENDPOINTS.zones}/${plantId}?zone_status=active`;
    return this.http.get<ZoneItem[]>(apiUrl);
  }
}
