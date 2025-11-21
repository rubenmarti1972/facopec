import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { StrapiService } from '@core/services/strapi.service';
import { HomePageContent } from '@core/models';

interface IdentityValue {
  title: string;
  description: string;
  icon: string;
  dataStrapiUid: string;
}

type IdentityCardKey = 'description' | 'mission' | 'vision';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  private readonly strapiService = inject(StrapiService);
  private readonly sanitizer = inject(DomSanitizer);

  loading = true;
  error: string | null = null;

  // URL del organigrama con fallback hardcodeado
  organigramaUrl = 'https://www.canva.com/design/DAG5Qgbtdg8/YDQsqBd1PqH4WtBZybKmEQ/view?embed';
  safeOrganigramaUrl: SafeResourceUrl | null = null;

  identity = {
    description:
      'Somos FACOPEC, una fundación afrocolombiana que canaliza recursos locales, nacionales e internacionales para impulsar proyectos educativos, culturales, recreativos y tecnológicos en Comunidades NARP (Negras, Afrocolombianas, Raizales y Palenqueras). Desde el Cauca acompañamos a niñas, niños, adolescentes, jóvenes y familias para potenciar sus capacidades, fortalecer sus sueños y activar su liderazgo comunitario.',
    dataStrapiUid: 'about.description',
    values: <IdentityValue[]>[
      {
        title: 'Derechos humanos y dignidad',
        description:
          'Promovemos la defensa y reivindicación de los derechos de las Comunidades NARP (Negras, Afrocolombianas, Raizales y Palenqueras).',
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

  ngOnInit(): void {
    this.safeOrganigramaUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.organigramaUrl);
    this.loadContent();
    this.loadOrganizationInfo();
    this.setupAutoRefresh();
  }

  toggleIdentityCard(key: IdentityCardKey): void {
    this.identityExpanded[key] = !this.identityExpanded[key];
  }

  private loadContent(): void {
    this.strapiService.getHomePage().subscribe({
      next: content => this.applyContent(content),
      error: error => {
        console.error('Error loading about content from Strapi', error);
        this.error = error instanceof Error ? error.message : 'No se pudo cargar el contenido institucional.';
        this.loading = false;
      }
    });
  }

  private loadOrganizationInfo(): void {
    this.strapiService.getOrganizationInfo().subscribe({
      next: orgInfo => {
        if (orgInfo?.organigramaUrl) {
          this.organigramaUrl = orgInfo.organigramaUrl;
          this.safeOrganigramaUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.organigramaUrl);
        }
      },
      error: error => {
        console.error('Error loading organization info from Strapi', error);
        // Mantener el fallback hardcodeado si hay error
      }
    });
  }

  private applyContent(content: HomePageContent): void {
    if (content.identity) {
      const fallbackValues = [...this.identity.values];
      this.identity = {
        description: content.identity.description ?? this.identity.description,
        dataStrapiUid: content.identity.dataUid ?? this.identity.dataStrapiUid,
        values:
          content.identity.values?.map((value, index) => ({
            title: value.title,
            description: value.description ?? fallbackValues[index]?.description ?? '',
            icon: value.icon ?? fallbackValues[index]?.icon ?? '✨',
            dataStrapiUid: value.dataUid ?? fallbackValues[index]?.dataStrapiUid ?? ''
          })).filter(value => !!value.title) ?? fallbackValues
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

    this.loading = false;
  }

  /**
   * Setup auto-refresh when window regains focus
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
          console.log('Auto-refreshing about content after tab became visible');
          this.strapiService.refreshHomePage().subscribe({
            next: content => {
              this.applyContent(content);
              lastLoadTime = Date.now();
            },
            error: error => {
              console.error('Error refreshing about content', error);
            }
          });
        }
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
  }
}
