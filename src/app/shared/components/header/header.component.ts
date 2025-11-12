/**
 * Header and Navigation Component
 * Displays main navigation tabs and branding
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { BRAND_COLORS } from '@core/design-system/brand-colors';

interface NavigationItem {
  id: string;
  label: string;
  route: string;
  icon?: string;
  description: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  brandColors = BRAND_COLORS;

  /** Estado del menú móvil */
  private _mobileMenuOpen = false;
  /** Ruta actual (para lógica adicional si la necesitas) */
  currentRoute = '';

  /** Si en algún lugar usas este arreglo, lo dejo; el HTML actual usa routerLink directo */
  navigationItems: NavigationItem[] = [
    { id: 'home',      label: 'INICIO',                 route: '/inicio',                 description: 'Página de inicio' },
    { id: 'projects',  label: 'PROYECTOS',              route: '/proyectos',              description: 'Nuestros proyectos' },
    { id: 'donations', label: 'DONACIONES',             route: '/donaciones',             description: 'Apoya nuestra misión' },
    { id: 'sponsor',   label: 'APADRINA',               route: '/apadrina',               description: 'Programa de apadrinamiento' },
    { id: 'literary',  label: 'RUTA LITERARIA MARÍA',   route: '/ruta-literaria-maria',   description: 'Iniciativa literaria' },
    { id: 'about',     label: 'NOSOTROS',               route: '/nosotros',               description: 'Información de la fundación' },
  ];

  private sub?: Subscription;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Captura la ruta inicial
    this.currentRoute = this.router.url;

    // Actualiza currentRoute en cada navegación (útil si usas isActive personalizado)
    this.sub = this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.currentRoute = e.urlAfterRedirects || e.url;
        this._mobileMenuOpen = false; // cierra menú al navegar
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  /** === Métodos que el HTML espera === */

  /** Botón hamburguesa */
  toggleMenu(): void {
    this._mobileMenuOpen = !this._mobileMenuOpen;
  }

  /** Cerrar menú móvil (al hacer click en una opción) */
  closeMenu(): void {
    this._mobileMenuOpen = false;
  }

  /** Usado en *ngIf="menuOpen()" */
  menuOpen(): boolean {
    return this._mobileMenuOpen;
  }

  /** Navegación programática si la necesitas desde TS */
  navigate(route: string): void {
    this.router.navigate([route]);
    this.closeMenu();
  }

  /** Utilidad: check activo (si prefieres en vez de routerLinkActive) */
  isActive(route: string): boolean {
    return this.currentRoute === route || this.currentRoute.startsWith(route + '/');
  }
}
