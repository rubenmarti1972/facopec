/**
 * Application Routes Configuration
 * Defines all routes with lazy loading and protection
 */

import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: '',
    redirectTo: '/inicio',
    pathMatch: 'full'
  },
  {
    path: 'inicio',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
    data: { title: 'Inicio - Fundación Afrocolombiana Pro Encasa' }
  },
  {
    path: 'proyectos',
    loadComponent: () => import('./features/projects/projects.component').then(m => m.ProjectsComponent),
    data: { title: 'Proyectos - Fundación Afrocolombiana Pro Encasa' }
  },
  {
    path: 'programas',
    loadComponent: () => import('./features/programs/programs.component').then(m => m.ProgramsComponent),
    data: { title: 'Programas - Fundación Afrocolombiana Pro Encasa' }
  },
  {
    path: 'reportes',
    loadComponent: () => import('./features/reports/reports.component').then(m => m.ReportsComponent),
    data: { title: 'Reportes - Fundación Afrocolombiana Pro Encasa' }
  },
  {
    path: 'apadrina',
    loadComponent: () => import('./features/sponsor/sponsor.component').then(m => m.SponsorComponent),
    data: { title: 'Apadrinamiento - Fundación Afrocolombiana Pro Encasa' }
  },
  {
    path: 'nosotros',
    loadComponent: () => import('./features/about/about.component').then(m => m.AboutComponent),
    data: { title: 'Nosotros - Fundación Afrocolombiana Pro Encasa' }
  },
  {
    path: 'becas',
    loadComponent: () => import('./features/grants/grants.component').then(m => m.GrantsComponent),
    data: { title: 'Becas - Fundación Afrocolombiana Pro Encasa' }
  },
  {
    path: 'ruta-literaria-maria',
    loadComponent: () => import('./features/literary-route/literary-route.component').then(m => m.LiteraryRouteComponent),
    data: { title: 'Ruta Literaria María - Fundación Afrocolombiana Pro Encasa' }
  },
  {
    path: 'cuenta',
    loadComponent: () => import('./features/account/account.component').then(m => m.AccountComponent),
    data: { title: 'Cuenta - Fundación Afrocolombiana Pro Encasa' }
  },
  {
    path: 'periodico',
    loadComponent: () => import('./features/newspaper/newspaper.component').then(m => m.NewspaperComponent),
    data: { title: 'Periódico - Fundación Afrocolombiana Pro Encasa' }
  },
  {
    path: 'donaciones',
    loadComponent: () => import('./features/donate/donate.component').then(m => m.DonateComponent),
    data: { title: 'Donaciones - Fundación Afrocolombiana Pro Encasa' }
  },
  {
    path: 'contactanos',
    loadComponent: () => import('./features/contact/contact.component').then(m => m.ContactComponent),
    data: { title: 'Contáctanos - Fundación Afrocolombiana Pro Encasa' }
  },
  {
    path: 'admin', loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES),
    canActivate: [] // Add AuthGuard with admin role check
  },
  // Rutas en inglés - redirecciones por compatibilidad
  { path: 'home', redirectTo: '/inicio', pathMatch: 'full' },
  { path: 'projects', redirectTo: '/proyectos', pathMatch: 'full' },
  { path: 'reports', redirectTo: '/reportes', pathMatch: 'full' },
  { path: 'sponsor', redirectTo: '/apadrina', pathMatch: 'full' },
  { path: 'about', redirectTo: '/nosotros', pathMatch: 'full' },
  { path: 'grants', redirectTo: '/becas', pathMatch: 'full' },
  { path: 'literary-route', redirectTo: '/ruta-literaria-maria', pathMatch: 'full' },
  { path: 'account', redirectTo: '/cuenta', pathMatch: 'full' },
  { path: 'newspaper', redirectTo: '/periodico', pathMatch: 'full' },
  { path: 'donate', redirectTo: '/donaciones', pathMatch: 'full' },
  { path: 'contact', redirectTo: '/contactanos', pathMatch: 'full' },
  { path: 'contacto', redirectTo: '/contactanos', pathMatch: 'full' },
  {
    path: '**',
    redirectTo: '/inicio'
  }
];
