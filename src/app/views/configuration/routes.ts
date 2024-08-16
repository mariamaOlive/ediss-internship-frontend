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
    path: 'plants/:plantId/zone/:zoneId',
    loadComponent: () => import('./zone/zone.component').then(m => m.ZoneComponent),
    data: {
      title: 'Zone Details'
    }
  },
  {
    path: 'plants/:plantId/add-zone',
    loadComponent: () => import('./add-zone/add-zone.component').then(m => m.AddZoneComponent),
    data: {
      title: 'Zone Details'
    }
  }
];

