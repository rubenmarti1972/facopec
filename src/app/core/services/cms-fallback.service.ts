/**
 * Servicio de Fallback para el CMS
 * Gestiona el uso de datos hardcodeados cuando el CMS falla o no tiene imágenes disponibles
 */

import { Injectable } from '@angular/core';
import { MediaAsset } from '../models';

export interface FallbackImage {
  path: string;
  alt: string;
}

export interface FallbackMapping {
  [key: string]: FallbackImage;
}

@Injectable({
  providedIn: 'root'
})
export class CmsFallbackService {
  // Indica si el CMS está completamente caído (timeout o error de red)
  private cmsIsDown = false;

  // Timestamp del último error del CMS
  private lastCmsError = 0;

  // Tiempo para considerar que el CMS está caído (30 segundos)
  private readonly cmsDownThreshold = 30000;

  /**
   * Mapeo de imágenes del CMS a sus equivalentes hardcodeados
   * Clave: nombre/identificador de la imagen en el CMS
   */
  private readonly fallbackImages: FallbackMapping = {
    // Hero / Portada
    'hero-main': {
      path: 'assets/fotos-fundacion/portada.webp',
      alt: 'Niños y jóvenes de FACOPEC en actividades educativas'
    },
    'hero-collage': {
      path: 'assets/fotos-fundacion/collage.webp',
      alt: 'Montaje de actividades de la Fundación'
    },
    'hero-team': {
      path: 'assets/fotos-fundacion/collage-profe.webp',
      alt: 'Equipo FACOPEC con la comunidad'
    },
    'hero-community': {
      path: 'assets/fotos-fundacion/apoyo.webp',
      alt: 'Trabajo comunitario FACOPEC'
    },

    // Logos de programas (14 programas)
    'program-guias': {
      path: 'assets/program-logos/guias.png',
      alt: 'Programa Guías'
    },
    'program-guias-mate': {
      path: 'assets/program-logos/guias-mate.png',
      alt: 'Programa Guías de Matemáticas'
    },
    'program-talleres': {
      path: 'assets/program-logos/talleres-nivelacion.png',
      alt: 'Talleres de Nivelación'
    },
    'program-primaria': {
      path: 'assets/program-logos/primaria.png',
      alt: 'Programa Primaria'
    },
    'program-plan-lector': {
      path: 'assets/program-logos/plan-lector.png',
      alt: 'Plan Lector'
    },
    'program-escuela-padres': {
      path: 'assets/program-logos/escuela-padres.png',
      alt: 'Escuela de Padres'
    },
    'program-espiritual': {
      path: 'assets/program-logos/espiritual.png',
      alt: 'Programa Espiritual'
    },
    'program-empleabilidad': {
      path: 'assets/program-logos/emplpeabilidad.png',
      alt: 'Programa de Empleabilidad'
    },
    'program-educa': {
      path: 'assets/program-logos/educa.png',
      alt: 'Programa Educa'
    },
    'program-comunidades-narp': {
      path: 'assets/program-logos/comunidades-narp.png',
      alt: 'Comunidades NARP'
    },
    'program-comunitario': {
      path: 'assets/program-logos/comunitario.png',
      alt: 'Programa Comunitario'
    },
    'program-dona-ropa': {
      path: 'assets/program-logos/dona-ropa.png',
      alt: 'Donación de Ropa'
    },
    'program-salida-pedagogica': {
      path: 'assets/program-logos/salida-pedagogica.png',
      alt: 'Salidas Pedagógicas'
    },
    'program-circulo': {
      path: 'assets/program-logos/circulo.png',
      alt: 'Círculo Literario'
    },

    // Supporters / Aliados
    'supporter-bienestar': {
      path: 'assets/supporters/logo-bienestar.png',
      alt: 'Ministerio de Bienestar Social'
    },
    'supporter-interior': {
      path: 'assets/supporters/logo-interior.png',
      alt: 'Ministerio del Interior'
    },

    // Logo principal
    'logo-facopec': {
      path: 'assets/logo.png',
      alt: 'Logo FACOPEC'
    },
    'logo-facopec-svg': {
      path: 'assets/logo.svg',
      alt: 'Logo FACOPEC'
    },

    // Otros
    'ninos': {
      path: 'assets/ninos.jpg',
      alt: 'Niños de FACOPEC'
    }
  };

