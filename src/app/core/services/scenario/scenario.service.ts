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

  fetchScenarios(): Observable<ScenarioItem[]> {
    const apiUrl = `${environment.apiUrl}${API_ENDPOINTS.scenarios}`;
    return this.http.get<ScenarioItem[]>(apiUrl);
  }
}
