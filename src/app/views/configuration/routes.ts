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
    loadComponent: () => import('./zonelist/zonelist.component').then(m => m.ZonelistComponent),
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
  }
];

