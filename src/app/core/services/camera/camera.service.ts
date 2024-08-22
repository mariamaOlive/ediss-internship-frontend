import { Injectable } from '@angular/core';
import { CameraItem } from '../../models/camera';
import { of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CameraService {

  private dataCameras: CameraItem[] = [
    { name: "Camera 1", id: 1, ipAddress: "187.20.135.197" },
    { name: "Camera 2", id: 2, ipAddress: "187.20.135.199" },
    { name: "Camera 3", id: 3, ipAddress: "187.20.135.200" }
  ];


  constructor() {}

  getAllCameras(){
    return of(this.dataCameras);
  }
  
}
