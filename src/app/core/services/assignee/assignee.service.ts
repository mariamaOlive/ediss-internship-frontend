import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { AssigneeItem } from '../../models/assignee.model';
import { mockAssignees } from '../../mock-data/mock-data';
import { environment } from 'src/app/environments/environment';
import { API_ENDPOINTS } from '../../config/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class AssigneeService {

  // TODO: Remove after connecting to API
  private readonly dataAssignees: AssigneeItem[] = mockAssignees;

  constructor(private http: HttpClient) { }

  // HTTP request method to get all assignees
  fetchAllAssignees(): Observable<AssigneeItem[]> {
    const apiUrl = `${environment.apiUrl}${API_ENDPOINTS.assignees}`; // Replace API endpoint
    return this.http.get<AssigneeItem[]>(apiUrl);
  }
}
