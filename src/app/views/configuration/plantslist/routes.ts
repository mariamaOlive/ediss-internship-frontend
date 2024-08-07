import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./plantslist.component').then(m => m.PlantslistComponent),
    data: {
      title: `Configuration`
    }
  }
];

