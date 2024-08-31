import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpErrorResponse, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { environment } from 'src/app/environments/environment';
import { API_ENDPOINTS } from '../../config/api-endpoints';
import { mockScenarios } from '../../mock-data/mock-data'

import { ScenarioService } from './scenario.service';

describe('ScenarioService', () => {
  let service: ScenarioService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        ScenarioService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ScenarioService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all scenarios from the API', () => {
    service.fetchScenarios().subscribe(scenarios => {
      expect(scenarios.length).toBe(mockScenarios.length);
      expect(scenarios).toEqual(mockScenarios);
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}${API_ENDPOINTS.scenarios}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockScenarios);
  });
});
