import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageFallbackDirective } from '@shared/directives/image-fallback.directive';

export interface CarouselImage {
  url: string;
  alt: string;
  title?: string;
  fallbackUrl?: string;
}

@Component({
  selector: 'app-hero-carousel',
  standalone: true,
  imports: [CommonModule, ImageFallbackDirective],
  template: `
    <div class="carousel-container">
      <div class="carousel-wrapper">
        <div
          class="carousel-slides"
          [style.transform]="'translateX(-' + (currentSlide * 100) + '%)'">
          <div
            *ngFor="let image of images; let i = index"
            class="carousel-slide"
            [class.active]="i === currentSlide">
            <img
              [src]="image.url"
              [alt]="image.alt"
              [appImageFallback]="image.fallbackUrl || 'assets/fotos-fundacion/portada.webp'"
              class="carousel-image"
              loading="lazy">
            <div class="carousel-overlay"></div>
          </div>
        </div>

        <!-- Navigation Arrows -->
        <button
          class="carousel-arrow carousel-arrow-left"
          (click)="previousSlide()"
          aria-label="Previous slide">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          class="carousel-arrow carousel-arrow-right"
          (click)="nextSlide()"
          aria-label="Next slide">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <!-- Indicators -->
        <div class="carousel-indicators">
          <button
            *ngFor="let image of images; let i = index"
            [class.active]="i === currentSlide"
            (click)="goToSlide(i)"
            [aria-label]="'Go to slide ' + (i + 1)">
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .carousel-container {
      position: relative;
      width: 100%;
      height: 600px;
      overflow: hidden;
      border-radius: 0;
    }

    .carousel-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
    }

    .carousel-slides {
      display: flex;
      height: 100%;
      transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .carousel-slide {
      flex: 0 0 100%;
      position: relative;
      height: 100%;
    }

    .carousel-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
    }

    .carousel-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0.1) 0%,
        rgba(0, 0, 0, 0.3) 100%
      );
    }

    .carousel-arrow {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(255, 255, 255, 0.9);
      border: none;
      border-radius: 50%;
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      z-index: 10;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .carousel-arrow:hover {
      background: white;
      transform: translateY(-50%) scale(1.1);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
    }

    .carousel-arrow svg {
      width: 24px;
      height: 24px;
      color: #1e40af;
    }

    .carousel-arrow-left {
      left: 20px;
    }

    .carousel-arrow-right {
      right: 20px;
    }

    .carousel-indicators {
      position: absolute;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 12px;
      z-index: 10;
    }

    .carousel-indicators button {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: 2px solid white;
      background: rgba(255, 255, 255, 0.5);
      cursor: pointer;
      transition: all 0.3s ease;
      padding: 0;
    }

    .carousel-indicators button:hover {
      background: rgba(255, 255, 255, 0.8);
      transform: scale(1.2);
    }

    .carousel-indicators button.active {
      background: white;
      width: 32px;
      border-radius: 6px;
    }

    @media (max-width: 768px) {
      .carousel-container {
        height: 400px;
      }

      .carousel-arrow {
        width: 40px;
        height: 40px;
      }

      .carousel-arrow svg {
        width: 20px;
        height: 20px;
      }

      .carousel-arrow-left {
        left: 12px;
      }

      .carousel-arrow-right {
        right: 12px;
      }

      .carousel-indicators {
        bottom: 16px;
        gap: 8px;
      }

      .carousel-indicators button {
        width: 10px;
        height: 10px;
      }

      .carousel-indicators button.active {
        width: 24px;
      }
    }
  `]
})
export class HeroCarouselComponent implements OnInit, OnDestroy {
  @Input() images: CarouselImage[] = [];
  @Input() autoPlayInterval = 5000;
  @Input() autoPlay = true;

  currentSlide = 0;
  private autoPlayTimer?: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    if (this.autoPlay && this.images.length > 1) {
      this.startAutoPlay();
    }
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.images.length;
    this.resetAutoPlay();
  }

  previousSlide(): void {
    this.currentSlide = this.currentSlide === 0
      ? this.images.length - 1
      : this.currentSlide - 1;
    this.resetAutoPlay();
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
    this.resetAutoPlay();
  }

  private startAutoPlay(): void {
    this.autoPlayTimer = setInterval(() => {
      this.nextSlide();
    }, this.autoPlayInterval);
  }

  private stopAutoPlay(): void {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
    }
  }

  private resetAutoPlay(): void {
    if (this.autoPlay) {
      this.stopAutoPlay();
      this.startAutoPlay();
    }
  }
}
