import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./plants-list/plants-list.component').then(m => m.PlantsListComponent),
    data: {
      title: `New Detection`
    }
  }
  ,
  {
    path: 'plants/:id',
    loadComponent: () => import('./zones-list/zones-list.component').then(m => m.ZonesListComponent),
    data: {
      title: 'Zones'
    }
  },
  {
    path: 'plants/:plantId/zones/:zoneId',
    loadComponent: () => import('./detection-instance-list/detection-instance-list.component').then(m => m.DetectionInstanceListComponent),
    data: {
      title: 'Detection Instance List'
    }
  },
  {
    path: 'plants/:plantId/zones/:zoneId/detection-instance/:detectionId',
    loadComponent: () => import('./detection-instance/detection-instance.component').then(m => m.DetectionInstanceComponent),
    data: {
      title: 'Detection Instance Details'
    }
  },
  {
    path: 'plants/:plantId/zones/:zoneId/add-detection-instance',
    loadComponent: () => import('./add-detection-instance/add-detection-instance.component').then(m => m.AddDetectionInstanceComponent),
    data: {
      title: 'Add Detection Instance'
    }
  }
];

