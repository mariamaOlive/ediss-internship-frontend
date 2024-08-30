import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ScenarioItem } from '../../models/scenario.model';
import { API_ENDPOINTS } from '../../config/api-endpoints';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ScenarioService {

  constructor(private http: HttpClient) { }

  /**
   * Fetches all scenarios from the server.
   * @returns An Observable that emits an array of ScenarioItem objects.
   */
  fetchScenarios(): Observable<ScenarioItem[]> {
    const apiUrl = `${environment.apiUrl}${API_ENDPOINTS.scenarios}`;
    return this.http.get<ScenarioItem[]>(apiUrl);
  }
}
