import { ScenarioItem } from './scenario.model'

// ========================
// Plant Requests
// ========================

export interface PlantUpdateRequest {
  plantConfidence: number;
}


// ========================
// Zone Requests
// ========================
export interface CameraZoneCreateRequest {
  name: string;
  description: string;
  ipaddress: string;
}

export interface ZoneCreateRequest {
  title: string;
  description: string;
  plant_id: number;
  cameras: CameraZoneCreateRequest[];  
  assignee_id: number;
  zoneconfidence: number;
}

// ========================
// Detection instance Requests
// ========================

export interface Recording {
  id?: number;
  name: string;
  zone_id: number;
  assignee_id?: number;
  detection_type_id: number;
  starttime: string; 
  endtime?: string;    
  status?: boolean;
  confidence: number;
  task_id?: string;
  camera_id: number;
}


export interface CreateRecording {
  name: string;
  zone_id: number;
  assignee_id: number;
  detection_type: number; 
  status?: boolean;
  confidence: number;
  camera_id: number;
}

export interface DetectionInstanceRequest {
  recording: Recording;
  scenarios: ScenarioItem[];
}
export interface CreateDetectionInstanceRequest {
  recording: CreateRecording;
  scenarios: ScenarioItem[];
}

