import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface HeaderChildLink {
  label: string;
  href: string;
  dataStrapiUid: string;
}

interface HeaderLinkGroup {
  title: string;
  dataStrapiUid: string;
  items: HeaderChildLink[];
}

interface HeaderLink {
  label: string;
  routerLink?: string;
  href?: string;
  exact?: boolean;
  fragment?: string;
  dataStrapiUid: string;
  children?: HeaderLinkGroup[];
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  private readonly mobileQuery = typeof window !== 'undefined' ? window.matchMedia('(max-width: 720px)') : null;

  isMenuOpen = false;
  private openDropdownIndex: number | null = null;

  readonly navLinks: HeaderLink[] = [
    { label: 'Inicio', routerLink: '/home', exact: true, dataStrapiUid: 'navigation.home' },
    {
      label: 'Programas',
      href: '/home#programas',
      dataStrapiUid: 'navigation.activities',
      children: [
        {
          title: 'Para estudiantes',
          dataStrapiUid: 'navigation.activities.students',
          items: [
            {
              label: 'Talleres de Nivelación',
              href: 'https://talleresdenivelacion.blogspot.com/',
              dataStrapiUid: 'navigation.activities.students.talleres'
            },
            {
              label: 'Salidas Pedagógicas',
              href: 'https://salidaspedagogicas-facopec.blogspot.com/',
              dataStrapiUid: 'navigation.activities.students.salidas'
            },
            {
              label: 'Personeros y Líderes Estudiantiles',
              href: 'https://personerosestudiantilesylideres.blogspot.com/',
              dataStrapiUid: 'navigation.activities.students.personeros'
            },
            {
              label: 'Obra María | Jorge Isaacs',
              href: 'https://rutaliterariamaria.blogspot.com/',
              dataStrapiUid: 'navigation.activities.students.obraMaria'
            },
          ]
        },
        {
          title: 'Para fin de año 2025',
          dataStrapiUid: 'navigation.activities.yearEnd',
          items: [
            {
              label: 'Regalos de corazón',
              href: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/2025/08/regalos-de-corazon-fundacion.html',
              dataStrapiUid: 'navigation.activities.yearEnd.regalos'
            }
          ]
        },
        {
          title: 'Para adultos',
          dataStrapiUid: 'navigation.activities.adults',
          items: [
            {
              label: 'Escuela de Padres | Virtual',
              href: 'https://consejosparapadresymadres.blogspot.com/',
              dataStrapiUid: 'navigation.activities.adults.escuelaPadres'
            },
            {
              label: 'Empleabilidad',
              href: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Empleabilidad',
              dataStrapiUid: 'navigation.activities.adults.empleabilidad'
            }
          ]
        }
      ]
    },
    { label: 'Proyectos', routerLink: '/projects', dataStrapiUid: 'navigation.projects' },
    { label: 'Ruta literaria', routerLink: '/literary-route', dataStrapiUid: 'navigation.literaryRoute' },
    { label: 'Periódico', routerLink: '/newspaper', dataStrapiUid: 'navigation.newspaper' },
    {
      label: 'Informes',
      routerLink: '/reports',
      dataStrapiUid: 'navigation.reports',
      children: [
        {
          title: 'Gestión contable',
          dataStrapiUid: 'navigation.reports.accounting',
          items: [
            {
              label: 'Informe contable',
              href: '/reports#informe-contable',
              dataStrapiUid: 'navigation.reports.accounting.financial'
            }
          ]
        },
        {
          title: 'Impacto social',
          dataStrapiUid: 'navigation.reports.impact',
          items: [
            {
              label: 'Personas atendidas por programas',
              href: '/reports#atencion-programas',
              dataStrapiUid: 'navigation.reports.impact.attendance'
            }
          ]
        }
      ]
    }
  ];

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    if (!this.isMenuOpen) {
      this.openDropdownIndex = null;
    }
  }

  closeMenu(): void {
    if (this.isMenuOpen) {
      this.isMenuOpen = false;
    }
    this.openDropdownIndex = null;
  }

  toggleDropdown(index: number, event: MouseEvent): void {
    if (this.mobileQuery?.matches) {
      event.preventDefault();
      this.openDropdownIndex = this.openDropdownIndex === index ? null : index;
    }
  }

  isDropdownOpen(index: number): boolean {
    return this.openDropdownIndex === index;
  }
}
