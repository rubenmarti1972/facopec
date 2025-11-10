import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StrapiService } from '@core/services/strapi.service';
import { HomePageContent, HighlightContent, SupporterLogoContent, MediaAsset, GlobalSettings } from '@core/models';

interface HeroStat {
  label: string;
  value: string;
}

interface HeroAction {
  label: string;
  routerLink?: string;
  href?: string;
  variant: 'primary' | 'secondary';
  dataStrapiUid: string;
}

interface HeroVerse {
  reference: string;
  text: string;
  description: string;
}

interface HeroContent {
  eyebrow: string;
  title: string[];
  lead: string;
  stats: HeroStat[];
  actions: HeroAction[];
  verse: HeroVerse;
  image: string;
  imageAlt: string;
}

interface ActivityCard {
  title: string;
  description: string;
  href: string;
  icon: string;
  theme: 'teal' | 'blue' | 'rose' | 'gold';
  dataStrapiUid: string;
}

interface IdentityValue {
  title: string;
  description: string;
  icon: string;
  dataStrapiUid: string;
}

interface ProgramCard {
  title: string;
  description: string;
  highlights: string[];
  href: string;
  strapiCollection: string;
  strapiEntryId: string;
}

interface CatalogItem {
  title: string;
  description: string;
  price: string;
  href: string;
  strapiCollection: string;
  strapiEntryId: string;
}

interface GalleryItem {
  title: string;
  description: string;
  cover: string;
  type: 'image' | 'video';
  href: string;
  strapiCollection: string;
  strapiEntryId: string;
}

interface SupporterLogo {
  src: string;
  alt: string;
  caption: string;
  dataStrapiUid: string;
}

