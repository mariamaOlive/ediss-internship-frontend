import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { ZoneItem } from '../../models/zone.model';
import { environment } from 'src/app/environments/environment';
import { API_ENDPOINTS } from '../../config/api-endpoints';
import { ZoneCreateRequest } from '../../models/api-requests.model';

@Injectable({
  providedIn: 'root'
})
export class ZoneService {

  constructor(private http: HttpClient) { }

  /**
   * Adds a new zone by sending a request to the server.
   * @param newZone The data for the new zone to be created.
   * @returns An Observable that emits the server's response.
   */
  addZone(newZone: ZoneCreateRequest): Observable<ZoneItem> {
    const apiUrl = `${environment.apiUrl}${API_ENDPOINTS.zones}`;
    return this.http.post<any>(apiUrl, newZone);
  }

  /**
  * Deletes a zone by sending a request to the server.
  * @param zoneId The data for the new zone to be created.
  * @returns An Observable of the delete response.
  */
  deleteZone(zoneId: number): Observable<any> {
    const apiUrl = `${environment.apiUrl}${API_ENDPOINTS.zones}/${zoneId}`;
    return this.http.delete(apiUrl);
  }

  /**
   * Fetches a zone by its ID.
   * @param zoneId The ID of the zone to fetch.
   * @returns An Observable that emits a ZoneItem object.
   */
  fetchZoneById(zoneId: number): Observable<ZoneItem> {
    const apiUrl = `${environment.apiUrl}${API_ENDPOINTS.zones}/${zoneId}`;
    return this.http.get<ZoneItem>(apiUrl);
  }

  /**
   * Fetches all active zones for a given plant by its ID.
   * @param plantId The ID of the plant to fetch zones for.
   * @returns An Observable that emits an array of ZoneItem objects.
   */
  fetchZonesByPlantId(plantId: number): Observable<ZoneItem[]> {
    const apiUrl = `${environment.apiUrl}${API_ENDPOINTS.plants}${API_ENDPOINTS.zones}/${plantId}?zone_status=active`;
    return this.http.get<ZoneItem[]>(apiUrl);
  }
}
