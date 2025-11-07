/**
 * Header and Navigation Component
 * Displays main navigation tabs and branding
 */

import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { BRAND_COLORS } from '@core/design-system/brand-colors';
import { StrapiService } from '@core/services/strapi.service';
import { GlobalSettings } from '@core/models';

interface NavigationItem {
  id: string;
  label: string;
  route: string;
  icon?: string;
  description: string;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
  // Si este componente fuera standalone, agrega:
  // standalone: true,
  // imports: [CommonModule, RouterModule],
})
export class HeaderComponent implements OnInit, OnDestroy {
  brandColors = BRAND_COLORS;
  private readonly strapiService = inject(StrapiService);

  /** Estado del menú móvil */
  private _mobileMenuOpen = false;
  /** Ruta actual (para lógica adicional si la necesitas) */
  currentRoute = '';

  loading = true;
  error: string | null = null;

  /** Si en algún lugar usas este arreglo, lo dejo; el HTML actual usa routerLink directo */
  navigationItems: NavigationItem[] = [
    { id: 'home',      label: 'INICIO',                 route: '/inicio',                 description: 'Página de inicio' },
    { id: 'projects',  label: 'PROYECTOS',              route: '/proyectos',              description: 'Nuestros proyectos' },
    { id: 'donations', label: 'DONACIONES',             route: '/donaciones',             description: 'Apoya nuestra misión' },
    { id: 'sponsor',   label: 'APADRINA',               route: '/apadrina',               description: 'Programa de apadrinamiento' },
    { id: 'literary',  label: 'RUTA LITERARIA MARÍA',   route: '/ruta-literaria-maria',   description: 'Iniciativa literaria' },
    { id: 'about',     label: 'NOSOTROS',               route: '/nosotros',               description: 'Información de la fundación' },
  ];

  logoUrl = 'assets/logo.png';
  logoAlt = 'Logo FACOPEC';
  siteNamePrimary = 'Fundación Afrocolombiana';
  siteNameSecondary = 'Profe en Casa';

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

    this.loadNavigation();
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

  private loadNavigation(): void {
    this.strapiService.getGlobalSettings().subscribe({
      next: settings => this.applyNavigation(settings),
      error: error => {
        console.error('Error loading navigation from Strapi', error);
        this.error = error instanceof Error ? error.message : 'No se pudo cargar la navegación dinámica.';
        this.loading = false;
      }
    });
  }

  private applyNavigation(settings: GlobalSettings): void {
    if (settings.navigation?.length) {
      const mapped = settings.navigation
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((item, index) => ({
          id: item.label?.toLowerCase().replace(/\s+/g, '-') || `nav-${index}`,
          label: item.label,
          route: item.url,
          description: item.description ?? '',
          icon: item.icon ?? '🔹'
        }))
        .filter(item => !!item.label && !!item.route);

      if (mapped.length) {
        this.navigationItems = mapped;
      }
    }

    if (settings.siteName) {
      const parts = settings.siteName.split('|').map(part => part.trim()).filter(Boolean);
      if (parts.length >= 2) {
        [this.siteNamePrimary, this.siteNameSecondary] = [parts[0], parts[1]];
      } else {
        this.siteNamePrimary = settings.siteName;
        this.siteNameSecondary = '';
      }
    }

    const mediaUrl = this.strapiService.buildMediaUrl(settings.logo);
    if (mediaUrl) {
      this.logoUrl = mediaUrl;
      this.logoAlt = settings.logo?.alternativeText ?? settings.logo?.caption ?? this.logoAlt;
    }

    this.loading = false;
  }

  isExternalLink(route: string): boolean {
    return /^https?:\/\//i.test(route);
  }
}
