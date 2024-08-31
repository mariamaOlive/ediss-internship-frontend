import { AssigneeItem } from '../models/assignee.model';
import { CameraItem } from '../models/camera.model';
import { DetectionInstanceItem, DetectionTypeItem } from '../models/detection-instance.model';
import { PlantItem } from '../models/plant.model';
import { ZoneItem } from '../models/zone.model';
import { CreateDetectionInstanceRequest, DetectionInstanceRequest, ZoneCreateRequest } from '../models/api-requests.model';
import { ScenarioItem } from '../models/scenario.model';

// Mock data for AssigneeItem
export const mockAssignees: AssigneeItem[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '123-456-7890'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '098-765-4321'
  },
  {
    id: 3,
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    phone: '555-555-5555'
  }
];


export const mockPlantsActive: PlantItem[] = [
  {
    id: 1,
    name: 'Aptar Plant 1',
    address: '123 Main St, Springfield, IL',
    plantConfidence: 85,
    plantstatus: true,
  },
  {
    id: 2,
    name: 'Aptar Plant 2',
    address: '456 Oak Ave, Metropolis, NY',
    plantConfidence: 90,
    plantstatus: true,
  },
  {
    id: 5,
    name: 'Aptar Plant 5',
    address: '456 Oak Ave, Metropolis, NY',
    plantConfidence: 92,
    plantstatus: true,
  }
];


export const mockPlantsInactive: PlantItem[] = [
  {
    id: 3,
    name: 'Aptar Plant 3',
    address: '789 Maple Dr, Gotham, NJ',
    plantConfidence: 75,
    plantstatus: false,
  },
  {
    id: 4,
    name: 'Aptar Plant 4',
    address: '101 Pine Ln, Star City, CA',
    plantConfidence: 65,
    plantstatus: true,
  }
]

export const mockCamera: CameraItem[] = [
  { name: "Camera 1", id: 1, ipaddress: "187.20.135.197" },
  { name: "Camera 2", id: 2, ipaddress: "187.20.135.199" },
  { name: "Camera 3", id: 3, ipaddress: "187.20.135.200" },
  { name: "Camera 4", id: 4, ipaddress: "187.20.135.201" },
  { name: "Camera 5", id: 5, ipaddress: "187.20.135.202" }
];


export const mockZones: ZoneItem[] = [{
  id: 1,
  title: 'Zone 1',
  description: 'This is the first test zone',
  plant_id: 101,
  cameras: [
    {
      id: 1,
      name: 'Camera 1',
      ipaddress: '192.168.1.101'
    },
    {
      id: 2,
      name: 'Camera 2',
      ipaddress: '192.168.1.102'
    }
  ],
  assignee_id: 201,
  zoneconfidence: 90,
  zonestatus: 'active'
},
{
  id: 2,
  title: 'Zone 2',
  description: 'This is the second test zone',
  plant_id: 102,
  cameras: [
    {
      id: 3,
      name: 'Camera 3',
      ipaddress: '192.168.2.101'
    }
  ],
  assignee_id: 202,
  zoneconfidence: 85,
  zonestatus: 'inactive'
},
{
  id: 3,
  title: 'Zone 3',
  description: 'This is the third test zone',
  plant_id: 103,
  cameras: [],
  assignee_id: 203,
  zoneconfidence: 75,
  zonestatus: 'active'
}
];


export const mockZoneRequest: ZoneCreateRequest = {
  title: 'New Zone',
  plant_id: 1,
  cameras: [{
    name: 'Camera 3',
    ipaddress: '192.168.2.101',
    description: ""
  }],
  assignee_id: 2,
  zoneconfidence: 85,
  description: 'Test Zone',
  status: 'active'
};


export const mockScenarios: ScenarioItem[] = [
  {
    id: 1,
    name: 'Vest',
    description: 'Detection of safety vests in the area.'
  },
  {
    id: 2,
    name: 'Helmet',
    description: 'Detection of safety helmets on personnel.'
  },
  {
    id: 3,
    name: 'Mask',
    description: 'Detection of protective masks on workers.'
  },
  {
    id: 4,
    name: 'Goggles',
    description: 'Detection of safety goggles for eye protection.'
  },
  {
    id: 5,
    name: 'Hairnet',
    description: 'Detection of hairnets in areas where they are required.'
  },
  {
    id: 6,
    name: 'Earplugs',
    description: 'Detection of earplugs for hearing protection in noisy environments.'
  }
];


export const mockDetectionTypes: DetectionTypeItem[] = [
  { id: 1, name: 'PPE Detection', description: 'Detects PPE like helmets, vests, etc.' },
  { id: 2, name: 'Intrusion Detection', description: 'Detects unauthorized intrusions.' },
  { id: 3, name: 'Fire Detection', description: 'Detects fire or smoke in the area.' }
];


export const mockNewDetectionInstance: CreateDetectionInstanceRequest = {
  recording: {
    name: 'Test Instance',
    zone_id: 1,
    assignee_id: 2,
    confidence: 95,
    detection_type: 1,
    camera_id: 3,
    status: true
  },
  scenarios: [mockScenarios[0],mockScenarios[2]]
};

// Mock DetectionInstanceRequest, which will be transformed into DetectionInstanceItem by the service
export const mockDetectionInstanceRequests: DetectionInstanceRequest[] = [
  {
    recording: {
      id: 1,
      name: 'Detection 1',
      zone_id: 1,
      assignee_id: 1,
      detection_type_id: 1,
      starttime: '2023-08-29T08:00:00Z',
      confidence: 0.95,
      camera_id: 1,
      status: true
    },
    scenarios: [mockScenarios[0], mockScenarios[1]] // Vest and Helmet
  },
  {
    recording: {
      id: 2,
      name: 'Detection 2',
      zone_id: 1,
      assignee_id: 2,
      detection_type_id: 2,
      starttime: '2023-08-29T09:00:00Z',
      confidence: 0.90,
      camera_id: 2,
      status: true
    },
    scenarios: [mockScenarios[2]] // Mask
  }
];


export const mockDetectionInstances: DetectionInstanceItem[] = mockDetectionInstanceRequests.map(request => {
  const zone = mockZones.find(z => z.id === request.recording.zone_id);
  const assignee = mockAssignees.find(a => a.id === request.recording.assignee_id);
  const camera = mockCamera.find(c => c.id === request.recording.camera_id);
  const detectionType = mockDetectionTypes.find(dt => dt.id === request.recording.detection_type_id);

  return {
    id: request.recording.id,
    name: request.recording.name,
    zone: zone,
    detectionType: detectionType,
    confidenceTheshold: request.recording.confidence * 100,
    assignee: assignee,
    classesDetection: request.scenarios,
    camera: camera,
    isRunning: request.recording.status,
    starttime: request.recording.starttime,
    timeElapsed: undefined // Time elapsed can be calculated as needed
  };
});


