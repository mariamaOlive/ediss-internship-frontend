import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting  } from '@angular/common/http/testing';
import { HttpErrorResponse, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { environment } from 'src/app/environments/environment';
import { API_ENDPOINTS } from '../../config/api-endpoints';
import { mockAssignees } from '../../mock-data/mock-data'

import { AssigneeService } from './assignee.service';

describe('AssigneeService', () => {
  let service: AssigneeService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        AssigneeService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(AssigneeService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all assignees from the API', () => {

    service.fetchAllAssignees().subscribe(assignees => {
      expect(assignees.length).toBe(3);
      expect(assignees).toEqual(mockAssignees);
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}${API_ENDPOINTS.assignees}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockAssignees);
  });

});