  constructor() {}

  /**
   * Marca el CMS como caído (después de un timeout o error de red)
   */
  markCmsAsDown(): void {
    this.cmsIsDown = true;
    this.lastCmsError = Date.now();
    console.warn('[CmsFallback] CMS marcado como caído. Usando solo datos hardcodeados.');
  }

  /**
   * Marca el CMS como disponible (después de una respuesta exitosa)
   */
  markCmsAsUp(): void {
    if (this.cmsIsDown) {
      console.log('[CmsFallback] CMS recuperado. Reiniciando uso de datos del CMS.');
    }
    this.cmsIsDown = false;
    this.lastCmsError = 0;
  }

  /**
   * Verifica si el CMS está actualmente caído
   */
  isCmsDown(): boolean {
    // Si pasó el tiempo del threshold, intentar reconectar
    if (this.cmsIsDown && Date.now() - this.lastCmsError > this.cmsDownThreshold) {
      console.log('[CmsFallback] Threshold superado. Intentando reconectar al CMS...');
      this.cmsIsDown = false;
    }
    return this.cmsIsDown;
  }

  /**
   * Obtiene la URL de una imagen con fallback automático
   * Si el CMS está caído o la imagen del CMS es null/vacía, usa el fallback
   */
  getImageUrl(
    cmsImage: MediaAsset | null | undefined,
    fallbackKey: string,
    buildMediaUrlFn: (media?: MediaAsset | null) => string | null
  ): string {
    // Si el CMS está completamente caído, usar fallback directamente
    if (this.isCmsDown()) {
      return this.getFallbackImage(fallbackKey);
    }

    // Intentar obtener la URL del CMS
    const cmsUrl = buildMediaUrlFn(cmsImage);

    // Si el CMS no tiene imagen, usar fallback
    if (!cmsUrl) {
      return this.getFallbackImage(fallbackKey);
    }

    // Retornar la URL del CMS
    return cmsUrl;
  }

  /**
   * Obtiene la URL de una imagen hardcodeada por su clave
   */
  getFallbackImage(key: string): string {
    const fallback = this.fallbackImages[key];
    if (!fallback) {
      console.warn(`[CmsFallback] No se encontró imagen de fallback para: ${key}`);
      return 'assets/logo.png'; // Fallback genérico
    }
    return fallback.path;
  }

  /**
   * Obtiene el texto alternativo de una imagen hardcodeada
   */
  getFallbackAlt(key: string): string {
    const fallback = this.fallbackImages[key];
    return fallback?.alt ?? 'Imagen FACOPEC';
  }

  /**
   * Obtiene la imagen completa (path + alt) por su clave
   */
  getFallbackImageData(key: string): FallbackImage {
    return (
      this.fallbackImages[key] || {
        path: 'assets/logo.png',
        alt: 'Imagen FACOPEC'
      }
    );
  }

  /**
   * Valida si una URL de imagen es válida (no vacía, no null, no undefined)
   * Más estricto: verifica que sea una URL real
   */
  isValidImageUrl(url: string | null | undefined): boolean {
    if (!url || typeof url !== 'string') {
      return false;
    }

    const trimmed = url.trim();

    // URL vacía
    if (trimmed.length === 0) {
      return false;
    }

    // URL debe empezar con / o http
    if (!trimmed.startsWith('/') && !trimmed.startsWith('http')) {
      return false;
    }

    // URL no debe ser placeholder o undefined string
    if (trimmed === 'undefined' || trimmed === 'null') {
      return false;
    }

    return true;
  }

  /**
   * Valida si un MediaAsset tiene una URL válida
   */
  hasValidMedia(media?: MediaAsset | null): boolean {
    return !!(media?.url && this.isValidImageUrl(media.url));
  }

  /**
   * Resuelve una URL con fallback automático
   * Si la URL del CMS es inválida, usa el fallback
   */
  resolveWithFallback(cmsUrl: string | null | undefined, fallbackKey: string): string {
    if (this.isCmsDown() || !this.isValidImageUrl(cmsUrl)) {
      return this.getFallbackImage(fallbackKey);
    }
    return cmsUrl!;
  }
}
