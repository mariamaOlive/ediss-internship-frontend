import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { CameraItem } from '../../models/camera.model';
import { environment } from 'src/app/environments/environment';
import { API_ENDPOINTS } from '../../config/api-endpoints';
@Injectable({
  providedIn: 'root'
})
export class CameraService {

  constructor(private http: HttpClient) { }

  /**
   * Fetches a camera by its ID.
   * @param cameraId The ID of the camera to fetch.
   * @returns An Observable of CameraItem.
   */
  fetchCameraById(cameraId: number): Observable<CameraItem> {
    const apiUrl = `${environment.apiUrl}${API_ENDPOINTS.cameras}/${cameraId}`;
    return this.http.get<CameraItem>(apiUrl);
  }
}
