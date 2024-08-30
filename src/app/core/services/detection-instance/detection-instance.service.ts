import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { DetectionInstanceItem, DetectionTypeItem } from '../../models/detection-instance.model';
import { mockDetectionInstance } from '../../mock-data/mock-data';
import { environment } from 'src/app/environments/environment';
import { API_ENDPOINTS } from '../../config/api-endpoints';
import { CreateDetectionInstanceRequest, DetectionInstanceRequest } from '../../models/api-requests.model';
import { ZoneItem } from '../../models/zone.model';
import { AssigneeItem } from '../../models/assignee.model';
import { AssigneeService } from '../assignee/assignee.service';
import { ZoneService } from '../zone/zone.service';
import { CameraService } from '../camera/camera.service';
import { CameraItem } from '../../models/camera.model';

@Injectable({
  providedIn: 'root'
})
export class DetectionInstanceService {

  private dataDetection: DetectionInstanceItem[] = mockDetectionInstance;

  private detectionTypesCache: DetectionTypeItem[] | null = null;

  constructor(private http: HttpClient, private assigneeService: AssigneeService, private zoneService: ZoneService, private cameraService: CameraService) {}

  addDetectionInstance(newDetectionInstance: CreateDetectionInstanceRequest): Observable<any> {
    const apiUrl = `${environment.apiUrl}${API_ENDPOINTS.detection}/start`;
    return this.http.post<any>(apiUrl, newDetectionInstance);
  }

  fetchDetectionInstancesByZoneId(zoneId: number): Observable<DetectionInstanceItem[]> {
    const detectionInstancesUrl = `${environment.apiUrl}${API_ENDPOINTS.zones}${API_ENDPOINTS.detectionInstances}/${zoneId}`;
    
    return this.fetchDetectionTypes().pipe(
      switchMap(detectionTypes => 
        this.http.get<DetectionInstanceRequest[]>(detectionInstancesUrl).pipe(
          map(detectionInstances =>
            detectionInstances.map(item => {
              const detectionType = detectionTypes.find(dt => dt.id === item.recording.detection_type_id);
              return this.mapToDetectionInstance(item, detectionType);
            })
          )
        )
      )
    );
  }


  // HTTP request method to get detection instance info by zone ID
  fetchDetectionInstanceInfo(detectionId: number): Observable<DetectionInstanceItem> {
    const apiUrl = `${environment.apiUrl}${API_ENDPOINTS.zones}${API_ENDPOINTS.detectionInstance}/${detectionId}`;
    
    return this.fetchDetectionTypes().pipe(
      switchMap(detectionTypes =>
        this.http.get<DetectionInstanceRequest>(apiUrl).pipe(
          switchMap(item => 
            forkJoin({
              zone: this.zoneService.fetchZoneById(item.recording.zone_id),
              camera: this.cameraService.fetchCameraById(item.recording.camera_id),
              assignee: this.assigneeService.fetchAllAssignees().pipe(
                map(assignees => assignees.find(assignee => assignee.id === item.recording.assignee_id))
              )
            }).pipe(
              map(({ zone, assignee, camera }) => {
                const detectionType = detectionTypes.find(dt => dt.id === item.recording.detection_type_id);
                return this.mapToDetectionInstance(item, detectionType, zone, camera, assignee);
              })
            )
          )
        )
      )
    );
  }

  fetchDetectionTypes(): Observable<DetectionTypeItem[]> {
    if (this.detectionTypesCache) {
      // Return cached detection types
      return of(this.detectionTypesCache);
    } else {
      const detectionTypesUrl = `${environment.apiUrl}${API_ENDPOINTS.detection}/types`;
      return this.http.get<DetectionTypeItem[]>(detectionTypesUrl).pipe(
        tap(detectionTypes => this.detectionTypesCache = detectionTypes) // Cache the result
      );
    }
  }

  stopDetectionInstance(instanceId?: number): Observable<any> {
    const apiUrl = `${environment.apiUrl}${API_ENDPOINTS.detection}/stop/${instanceId}`;
    return this.http.post(apiUrl, {});
  } 

  private mapToDetectionInstance(
    item: DetectionInstanceRequest, 
    detectionType: DetectionTypeItem | undefined, 
    zone?: ZoneItem, 
    camera?: CameraItem, 
    assignee?: AssigneeItem
  ): DetectionInstanceItem {
    return {
      id: item.recording.id,
      name: item.recording.name,
      isRunning: item.recording.status,
      confidenceTheshold: item.recording.confidence * 100,
      detectionType: detectionType,
      classesDetection: item.scenarios ?? undefined,
      zone: zone ?? undefined,  // Default to undefined if not provided
      camera: camera ?? undefined,  // Default to undefined if not provided
      assignee: assignee ?? undefined  // Default to undefined if not provided
    };
  }

  deleteDetectionInstance(zoneId?: number): Observable<boolean> {
    const index = this.dataDetection.findIndex(zone => zone.id === zoneId);

    if (index !== -1) {
      this.dataDetection.splice(index, 1);
      console.log(`Zone with ID ${zoneId} deleted.`);
      return of(true); // Return true indicating successful deletion
    } else {
      console.error(`Zone with ID ${zoneId} not found.`);
      return of(false); // Return false indicating failure to delete
    }
  }

  // HTTP request method to delete a detection instance
  // deleteDetectionInstance(zoneId: number): Observable<boolean> {
  //   const apiUrl = `https://api.example.com/detection-instances/${zoneId}`;
  //   return this.http.delete<boolean>(apiUrl);
  // }
}
