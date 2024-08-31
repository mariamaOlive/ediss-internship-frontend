import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpErrorResponse, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { environment } from 'src/app/environments/environment';
import { API_ENDPOINTS } from '../../config/api-endpoints';

import { ZoneService } from './zone.service';
import { mockZones, mockZoneRequest } from '../../mock-data/mock-data';

describe('ZoneService', () => {
  let service: ZoneService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        ZoneService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ZoneService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a POST request to add a new zone', () => {
  
    service.addZone(mockZoneRequest).subscribe(response => {
      expect(response).toBeTruthy();
    });
  
    const req = httpTestingController.expectOne(`${environment.apiUrl}${API_ENDPOINTS.zones}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockZoneRequest);
  
    req.flush({
      "id": 1,
      "title": 'New Zone',
      "description": 'Test Zone',
      "plant_id": 1,
      "assignee_id": 2,
      "zoneconfidence": 85,
      "zonestatus": "active",
      "cameras": [{
        id: 1,
        name: "Camera 3",
        description: "", 
        ipadress: "192.168.2.101",
        zone_id: 1
      }]
    });
  });


  it('should fetch a zone by its ID', () => {
    const zoneId = 1;
  
    service.fetchZoneById(zoneId).subscribe(zone => {
      expect(zone).toEqual(mockZones[0]);
    });
  
    const req = httpTestingController.expectOne(`${environment.apiUrl}${API_ENDPOINTS.zones}/${zoneId}`);
    expect(req.request.method).toBe('GET');
  
    req.flush(mockZones[0]);
  });

});



