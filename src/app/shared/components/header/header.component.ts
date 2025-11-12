/**
 * Header and Navigation Component
 * Consumes Strapi global settings to build the public navigation
 */

import { Component, OnDestroy, OnInit, inject } from '@angular/core';
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
  routerLink?: string;
  href?: string;
  fragment?: string;
  target?: '_self' | '_blank';
  exact?: boolean;
  icon?: string;
  description?: string;
  dataStrapiUid?: string;
  children?: NavigationGroupView[];
}

interface PrimaryCtaLink {
  label: string;
  routerLink?: string;
  href?: string;
  target?: '_self' | '_blank';
  dataStrapiUid: string;
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
  private readonly strapiService = inject(StrapiService);

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

    this.loadNavigation();
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

  toggleMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    if (!this.mobileMenuOpen) {
      this.dropdownIndex = null;
    }
  }

  closeMenu(): void {
    this.mobileMenuOpen = false;
    this.dropdownIndex = null;
  }

  menuOpen(): boolean {
    return this.mobileMenuOpen;
  }

  toggleDropdown(index: number, event: Event): void {
    event.preventDefault();
    if (this.dropdownIndex === index) {
      this.dropdownIndex = null;
    } else {
      this.dropdownIndex = index;
    }
  }

  openDropdown(index: number): void {
    if (this.mobileMenuOpen) {
      return;
    }
    this.dropdownIndex = index;
  }

  closeDropdown(index?: number): void {
    if (this.mobileMenuOpen) {
      return;
    }
    if (index === undefined || this.dropdownIndex === index) {
      this.dropdownIndex = null;
    }
  }

  isDropdownOpen(index: number): boolean {
    return this.dropdownIndex === index;
  }

  isExternalHref(href?: string | null, target?: string | null): boolean {
    if (!href) {
      return target === '_blank';
    }
    return /^https?:\/\//i.test(href);
  }

  isActive(item: NavigationItemView): boolean {
    if (item.routerLink) {
      const normalizedRoute = item.routerLink.endsWith('/') ? item.routerLink.slice(0, -1) : item.routerLink;
      const current = this.currentRoute.endsWith('/') ? this.currentRoute.slice(0, -1) : this.currentRoute;
      if (item.exact) {
        return current === normalizedRoute;
      }
      return current.startsWith(normalizedRoute);
    }
    return false;
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
      const mapped = this.mapNavigation(settings.navigation);
      if (mapped.length) {
        this.navigationItems = mapped;

        const donateEntry = mapped.find(item =>
          ['navigation.donate', 'navigation.donations'].includes(item.dataStrapiUid ?? '')
        );

        if (donateEntry) {
          this.cta = {
            label: donateEntry.label,
            routerLink: donateEntry.routerLink,
            href: donateEntry.href,
            target: donateEntry.target,
            dataStrapiUid: donateEntry.dataStrapiUid ?? 'navigation.donate'
          } satisfies PrimaryCtaLink;
        }
      }
    }

    if (settings.siteName) {
      const [primary, secondary] = settings.siteName.split('|').map(part => part.trim()).filter(Boolean);
      this.siteNamePrimary = primary ?? this.siteNamePrimary;
      this.siteNameSecondary = secondary ?? '';
    }

    const mediaUrl = this.strapiService.buildMediaUrl(settings.logo);
    if (mediaUrl) {
      this.logoUrl = mediaUrl;
      this.logoAlt = settings.logo?.alternativeText ?? settings.logo?.caption ?? this.logoAlt;
    }

    this.loading = false;
  }

  private mapNavigation(entries: NavigationEntry[]): NavigationItemView[] {
    return entries
      .slice()
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((entry, index) => {
        const id = entry.dataUid ?? `nav-${index}`;
        const link = this.normalizeLink(entry.url, entry.fragment, entry.target);
        const children = this.mapGroups(entry.children);
        return {
          id,
          label: entry.label ?? id,
          routerLink: link.routerLink,
          href: link.href,
          fragment: link.fragment,
          target: link.target,
          exact: entry.exact ?? false,
          icon: entry.icon ?? undefined,
          description: entry.description ?? undefined,
          dataStrapiUid: entry.dataUid ?? undefined,
          children
        } satisfies NavigationItemView;
      })
      .filter(item => !!item.label && (item.routerLink || item.href || item.children?.length));
  }

  private mapGroups(groups?: NavigationGroup[] | null): NavigationGroupView[] | undefined {
    if (!groups?.length) {
      return undefined;
    }

    const mapped = groups
      .map(group => {
        const items = this.mapChildLinks(group.items);
        if (!items.length) {
          return undefined;
        }
        const entry: NavigationGroupView = {
          title: group.title ?? undefined,
          dataStrapiUid: group.dataUid ?? undefined,
          items
        };
        return entry;
      })
      .filter((group): group is NavigationGroupView => !!group);

    return mapped.length ? mapped : undefined;
  }

  private mapChildLinks(items?: NavigationChildLink[] | null): NavigationChildView[] {
    if (!items?.length) {
      return [];
    }

    return items
      .map(item => {
        const link = this.normalizeLink(item.url, item.fragment, item.target);
        return {
          label: item.label,
          routerLink: link.routerLink,
          href: link.href,
          fragment: link.fragment,
          target: link.target,
          dataStrapiUid: item.dataUid ?? undefined
        } satisfies NavigationChildView;
      })
      .filter(child => !!child.label && (child.routerLink || child.href));
  }

  private coerceTarget(target?: string | null): '_self' | '_blank' | undefined {
    if (target === '_blank' || target === '_self') {
      return target;
    }
    return undefined;
  }

  private normalizeLink(
    url?: string | null,
    fragment?: string | null,
    target?: string | null
  ): { routerLink?: string; href?: string; fragment?: string; target?: '_self' | '_blank' } {
    const normalizedTarget = this.coerceTarget(target);

    if (!url) {
      return normalizedTarget ? { target: normalizedTarget } : {};
    }

    const trimmed = url.trim();
    const isAbsolute = /^https?:\/\//i.test(trimmed);
    const hasHash = trimmed.includes('#');
    const [pathPart, hashPart] = hasHash ? trimmed.split('#', 2) : [trimmed, undefined];
    const resolvedFragment = fragment ?? hashPart ?? undefined;
    const resolvedTarget = normalizedTarget ?? (isAbsolute ? '_blank' : undefined);

    if (isAbsolute) {
      return {
        href: trimmed,
        fragment: resolvedFragment,
        target: resolvedTarget
      };
    }

    if (trimmed.startsWith('/')) {
      const result: { routerLink: string; fragment?: string; target?: '_self' | '_blank' } = {
        routerLink: pathPart || '/'
      };
      if (resolvedFragment) {
        result.fragment = resolvedFragment;
      }
      if (resolvedTarget) {
        result.target = resolvedTarget;
      }
      return result;
    }

    if (trimmed.startsWith('#')) {
      const result: { routerLink: string; fragment?: string; target?: '_self' | '_blank' } = {
        routerLink: '/'
      };
      result.fragment = trimmed.slice(1);
      if (resolvedTarget) {
        result.target = resolvedTarget;
      }
      return result;
    }

    const result: { href: string; fragment?: string; target?: '_self' | '_blank' } = {
      href: trimmed
    };
    if (resolvedFragment) {
      result.fragment = resolvedFragment;
    }
    if (resolvedTarget) {
      result.target = resolvedTarget;
    }
    return result;
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
