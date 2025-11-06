/**
 * Application Routes Configuration
 * Defines all routes with lazy loading and protection
 */

import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
    data: { title: 'Home - Fundación Afrocolombiana Pro Encasa' }
  },
  {
    path: 'projects',
    loadComponent: () => import('./features/projects/projects.component').then(m => m.ProjectsComponent),
    data: { title: 'Projects - Fundación Afrocolombiana Pro Encasa' }
  },
  {
    path: 'reports',
    loadComponent: () => import('./features/reports/reports.component').then(m => m.ReportsComponent),
    data: { title: 'Reports - Fundación Afrocolombiana Pro Encasa' }
  },
  {
    path: 'sponsor',
    loadComponent: () => import('./features/sponsor/sponsor.component').then(m => m.SponsorComponent),
    data: { title: 'Sponsorship - Fundación Afrocolombiana Pro Encasa' }
  },
  {
    path: 'about',
    loadComponent: () => import('./features/about/about.component').then(m => m.AboutComponent),
    data: { title: 'About Us - Fundación Afrocolombiana Pro Encasa' }
  },
  {
    path: 'grants',
    loadComponent: () => import('./features/grants/grants.component').then(m => m.GrantsComponent),
    data: { title: 'Grants - Fundación Afrocolombiana Pro Encasa' }
  },
  {
    path: 'literary-route',
    loadComponent: () => import('./features/literary-route/literary-route.component').then(m => m.LiteraryRouteComponent),
    data: { title: 'Literary Route María - Fundación Afrocolombiana Pro Encasa' }
  },
  {
    path: 'account',
    loadComponent: () => import('./features/account/account.component').then(m => m.AccountComponent),
    data: { title: 'Account - Fundación Afrocolombiana Pro Encasa' }
  },
  {
    path: 'newspaper',
    loadComponent: () => import('./features/newspaper/newspaper.component').then(m => m.NewspaperComponent),
    data: { title: 'Newspaper - Fundación Afrocolombiana Pro Encasa' }
  },
  {
    path: 'donate',
    loadComponent: () => import('./features/donate/donate.component').then(m => m.DonateComponent),
    data: { title: 'Donate - Fundación Afrocolombiana Pro Encasa' }
  },
  {
    path: 'admin', loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES),
    canActivate: [] // Add AuthGuard with admin role check
  },
  {
    path: '**',
    redirectTo: '/home'
  }
];
