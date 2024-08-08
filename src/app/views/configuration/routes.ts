import { Routes } from '@angular/router';
import { Page500Component } from '../pages/page500/page500.component';
import { PlantslistComponent } from './plantslist/plantslist.component';

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
    loadComponent: () => import('./plantslist/zonelist/zonelist.component').then(m => m.ZonelistComponent),
    data: {
      title: 'User Detail'
    }
  }
];

