import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StrapiService } from '@core/services/strapi.service';
import { ProjectCardSummary } from '@core/models';

interface ProjectLink {
  title: string;
  description: string;
  tag: string;
  href: string;
  imageUrl?: string;
}

interface ProgramLogo {
  logo: string;
  alt: string;
  href: string;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  private readonly strapiService = inject(StrapiService);

  loading = true;
  error: string | null = null;

  projects: ProjectLink[] = [
    {
      title: 'Apoyo escolar Profe en Casa',
      description: 'Refuerzos escolares, lectura guiada y clubes creativos para niñas, niños y adolescentes.',
      tag: 'Educación',
      href: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Tutor%C3%ADas'
    },
    {
      title: 'Ruta literaria "María"',
      description: 'Lectura en familia, creación de relatos y visitas pedagógicas por el territorio afro.',
      tag: 'Cultura',
      href: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Ruta%20Literaria%20Mar%C3%ADa'
    },
    {
      title: 'Club Familias que acompañan',
      description: 'Escuela para familias, bienestar emocional y redes comunitarias que se cuidan entre sí.',
      tag: 'Bienestar',
      href: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Familias'
    },
    {
      title: 'Huerta y alimentación saludable',
      description: 'Agricultura urbana, cocina nutritiva y emprendimientos solidarios para el territorio.',
      tag: 'Territorio',
      href: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Huerta'
    }
  ];

  programLogos: ProgramLogo[] = [
    { logo: 'assets/program-logos/guias.png', alt: 'Guías y Cuentos Cortos', href: 'https://cuentoscortosprofeencasa.blogspot.com/' },
    { logo: 'assets/program-logos/guias-mate.png', alt: 'Guías de Matemáticas', href: 'https://matematicasprofeencasa.blogspot.com/' },
    { logo: 'assets/program-logos/Talleres-nivelacion.png', alt: 'Talleres de Nivelación', href: 'https://talleresdenivelacion.blogspot.com/' },
    { logo: 'assets/program-logos/Plan-lector.png', alt: 'Plan Lector', href: 'https://rutaliterariamaria.blogspot.com/' },
    { logo: 'assets/program-logos/Escuelas-padres.png', alt: 'Escuela de Padres', href: 'https://consejosparapadresymadres.blogspot.com/' },
    { logo: 'assets/program-logos/espiritual.png', alt: 'Formación Espiritual', href: 'https://escueladominicalcreciendoconcristo.blogspot.com/' },
    { logo: 'assets/program-logos/comunidades-narp.png', alt: 'Comunidades NARP', href: 'https://docs.google.com/forms/d/e/1FAIpQLScI9v2p8Rgp892XzGbEcrN-yKsyMh4A5h1UGmRDeZw_9RqIGQ/viewform' },
    { logo: 'assets/program-logos/empleabilidad.png', alt: 'Empleabilidad', href: 'https://empleabilidad-facopec.blogspot.com/' },
    { logo: 'assets/program-logos/Salida-pedagogica.png', alt: 'Salidas Pedagógicas', href: 'https://salidaspedagogicas-facopec.blogspot.com/' },
    { logo: 'assets/program-logos/educa.png', alt: 'FACOPEC Educa', href: 'https://facopeceduca.blogspot.com/' },
    { logo: 'assets/program-logos/Dona-ropa.png', alt: 'Dona Ropa', href: 'https://quetienespararegalar.blogspot.com/' },
    { logo: 'assets/program-logos/comunitario.png', alt: 'Servicio Comunitario', href: 'https://serviciocomunitario-facopec.blogspot.com/' },
    { logo: 'assets/program-logos/primaria.png', alt: 'Desafío Matemáticos', href: 'https://desafio-matematicos.blogspot.com/' }
  ];

  ngOnInit(): void {
    this.strapiService.getProjectSummaries().subscribe({
      next: projects => this.applyProjects(projects),
      error: error => {
        console.error('Error loading projects from Strapi', error);
        this.error = error instanceof Error ? error.message : 'No se pudieron cargar los proyectos.';
        this.loading = false;
      }
    });
  }

  private applyProjects(projects: ProjectCardSummary[]): void {
    if (projects.length) {
      this.projects = projects
        .map(project => ({
          title: project.title,
          description: project.description ?? '',
          tag: project.tag ?? '',
          href: project.link ?? '#',
          imageUrl: project.cover?.url
            ? (project.cover.url.startsWith('http')
                ? project.cover.url
                : `${this.strapiService['publicUrl'] || this.strapiService['apiUrl']}${project.cover.url}`)
            : undefined
        }))
        .filter(project => !!project.title && !!project.href);
    }

    this.loading = false;
  }
}
