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
  chartType: 'bars' | 'pie' = 'bars';

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
      'La misión de la Fundación Afrocolombiana Profe en Casa  | (FACOPEC) es transformar vidas mediante una educación inclusiva y de calidad. Nos dedicamos a gestionar recursos para desarrollar proyectos que promuevan y defiendan los derechos humanos de las comunidades Negras, afrocolombianas, raizales y palenqueras (NARP). A través de la filantropía, empoderamos a individuos y familias, potenciando sus capacidades mediante programas educativos, culturales, recreativos y tecnológicos, con el objetivo de maximizar el impacto positivo y fomentar el desarrollo como agentes de cambio.',
    vision:
    'La visión de la Fundación Afrocolombiana Profe en Casa | (FACOPEC) es ser reconocidos como una entidad líder en la promoción de los derechos humanos y el desarrollo integral de las comunidades (NARP) Negras, afrocolombianas, raizales y palenqueras. Aspiramos a forjar un futuro donde estas comunidades desarrollen plenamente su potencial en los ámbitos tecnológicos, educativos, culturales y sociales, contribuyendo activamente al progreso social, económico y ambiental de Colombia y del mundo.',
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

  getDonutBackground(percent: number): string {
    const clamped = Math.min(100, Math.max(0, percent));
    return `conic-gradient(#178f6b 0% ${clamped}%, rgba(15, 42, 61, 0.12) ${clamped}% 100%)`;
  }

  trackByProjectName(_index: number, project: { name: string }): string {
    return project.name;
  }

  toggleChartVisibility(): void {
    this.chartVisible = !this.chartVisible;
  }

  setChartType(type: 'bars' | 'pie'): void {
    this.chartType = type;
  }

  private formatCurrency(value: number): string {
    return value.toLocaleString('es-CO');
  }

  printFinancialReport(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const printWindow = window.open('', '_blank', 'width=900,height=650');

    if (!printWindow) {
      return;
    }

    const tableRows = this.financialProjects
      .map(
        project => `
          <tr>
            <th scope="row">${project.name}</th>
            <td>${this.formatCurrency(project.income)}</td>
            <td>${this.formatCurrency(project.executed)}</td>
            <td>${this.formatCurrency(project.income - project.executed)}</td>
          </tr>
        `
      )
      .join('');

    const bars = this.financialProjects
      .map(project => {
        const executedPercent = this.getExecutionPercent(project.income, project.executed);
        const balancePercent = 100 - executedPercent;
        return `
          <li class="bar-item">
            <div class="bar-label">
              <span>${project.name}</span>
              <span class="bar-percent">${executedPercent}% ejecutado</span>
            </div>
            <div class="bar-track" aria-hidden="true">
              <span class="bar-executed" style="width:${executedPercent}%;"></span>
              <span class="bar-balance" style="width:${balancePercent}%;"></span>
            </div>
            <div class="bar-values">
              <span>Ejecutado: ${this.formatCurrency(project.executed)} COP</span>
              <span>Saldo: ${this.formatCurrency(project.income - project.executed)} COP</span>
            </div>
          </li>
        `;
      })
      .join('');

    const { income, executed, balance } = this.executionTotals;

    const styles = `
      body { font-family: 'Inter', system-ui, -apple-system, sans-serif; color: #0f2a3d; padding: 32px; background: #f5f7f8; }
      h1 { margin: 0 0 6px; color: #0f2a3d; letter-spacing: 0.01em; }
      p { margin: 0; color: #3c4f63; }
      table { width: 100%; border-collapse: collapse; margin-top: 12px; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(15, 42, 61, 0.08); }
      th, td { border-bottom: 1px solid rgba(15, 42, 61, 0.1); padding: 12px 14px; text-align: left; }
      th { background: rgba(20, 97, 75, 0.12); color: #14614b; text-transform: uppercase; letter-spacing: 0.04em; font-size: 12px; }
      tfoot td { font-weight: 700; color: #0f2a3d; background: rgba(15, 42, 61, 0.06); }
      .summary { display: flex; align-items: center; gap: 16px; margin-bottom: 18px; }
      .summary img { height: 96px; width: 96px; object-fit: contain; animation: logoRotate 16s linear infinite; }
      .badge { background: rgba(20, 97, 75, 0.12); color: #14614b; padding: 7px 12px; border-radius: 999px; font-weight: 700; font-size: 13px; display: inline-block; }
      .bars { list-style: none; padding: 0; margin: 18px 0 0; display: grid; gap: 12px; }
      .bar-item { background: #fff; border: 1px solid rgba(15, 42, 61, 0.08); border-radius: 14px; padding: 12px 14px; box-shadow: 0 10px 30px rgba(15, 42, 61, 0.06); }
      .bar-label { display: flex; justify-content: space-between; align-items: center; font-weight: 700; color: #0f2a3d; }
      .bar-percent { color: #178f6b; font-weight: 800; }
      .bar-track { position: relative; display: flex; width: 100%; height: 12px; border-radius: 999px; overflow: hidden; background: rgba(20, 97, 75, 0.12); margin: 10px 0; }
      .bar-executed { background: linear-gradient(90deg, #178f6b, #0d4f3b); }
      .bar-balance { background: rgba(15, 42, 61, 0.12); }
      .bar-values { display: flex; justify-content: space-between; color: #3c4f63; font-size: 13px; }
      @keyframes logoRotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
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
            </div>
          </div>
          <table aria-label="Informe financiero anual 2025">
            <thead>
              <tr>
                <th scope="col">Proyecto</th>
                <th scope="col">Ingresos (COP)</th>
                <th scope="col">Ejecutado (COP)</th>
                <th scope="col">Saldo (COP)</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
            <tfoot>
              <tr>
                <td>TOTAL GENERAL</td>
                <td>${this.formatCurrency(income)}</td>
                <td>${this.formatCurrency(executed)}</td>
                <td>${this.formatCurrency(balance)}</td>
              </tr>
            </tfoot>
          </table>
          <ul class="bars" aria-label="Ejecución por proyecto">
            ${bars}
          </ul>
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
