import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./plantslist/plantslist.component').then(m => m.PlantslistComponent),
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
    loadComponent: () => import('./add-detection-instance/add-zone.component').then(m => m.AddZoneComponent),
    data: {
      title: 'Add Detection Instance'
    }
  }
];

