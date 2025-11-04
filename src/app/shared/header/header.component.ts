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
  readonly navLinks: HeaderLink[] = [
    { label: 'Inicio', routerLink: '/', exact: true, dataStrapiUid: 'navigation.home' },
    {
      label: 'Programas y actividades',
      routerLink: '/projects',
      dataStrapiUid: 'navigation.activities',
      children: [
        {
          title: 'Para estudiantes',
          dataStrapiUid: 'navigation.activities.students',
          items: [
            {
              label: 'Talleres de Nivelación',
              href: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Talleres%20de%20Nivelaci%C3%B3n',
              dataStrapiUid: 'navigation.activities.students.talleres'
            },
            {
              label: 'Salidas Pedagógicas',
              href: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Salidas%20Pedag%C3%B3gicas',
              dataStrapiUid: 'navigation.activities.students.salidas'
            },
            {
              label: 'Personeros y Líderes Estudiantiles',
              href: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Personeros',
              dataStrapiUid: 'navigation.activities.students.personeros'
            },
            {
              label: 'Obra María | Jorge Isaacs',
              href: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Obra%20Mar%C3%ADa',
              dataStrapiUid: 'navigation.activities.students.obraMaria'
            },
            {
              label: 'Plan Lector',
              href: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Plan%20Lector',
              dataStrapiUid: 'navigation.activities.students.planLector'
            },
            {
              label: 'Obra | La María | Jorge Isaacs',
              href: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/La%20Mar%C3%ADa',
              dataStrapiUid: 'navigation.activities.students.obraLaMaria'
            }
          ]
        },
        {
          title: 'Para fin de año 2025',
          dataStrapiUid: 'navigation.activities.yearEnd',
          items: [
            {
              label: 'Regalos de corazón',
              href: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Regalos%20de%20coraz%C3%B3n',
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
              href: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Escuela%20de%20Padres',
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
    { label: 'Nosotros', routerLink: '/about', dataStrapiUid: 'navigation.about' }
  ];
}
