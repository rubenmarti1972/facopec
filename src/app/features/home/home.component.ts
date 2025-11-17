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
  variant: 'primary' | 'secondary';
  dataStrapiUid: string;
}

interface HeroVerse {
  reference: string;
  text: string;
  description: string;
}

interface HeroCarouselSlide {
  url: string;
  alt: string;
  title?: string;
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
      url: 'assets/ninos.jpg',
      alt: 'Niñas y niños afrocolombianos compartiendo en comunidad',
      title: 'Aprendizajes con sentido desde Puerto Tejada'
    },
    {
      url: 'assets/fotos-fundacion/portada.webp',
      alt: 'Equipo pedagógico acompañando actividades en FACOPEC',
      title: 'Educación y acompañamiento integral para las familias'
    },
    {
      url: 'assets/fotos-fundacion/collage.webp',
      alt: 'Collage de experiencias educativas y culturales de la fundación',
      title: 'Arte, lectura y tecnología para transformar territorios'
    },
    {
      url: 'assets/fotos-fundacion/collage-profe.webp',
      alt: 'Voluntariado y equipo FACOPEC reunidos con la comunidad',
      title: 'Redes solidarias que abrazan a la comunidad'
    }
  ];

  heroCarousel: HeroCarouselSlide[] = this.fallbackCarouselSlides.map(slide => ({ ...slide }));
  heroCarouselIndex = 0;
  private carouselIntervalId: ReturnType<typeof setInterval> | null = null;
  private readonly carouselRotationMs = 20000;
  private visibilityChangeHandler?: () => void;
  private lastContentRefresh = Date.now();

  // Fallback mínimo - Solo se usa si el CMS falla
  hero: HeroContent = {
    eyebrow: 'Cargando...',
    title: ['Fundación Afrocolombiana', 'Profe en Casa'],
    lead: 'Cargando información desde el CMS...',
    stats: [],
    actions: [],
    verse: {
      reference: '',
      text: '',
      description: ''
    },
    image: 'assets/logo.png',
    imageAlt: 'FACOPEC'
  };

  globalLogoUrl = 'assets/logo.png';
  globalLogoAlt = 'Logo FACOPEC';

  // Fallback mínimo - Se llena del CMS
  identity = {
    description: '',
    dataStrapiUid: 'about.description',
    values: <IdentityValue[]>[]
  };

  // Fallback mínimo - Se llena del CMS
  impactHighlights: Array<{
    icon: string;
    imagePath: string;
    title: string;
    label: string;
    dataStrapiUid: string;
    theme: string;
  }> = [];

  // Fallback mínimo - Se llena del CMS
  missionVision = {
    mission: '',
    vision: '',
    dataStrapiUidMission: 'about.mission',
    dataStrapiUidVision: 'about.vision'
  };

  identityExpanded: Record<IdentityCardKey, boolean> = {
    description: false,
    mission: false,
    vision: false
  };

  // Fallback mínimo - Se llena del CMS
  activityCards: ActivityCard[] = [];

  // Fallback mínimo - Se llena del CMS
  programCards: ProgramCard[] = [];

  // Fallback mínimo - Se llena del CMS
  supporters: SupporterLogo[] = [];

  // Fallback mínimo - Se llena del CMS
  catalogItems: CatalogItem[] = [];

  // Fallback mínimo - Se llena del CMS
  galleryItems: GalleryItem[] = [];

  // Fallback mínimo - Se llena del CMS
  attendedPersons: AttendedPersonCardContent[] = [];

  // Fallback mínimo - Se llena del CMS
  eventCalendar: EventCalendarItemContent[] = [];

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

    // Actualizar siempre, incluso si está vacío (para reflejar eliminaciones del CMS)
    if (content.attendedPersons !== undefined) {
      const mapped = (content.attendedPersons || [])
        .map(person => ({
          id: person.id,
          program: person.program,
          count: person.count ?? 0,
          description: person.description ?? '',
          icon: person.icon ?? '👥',
          theme: person.theme ?? 'teal'
        }))
        .filter(person => !!person.program);

      this.attendedPersons = mapped;
    }

    // Actualizar siempre, incluso si está vacío (para reflejar eliminaciones del CMS)
    if (content.eventCalendar !== undefined) {
      const mapped = (content.eventCalendar || [])
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

      this.eventCalendar = mapped;
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

      const title = item.image?.caption ?? item.description ?? item.title ?? undefined;
      const alt = item.image?.alternativeText ?? item.title ?? title ?? 'Fotografía de FACOPEC';
      slides.push({ url: imageUrl, alt, title });
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
