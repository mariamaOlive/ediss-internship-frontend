import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { PlantItem } from '../../models/plant.model';
import { PlantUpdateRequest } from '../../models/api-requests.model';
import { environment } from 'src/app/environments/environment';
import { API_ENDPOINTS } from '../../config/api-endpoints';


@Injectable({
  providedIn: 'root'
})
export class PlantService {

  constructor(
    private http: HttpClient
  ) { }

  /**
   * Fetch all plants based on their status (active/inactive).
   * @param status Status of the plants to fetch ('active' or 'inactive').
   * @returns An Observable of PlantItem array.
   */
  fetchPlants(status: string = 'active'): Observable<PlantItem[]> {
    const apiUrl = `${environment.apiUrl}${API_ENDPOINTS.plants}?plant_status=${status}`;
    return this.http.get<PlantItem[]>(apiUrl);
  }

  /**
   * Inactivates a specific plant.
   * @param plantId The ID of the plant to update.
   * @returns An Observable of the delete response.
   */
  inactivatePlant(plantId: number): Observable<any> {
    const url = `${environment.apiUrl}${API_ENDPOINTS.plants}/${plantId}`;
    return this.http.delete(url);
  }

  /**
   * Update the confidence threshold of a specific plant.
   * @param plantId The ID of the plant to update.
   * @param confidenceThreshold The new confidence threshold value.
   * @returns An Observable of the update response.
   */
  updatePlant(plantId: number, confidenceTheshold: number): Observable<any> {
    const updateRequest: PlantUpdateRequest = { plantConfidence: confidenceTheshold };
    const url = `${environment.apiUrl}${API_ENDPOINTS.plants}/${plantId}`;
    return this.http.put(url, updateRequest);
  }


}
