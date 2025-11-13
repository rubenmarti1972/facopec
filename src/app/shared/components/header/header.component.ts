/**
 * Header and Navigation Component
 * Consumes Strapi global settings to build the public navigation
 */

import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { BRAND_COLORS } from '@core/design-system/brand-colors';
import { StrapiService } from '@core/services/strapi.service';
import { NavigationEntry, NavigationGroup, NavigationChildLink, GlobalSettings } from '@core/models';

/**
 * View model para items de navegación en el template
 */
interface NavigationItemView {
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

/**
 * View model para grupos de navegación (submenús)
 */
interface NavigationGroupView {
  title?: string;
  dataStrapiUid?: string;
  items: NavigationChildView[];
}

/**
 * View model para enlaces hijos en submenús
 */
interface NavigationChildView {
  label: string;
  routerLink?: string;
  href?: string;
  fragment?: string;
  target?: '_self' | '_blank';
  dataStrapiUid?: string;
}

/**
 * View model para el botón CTA principal
 */
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

  /** Estado del menú móvil */
  mobileMenuOpen = false;

  /** Ruta actual */
  currentRoute = '';

  /** Items de navegación procesados para la vista */
  navigationItems: NavigationItemView[] = [];

  /** Índice del dropdown activo (para desktop) */
  dropdownIndex: number | null = null;

  /** CTA principal (botón de donación) */
  cta?: PrimaryCtaLink;

  /** Logo y nombre del sitio */
  siteNamePrimary = 'Fundación Afrocolombiana';
  siteNameSecondary = 'Profe en Casa';
  logoUrl?: string;
  logoAlt = 'Logo FACOPEC';

  /** Estados de carga y error */
  loading = true;
  error?: string;

  private sub?: Subscription;

  constructor(
    private router: Router,
    private strapiService: StrapiService
  ) {}

  ngOnInit(): void {
    this.currentRoute = this.router.url;

    // Cargar navegación fallback primero (se muestra de inmediato)
    this.applyDefaultNavigation();

    // Intentar cargar navegación desde el backend (sobrescribe el fallback si tiene éxito)
    this.loadNavigation();

    // Actualiza currentRoute en cada navegación
    this.sub = this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.currentRoute = e.urlAfterRedirects || e.url;
        this.mobileMenuOpen = false;
        this.dropdownIndex = null;
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  /** === Métodos públicos para el template === */

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

  /** Verificar si un item tiene hijos */
  hasChildren(item: NavigationItemView): boolean {
    return !!item.children && item.children.length > 0;
  }

  /** Alternar submenú por ID (alternativa al índice numérico) */
  toggleSubmenu(itemId: string | undefined): void {
    const currentIndex = this.navigationItems.findIndex(item => item.id === itemId);
    if (currentIndex >= 0) {
      this.toggleDropdown(currentIndex, new Event('click'));
    }
  }

  /** Verificar si un submenú está abierto por ID */
  isSubmenuOpen(itemId: string | undefined): boolean {
    const index = this.navigationItems.findIndex(item => item.id === itemId);
    return index >= 0 && this.isDropdownOpen(index);
  }

  /** Cerrar todos los submenús */
  closeAllSubmenus(): void {
    this.dropdownIndex = null;
  }

  /** === Métodos privados === */

  /**
   * Aplicar navegación por defecto (fallback)
   * Se muestra inmediatamente incluso sin backend disponible
   */
  private applyDefaultNavigation(): void {
    this.navigationItems = [
      {
        id: 'nav-home',
        label: 'Inicio',
        routerLink: '/home',
        exact: true
      },
      {
        id: 'nav-programs',
        label: 'Programas',
        routerLink: '/home',
        fragment: 'programas',
        children: [
          {
            title: '💻 Innovación y Tecnología Educativa',
            items: [
              {
                label: 'Talleres de nivelación',
                href: 'https://talleresdenivelacion.blogspot.com/',
                target: '_blank'
              }
            ]
          },
          {
            title: '📚 Refuerzo Académico y Nivelación',
            items: [
              {
                label: 'Matemáticas básicas',
                href: 'https://matematicasbasicas.blogspot.com/',
                target: '_blank'
              },
              {
                label: 'Lectura crítica',
                href: 'https://lecturacritica.blogspot.com/',
                target: '_blank'
              },
              {
                label: 'Ciencias naturales',
                href: 'https://cienciasnaturales.blogspot.com/',
                target: '_blank'
              },
              {
                label: 'Ciencias sociales',
                href: 'https://cienciassociales.blogspot.com/',
                target: '_blank'
              },
              {
                label: 'Inglés básico',
                href: 'https://inglesbasico.blogspot.com/',
                target: '_blank'
              },
              {
                label: 'Refuerzo escolar',
                href: 'https://refuerzoescolar.blogspot.com/',
                target: '_blank'
              },
              {
                label: 'Pre-ICFES',
                href: 'https://preicfes.blogspot.com/',
                target: '_blank'
              },
              {
                label: 'Tutorías personalizadas',
                href: 'https://tutoriaspersonalizadas.blogspot.com/',
                target: '_blank'
              }
            ]
          },
          {
            title: '👨‍👩‍👧‍👦 Desarrollo Comunitario y Familiar',
            items: [
              {
                label: 'Alfabetización',
                href: 'https://alfabetizacion.blogspot.com/',
                target: '_blank'
              },
              {
                label: 'Capacitación laboral',
                href: 'https://capacitacionlaboral.blogspot.com/',
                target: '_blank'
              },
              {
                label: 'Emprendimiento',
                href: 'https://emprendimiento.blogspot.com/',
                target: '_blank'
              }
            ]
          }
        ]
      },
      {
        id: 'nav-projects',
        label: 'Proyectos',
        routerLink: '/projects'
      },
      {
        id: 'nav-support',
        label: 'Apóyanos',
        routerLink: '/donaciones'
      },
      {
        id: 'nav-contact',
        label: 'Contáctanos',
        routerLink: '/contactanos'
      },
      {
        id: 'nav-about',
        label: 'Nosotros',
        routerLink: '/about'
      }
    ];

    // CTA por defecto - enlaza directamente a las pasarelas de pago
    this.cta = {
      label: 'Donar',
      routerLink: '/donaciones',
      fragment: 'pasarelas',
      dataStrapiUid: 'navigation.donate'
    };

    this.loading = false;
  }

  private loadNavigation(): void {
    this.strapiService.getGlobalSettings().subscribe({
      next: settings => this.applyNavigation(settings),
      error: error => {
        console.error('Error loading navigation from Strapi', error);
        console.log('Usando navegación por defecto (fallback)');
        this.error = error instanceof Error ? error.message : 'No se pudo cargar la navegación dinámica.';
        this.loading = false;
        // No hacemos nada más, el fallback ya se cargó en ngOnInit
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
          };
        }
      }
    }

    if (settings.siteName) {
      const [primary, secondary] = settings.siteName.split('|').map((part: string) => part.trim()).filter(Boolean);
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
        };
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
        };
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
}
