import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { CameraItem } from '../../models/camera';
import { mockCamera } from '../../mock-data/mock-data';
import { environment } from 'src/app/environments/environment';
import { API_ENDPOINTS } from '../../config/api-endpoints';
@Injectable({
  providedIn: 'root'
})
export class CameraService {

  // TODO: Remove after connecting to API
  private readonly dataCameras: CameraItem[] = mockCamera;

  constructor(private http: HttpClient) { }

  // // TODO: Remove after connecting to API
  // fetchAllCameras(): Observable<CameraItem[]> {
  //   return of(this.dataCameras);
  // }

  fetchCameraById(cameraId?: number): Observable<CameraItem> {
    const apiUrl = `${environment.apiUrl}${API_ENDPOINTS.cameras}/${cameraId}`;
    return this.http.get<CameraItem>(apiUrl);
  }
}
