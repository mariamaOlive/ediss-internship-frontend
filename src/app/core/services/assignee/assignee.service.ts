import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { AssigneeItem } from '../../models/assignee.model';
import { environment } from 'src/app/environments/environment';
import { API_ENDPOINTS } from '../../config/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class AssigneeService {

  constructor(private http: HttpClient) { }

  /**
   * Fetches all assignees from the API.
   * @returns An Observable of AssigneeItem array.
   */
  fetchAllAssignees(): Observable<AssigneeItem[]> {
    const apiUrl = `${environment.apiUrl}${API_ENDPOINTS.assignees}`; // Replace API endpoint
    return this.http.get<AssigneeItem[]>(apiUrl);
  }
}
