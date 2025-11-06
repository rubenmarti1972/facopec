import { Component, ChangeDetectionStrategy, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { StrapiService } from '@core/services/strapi.service';
import { DonationsPageContent, MediaAsset } from '@core/models';

type DonationType = 'once' | 'monthly';

interface DonationMetric {
  value: string;
  label: string;
  dataStrapiUid: string;
}

interface DonationHighlight {
  icon: string;
  title: string;
  description: string;
  theme: 'teal' | 'blue' | 'sun' | 'rose';
  dataStrapiUid: string;
}

interface DonationStory {
  title: string;
  description: string;
  impact: string;
  cover: string;
  href: string;
  strapiCollection: string;
  strapiEntryId: string;
}

interface SupportAction {
  icon: string;
  title: string;
  description: string;
  href: string;
  linkLabel: string;
  theme: 'teal' | 'blue' | 'rose' | 'sun';
  dataStrapiUid: string;
}

interface PaymentGateway {
  name: string;
  description: string;
  href: string;
  actionLabel: string;
  badge: string;
  theme: 'pse' | 'international';
}

@Component({
  selector: 'app-donate',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './donate.component.html',
  styleUrls: ['./donate.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DonateComponent implements OnInit {
  private readonly strapiService = inject(StrapiService);

  loading = true;
  error: string | null = null;

  heroTitlePrimary = 'Tu donación';
  heroTitleHighlight = 'cambia vidas';
  heroDescription =
    'Con cada aporte fortalecemos procesos educativos, culturales y espirituales en el Valle del Cauca. Acompañas a familias afrocolombianas para que sigan soñando con más oportunidades.';

  // UI model
  donationAmounts = [
    { value: 20000, label: '$20.000', icon: '🎒', impact: 'Útiles para un niño' },
    { value: 50000, label: '$50.000', icon: '📚', impact: 'Libros y lectura guiada' },
    { value: 100000, label: '$100.000', icon: '🍎', impact: 'Refrigerios de un taller' },
    { value: 200000, label: '$200.000', icon: '🚌', impact: 'Transporte a actividades' },
  ];

  donationStats: DonationMetric[] = [
    {
      value: '+180',
      label: 'Kits escolares entregados en 2023',
      dataStrapiUid: 'donations.stats.kits',
    },
    {
      value: '24',
      label: 'Familias con acompañamiento nutricional',
      dataStrapiUid: 'donations.stats.families',
    },
    {
      value: '12',
      label: 'Voluntarios articulados cada mes',
      dataStrapiUid: 'donations.stats.volunteers',
    },
  ];

  donationHighlights: DonationHighlight[] = [
    {
      icon: '📚',
      title: 'Educación accesible',
      description: 'Materiales, tutorías y recursos digitales para niñas y niños afrocolombianos.',
      theme: 'teal',
      dataStrapiUid: 'donations.highlights.education',
    },
    {
      icon: '🤝🏾',
      title: 'Crecimiento comunitario',
      description: 'Encuentros familiares, redes solidarias y acompañamiento psicoemocional.',
      theme: 'blue',
      dataStrapiUid: 'donations.highlights.community',
    },
    {
      icon: '🌱',
      title: 'Huerta y nutrición',
      description: 'Huertas urbanas, soberanía alimentaria y formación en hábitos saludables.',
      theme: 'sun',
      dataStrapiUid: 'donations.highlights.garden',
    },
    {
      icon: '🎶',
      title: 'Arte y espiritualidad',
      description: 'Laboratorios creativos, danza y espacios de fe que fortalecen la identidad.',
      theme: 'rose',
      dataStrapiUid: 'donations.highlights.art',
    },
  ];

  donationStories: DonationStory[] = [
    {
      title: 'Tutorías Profe en Casa',
      description: 'Voluntariado pedagógico que refuerza lectura, matemáticas y tecnología desde el hogar.',
      impact: 'Con $85.000 COP aseguras kits completos para un estudiante durante un trimestre.',
      cover: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200&q=80',
      href: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Tutor%C3%ADas',
      strapiCollection: 'donaciones-historias',
      strapiEntryId: 'tutorias-profe-en-casa',
    },
    {
      title: 'Huerta comunitaria',
      description: 'Familias siembran y aprenden sobre alimentación sostenible con apoyo de la fundación.',
      impact: 'Una donación de $70.000 COP respalda canastas de alimentos para cuatro familias.',
      cover: 'https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=1200&q=80',
      href: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Huerta',
      strapiCollection: 'donaciones-historias',
      strapiEntryId: 'huerta-comunitaria',
    },
    {
      title: 'Ruta Literaria María',
      description: 'Clubes de lectura, escritura creativa y encuentros culturales que celebran la afrocolombianidad.',
      impact: 'Con $45.000 COP apoyas la compra de libros y actividades para un círculo de lectura.',
      cover: 'https://images.unsplash.com/photo-1529158062015-cad636e69505?auto=format&fit=crop&w=1200&q=80',
      href: 'https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Ruta%20Literaria%20Mar%C3%ADa',
      strapiCollection: 'donaciones-historias',
      strapiEntryId: 'ruta-literaria',
    },
  ];

  supportActions: SupportAction[] = [
    {
      icon: '🤝',
      title: 'Apadrina un niño',
      description: 'Acompaña el proceso educativo y emocional de una niña o un niño durante todo el año.',
      href: '/apadrina',
      linkLabel: 'Conocer más',
      theme: 'sun',
      dataStrapiUid: 'donations.actions.sponsor',
    },
    {
      icon: '⏰',
      title: 'Voluntariado activo',
      description: 'Comparte tu tiempo en tutorías, logística de eventos y mentorías profesionales.',
      href: '/contacto',
      linkLabel: 'Inscribirme',
      theme: 'teal',
      dataStrapiUid: 'donations.actions.volunteer',
    },
    {
      icon: '📢',
      title: 'Comparte nuestra misión',
      description: 'Multiplica el mensaje en redes sociales y vincula nuevos aliados solidarios.',
      href: 'https://www.facebook.com/FundacionAfrocolombianaProfeEnCasa',
      linkLabel: 'Compartir',
      theme: 'rose',
      dataStrapiUid: 'donations.actions.share',
    },
  ];

  paymentGateways: PaymentGateway[] = [
    {
      name: 'Pagos PSE (Colombia)',
      description:
        'Conéctate con tu banco a través de la pasarela PSE y realiza transferencias seguras desde cualquier entidad nacional.',
      href: 'https://www.pse.com.co/persona',
      actionLabel: 'Donar con PSE',
      badge: '🇨🇴 PSE',
      theme: 'pse',
    },
    {
      name: 'Pasarela internacional',
      description:
        'Haz tu aporte desde el exterior con tarjeta de crédito o cuenta PayPal en una plataforma segura para aliados globales.',
      href: 'https://www.paypal.com/donate',
      actionLabel: 'Donar desde el exterior',
      badge: '🌍 Global',
      theme: 'international',
    },
  ];

  ngOnInit(): void {
    this.loadContent();
  }

  // Estado con señales
  readonly selectedAmount = signal<number>(0);
  readonly donationType = signal<DonationType>('once');

  // Monto personalizado (input con ngModel)
  customAmount: number | null = null;

  // Derivados (si los quieres usar en la plantilla)
  readonly isCustom = computed(() => this.customAmount != null && this.customAmount > 0);

  // Acciones
  selectAmount(value: number): void {
    this.selectedAmount.set(value);
    // limpiar campo personalizado si eligen uno predefinido
    this.customAmount = null;
  }

  onCustomAmountChange(): void {
    const v = Number(this.customAmount ?? 0);
    // fuerza mínimo 0 y quita NaN
    const safe = Number.isFinite(v) && v > 0 ? Math.floor(v) : 0;
    this.selectedAmount.set(safe);
  }

  getImpactMessage(): string {
    const amount = this.selectedAmount();
    const kind = this.donationType();

    // Texto base por tramos (ajústalo a tu realidad)
    let base: string;
    if (amount >= 200000) base = 'financia transporte y materiales para un grupo de niños';
    else if (amount >= 100000) base = 'cubre materiales y alimentación para un taller';
    else if (amount >= 50000) base = 'apoya libros y actividades de lectura';
    else if (amount >= 20000) base = 'aporta útiles para un estudiante';
    else base = 'apoya nuestras actividades';

    const suffix = kind === 'monthly'
      ? ' cada mes, creando impacto sostenido.'
      : ' en una jornada puntual.';

    return `Tu aporte de $${amount.toLocaleString('es-CO')} ${base}${suffix}`;
  }

  processDonation(): void {
    const payload = {
      amountCOP: this.selectedAmount(),
      type: this.donationType(),
      isCustom: this.isCustom(),
      ts: new Date().toISOString(),
    };
    // Aquí conectas con tu pasarela real (Wompi/PayPal/PSE/etc.)
    console.log('Donation payload →', payload);

    // Ejemplo: redirección o toast
    // this.router.navigate(['/gracias']);  // si usas Router
    // o muestra un modal/toast de éxito
    alert('¡Gracias por tu donación! Procesaremos el pago a continuación.');
  }

  private loadContent(): void {
    this.strapiService.getDonationsPage().subscribe({
      next: content => this.applyDonationsContent(content),
      error: error => {
        console.error('Error loading donations page content', error);
        this.error = error instanceof Error ? error.message : 'No se pudo cargar el contenido de donaciones.';
        this.loading = false;
      }
    });
  }

  private applyDonationsContent(content: DonationsPageContent): void {
    if (content.heroTitle) {
      const parts = content.heroTitle.split('|').map(part => part.trim()).filter(Boolean);
      this.heroTitlePrimary = parts[0] ?? content.heroTitle;
      this.heroTitleHighlight = parts[1] ?? this.heroTitleHighlight;
    }

    if (content.heroSubtitle) {
      this.heroDescription = content.heroSubtitle;
    }

    if (content.donationAmounts?.length) {
      const mapped = content.donationAmounts
        .map(amount => ({
          value: amount.value ?? 0,
          label: amount.label ?? '',
          icon: amount.icon ?? '🎁',
          impact: amount.impact ?? ''
        }))
        .filter(amount => amount.value > 0 && !!amount.label);

      if (mapped.length) {
        this.donationAmounts = mapped;
      }
    }

    if (content.metrics?.length) {
      const mapped = content.metrics
        .map(metric => ({
          value: metric.value,
          label: metric.label,
          dataStrapiUid: metric.dataUid ?? ''
        }))
        .filter(metric => !!metric.value && !!metric.label);

      if (mapped.length) {
        this.donationStats = mapped;
      }
    }

    if (content.highlights?.length) {
      const mapped = content.highlights
        .map(highlight => ({
          icon: highlight.icon ?? '✨',
          title: highlight.title,
          description: highlight.description ?? '',
          theme: (highlight.theme as DonationHighlight['theme']) ?? 'teal',
          dataStrapiUid: highlight.dataUid ?? ''
        }))
        .filter(highlight => !!highlight.title);

      if (mapped.length) {
        this.donationHighlights = mapped;
      }
    }

    const fallbackStories = [...this.donationStories];
    if (content.stories?.length) {
      const mapped = content.stories
        .map((story, index) => ({
          title: story.title,
          description: story.description ?? '',
          impact: story.impact ?? '',
          cover: this.resolveMediaUrl(story.cover) ?? fallbackStories[index]?.cover ?? fallbackStories[0]?.cover ?? '',
          href: story.link ?? '#',
          strapiCollection: story.strapiCollection ?? '',
          strapiEntryId: story.strapiEntryId ?? ''
        }))
        .filter(story => !!story.title && !!story.cover);

      if (mapped.length) {
        this.donationStories = mapped;
      }
    }

    if (content.supportActions?.length) {
      const mapped = content.supportActions
        .map(action => ({
          icon: action.icon ?? '🤝',
          title: action.title,
          description: action.description ?? '',
          href: action.link ?? '#',
          linkLabel: action.linkLabel ?? 'Conocer más',
          theme: (action.theme as SupportAction['theme']) ?? 'teal',
          dataStrapiUid: action.dataUid ?? ''
        }))
        .filter(action => !!action.title && !!action.href);

      if (mapped.length) {
        this.supportActions = mapped;
      }
    }

    if (content.paymentGateways?.length) {
      const mapped = content.paymentGateways
        .map(gateway => ({
          name: gateway.name,
          description: gateway.description ?? '',
          href: gateway.link ?? '#',
          actionLabel: gateway.actionLabel ?? 'Donar',
          badge: gateway.badge ?? '',
          theme: (gateway.theme as PaymentGateway['theme']) ?? 'pse'
        }))
        .filter(gateway => !!gateway.name && !!gateway.href);

      if (mapped.length) {
        this.paymentGateways = mapped;
      }
    }

    this.loading = false;
  }

  private resolveMediaUrl(media?: MediaAsset | null): string | null {
    return this.strapiService.buildMediaUrl(media);
  }
}

