import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./presentations/components/layout/guest/guest.component').then((m) => m.GuestComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./presentations/pages/general/login/login.component').then((m) => m.LoginComponent),
      },
      {
        path: 'sign-up',
        loadComponent: () => import('./presentations/pages/general/sign-up/sign-up.component').then((m) => m.SignUpComponent),
      }
    ]
  },
  {
    path: 'admin',
    loadComponent: () => import('./presentations/components/layout/admin/admin.component').then((m) => m.AdminComponent),
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadComponent: () => import('./presentations/pages/admin/home/home.component').then((m) => m.HomeComponent),
        canActivate: [AuthGuard],
        data: { roles: ['admin'] },
        title: 'Dashboard'
      },
      {
        path: 'users',
        loadComponent: () => import('./presentations/pages/admin/users/users.component').then((m) => m.UsersComponent),
        canActivate: [AuthGuard],
        data: { roles: ['admin'] },
        title: 'Users'
      }
    ]
  },
  {
    path: 'amazone',
    loadComponent: () => import('./presentations/components/layout/amazone/amazone.component').then((m) => m.AmazoneComponent),
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadComponent: () => import('./presentations/pages/amazone/home/home.component').then((m) => m.HomeComponent),
        canActivate: [AuthGuard],
        data: { roles: ['amazone'] },
        title: 'Dashboard'
      },
      {
        path: 'simulation/add',
        loadComponent: () => import('./presentations/pages/amazone/simulations/add/add.component').then((m) => m.AddComponent),
        canActivate: [AuthGuard],
        data: { roles: ['amazone'] },
        title: 'Simulation'
      },
      {
        path: 'simulation/list',
        loadComponent: () => import('./presentations/pages/amazone/simulations/list/list.component').then((m) => m.ListComponent),
        canActivate: [AuthGuard],
        data: { roles: ['amazone'] },
        title: 'Simulation'
      },
      {
        path: 'subscription/add',
        loadComponent: () => import('./presentations/pages/amazone/souscriptions/add/add.component').then((m) => m.AddComponent),
        canActivate: [AuthGuard],
        data: { roles: ['amazone'] },
        title: 'Souscription'

      },
      {
        path: 'subscription/list',
        loadComponent: () => import('./presentations/pages/amazone/souscriptions/list/list.component').then((m) => m.ListComponent),
        canActivate: [AuthGuard],
        data: { roles: ['amazone'] },
        title: 'Souscription'

      },
    ]
  },
  {
    path: '**',
    loadComponent: () => import('./presentations/pages/general/not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
];
