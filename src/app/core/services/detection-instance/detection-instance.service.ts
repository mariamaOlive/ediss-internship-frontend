import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { DetectionInstanceItem, DetectionTypeItem } from '../../models/detection-instance.model';
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

  private detectionTypesCache: DetectionTypeItem[] | null = null;

  constructor(private http: HttpClient, private assigneeService: AssigneeService, private zoneService: ZoneService, private cameraService: CameraService) { }

  /**
   * Adds a new detection instance by sending a request to the server.
   * @param newDetectionInstance The detection instance data to be created.
   * @returns An Observable that emits the server's response.
   */
  addDetectionInstance(newDetectionInstance: CreateDetectionInstanceRequest): Observable<any> {
    const apiUrl = `${environment.apiUrl}${API_ENDPOINTS.detection}/start`;
    return this.http.post<any>(apiUrl, newDetectionInstance);
  }

  /**
   * Fetches all detection instances for a given zone by its ID without extra info related
   * @param zoneId The ID of the zone to fetch detection instances for.
   * @returns An Observable that emits an array of DetectionInstanceRequest.
   */
    fetchDetectionInstancesByZoneIdSimple(zoneId: number): Observable<DetectionInstanceRequest[]> {
      const detectionInstancesUrl = `${environment.apiUrl}${API_ENDPOINTS.zones}${API_ENDPOINTS.detectionInstances}/${zoneId}`;
      return this.http.get<DetectionInstanceRequest[]>(detectionInstancesUrl);
    }

  /**
   * Fetches all detection instances for a given zone by its ID.
   * @param zoneId The ID of the zone to fetch detection instances for.
   * @returns An Observable that emits an array of DetectionInstanceItem objects sorted by startTime.
   */
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
          ),
          map(detectionInstances => detectionInstances.sort((a, b) => {
            return new Date(b.starttime).getTime() - new Date(a.starttime).getTime(); //Descending order
          }))
        )
      )
    );
  }

  /**
   * Fetches detailed information about a specific detection instance by its ID.
   * @param detectionId The ID of the detection instance to fetch information for.
   * @returns An Observable that emits the detailed DetectionInstanceItem object.
   */
  fetchDetectionInstanceInfo(detectionId: number): Observable<DetectionInstanceItem> {
    const apiUrl = `${environment.apiUrl}${API_ENDPOINTS.zones}${API_ENDPOINTS.detectionInstance}/${detectionId}`;

    return this.fetchDetectionTypes().pipe(
      switchMap(detectionTypes =>
        this.http.get<DetectionInstanceRequest>(apiUrl).pipe(
          switchMap(item => this.fetchAdditionalInfo(item).pipe(
            map(({ zone, assignee, camera }) => {
              const detectionType = detectionTypes.find(dt => dt.id === item.recording.detection_type_id);
              return this.mapToDetectionInstance(item, detectionType, zone, camera, assignee);
            })
          ))
        )
      )
    );
  }

  /**
   * Fetches the zone, camera, and assignee details for a detection instance.
   * @param {DetectionInstanceRequest} item - The detection instance request with `zone_id`, `camera_id`, and `assignee_id`.
   * @returns {Observable<{ zone: ZoneItem; camera: CameraItem; assignee: AssigneeItem }>} - An observable emitting the zone, 
   * camera, and assignee details. Throws an error if the assignee is not found.
   */
  private fetchAdditionalInfo(item: DetectionInstanceRequest): Observable<{ zone: ZoneItem; camera: CameraItem; assignee: AssigneeItem }> {
    return forkJoin({
      zone: this.zoneService.fetchZoneById(item.recording.zone_id),
      camera: this.cameraService.fetchCameraById(item.recording.camera_id),
      assignee: this.assigneeService.fetchAllAssignees().pipe(
        map(assignees => {
          const assignee = assignees.find(assignee => assignee.id === item.recording.assignee_id);
          if (!assignee) {
            throw new Error(`Assignee with ID ${item.recording.assignee_id} not found.`);
          }
          return assignee;
        })
      )
    });
  }

  /**
  * Fetches detection types from the server, with caching to avoid redundant requests.
  * @returns An Observable that emits an array of DetectionTypeItem objects.
  */
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

  /**
  * Stops a detection instance by sending a stop request to the server.
  * @param instanceId The ID of the detection instance to stop.
  * @returns An Observable that emits the server's response.
  */
  stopDetectionInstance(instanceId?: number): Observable<any> {
    const apiUrl = `${environment.apiUrl}${API_ENDPOINTS.detection}/stop/${instanceId}`;
    return this.http.post(apiUrl, {});
  }

  /**
   * Maps the server response to a DetectionInstanceItem object.
   * @param item The detection instance data from the server.
   * @param detectionType The detection type associated with the detection instance.
   * @param zone The zone associated with the detection instance.
   * @param camera The camera associated with the detection instance.
   * @param assignee The assignee associated with the detection instance.
   * @returns A DetectionInstanceItem object representing the detection instance.
   */
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
      confidenceTheshold: item.recording.confidence,
      detectionType: detectionType,
      classesDetection: item.scenarios ?? undefined,
      starttime: item.recording.starttime,
      cameraId: item.recording.camera_id,
      zone: zone ?? undefined,  // Default to undefined if not provided
      camera: camera ?? undefined,  // Default to undefined if not provided
      assignee: assignee ?? undefined  // Default to undefined if not provided
    };
  }


  //TODO: There's no API endpoint
  deleteDetectionInstance(zoneId?: number): Observable<boolean> {
    return of(true);
  }
}
