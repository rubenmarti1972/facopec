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
import { GlobalSettings, NavigationEntry, NavigationGroup, NavigationChildLink } from '@core/models';

interface NavigationChildView {
  label: string;
  routerLink?: string;
  href?: string;
  fragment?: string;
  target?: '_self' | '_blank';
  dataStrapiUid?: string;
}

interface NavigationGroupView {
  title?: string;
  dataStrapiUid?: string;
  items: NavigationChildView[];
}

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

  navigationItems: NavigationItemView[] = [
    {
      id: 'navigation.home',
      label: 'Inicio',
      routerLink: '/inicio',
      exact: true,
      dataStrapiUid: 'navigation.home'
    },
    {
      id: 'navigation.programs',
      label: 'Programas',
      routerLink: '/inicio',
      fragment: 'programas',
      dataStrapiUid: 'navigation.programs',
      children: [
        {
          title: 'Para estudiantes',
          dataStrapiUid: 'navigation.programs.students',
          items: [
            {
              label: 'Talleres de Nivelación',
              href: 'https://talleresdenivelacion.blogspot.com/',
              target: '_blank',
              dataStrapiUid: 'navigation.programs.students.talleres'
            },
            {
              label: 'Salidas Pedagógicas',
              href: 'https://salidaspedagogicas-facopec.blogspot.com/',
              target: '_blank',
              dataStrapiUid: 'navigation.programs.students.salidas'
            },
            {
              label: 'Personeros y Líderes',
              href: 'https://personerosestudiantilesylideres.blogspot.com/',
              target: '_blank',
              dataStrapiUid: 'navigation.programs.students.personeros'
            },
            {
              label: 'Obra María | Jorge Isaacs',
              href: 'https://rutaliterariamaria.blogspot.com/',
              target: '_blank',
              dataStrapiUid: 'navigation.programs.students.obraMaria'
            }
          ]
        },
        {
          title: 'Para fin de año 2025',
          dataStrapiUid: 'navigation.programs.yearEnd',
          items: [
            {
              label: 'Regalos de corazón',
              href: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/2025/08/regalos-de-corazon-fundacion.html',
              target: '_blank',
              dataStrapiUid: 'navigation.programs.yearEnd.regalos'
            }
          ]
        },
        {
          title: 'Para adultos',
          dataStrapiUid: 'navigation.programs.adults',
          items: [
            {
              label: 'Escuela de Padres | Virtual',
              href: 'https://consejosparapadresymadres.blogspot.com/',
              target: '_blank',
              dataStrapiUid: 'navigation.programs.adults.parents'
            },
            {
              label: 'Empleabilidad',
              href: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Empleabilidad',
              target: '_blank',
              dataStrapiUid: 'navigation.programs.adults.jobs'
            }
          ]
        }
      ]
    },
    {
      id: 'navigation.projects',
      label: 'Proyectos',
      routerLink: '/proyectos',
      dataStrapiUid: 'navigation.projects'
    },
    {
      id: 'navigation.donations',
      label: 'Donaciones',
      routerLink: '/donaciones',
      dataStrapiUid: 'navigation.donations'
    },
    {
      id: 'navigation.sponsor',
      label: 'Apadrina',
      routerLink: '/apadrina',
      dataStrapiUid: 'navigation.sponsor'
    },
    {
      id: 'navigation.literaryRoute',
      label: 'Ruta literaria',
      routerLink: '/ruta-literaria-maria',
      dataStrapiUid: 'navigation.literaryRoute'
    },
    {
      id: 'navigation.about',
      label: 'Nosotros',
      routerLink: '/nosotros',
      dataStrapiUid: 'navigation.about'
    }
  ];

  cta: PrimaryCtaLink = {
    label: 'Donar',
    routerLink: '/donaciones',
    dataStrapiUid: 'navigation.donate'
  };

  logoUrl = 'assets/logo.png';
  logoAlt = 'Logo FACOPEC';
  siteNamePrimary = 'Fundación Afrocolombiana';
  siteNameSecondary = 'Profe en Casa';

  loading = true;
  error: string | null = null;
  mobileMenuOpen = false;
  private dropdownIndex: number | null = null;
  currentRoute = '';

  private sub?: Subscription;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.currentRoute = this.router.url;
    this.sub = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.urlAfterRedirects || event.url;
        this.closeMenu();
      }
    });

    this.loadNavigation();
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
}
