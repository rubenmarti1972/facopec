import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-official-logos-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="official-logos-bar">
      <div class="official-logos-container">
        <div class="official-logo">
          <a
            href="https://www.icbf.gov.co/pj-4829-fundacion-afrocolombiana-profe-en-casa"
            target="_blank"
            rel="noopener noreferrer"
            class="official-logo-link">
            <img
              src="assets/fotos-fundacion/logo bienestar.png"
              alt="Instituto Colombiano de Bienestar Familiar - ICBF"
              class="official-logo-image">
            <div class="official-logo-info">
              <span class="official-logo-text">RESOLUCIÓN N. 4829</span>
              <span class="official-logo-date">del 26/08/2025 - ICBF</span>
            </div>
          </a>
        </div>

        <div class="official-logo">
          <div class="official-logo-link">
            <div class="official-logo-placeholder">
              <span class="placeholder-text">MINISTERIO DEL INTERIOR</span>
            </div>
            <div class="official-logo-info">
              <span class="official-logo-text">RESOLUCIÓN N. OBRPUN6882024</span>
              <span class="official-logo-date">del 26/11/2024</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .official-logos-bar {
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      border-bottom: 1px solid #cbd5e1;
      padding: 12px 0;
    }

    .official-logos-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 48px;
      flex-wrap: wrap;
    }

    .official-logo {
      display: flex;
      align-items: center;
    }

    .official-logo-link {
      display: flex;
      align-items: center;
      gap: 16px;
      text-decoration: none;
      transition: transform 0.3s ease;
    }

    a.official-logo-link:hover {
      transform: scale(1.05);
    }

    .official-logo-image {
      height: 60px;
      width: auto;
      object-fit: contain;
    }

    .official-logo-placeholder {
      height: 60px;
      width: 80px;
      background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 8px;
    }

    .placeholder-text {
      font-size: 9px;
      font-weight: 700;
      color: white;
      text-align: center;
      line-height: 1.2;
    }

    .official-logo-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .official-logo-text {
      font-size: 11px;
      font-weight: 700;
      color: #1e40af;
      letter-spacing: 0.5px;
    }

    .official-logo-date {
      font-size: 10px;
      font-weight: 500;
      color: #64748b;
    }

    @media (max-width: 768px) {
      .official-logos-container {
        gap: 24px;
        padding: 0 16px;
      }

      .official-logo-link {
        gap: 12px;
      }

      .official-logo-image {
        height: 48px;
      }

      .official-logo-placeholder {
        height: 48px;
        width: 64px;
      }

      .placeholder-text {
        font-size: 8px;
      }

      .official-logo-text {
        font-size: 10px;
      }

      .official-logo-date {
        font-size: 9px;
      }
    }
  `]
})
export class OfficialLogosBarComponent {}
