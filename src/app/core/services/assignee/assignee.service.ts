import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { AssigneeItem } from '../../models/assignee';
import { mockAssignees } from '../../mock-data/mock-data';
import { environment } from '../../config/environment';
import { API_ENDPOINTS } from '../../config/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class AssigneeService {

  // TODO: Remove after connecting to API
  private readonly dataAssignees: AssigneeItem[] = mockAssignees;

  constructor(private http: HttpClient) { }

  // Method to get all assignees, returning an Observable
  getAllAssignees(): Observable<AssigneeItem[]> {
    return of(this.dataAssignees);
  }

  // TODO: Move to this implementation
  // getAllAssignees(): Observable<Assignee[]> {
  //   const apiUrl = 'https://api.example.com/assignees'; // Replace API endpoint
  //   return this.http.get<Assignee[]>(apiUrl);
  // }
}
