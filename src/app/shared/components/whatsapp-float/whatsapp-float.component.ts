import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-whatsapp-float',
  standalone: true,
  imports: [CommonModule],
  template: `
    <a
      href="https://wa.me/573215230283?text=Hola%2C%20me%20gustar%C3%ADa%20conocer%20m%C3%A1s%20sobre%20la%20Fundaci%C3%B3n%20FACOPEC"
      target="_blank"
      rel="noopener noreferrer"
      class="whatsapp-float"
      aria-label="Contactar por WhatsApp">
      <div class="whatsapp-pulse"></div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="whatsapp-icon">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
      </svg>
      <span class="whatsapp-tooltip">¡Escríbenos!</span>
    </a>
  `,
  styles: [`
    .whatsapp-float {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 64px;
      height: 64px;
      background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 24px rgba(37, 211, 102, 0.4);
      cursor: pointer;
      z-index: 1000;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      text-decoration: none;
      animation: float 3s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-10px);
      }
    }

    .whatsapp-float:hover {
      transform: scale(1.15) translateY(-5px);
      box-shadow: 0 12px 32px rgba(37, 211, 102, 0.6);
    }

    .whatsapp-float:hover .whatsapp-tooltip {
      opacity: 1;
      visibility: visible;
      transform: translateX(0);
    }

    .whatsapp-icon {
      width: 36px;
      height: 36px;
      color: white;
      position: relative;
      z-index: 2;
    }

    .whatsapp-pulse {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: rgba(37, 211, 102, 0.4);
      animation: pulse 2s ease-out infinite;
    }

    @keyframes pulse {
      0% {
        transform: scale(1);
        opacity: 1;
      }
      100% {
        transform: scale(1.5);
        opacity: 0;
      }
    }

    .whatsapp-tooltip {
      position: absolute;
      right: 76px;
      background: white;
      color: #128C7E;
      padding: 10px 16px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 14px;
      white-space: nowrap;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      opacity: 0;
      visibility: hidden;
      transform: translateX(10px);
      transition: all 0.3s ease;
    }

    .whatsapp-tooltip::after {
      content: '';
      position: absolute;
      right: -8px;
      top: 50%;
      transform: translateY(-50%);
      width: 0;
      height: 0;
      border-left: 8px solid white;
      border-top: 8px solid transparent;
      border-bottom: 8px solid transparent;
    }

    @media (max-width: 768px) {
      .whatsapp-float {
        width: 56px;
        height: 56px;
        bottom: 20px;
        right: 20px;
      }

      .whatsapp-icon {
        width: 32px;
        height: 32px;
      }

      .whatsapp-tooltip {
        right: 68px;
        font-size: 13px;
        padding: 8px 12px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .whatsapp-float {
        animation: none;
      }

      .whatsapp-pulse {
        animation: none;
      }
    }
  `]
})
export class WhatsappFloatComponent {}
