import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpErrorResponse, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { environment } from 'src/app/environments/environment';
import { API_ENDPOINTS } from '../../config/api-endpoints';

import { CameraService } from './camera.service';
import { mockCamera } from '../../mock-data/mock-data';

describe('CameraService', () => {
  let service: CameraService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        CameraService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(CameraService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });


  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch a camera by its ID', () => {

    let cameraId = 1;
    service.fetchCameraById(cameraId).subscribe(camera => {
      expect(camera).toEqual(mockCamera[0]);
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}${API_ENDPOINTS.cameras}/${cameraId}`);
    expect(req.request.method).toBe('GET');

    req.flush(mockCamera[0]);
  });
});
