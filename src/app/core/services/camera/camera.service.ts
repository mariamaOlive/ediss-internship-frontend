import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { CameraItem } from '../../models/camera';
import { mockCamera } from '../../mock-data/mock-data';

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  // TODO: Remove after connecting to API
  private readonly dataCameras: CameraItem[] = mockCamera;

  constructor(private http: HttpClient) {}

  // TODO: Remove after connecting to API
  getAllCameras(): Observable<CameraItem[]> {
    return of(this.dataCameras);
  }

  // TODO: API request
  // getAllCameras(): Observable<CameraItem[]> {
  //   const apiUrl = 'https://api.example.com/cameras'; // Replace with your actual API endpoint
  //   return this.http.get<CameraItem[]>(apiUrl);
  // }
}
