import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpErrorResponse, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { environment } from 'src/app/environments/environment';
import { API_ENDPOINTS } from '../../config/api-endpoints';
import { mockPlantsActive, mockPlantsInactive } from '../../mock-data/mock-data'
import { PlantService } from './plant.service';


describe('PlantService', () => {
  let service: PlantService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        PlantService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(PlantService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch active plants from the API', () => {
    service.fetchPlants('active').subscribe(plants => {
      expect(plants.length).toBe(mockPlantsActive.length);
      expect(plants).toEqual(mockPlantsActive);
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}${API_ENDPOINTS.plants}?plant_status=active`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPlantsActive);
  });

  it('should fetch inactive plants from the API', () => {
    service.fetchPlants('inactive').subscribe(plants => {
      expect(plants.length).toBe(mockPlantsInactive.length);
      expect(plants).toEqual(mockPlantsInactive);
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}${API_ENDPOINTS.plants}?plant_status=inactive`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPlantsInactive);
  });

  it('should update the confidence threshold of a plant', () => {
    const plantId = 1;
    const confidenceThreshold = 90;

    service.updatePlant(plantId, confidenceThreshold).subscribe(response => {
      expect(response.plantConfidence).toBe(confidenceThreshold);
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}${API_ENDPOINTS.plants}/${plantId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ plantConfidence: confidenceThreshold });

    req.flush({
      id: 1,
      name: 'Aptar Plant 1',
      address: '123 Main St, Springfield, IL',
      plantConfidence: 90,
      plantstatus: true,
    });
  });

});
