import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./plants-list/plants-list.component').then(m => m.PlantsListComponent),
    data: {
      title: `Configuration`
    }
  }
  ,
  {
    path: 'plants/:id',
    loadComponent: () => import('./detection-instance-list/detection-instance-list.component').then(m => m.DetectionInstanceListComponent),
    data: {
      title: 'Plants'
    }
  },
  {
    path: 'plants/:plantId/detection-instance/:detectionId',
    loadComponent: () => import('./detection-instance/detection-instance.component').then(m => m.DetectionInstanceComponent),
    data: {
      title: 'Detection Instance Details'
    }
  },
  {
    path: 'plants/:plantId/add-detection-instance',
    loadComponent: () => import('./add-detection-instance/add-detection-instance.component').then(m => m.AddDetectionInstanceComponent),
    data: {
      title: 'Add Detection Instance'
    }
  }
];

