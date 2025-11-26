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

  financialProjects = [
    {
      name: 'Programa Tecnología Rural',
      income: 980_000_000,
      executed: 820_000_000
    },
    {
      name: 'Becas de Innovación Juvenil',
      income: 720_000_000,
      executed: 645_000_000
    },
    {
      name: 'Formación Docente en TIC',
      income: 550_000_000,
      executed: 490_000_000
    },
    {
      name: 'Laboratorio STEAM para Comunidades',
      income: 430_000_000,
      executed: 398_000_000
    },
    {
      name: 'Programa de Alfabetización Digital',
      income: 370_000_000,
      executed: 350_000_000
    }
  ];

  chartVisible = false;

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

  get executionTotals(): { income: number; executed: number; balance: number } {
    const income = this.financialProjects.reduce((sum, project) => sum + project.income, 0);
    const executed = this.financialProjects.reduce((sum, project) => sum + project.executed, 0);
    return {
      income,
      executed,
      balance: income - executed
    };
  }

  getExecutionPercent(projectIncome: number, executed: number): number {
    if (!projectIncome) {
      return 0;
    }
    return Math.round((executed / projectIncome) * 100);
  }

  trackByProjectName(_index: number, project: { name: string }): string {
    return project.name;
  }

  toggleChartVisibility(): void {
    this.chartVisible = !this.chartVisible;
  }

  printFinancialReport(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const section = document.getElementById('financial-report');
    if (!section) {
      return;
    }

    const printWindow = window.open('', '_blank', 'width=900,height=650');

    if (!printWindow) {
      return;
    }

    const styles = `
      body { font-family: 'Inter', system-ui, -apple-system, sans-serif; color: #0f2a3d; padding: 24px; }
      h1 { margin: 0 0 8px; color: #0f2a3d; }
      p { margin: 0 0 12px; color: #3c4f63; }
      table { width: 100%; border-collapse: collapse; margin-top: 12px; }
      th, td { border-bottom: 1px solid rgba(15, 42, 61, 0.1); padding: 10px 12px; text-align: left; }
      th { background: rgba(20, 97, 75, 0.08); color: #14614b; text-transform: uppercase; letter-spacing: 0.04em; font-size: 12px; }
      tfoot td { font-weight: 700; color: #0f2a3d; }
      .summary { display: flex; align-items: center; gap: 16px; margin-bottom: 8px; }
      .summary img { height: 48px; width: 48px; object-fit: contain; }
      .badge { background: rgba(20, 97, 75, 0.1); color: #14614b; padding: 6px 12px; border-radius: 999px; font-weight: 600; font-size: 12px; display: inline-block; }
    `;

    printWindow.document.write(`
      <html>
        <head>
          <title>Informe Financiero 2025</title>
          <style>${styles}</style>
        </head>
        <body>
          <div class="summary">
            <img src="${location.origin}/assets/logo.png" alt="Logo Fundación Avanza">
            <div>
              <h1>Fundación Avanza – Año 2025</h1>
              <span class="badge">Informe financiero anual por proyecto</span>
              <p>Datos simulados para fines informativos.</p>
            </div>
          </div>
          ${section.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
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
