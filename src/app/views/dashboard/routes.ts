import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard-list/dashboard-list.component').then(m => m.DashboardListComponent),
    data: {
      title: `Dashboard`
    }
  },
  {
    path: 'plants/:id',
    loadComponent: () => import('./dashboard-details/dashboard-details.component').then(m => m.DashboardDetailsComponent),
    data: {
      title: 'Dashboard Details'
    }
  }
];

