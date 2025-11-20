import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { StrapiService } from '@core/services/strapi.service';
import { EmailService } from '@core/services/email.service';
import { HomePageContent, HeroSectionContent, HighlightContent, SupporterLogoContent, MediaAsset, GlobalSettings, AttendedPersonCardContent, EventCalendarItemContent } from '@core/models';
import { HeroCarouselComponent, CarouselImage } from '@shared/components/hero-carousel/hero-carousel.component';

interface HeroStat {
  label: string;
  value: string;
}

interface HeroAction {
  label: string;
  routerLink?: string;
  href?: string;
  fragment?: string;
  variant: 'primary' | 'secondary';
  dataStrapiUid: string;
}

interface HeroVerse {
  reference: string;
  text: string;
  description: string;
}

interface HeroCarouselSlide {
  image: string;
  alt: string;
  caption?: string;
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

interface ProgramLogo {
  logo: string;
  alt: string;
  href: string;
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
  logo?: string;
  logoAlt?: string;
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
  imports: [CommonModule, FormsModule, RouterLink, HeroCarouselComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly strapiService = inject(StrapiService);
  private readonly emailService = inject(EmailService);

  loading = true;
  error: string | null = null;

  private readonly fallbackCarouselSlides: HeroCarouselSlide[] = [
    {
      image: 'assets/ninos.jpg',
      alt: 'Niñas y niños afrocolombianos compartiendo en comunidad',
      caption: 'Aprendizajes con sentido desde Puerto Tejada'
    },
    {
      image: 'assets/fotos-fundacion/portada.webp',
      alt: 'Equipo pedagógico acompañando actividades en FACOPEC',
      caption: 'Educación y acompañamiento integral para las familias'
    },
    {
      image: 'assets/fotos-fundacion/collage.webp',
      alt: 'Collage de experiencias educativas y culturales de la fundación',
      caption: 'Arte, lectura y tecnología para transformar territorios'
    },
    {
      image: 'assets/fotos-fundacion/collage-profe.webp',
      alt: 'Voluntariado y equipo FACOPEC reunidos con la comunidad',
      caption: 'Redes solidarias que abrazan a la comunidad'
    }
  ];

  heroCarousel: HeroCarouselSlide[] = this.fallbackCarouselSlides.map(slide => ({ ...slide }));
  heroCarouselIndex = 0;
  private carouselIntervalId: ReturnType<typeof setInterval> | null = null;
  private readonly carouselRotationMs = 20000;
  private visibilityChangeHandler?: () => void;
  private lastContentRefresh = Date.now();

  hero: HeroContent = {
    eyebrow: 'Misión con sentido social',
    title: ['Transformamos vidas', 'a través de la educación y el cuidado'],
    lead:
      'Somos la Fundación Afrocolombiana Profe en Casa. Desde Puerto Tejada impulsamos procesos educativos, culturales y espirituales para niñas, niños, adolescentes y sus familias en el Cauca.',
    stats: <HeroStat[]>[
      { value: '+180', label: 'Estudiantes acompañados con tutorías y mentorías' },
      { value: '35', label: 'Voluntarios activos en programas comunitarios' },
      { value: '12', label: 'Barrios impactados con actividades presenciales y virtuales' }
    ],
    actions: <HeroAction[]>[
      { label: 'Donar ahora', routerLink: '/donaciones', variant: 'primary', dataStrapiUid: 'hero.actions.donate' },
      {
        label: 'Ver programas',
        routerLink: '/home',
        fragment: 'programas',
        variant: 'secondary',
        dataStrapiUid: 'hero.actions.programs'
      }
    ],
    verse: {
      reference: 'Proverbios 3:13',
      text: '"Feliz quien halla sabiduría"',
      description:
        'Creamos espacios seguros para aprender, compartir y crecer en comunidad. Creemos en el poder de la lectura, la tecnología y la fe para transformar historias.'
    },
    image: 'assets/ninos.jpg',
    imageAlt: 'Familia afrocolombiana abrazada y sonriendo'
  };

  carouselImages: CarouselImage[] = [
    {
      url: 'assets/fotos-fundacion/portada.webp',
      alt: 'FACOPEC - Fundación Afrocolombiana Profe en Casa en acción'
    },
    {
      url: 'assets/fotos-fundacion/collage.webp',
      alt: 'Niños y niñas participando en actividades educativas'
    },
    {
      url: 'assets/fotos-fundacion/collage-profe.webp',
      alt: 'Profesores y estudiantes en sesiones de aprendizaje'
    },
    {
      url: 'assets/fotos-fundacion/apoyo.webp',
      alt: 'Apoyo y trabajo comunitario en FACOPEC'
    }
  ];

  globalLogoUrl = 'assets/logo.png';
  globalLogoAlt = 'Logo FACOPEC';

  identity = {
    description:
      'Somos FACOPEC, una fundación afrocolombiana que canaliza recursos locales, nacionales e internacionales para impulsar proyectos educativos, culturales, recreativos y tecnológicos en Comunidades NARP (Negras, Afrocolombianas, Raizales y Palenqueras). Desde el Cauca acompañamos a niñas, niños, adolescentes, jóvenes y familias para potenciar sus capacidades, fortalecer sus sueños y activar su liderazgo comunitario.',
    dataStrapiUid: 'about.description',
    values: <IdentityValue[]>[
      {
        title: 'Derechos humanos y dignidad',
        description: 'Promovemos la defensa y reivindicación de los derechos de las Comunidades NARP (Negras, Afrocolombianas, Raizales y Palenqueras).',
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
      imagePath: 'assets/program-logos/educa.png',
      title: 'Educación integral',
      label: 'Tutoclubes de lectura y acompañamiento pedagógico',
      dataStrapiUid: 'impact.education',
      theme: 'teal'
    },
    {
      icon: '🤝🏾',
      imagePath: 'assets/program-logos/comunitario.png',
      title: 'Tejido comunitario',
      label: 'Trabajo con familias, líderes y aliados del territorio',
      dataStrapiUid: 'impact.community',
      theme: 'blue'
    },
    {
      icon: '🌱',
      imagePath: 'assets/program-logos/espiritual.png',
      title: 'Valores y fe',
      label: 'Formación espiritual, bienestar emocional y liderazgo',
      dataStrapiUid: 'impact.faith',
      theme: 'rose'
    }
  ];

  missionVision = {
    mission:
      'La Fundación Afrocolombiana Profe en Casa | FACOPEC se dedica a captar y canalizar recursos a nivel local, nacional e internacional para desarrollar proyectos que promuevan y reivindiquen los derechos humanos de las Comunidades NARP (Negras, Afrocolombianas, Raizales y Palenqueras). Trabajamos para empoderar a niños, niñas, adolescentes, jóvenes, hombres, mujeres y familias, potenciando sus capacidades y sueños mediante programas educativos, culturales, recreativos, y tecnológicos, entre otros, con el fin de maximizar su impacto positivo y fomentar su desarrollo como actores de cambio en sus comunidades.',
    vision:
      'Ser reconocidos como una fundación líder en la promoción de los derechos humanos y el desarrollo integral de las Comunidades NARP. Aspiramos a crear un futuro donde estas comunidades puedan desplegar plenamente su potencial en ámbitos tecnológicos, educativos, culturales y sociales, contribuyendo activamente al progreso social, económico y ambiental de Colombia y el mundo.',
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

  programLogos: ProgramLogo[] = [
    { logo: 'assets/program-logos/guias.png', alt: 'Guías y Cuentos Cortos', href: 'https://cuentoscortosprofeencasa.blogspot.com/' },
    { logo: 'assets/program-logos/guias-mate.png', alt: 'Guías de Matemáticas', href: 'https://matematicasprofeencasa.blogspot.com/' },
    { logo: 'assets/program-logos/talleres-nivelacion.png', alt: 'Talleres de Nivelación', href: 'https://talleresdenivelacion.blogspot.com/' },
    { logo: 'assets/program-logos/plan-lector.png', alt: 'Plan Lector', href: 'https://rutaliterariamaria.blogspot.com/' },
    { logo: 'assets/program-logos/escuela-padres.png', alt: 'Escuela de Padres', href: 'https://consejosparapadresymadres.blogspot.com/' },
    { logo: 'assets/program-logos/espiritual.png', alt: 'Formación Espiritual', href: 'https://escueladominicalcreciendoconcristo.blogspot.com/' },
    { logo: 'assets/program-logos/comunidades-narp.png', alt: 'Comunidades NARP', href: 'https://docs.google.com/forms/d/e/1FAIpQLScI9v2p8Rgp892XzGbEcrN-yKsyMh4A5h1UGmRDeZw_9RqIGQ/viewform' },
    { logo: 'assets/program-logos/emplpeabilidad.png', alt: 'Empleabilidad', href: 'https://empleabilidad-facopec.blogspot.com/' },
    { logo: 'assets/program-logos/salida-pedagogica.png', alt: 'Salidas Pedagógicas', href: 'https://salidaspedagogicas-facopec.blogspot.com/' },
    { logo: 'assets/program-logos/educa.png', alt: 'FACOPEC Educa', href: 'https://facopeceduca.blogspot.com/' },
    { logo: 'assets/program-logos/dona-ropa.png', alt: 'Dona Ropa', href: 'https://quetienespararegalar.blogspot.com/' },
    { logo: 'assets/program-logos/comunitario.png', alt: 'Servicio Comunitario', href: 'https://serviciocomunitario-facopec.blogspot.com/' },
    { logo: 'assets/program-logos/primaria.png', alt: 'Desafío Matemáticos', href: 'https://desafio-matematicos.blogspot.com/' }
  ];

  programCards: ProgramCard[] = [
    {
      title: 'Semillero Digital',
      description:
        'Talleres STEAM, alfabetización digital y mentorías vocacionales que conectan a jóvenes con oportunidades tecnológicas.',
      highlights: ['Tecnología', 'Innovación', 'Mentorías'],
      href: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Semillero%20Digital',
      strapiCollection: 'programas',
      strapiEntryId: 'semillero-digital',
      logo: 'assets/program-logos/semillero-digital.svg',
      logoAlt: 'Logo del programa Semillero Digital'
    },
    {
      title: 'Club Familias que Acompañan',
      description:
        'Escuela de padres, orientación psicoemocional y redes solidarias para fortalecer el cuidado en casa.',
      highlights: ['Familias', 'Bienestar', 'Prevención'],
      href: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Familias',
      strapiCollection: 'programas',
      strapiEntryId: 'club-familias',
      logo: 'assets/program-logos/club-familias.svg',
      logoAlt: 'Logo del programa Club Familias que Acompañan'
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
      title: 'Teatro Las Dos Aguas',
      description: 'Salida pedagógica al Teatro Las Dos Aguas, una experiencia cultural que enriquece el aprendizaje de nuestros estudiantes.',
      cover: 'assets/program-logos/salida-pedagogica.png',
      type: 'image',
      href: 'https://salidaspedagogicas-facopec.blogspot.com/2025/10/facopec-dteatro.html',
      strapiCollection: 'galeria',
      strapiEntryId: 'teatro-dos-aguas'
    },
    {
      title: 'Museo de la Caña',
      description: 'Salida pedagógica al Museo de la Caña - Hacienda El Paraíso, explorando nuestra historia y patrimonio cultural.',
      cover: 'assets/program-logos/salida-pedagogica.png',
      type: 'image',
      href: 'https://salidaspedagogicas-facopec.blogspot.com/2025/04/museo-de-la-cana-hacienda-el-paraiso.html',
      strapiCollection: 'galeria',
      strapiEntryId: 'museo-cana'
    },
    {
      title: 'Curso Manipulación de Alimentos',
      description: 'Cooperación entre el SENA y la Fundación Afrocolombiana Profe en Casa para formación en manipulación de alimentos.',
      cover: 'assets/program-logos/educa.png',
      type: 'image',
      href: 'https://www.facebook.com/Profeencasasedecds/posts/pfbid0jUg224nXfxCa3MWdo2jZFps1mNcWDkuidzGDShV1FfcZgo6rBYeXLaYovtE5E61vl',
      strapiCollection: 'galeria',
      strapiEntryId: 'curso-manipulacion-alimentos'
    },
    {
      title: 'Desafío 5K',
      description: 'Una carrera llena de mucha energía y alegría en Ciudad del Sur, promoviendo la actividad física y el espíritu comunitario.',
      cover: 'assets/program-logos/comunitario.png',
      type: 'image',
      href: 'https://www.facebook.com/photo/?fbid=1007381601593265&set=pcb.1007384828259609',
      strapiCollection: 'galeria',
      strapiEntryId: 'desafio-5k'
    },
    {
      title: 'Feria de Empleo',
      description: 'Feria de empleo para conectar a nuestra comunidad con oportunidades laborales y fortalecer la empleabilidad.',
      cover: 'assets/program-logos/emplpeabilidad.png',
      type: 'image',
      href: 'https://www.facebook.com/Profeencasasedecds/posts/pfbid0TLJhrPgsq3YMiVUiqbErE6nMvQ8xUnREvvTjkoxm3ZuRTMmpjAGeuyo5EaLk6v3xl',
      strapiCollection: 'galeria',
      strapiEntryId: 'feria-empleo'
    }
  ];

  attendedPersons: AttendedPersonCardContent[] = [
    {
      program: 'Tutorías Profe en Casa',
      count: 120,
      description: 'Estudiantes en refuerzo escolar',
      icon: '🧠',
      theme: 'teal'
    },
    {
      program: 'Ruta Literaria María',
      count: 65,
      description: 'Participantes en círculos de lectura',
      icon: '📖',
      theme: 'blue'
    },
    {
      program: 'Semillero Digital',
      count: 45,
      description: 'Jóvenes en talleres STEAM',
      icon: '💻',
      theme: 'purple'
    },
    {
      program: 'Club Familias',
      count: 80,
      description: 'Familias acompañadas',
      icon: '👨‍👩‍👧‍👦',
      theme: 'rose'
    }
  ];

  eventCalendar: EventCalendarItemContent[] = [
    {
      title: 'Cierre del programa de nivelación',
      description: 'Cierre del programa de nivelación académica',
      eventDate: '2025-11-27T15:00:00',
      location: 'Sede FACOPEC',
      category: 'evento',
      color: 'teal',
      isHighlighted: true
    },
    {
      title: 'Mujeres Equidad y Empleo',
      description: 'Programa de empleabilidad y formación para mujeres',
      eventDate: '2025-11-10T09:00:00',
      endDate: '2026-01-10T17:00:00',
      location: 'Sede FACOPEC',
      category: 'formacion',
      color: 'purple',
      isHighlighted: true
    },
    {
      title: 'Taller de lectura en voz alta',
      description: 'Círculo literario con familias',
      eventDate: '2025-12-15T15:00:00',
      location: 'Biblioteca Comunitaria',
      category: 'taller',
      color: 'blue',
      isHighlighted: true
    },
    {
      title: 'Reunión Club Familias',
      description: 'Escuela de padres mensual',
      eventDate: '2025-12-20T17:00:00',
      location: 'Sede FACOPEC',
      category: 'reunion',
      color: 'rose'
    },
    {
      title: 'Celebración Fin de Año',
      description: 'Cierre de actividades 2025',
      eventDate: '2025-12-22T14:00:00',
      location: 'Parque Central',
      category: 'celebracion',
      color: 'gold',
      isHighlighted: true
    }
  ];

  ngOnInit(): void {
    this.restartCarouselAutoPlay();
    this.loadContent();
    this.loadGlobalBranding();
    this.setupAutoRefresh();
    this.startCarouselRotation();
  }

  ngOnDestroy(): void {
    this.stopCarouselRotation();
    this.clearCarouselInterval();

    if (typeof window !== 'undefined' && this.visibilityChangeHandler) {
      window.removeEventListener('visibilitychange', this.visibilityChangeHandler);
    }
  }

  toggleIdentityCard(key: IdentityCardKey): void {
    this.identityExpanded[key] = !this.identityExpanded[key];
  }

  get carouselTransform(): string {
    if (!this.heroCarousel.length) {
      return 'translateX(0)';
    }
    return `translateX(-${this.heroCarouselIndex * 100}%)`;
  }

  get carouselTrackWidth(): string {
    return `${Math.max(this.heroCarousel.length, 1) * 100}%`;
  }

  nextSlide(manual = true): void {
    if (!this.heroCarousel.length) {
      return;
    }

    this.heroCarouselIndex = (this.heroCarouselIndex + 1) % this.heroCarousel.length;

    if (manual) {
      this.restartCarouselInterval();
    }
  }

  previousSlide(): void {
    if (!this.heroCarousel.length) {
      return;
    }

    this.heroCarouselIndex =
      (this.heroCarouselIndex - 1 + this.heroCarousel.length) % this.heroCarousel.length;
    this.restartCarouselInterval();
  }

  goToSlide(index: number): void {
    if (index < 0 || index >= this.heroCarousel.length) {
      return;
    }

    this.heroCarouselIndex = index;
    this.restartCarouselInterval();
  }

  private startCarouselRotation(): void {
    if (typeof window === 'undefined') {
      return;
    }

    this.scheduleCarousel();
  }

  private stopCarouselRotation(): void {
    if (this.carouselIntervalId) {
      clearInterval(this.carouselIntervalId);
      this.carouselIntervalId = null;
    }
  }

  private restartCarouselInterval(): void {
    if (typeof window === 'undefined') {
      return;
    }

    this.scheduleCarousel();
  }

  private scheduleCarousel(): void {
    this.stopCarouselRotation();

    if (typeof window === 'undefined') {
      return;
    }

    if (this.heroCarousel.length <= 1) {
      return;
    }

    this.carouselIntervalId = window.setInterval(() => {
      this.nextSlide(false);
    }, this.carouselRotationMs);
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

      this.applyHeroCarousel(hero);
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
      const fallbackPrograms = [...this.programCards];
      const mapped = content.programs
        .map((program, index) => {
          const fallback = fallbackPrograms[index];
          const logoUrl = this.resolveMediaUrl(program.logo) ?? fallback?.logo;
          const logoAlt = program.logoAlt ?? program.title ?? fallback?.logoAlt ?? fallback?.title ?? '';

          return {
            title: program.title ?? fallback?.title ?? '',
            description: program.description ?? fallback?.description ?? '',
            highlights: program.highlights?.filter(Boolean) ?? fallback?.highlights ?? [],
            href: program.link ?? fallback?.href ?? '#',
            strapiCollection: program.strapiCollection ?? fallback?.strapiCollection ?? '',
            strapiEntryId: program.strapiEntryId ?? fallback?.strapiEntryId ?? '',
            logo: logoUrl ?? undefined,
            logoAlt: logoAlt
          } satisfies ProgramCard;
        })
        .filter(program => !!program.title);

      if (mapped.length) {
        this.programCards = mapped;
      }
    }

    // IMPORTANTE: Usar programs del CMS para poblar programLogos si programLogos está vacío
    if (content.programLogos?.length) {
      const fallbackLogos = [...this.programLogos];
      const mapped = content.programLogos
        .map((programLogo, index) => {
          const fallback = fallbackLogos[index];
          const logoUrl = this.resolveMediaUrl(programLogo.logo);

          return {
            logo: logoUrl ?? fallback?.logo ?? '',
            alt: programLogo.alt ?? fallback?.alt ?? '',
            href: programLogo.link ?? fallback?.href ?? '#'
          } satisfies ProgramLogo;
        })
        .filter(logo => !!logo.alt);

      if (mapped.length) {
        this.programLogos = mapped;
      }
    } else if (content.programs?.length) {
      // Si programLogos está vacío, usar programs como fuente de los logos
      const mapped = content.programs.map(program => ({
        logo: this.resolveMediaUrl(program.logo) ?? '',
        alt: program.title ?? '',
        href: program.link ?? '#'
      })).filter(logo => !!logo.alt && !!logo.href);

      if (mapped.length) {
        this.programLogos = mapped;
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

    if (content.attendedPersons?.length) {
      const mapped = content.attendedPersons
        .map(person => ({
          id: person.id,
          program: person.program,
          count: person.count ?? 0,
          description: person.description ?? '',
          icon: person.icon ?? '👥',
          theme: person.theme ?? 'teal'
        }))
        .filter(person => !!person.program);

      if (mapped.length) {
        this.attendedPersons = mapped;
      }
    }

    if (content.eventCalendar?.length) {
      const mapped = content.eventCalendar
        .map(event => ({
          id: event.id,
          title: event.title,
          description: event.description ?? '',
          eventDate: event.eventDate,
          endDate: event.endDate,
          location: event.location ?? '',
          category: event.category ?? 'evento',
          color: event.color ?? 'teal',
          isHighlighted: event.isHighlighted ?? false,
          link: event.link
        }))
        .filter(event => !!event.title && !!event.eventDate);

      // IMPORTANTE: Mezclar eventos del CMS con los hardcodeados en lugar de reemplazarlos
      // Esto asegura que las actividades hardcodeadas siempre estén presentes
      if (mapped.length) {
        const fallbackEvents = [
          {
            title: 'Cierre del programa de nivelación',
            description: 'Cierre del programa de nivelación académica',
            eventDate: '2025-11-27T15:00:00',
            location: 'Sede FACOPEC',
            category: 'evento',
            color: 'teal',
            isHighlighted: true
          },
          {
            title: 'Mujeres Equidad y Empleo',
            description: 'Programa de empleabilidad y formación para mujeres',
            eventDate: '2025-11-10T09:00:00',
            endDate: '2026-01-10T17:00:00',
            location: 'Sede FACOPEC',
            category: 'formacion',
            color: 'purple',
            isHighlighted: true
          }
        ];

        // Combinar eventos hardcodeados con los del CMS, evitando duplicados por título
        const existingTitles = new Set(mapped.map(e => e.title.toLowerCase()));
        const additionalEvents = fallbackEvents.filter(
          e => !existingTitles.has(e.title.toLowerCase())
        );

        this.eventCalendar = [...additionalEvents, ...mapped];
      }
    }

    this.loading = false;
    this.lastContentRefresh = Date.now();
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
      .map(highlight => {
        const imageUrl = this.resolveMediaUrl(highlight.image);
        return {
          icon: highlight.icon ?? '✨',
          imagePath: imageUrl ?? '', // Use CMS image if available
          title: highlight.title,
          label: highlight.label ?? highlight.description ?? '',
          dataStrapiUid: highlight.dataUid ?? '',
          theme: (highlight.theme as (typeof this.impactHighlights)[number]['theme']) ?? 'teal'
        };
      })
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

  private applyHeroCarousel(hero: HeroSectionContent): void {
    const slides: HeroCarouselSlide[] = [];

    hero.carouselItems?.forEach(item => {
      const imageUrl = this.resolveMediaUrl(item.image);
      if (!imageUrl) {
        return;
      }

      const caption = item.image?.caption ?? item.description ?? item.title ?? undefined;
      const alt = item.image?.alternativeText ?? item.title ?? caption ?? 'Fotografía de FACOPEC';
      slides.push({ image: imageUrl, alt, caption });
    });

    if (slides.length) {
      this.setHeroCarousel(slides);
    } else if (!this.heroCarousel.length) {
      this.setHeroCarousel(this.fallbackCarouselSlides);
    }
  }

  private setHeroCarousel(slides: HeroCarouselSlide[]): void {
    this.heroCarousel = slides.map(slide => ({ ...slide }));
    this.heroCarouselIndex = 0;

    // Update carouselImages for the app-hero-carousel component
    this.carouselImages = slides.map(slide => ({
      url: slide.image,
      alt: slide.alt,
      title: slide.caption
    }));

    this.restartCarouselAutoPlay();
  }

  private restartCarouselAutoPlay(): void {
    this.clearCarouselInterval();

    if (!this.heroCarousel.length || typeof document === 'undefined') {
      return;
    }

    this.carouselIntervalId = setInterval(() => {
      if (document.visibilityState === 'visible') {
        this.heroCarouselIndex = (this.heroCarouselIndex + 1) % this.heroCarousel.length;
      }
    }, this.carouselRotationMs);
  }

  private clearCarouselInterval(): void {
    if (this.carouselIntervalId) {
      clearInterval(this.carouselIntervalId);
      this.carouselIntervalId = null;
    }
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

    const refreshThreshold = 10000; // 10 seconds (reduced for faster updates)

    if (this.visibilityChangeHandler) {
      window.removeEventListener('visibilitychange', this.visibilityChangeHandler);
    }

    this.visibilityChangeHandler = (): void => {
      if (document.visibilityState !== 'visible') {
        return;
      }

      const timeSinceLastLoad = Date.now() - this.lastContentRefresh;

      if (timeSinceLastLoad <= refreshThreshold) {
        return;
      }

      console.log('Auto-refreshing content after tab became visible');

      this.strapiService.refreshHomePage().subscribe({
        next: content => this.applyHomeContent(content),
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
    };

    window.addEventListener('visibilitychange', this.visibilityChangeHandler);
  }

  /** Employability Form Properties */
  employabilityForm = {
    name: '',
    email: '',
    phone: '',
    education: '',
    interests: ''
  };

  employabilityFormSubmitting = false;
  employabilityFormSubmitted = false;
  employabilityFormError: string | null = null;

  /**
   * Submit employability form
   * Sends form data to the email profeencasasedeciudaddelsur@gmail.com
   */
  submitEmployabilityForm(): void {
    if (this.employabilityFormSubmitting) {
      return;
    }

    this.employabilityFormSubmitting = true;
    this.employabilityFormError = null;
    this.employabilityFormSubmitted = false;

    // Enviar el formulario usando el servicio de email
    this.emailService.sendEmployabilityForm(this.employabilityForm).subscribe({
      next: (response) => {
        console.log('Formulario enviado exitosamente:', response);
        console.log('Email enviado a: profeencasasedeciudaddelsur@gmail.com');

        this.employabilityFormSubmitting = false;
        this.employabilityFormSubmitted = true;

        // Reset form after successful submission
        this.employabilityForm = {
          name: '',
          email: '',
          phone: '',
          education: '',
          interests: ''
        };

        // Hide success message after 5 seconds
        setTimeout(() => {
          this.employabilityFormSubmitted = false;
        }, 5000);
      },
      error: (error) => {
        console.error('Error al enviar el formulario:', error);
        this.employabilityFormSubmitting = false;
        this.employabilityFormError = 'Hubo un error al enviar el formulario. Por favor, intenta nuevamente.';

        // Hide error message after 5 seconds
        setTimeout(() => {
          this.employabilityFormError = null;
        }, 5000);
      }
    });
  }
}
