import { Injectable } from '@angular/core';
import { CameraItem } from '../models/camera';
import { of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CameraService {

  private dataCameras: CameraItem[] = [
    new CameraItem("Camera 1", 1, "187.20.135.197"),
    new CameraItem("Camera 2", 2, "187.20.135.199"),
    new CameraItem("Camera 3", 3, "187.20.135.200")]


  constructor() {}

  getAllCameras(){
    return of(this.dataCameras);
  }
  
}
