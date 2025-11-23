/**
 * Directiva para manejar fallback automático de imágenes
 * Cuando una imagen del CMS falla al cargar, automáticamente usa la imagen hardcodeada
 */

import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: 'img[appImageFallback]',
  standalone: true
})
export class ImageFallbackDirective {
  @Input() appImageFallback: string = '';
  private hasError = false;

  constructor(private el: ElementRef<HTMLImageElement>) {}

  @HostListener('error')
  onError(): void {
    // Evitar bucles infinitos si el fallback también falla
    if (this.hasError) {
      return;
    }

    this.hasError = true;

    // Si hay una imagen de fallback definida, usarla
    if (this.appImageFallback) {
      console.warn(
        `[ImageFallback] Imagen del CMS falló al cargar: ${this.el.nativeElement.src}`,
        `Usando fallback: ${this.appImageFallback}`
      );
      this.el.nativeElement.src = this.appImageFallback;
    }
  }

  @HostListener('load')
  onLoad(): void {
    // Reset error flag cuando la imagen carga exitosamente
    this.hasError = false;
  }
}
