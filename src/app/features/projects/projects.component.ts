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

  projects: ProjectLink[] = [];
  programLogos: ProgramLogo[] = [];

  ngOnInit(): void {
    // Load projects from CMS
    this.strapiService.getProjectSummaries().subscribe({
      next: projects => this.applyProjects(projects),
      error: error => {
        console.error('Error loading projects from Strapi', error);
        this.error = error instanceof Error ? error.message : 'No se pudieron cargar los proyectos.';
        this.loading = false;
      }
    });

    // Load program logos from home page
    this.strapiService.getHomePage().subscribe({
      next: content => {
        if (content.programLogos?.length) {
          this.programLogos = content.programLogos.map(logo => ({
            logo: this.strapiService.buildMediaUrl(logo.logo) ?? '',
            alt: logo.alt ?? '',
            href: logo.link ?? '#'
          })).filter(logo => logo.alt);
        }
      },
      error: error => {
        console.warn('Could not load program logos', error);
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
