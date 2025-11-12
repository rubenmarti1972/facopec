/**
 * Header and Navigation Component
 * Displays main navigation tabs and branding
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { BRAND_COLORS } from '@core/design-system/brand-colors';
import { StrapiService } from '@core/services/strapi.service';
import { NavigationEntry } from '@core/models';

/**
 * Interfaz legacy para backward compatibility
 * @deprecated Usa NavigationEntry en su lugar
 */
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

  /** Items de navegación cargados desde el backend */
  navigationItems: NavigationEntry[] = [];

  /** Navegación por defecto (fallback si no hay datos del backend) */
  private readonly defaultNavigationItems: NavigationItem[] = [
    { id: 'home',      label: 'INICIO',                 route: '/inicio',                 description: 'Página de inicio' },
    { id: 'projects',  label: 'PROYECTOS',              route: '/proyectos',              description: 'Nuestros proyectos' },
    { id: 'donations', label: 'DONACIONES',             route: '/donaciones',             description: 'Apoya nuestra misión' },
    { id: 'sponsor',   label: 'APADRINA',               route: '/apadrina',               description: 'Programa de apadrinamiento' },
    { id: 'literary',  label: 'RUTA LITERARIA MARÍA',   route: '/ruta-literaria-maria',   description: 'Iniciativa literaria' },
    { id: 'about',     label: 'NOSOTROS',               route: '/nosotros',               description: 'Información de la fundación' },
  ];

  /** Estado de submenú abierto (para desktop dropdowns) */
  activeSubmenuId: string | null = null;

  private sub?: Subscription;

  constructor(
    private router: Router,
    private strapiService: StrapiService
  ) {}

  ngOnInit(): void {
    // Captura la ruta inicial
    this.currentRoute = this.router.url;

    // Cargar navegación desde el backend
    this.loadNavigationFromBackend();

    // Actualiza currentRoute en cada navegación (útil si usas isActive personalizado)
    this.sub = this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.currentRoute = e.urlAfterRedirects || e.url;
        this._mobileMenuOpen = false; // cierra menú al navegar
        this.activeSubmenuId = null; // cierra submenú al navegar
      }
    });
  }

  /**
   * Carga la navegación desde el backend de Strapi
   * Si falla o no hay datos, usa la navegación por defecto
   */
  private loadNavigationFromBackend(): void {
    this.strapiService.getGlobalSettings().subscribe({
      next: (settings) => {
        if (settings.navigation && settings.navigation.length > 0) {
          // Ordenar por el campo order si existe
          this.navigationItems = settings.navigation.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        } else {
          // Fallback a navegación por defecto
          this.navigationItems = this.convertLegacyToNavigationEntry(this.defaultNavigationItems);
        }
      },
      error: (err) => {
        console.warn('Error cargando navegación desde el backend, usando navegación por defecto:', err);
        // Fallback a navegación por defecto
        this.navigationItems = this.convertLegacyToNavigationEntry(this.defaultNavigationItems);
      }
    });
  }

  /**
   * Convierte items legacy a NavigationEntry para backward compatibility
   */
  private convertLegacyToNavigationEntry(items: NavigationItem[]): NavigationEntry[] {
    return items.map((item, index) => ({
      id: index,
      label: item.label,
      url: item.route,
      description: item.description,
      icon: item.icon,
      order: index,
      exact: item.id === 'home', // Solo home es exact
      dataUid: item.id
    }));
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

  /** Alternar submenú (para desktop dropdowns) */
  toggleSubmenu(itemId: string | number | undefined): void {
    const id = itemId?.toString() ?? null;
    this.activeSubmenuId = this.activeSubmenuId === id ? null : id;
  }

  /** Verificar si un submenú está abierto */
  isSubmenuOpen(itemId: string | number | undefined): boolean {
    return this.activeSubmenuId === itemId?.toString();
  }

  /** Cerrar todos los submenús */
  closeAllSubmenus(): void {
    this.activeSubmenuId = null;
  }

  /** Navegación para items con fragment */
  navigateWithFragment(url: string | undefined, fragment: string | undefined): void {
    if (!url) return;

    if (fragment) {
      this.router.navigate([url], { fragment });
    } else {
      this.router.navigate([url]);
    }

    this.closeMenu();
    this.closeAllSubmenus();
  }

  /** Obtener URL completa para un item de navegación */
  getNavigationUrl(item: NavigationEntry): string {
    return item.url || '#';
  }

  /** Verificar si un item tiene hijos */
  hasChildren(item: NavigationEntry): boolean {
    return !!item.children && item.children.length > 0;
  }
}
