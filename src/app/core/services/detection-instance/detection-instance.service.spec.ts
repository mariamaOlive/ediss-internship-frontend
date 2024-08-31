import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpErrorResponse, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { environment } from 'src/app/environments/environment';
import { API_ENDPOINTS } from '../../config/api-endpoints';

import { DetectionInstanceService } from './detection-instance.service';
import { mockNewDetectionInstance, mockScenarios, mockDetectionInstances, mockDetectionInstanceRequests, mockDetectionTypes, mockZones, mockAssignees, mockCamera } from '../../mock-data/mock-data';
import { DetectionInstanceRequest } from '../../models/api-requests.model';

describe('DetectionInstanceService', () => {
  let service: DetectionInstanceService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        DetectionInstanceService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(DetectionInstanceService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  xit('should send a POST request to add a new detection instance', () => {

    service.addDetectionInstance(mockNewDetectionInstance).subscribe(response => {
      expect(response.id).toEqual(1);
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}${API_ENDPOINTS.detection}/start`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockNewDetectionInstance);

    req.flush({success: true}); //TODO: See the correct response of the API
  });


  it('should fetch detection instances by zone ID and sort them by start time', () => {
    const zoneId = 1;
    const detectionInstancesUrl = `${environment.apiUrl}${API_ENDPOINTS.zones}${API_ENDPOINTS.detectionInstances}/${zoneId}`;
    const detectionTypesUrl = `${environment.apiUrl}${API_ENDPOINTS.detection}/types`;

    // Call the function
    service.fetchDetectionInstancesByZoneId(zoneId).subscribe(instances => {
      expect(instances.length).toBe(mockDetectionInstances.length);
      expect(new Date(instances[0].starttime).getTime()).toBeGreaterThan(new Date(instances[1].starttime).getTime());
    });

    // Handle the detection types request
    const reqDetectionTypes = httpTestingController.expectOne(detectionTypesUrl);
    expect(reqDetectionTypes.request.method).toBe('GET');
    reqDetectionTypes.flush(mockDetectionTypes);

    // Handle the detection instances request
    const reqDetectionInstances = httpTestingController.expectOne(detectionInstancesUrl);
    expect(reqDetectionInstances.request.method).toBe('GET');
    reqDetectionInstances.flush(mockDetectionInstanceRequests);
  });

  it('should fetch detailed information about a detection instance', () => {
    const detectionId = 1;
  
    service.fetchDetectionInstanceInfo(detectionId).subscribe(instance => {
      expect(instance.id).toBe(detectionId);
      expect(instance.zone).toEqual(mockZones[0]);
      expect(instance.assignee).toEqual(mockAssignees[0]);
      expect(instance.camera).toEqual(mockCamera[0]);
    });
  
    const detectionTypesUrl = `${environment.apiUrl}${API_ENDPOINTS.detection}/types`;
    const instanceUrl = `${environment.apiUrl}${API_ENDPOINTS.zones}${API_ENDPOINTS.detectionInstance}/${detectionId}`;
  
    // Handle the detection types request
    const reqDetectionTypes = httpTestingController.expectOne(detectionTypesUrl);
    expect(reqDetectionTypes.request.method).toBe('GET');
    reqDetectionTypes.flush(mockDetectionTypes);
  
    // Handle the detection instance request
    const reqDetectionInstance = httpTestingController.expectOne(instanceUrl);
    expect(reqDetectionInstance.request.method).toBe('GET');
    reqDetectionInstance.flush(mockDetectionInstanceRequests[0]);
  
    // Handle the additional info (zone, camera, assignee) requests
    const zoneReq = httpTestingController.expectOne(`${environment.apiUrl}${API_ENDPOINTS.zones}/${mockDetectionInstanceRequests[0].recording.zone_id}`);
    expect(zoneReq.request.method).toBe('GET');
    zoneReq.flush(mockZones[0]);
  
    const cameraReq = httpTestingController.expectOne(`${environment.apiUrl}${API_ENDPOINTS.cameras}/${mockDetectionInstanceRequests[0].recording.camera_id}`);
    expect(cameraReq.request.method).toBe('GET');
    cameraReq.flush(mockCamera[0]);
  
    const assigneeReq = httpTestingController.expectOne(`${environment.apiUrl}${API_ENDPOINTS.assignees}`);
    expect(assigneeReq.request.method).toBe('GET');
    assigneeReq.flush(mockAssignees);
  });
  
  it('should fetch detection types with caching', () => {
    const detectionTypesUrl = `${environment.apiUrl}${API_ENDPOINTS.detection}/types`;

    // First call should make a HTTP request
    service.fetchDetectionTypes().subscribe(types => {
      expect(types).toEqual(mockDetectionTypes);
      expect(types.length).toBe(mockDetectionTypes.length)
    });

    const req = httpTestingController.expectOne(detectionTypesUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockDetectionTypes);

    // Second call should return cached data without making a HTTP request
    service.fetchDetectionTypes().subscribe(types => {
      expect(types).toEqual(mockDetectionTypes);
    });

    httpTestingController.expectNone(detectionTypesUrl);
  });

  it('should stop a detection instance', () => {
    const instanceId = 1;
    const apiUrl = `${environment.apiUrl}${API_ENDPOINTS.detection}/stop/${instanceId}`;

    service.stopDetectionInstance(instanceId).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpTestingController.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});
    req.flush({ success: true });
  });

});