type IdentityCardKey = 'description' | 'mission' | 'vision';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private readonly strapiService = inject(StrapiService);

  loading = true;
  error: string | null = null;

  hero: HeroContent = {
    eyebrow: 'Misión con sentido social',
    title: ['Transformamos vidas', 'a través de la educación y el cuidado'],
    lead:
      'Somos la Fundación Afrocolombiana Profe en Casa. Desde Puerto Tejada impulsamos procesos educativos, culturales y espirituales para niñas, niños, adolescentes y sus familias en el Valle del Cauca.',
    stats: <HeroStat[]>[
      { value: '+180', label: 'Estudiantes acompañados con tutorías y mentorías' },
      { value: '35', label: 'Voluntarios activos en programas comunitarios' },
      { value: '12', label: 'Barrios impactados con actividades presenciales y virtuales' }
    ],
    actions: <HeroAction[]>[
      { label: 'Donar ahora', routerLink: '/donate', variant: 'primary', dataStrapiUid: 'hero.actions.donate' },
      {
        label: 'Ver programas',
        href: '/home#programas',
        variant: 'secondary',
        dataStrapiUid: 'hero.actions.programs'
      }
    ],
    verse: {
      reference: 'Proverbios 3:13',
      text: '“Feliz quien halla sabiduría”',
      description:
        'Creamos espacios seguros para aprender, compartir y crecer en comunidad. Creemos en el poder de la lectura, la tecnología y la fe para transformar historias.'
    },
    image: 'assets/ninos.jpg',
    imageAlt: 'Familia afrocolombiana abrazada y sonriendo'
  };

  globalLogoUrl = 'assets/logo.png';
  globalLogoAlt = 'Logo FACOPEC';

  identity = {
    description:
      'Somos FACOPEC, una fundación afrocolombiana que canaliza recursos locales, nacionales e internacionales para impulsar proyectos educativos, culturales, recreativos y tecnológicos en comunidades negras, afrocolombianas, raizales y palenqueras. Desde el Valle del Cauca acompañamos a niñas, niños, adolescentes, jóvenes y familias para potenciar sus capacidades, fortalecer sus sueños y activar su liderazgo comunitario.',
    dataStrapiUid: 'about.description',
    values: <IdentityValue[]>[
      {
        title: 'Derechos humanos y dignidad',
        description: 'Promovemos la defensa y reivindicación de los derechos de las comunidades negras, afrocolombianas, raizales y palenqueras.',
        icon: '👐🏾',
        dataStrapiUid: 'about.values.rights'
      },
      {
        title: 'Educación transformadora',
        description: 'Impulsamos procesos educativos, tecnológicos y culturales que potencian talentos y vocaciones.',
        icon: '💡',
        dataStrapiUid: 'about.values.education'
      },
      {
        title: 'Fe, cultura y comunidad',
        description: 'Fortalecemos el tejido comunitario desde la espiritualidad, la identidad cultural y el trabajo colaborativo.',
        icon: '🤲🏾',
        dataStrapiUid: 'about.values.community'
      }
    ]
  };

  impactHighlights = [
    {
      icon: '📚',
      title: 'Educación integral',
      label: 'Tutorías, clubes de lectura y acompañamiento pedagógico',
      dataStrapiUid: 'impact.education',
      theme: 'teal'
    },
    {
      icon: '🤝🏾',
      title: 'Tejido comunitario',
      label: 'Trabajo con familias, líderes y aliados del territorio',
      dataStrapiUid: 'impact.community',
      theme: 'blue'
    },
    {
      icon: '🌱',
      title: 'Valores y fe',
      label: 'Formación espiritual, bienestar emocional y liderazgo',
      dataStrapiUid: 'impact.faith',
      theme: 'rose'
    }
  ];

  missionVision = {
    mission:
      'La Fundación Afrocolombiana Profe en Casa | FACOPEC se dedica a captar y canalizar recursos a nivel local, nacional e internacional para desarrollar proyectos que promuevan y reivindiquen los derechos humanos de las comunidades negras, afrocolombianas, raizales y palenqueras. Trabajamos para empoderar a niños, niñas, adolescentes, jóvenes, hombres, mujeres y familias, potenciando sus capacidades y sueños mediante programas educativos, culturales, recreativos, y tecnológicos, entre otros, con el fin de maximizar su impacto positivo y fomentar su desarrollo como actores de cambio en sus comunidades.',
    vision:
      'Ser reconocidos como una fundación líder en la promoción de los derechos humanos y el desarrollo integral de las comunidades afrocolombianas, raizales y palenqueras. Aspiramos a crear un futuro donde estas comunidades puedan desplegar plenamente su potencial en ámbitos tecnológicos, educativos, culturales y sociales, contribuyendo activamente al progreso social, económico y ambiental de Colombia y el mundo.',
    dataStrapiUidMission: 'about.mission',
    dataStrapiUidVision: 'about.vision'
  };

  identityExpanded: Record<IdentityCardKey, boolean> = {
    description: false,
    mission: false,
    vision: false
  };

  activityCards: ActivityCard[] = [
    {
      title: 'Tutorías Profe en Casa',
      description: 'Refuerzo escolar personalizado, acompañamiento en tareas y aprendizaje basado en proyectos.',
      href: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Tutor%C3%ADas',
      icon: '🧠',
      theme: 'teal',
      dataStrapiUid: 'activities.tutorias'
    },
    {
      title: 'Ruta Literaria María',
      description: 'Lectura en voz alta, círculos literarios y creación de cuentos inspirados en nuestras raíces afro.',
      href: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Ruta%20Literaria%20Mar%C3%ADa',
      icon: '📖',
      theme: 'blue',
      dataStrapiUid: 'activities.rutaLiteraria'
    },
    {
      title: 'Huerta y alimentación',
      description: 'Huertas urbanas, cocina saludable y emprendimientos familiares con enfoque sostenible.',
      href: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Huerta',
      icon: '🥬',
      theme: 'gold',
      dataStrapiUid: 'activities.huerta'
    },
    {
      title: 'Arte, danza y fe',
      description: 'Laboratorios creativos, espacios de oración y actividades culturales para toda la comunidad.',
      href: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Cultura',
      icon: '🎨',
      theme: 'rose',
      dataStrapiUid: 'activities.arte'
    }
  ];

  programCards: ProgramCard[] = [
    {
      title: 'Semillero Digital',
      description:
        'Talleres STEAM, alfabetización digital y mentorías vocacionales que conectan a jóvenes con oportunidades tecnológicas.',
      highlights: ['Tecnología', 'Innovación', 'Mentorías'],
      href: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Semillero%20Digital',
      strapiCollection: 'programas',
      strapiEntryId: 'semillero-digital'
    },
    {
      title: 'Club Familias que Acompañan',
      description:
        'Escuela de padres, orientación psicoemocional y redes solidarias para fortalecer el cuidado en casa.',
      highlights: ['Familias', 'Bienestar', 'Prevención'],
      href: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Familias',
      strapiCollection: 'programas',
      strapiEntryId: 'club-familias'
    }
  ];

  supporters: SupporterLogo[] = [
    {
      src: 'assets/supporters/icbf-logo.svg',
      alt: 'Instituto Colombiano de Bienestar Familiar',
      caption: 'Instituto Colombiano de Bienestar Familiar',
      dataStrapiUid: 'supporters.icbf'
    },
    {
      src: 'assets/supporters/pnud-logo.svg',
      alt: 'Programa de las Naciones Unidas para el Desarrollo',
      caption: 'Programa de las Naciones Unidas para el Desarrollo',
      dataStrapiUid: 'supporters.pnud'
    }
  ];

  catalogItems: CatalogItem[] = [
    {
      title: 'Kit escolar completo',
      description: 'Útiles, lecturas y materiales artísticos para un estudiante durante un trimestre.',
      price: '$85.000 COP',
      href: 'https://wa.me/p/5881121183974635/573215230283',
      strapiCollection: 'catalogo-whatsapp',
      strapiEntryId: 'kit-escolar'
    },
    {
      title: 'Canasta solidaria',
      description: 'Apoyo nutricional para familias con niñas y niños en refuerzo escolar durante un mes.',
      price: '$70.000 COP',
      href: 'https://wa.me/p/5979113203538798/573215230283',
      strapiCollection: 'catalogo-whatsapp',
      strapiEntryId: 'canasta-solidaria'
    },
    {
      title: 'Apadrina una tutoría',
      description: 'Financia sesiones personalizadas y acompañamiento pedagógico para un estudiante.',
      price: '$45.000 COP',
      href: 'https://wa.me/p/5332119887812567/573215230283',
      strapiCollection: 'catalogo-whatsapp',
      strapiEntryId: 'apadrina-tutoria'
    }
  ];

  galleryItems: GalleryItem[] = [
    {
      title: 'Laboratorio de lectura',
      description: 'Niños y niñas viven experiencias literarias en la biblioteca comunitaria.',
      cover: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1000&q=80',
      type: 'image',
      href: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/2023/09/lectura-en-comunidad.html',
      strapiCollection: 'galeria',
      strapiEntryId: 'laboratorio-lectura'
    },
    {
      title: 'Huerta escolar comunitaria',
      description: 'Familias cosechan alimentos y aprenden sobre soberanía alimentaria.',
      cover: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=1000&q=80',
      type: 'image',
      href: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/2023/06/huerta-escolar.html',
      strapiCollection: 'galeria',
      strapiEntryId: 'huerta-escolar'
    },
    {
      title: 'Testimonio en video',
      description: 'Conoce cómo la fundación impacta a las familias del Cauca.',
      cover: 'https://img.youtube.com/vi/VN0qfM2Yg2w/hqdefault.jpg',
      type: 'video',
      href: 'https://www.youtube.com/watch?v=VN0qfM2Yg2w',
      strapiCollection: 'galeria',
      strapiEntryId: 'testimonio-video'
    }
  ];

  ngOnInit(): void {
    this.loadContent();
    this.loadGlobalBranding();
    this.setupAutoRefresh();
  }

  toggleIdentityCard(key: IdentityCardKey): void {
    this.identityExpanded[key] = !this.identityExpanded[key];
  }

  private loadContent(): void {
    this.strapiService.getHomePage().subscribe({
      next: content => this.applyHomeContent(content),
      error: error => {
        console.error('Error loading home page content', error);
        this.error = error instanceof Error ? error.message : 'No se pudo cargar el contenido desde Strapi.';
        this.loading = false;
      }
    });
  }

  private applyHomeContent(content: HomePageContent): void {
    const fallbackSupporters = [...this.supporters];
    const fallbackGalleryCover = this.galleryItems[0]?.cover ?? '';

    if (content.hero) {
      const hero = content.hero;
      const heroMediaUrl = this.resolveMediaUrl(hero.image);
      const heroAltText = hero.image?.alternativeText ?? hero.image?.caption ?? this.hero.imageAlt;
      this.hero = {
        eyebrow: hero.eyebrow ?? this.hero.eyebrow,
        title: hero.titleLines?.map(line => line.line).filter(Boolean) ?? this.hero.title,
        lead: hero.lead ?? this.hero.lead,
        stats:
          hero.stats?.map(stat => ({
            label: stat.label ?? '',
            value: stat.value ?? ''
          })).filter(stat => stat.label && stat.value) ?? this.hero.stats,
        actions:
          hero.actions?.map(action => {
            const url = action.url ?? '';
            const isInternal = action.isInternal ?? url.startsWith('/');
            return {
              label: action.label,
              variant: action.variant ?? 'primary',
              routerLink: isInternal ? url : undefined,
              href: !isInternal ? url : undefined,
              dataStrapiUid: action.dataUid ?? ''
            } satisfies HeroAction;
          }).filter(action => !!action.label && (!!action.routerLink || !!action.href)) ?? this.hero.actions,
        verse: {
          reference: hero.verse?.reference ?? this.hero.verse.reference,
          text: hero.verse?.text ?? this.hero.verse.text,
          description: hero.verse?.description ?? this.hero.verse.description
        },
        image: heroMediaUrl ?? this.hero.image,
        imageAlt: heroAltText ?? this.hero.imageAlt
      };
    }

    if (content.impactHighlights?.length) {
      const mapped = this.mapHighlights(content.impactHighlights);
      if (mapped.length) {
        this.impactHighlights = mapped;
      }
    }

    if (content.identity) {
      this.identity = {
        description: content.identity.description ?? this.identity.description,
        dataStrapiUid: content.identity.dataUid ?? this.identity.dataStrapiUid,
        values:
          content.identity.values?.map(value => ({
            title: value.title,
            description: value.description ?? '',
            icon: value.icon ?? '✨',
            dataStrapiUid: value.dataUid ?? ''
          })).filter(value => !!value.title) ?? this.identity.values
      };
    }

    if (content.missionVision) {
      this.missionVision = {
        mission: content.missionVision.mission ?? this.missionVision.mission,
        vision: content.missionVision.vision ?? this.missionVision.vision,
        dataStrapiUidMission: content.missionVision.missionUid ?? this.missionVision.dataStrapiUidMission,
        dataStrapiUidVision: content.missionVision.visionUid ?? this.missionVision.dataStrapiUidVision
      };
    }

    if (content.activities?.length) {
      const mapped = content.activities
        .map(activity => ({
          title: activity.title,
          description: activity.description ?? '',
          href: activity.link ?? '#',
          icon: activity.icon ?? '⭐',
          theme: (activity.theme as ActivityCard['theme']) ?? 'teal',
          dataStrapiUid: activity.dataUid ?? ''
        }))
        .filter(activity => !!activity.title);

      if (mapped.length) {
        this.activityCards = mapped;
      }
    }

    if (content.programs?.length) {
      const mapped = content.programs
        .map(program => ({
          title: program.title,
          description: program.description ?? '',
          highlights: program.highlights?.filter(Boolean) ?? [],
          href: program.link ?? '#',
          strapiCollection: program.strapiCollection ?? '',
          strapiEntryId: program.strapiEntryId ?? ''
        }))
        .filter(program => !!program.title);

      if (mapped.length) {
        this.programCards = mapped;
      }
    }

    if (content.supporters?.length) {
      const mapped = content.supporters
        .map((supporter, index) => this.mapSupporter(supporter, fallbackSupporters[index]))
        .filter((supporter): supporter is SupporterLogo => supporter !== null);

      if (mapped.length) {
        this.supporters = mapped;
      }
    }

    if (content.catalog?.length) {
      const mapped = content.catalog
        .map(item => ({
          title: item.title,
          description: item.description ?? '',
          price: item.price ?? '',
          href: item.link ?? '#',
          strapiCollection: item.strapiCollection ?? '',
          strapiEntryId: item.strapiEntryId ?? ''
        }))
        .filter(item => !!item.title);

      if (mapped.length) {
        this.catalogItems = mapped;
      }
    }

    if (content.gallery?.length) {
      const mapped = content.gallery
        .map(item => ({
          title: item.title,
          description: item.description ?? '',
          cover: this.resolveMediaUrl(item.media) ?? fallbackGalleryCover,
          type: (item.type as GalleryItem['type']) ?? 'image',
          href: item.link ?? '#',
          strapiCollection: item.strapiCollection ?? '',
          strapiEntryId: item.strapiEntryId ?? ''
        }))
        .filter(item => !!item.title && !!item.cover);

      if (mapped.length) {
        this.galleryItems = mapped;
      }
    }

    this.loading = false;
  }

  private loadGlobalBranding(): void {
    this.strapiService.getGlobalSettings().subscribe({
      next: (settings: GlobalSettings) => {
        const logoUrl = this.strapiService.buildMediaUrl(settings.logo);
        if (logoUrl) {
          this.globalLogoUrl = logoUrl;
          this.globalLogoAlt = settings.logo?.alternativeText ?? settings.logo?.caption ?? this.globalLogoAlt;
        }
      },
      error: error => {
        console.warn('No se pudo cargar el logo global desde Strapi.', error);
      }
    });
  }

  private mapHighlights(highlights: HighlightContent[]): typeof this.impactHighlights {
    return highlights
      .map(highlight => ({
        icon: highlight.icon ?? '✨',
        title: highlight.title,
        label: highlight.label ?? highlight.description ?? '',
        dataStrapiUid: highlight.dataUid ?? '',
        theme: (highlight.theme as (typeof this.impactHighlights)[number]['theme']) ?? 'teal'
      }))
      .filter(highlight => !!highlight.title);
  }

  private mapSupporter(supporter: SupporterLogoContent, fallback?: SupporterLogo): SupporterLogo | null {
    const mediaUrl = this.resolveMediaUrl(supporter.logo) ?? fallback?.src;
    const caption = supporter.caption ?? supporter.name ?? fallback?.caption ?? '';

    if (!mediaUrl && !supporter.name) {
      return null;
    }

    return {
      src: mediaUrl ?? '',
      alt: supporter.name ?? fallback?.alt ?? 'Aliado FACOPEC',
      caption,
      dataStrapiUid: supporter.dataUid ?? fallback?.dataStrapiUid ?? ''
    } satisfies SupporterLogo;
  }

  private resolveMediaUrl(media?: MediaAsset | null): string | null {
    return this.strapiService.buildMediaUrl(media);
  }

  /**
   * Setup auto-refresh when window regains focus
   * This ensures content is updated when user returns to the page
   */
  private setupAutoRefresh(): void {
    if (typeof window === 'undefined') {
      return;
    }

    let lastLoadTime = Date.now();

    const handleVisibilityChange = (): void => {
      if (document.visibilityState === 'visible') {
        const timeSinceLastLoad = Date.now() - lastLoadTime;
        const refreshThreshold = 10000; // 10 seconds (reduced for faster updates)

        if (timeSinceLastLoad > refreshThreshold) {
          console.log('Auto-refreshing content after tab became visible');
          this.strapiService.refreshHomePage().subscribe({
            next: content => {
              this.applyHomeContent(content);
              lastLoadTime = Date.now();
            },
            error: error => {
              console.error('Error refreshing home page content', error);
            }
          });

          this.strapiService.refreshGlobalSettings().subscribe({
            next: (settings: GlobalSettings) => {
              const logoUrl = this.strapiService.buildMediaUrl(settings.logo);
              if (logoUrl) {
                this.globalLogoUrl = logoUrl;
                this.globalLogoAlt = settings.logo?.alternativeText ?? settings.logo?.caption ?? this.globalLogoAlt;
              }
            },
            error: error => {
              console.warn('Error refreshing global settings', error);
            }
          });
        }
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
  }
}
