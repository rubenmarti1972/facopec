import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StrapiService } from '@core/services/strapi.service';
import { ProgramLogoSimpleContent } from '@core/models';

interface ProgramCategory {
  id: string;
  name: string;
  icon: string;
  programs: ProgramLogo[];
}

interface ProgramLogo {
  logo: string;
  alt: string;
  href: string;
  category?: string;
}

@Component({
  selector: 'app-programs',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './programs.component.html',
  styleUrls: ['./programs.component.css']
})
export class ProgramsComponent implements OnInit {
  private readonly strapiService = inject(StrapiService);

  categories: ProgramCategory[] = [];
  isLoading = true;
  errorMessage = '';

  // Fallback de categorías con los 13 programas del home
  private readonly fallbackPrograms: ProgramLogo[] = [
    { logo: 'assets/program-logos/guias.png', alt: 'Guías y Cuentos Cortos', href: 'https://cuentoscortosprofeencasa.blogspot.com/', category: 'lectura-literatura' },
    { logo: 'assets/program-logos/guias-mate.png', alt: 'Guías de Matemáticas', href: 'https://matematicasprofeencasa.blogspot.com/', category: 'academico' },
    { logo: 'assets/program-logos/talleres-nivelacion.png', alt: 'Talleres de Nivelación', href: 'https://talleresdenivelacionprofeencasa.blogspot.com/', category: 'academico' },
    { logo: 'assets/program-logos/plan-lector.png', alt: 'Plan Lector', href: 'https://planlectorprofeencasa.blogspot.com/', category: 'lectura-literatura' },
    { logo: 'assets/program-logos/escuela-padres.png', alt: 'Escuela de Padres', href: 'https://escueladepadresprofeencasa.blogspot.com/', category: 'formacion' },
    { logo: 'assets/program-logos/espiritual.png', alt: 'Formación Espiritual', href: 'https://formacionespiritualprofeencasa.blogspot.com/', category: 'formacion' },
    { logo: 'assets/program-logos/comunidades-narp.png', alt: 'Comunidades NARP', href: 'https://narpprofeencasa.blogspot.com/', category: 'comunitario' },
    { logo: 'assets/program-logos/emplpeabilidad.png', alt: 'Empleabilidad', href: 'https://empleabilidadprofeencasa.blogspot.com/', category: 'empleabilidad' },
    { logo: 'assets/program-logos/salida-pedagogica.png', alt: 'Salidas Pedagógicas', href: 'https://salidaspedagogicasprofeencasa.blogspot.com/', category: 'actividades' },
    { logo: 'assets/program-logos/educa.png', alt: 'EDUCA', href: 'https://educaprofeencasa.blogspot.com/', category: 'academico' },
    { logo: 'assets/program-logos/dona-ropa.png', alt: 'Donación de Ropa', href: 'https://donaropaeditorialprofeencasa.blogspot.com/', category: 'solidaridad' },
    { logo: 'assets/program-logos/comunitario.png', alt: 'Trabajo Comunitario', href: 'https://proyectocomunitarioprofeencasa.blogspot.com/', category: 'comunitario' },
    { logo: 'assets/program-logos/primaria.png', alt: 'Escuela Primaria', href: 'https://escuelaprimariaprofeencasa.blogspot.com/', category: 'academico' }
  ];

  private readonly categoryNames: Record<string, string> = {
    'academico': 'Académico',
    'lectura-literatura': 'Lectura y Literatura',
    'formacion': 'Formación',
    'comunitario': 'Comunitario',
    'empleabilidad': 'Empleabilidad',
    'actividades': 'Actividades',
    'solidaridad': 'Solidaridad'
  };

  private readonly categoryIcons: Record<string, string> = {
    'academico': '📚',
    'lectura-literatura': '📖',
    'formacion': '👥',
    'comunitario': '🤝',
    'empleabilidad': '💼',
    'actividades': '🎯',
    'solidaridad': '❤️'
  };

  ngOnInit(): void {
    this.loadPrograms();
  }

  private loadPrograms(): void {
    this.isLoading = true;
    this.strapiService.getHomePage().subscribe({
      next: content => {
        let programs: ProgramLogo[] = [];

        if (content.programLogos && content.programLogos.length > 0) {
          programs = content.programLogos.map((programLogo, index) => {
            const logoUrl = this.resolveMediaUrl(programLogo.logo);
            const fallback = this.fallbackPrograms[index];

            return {
              logo: logoUrl ?? fallback?.logo ?? '',
              alt: programLogo.alt ?? fallback?.alt ?? '',
              href: programLogo.link ?? fallback?.href ?? '#',
              category: programLogo.category ?? fallback?.category ?? 'academico'
            };
          });
        } else {
          programs = this.fallbackPrograms;
        }

        this.organizeByCategories(programs);
        this.isLoading = false;
      },
      error: error => {
        console.error('Error cargando programas:', error);
        this.organizeByCategories(this.fallbackPrograms);
        this.isLoading = false;
      }
    });
  }

  private organizeByCategories(programs: ProgramLogo[]): void {
    const categoriesMap = new Map<string, ProgramLogo[]>();

    programs.forEach(program => {
      const category = program.category || 'academico';
      if (!categoriesMap.has(category)) {
        categoriesMap.set(category, []);
      }
      categoriesMap.get(category)!.push(program);
    });

    this.categories = Array.from(categoriesMap.entries()).map(([id, programs]) => ({
      id,
      name: this.categoryNames[id] || id,
      icon: this.categoryIcons[id] || '📋',
      programs
    }));

    // Ordenar categorías: Académico primero, luego alfabéticamente
    this.categories.sort((a, b) => {
      if (a.id === 'academico') return -1;
      if (b.id === 'academico') return 1;
      return a.name.localeCompare(b.name);
    });
  }

  private resolveMediaUrl(media?: any): string | null {
    if (!media) {
      return null;
    }
    return this.strapiService.buildMediaUrl(media);
  }
}
