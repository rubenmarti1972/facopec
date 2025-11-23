# Sistema de Fallback del CMS - FACOPEC

## Descripción General

Este documento describe el sistema robusto de fallback implementado para garantizar que la aplicación **siempre** muestre contenido, incluso cuando el CMS (Strapi) o el servicio de imágenes (Cloudinary) fallen.

## Objetivos

1. **Disponibilidad Total**: La aplicación debe funcionar correctamente aunque el CMS esté caído
2. **Fallback de Imágenes**: Si las imágenes del CMS no cargan, usar automáticamente imágenes hardcodeadas
3. **Experiencia de Usuario**: Nunca mostrar páginas vacías o imágenes rotas
4. **Recuperación Automática**: Cuando el CMS se recupere, automáticamente volver a usarlo

## Arquitectura del Sistema

### 1. CmsFallbackService (`src/app/core/services/cms-fallback.service.ts`)

Servicio central que gestiona el estado del CMS y los fallbacks de imágenes.

#### Características Principales:

- **Detección de Estado del CMS**:
  - Marca el CMS como "caído" cuando hay timeout o error de red
  - Marca el CMS como "disponible" cuando responde exitosamente
  - Reintentos automáticos después de 30 segundos

- **Mapeo de Imágenes**:
  - Mantiene un mapa completo de imágenes del CMS → imágenes hardcodeadas
  - 14 logos de programas
  - 4 imágenes del hero/carrusel
  - Logos de aliados
  - Logo principal de FACOPEC

- **Métodos Clave**:
  ```typescript
  markCmsAsDown(): void          // Marca CMS como caído
  markCmsAsUp(): void            // Marca CMS como disponible
  isCmsDown(): boolean           // Verifica si CMS está caído
  getImageUrl(...)               // Obtiene URL con fallback automático
  getFallbackImage(key)          // Obtiene imagen hardcodeada por clave
  resolveWithFallback(...)       // Resuelve URL con fallback
  ```

### 2. StrapiService Mejorado (`src/app/core/services/strapi.service.ts`)

El servicio de Strapi ahora integra el servicio de fallback:

#### Modificaciones:

1. **Inyección del Servicio de Fallback**:
   ```typescript
   private readonly fallbackService = inject(CmsFallbackService);
   ```

2. **Notificación de Éxito**:
   - Cuando el CMS responde exitosamente, marca el servicio como disponible
   - Permite recuperación automática del CMS

3. **Notificación de Errores**:
   - **Error de Red** (status 0): Marca CMS como caído
   - **Timeout**: Marca CMS como caído
   - Usa timeout de 5 segundos por defecto

### 3. ImageFallbackDirective (`src/app/shared/directives/image-fallback.directive.ts`)

Directiva Angular que detecta cuando una imagen falla al cargar en tiempo de ejecución.

#### Funcionamiento:

```html
<img src="url-del-cms.jpg" [appImageFallback]="'assets/logo.png'" />
```

1. Si la imagen del CMS carga correctamente → No hace nada
2. Si la imagen del CMS falla → Automáticamente usa la imagen de fallback
3. Previene bucles infinitos si el fallback también falla

#### Eventos Manejados:

- `(error)`: Detecta error de carga y aplica fallback
- `(load)`: Resetea el estado de error cuando carga exitosamente

### 4. HomeComponent Mejorado (`src/app/features/home/home.component.ts`)

El componente principal ahora usa fallback agresivo:

#### Cambios Implementados:

1. **Inyección del Servicio**:
   ```typescript
   private readonly fallbackService = inject(CmsFallbackService);
   ```

2. **Fallback en Hero Image**:
   ```typescript
   const finalHeroImage = this.fallbackService.isCmsDown()
     ? this.hero.image  // Hardcodeada
     : (heroMediaUrl ?? this.hero.image);
   ```

3. **Fallback en Carrusel**:
   - Si CMS está caído → Usa carrusel hardcodeado inmediatamente
   - Si CMS no tiene slides → Usa carrusel hardcodeado
   - Si CMS tiene slides → Usa los del CMS

4. **Fallback en Logo Global**:
   - Si CMS está caído → No intenta usar el logo del CMS
   - Mantiene logo hardcodeado (`assets/logo.png`)

5. **Mezcla de Datos**:
   - Las actividades del CMS se mezclan con las hardcodeadas
   - Los logos de programas del CMS se mezclan con los hardcodeados
   - Los eventos del CMS se mezclan con los hardcodeados
   - **Resultado**: Siempre hay contenido visible

## Flujo de Trabajo

### Escenario 1: CMS Funcionando Correctamente

```
1. Usuario carga página
2. StrapiService solicita datos al CMS
3. CMS responde en < 5 segundos ✅
4. StrapiService llama a fallbackService.markCmsAsUp()
5. Se usan imágenes y datos del CMS
6. Si alguna imagen falla al cargar:
   → ImageFallbackDirective la reemplaza con imagen hardcodeada
```

### Escenario 2: CMS Caído (Timeout o Error de Red)

```
1. Usuario carga página
2. StrapiService solicita datos al CMS
3. Timeout después de 5 segundos ⏱️ o Error de red 🚫
4. StrapiService llama a fallbackService.markCmsAsDown()
5. Se usan SOLO datos e imágenes hardcodeadas
6. Después de 30 segundos:
   → CmsFallbackService permite reintentar
   → Próxima carga de página intentará usar el CMS nuevamente
```

### Escenario 3: CMS Funciona pero Cloudinary Está Caído

```
1. Usuario carga página
2. StrapiService solicita datos al CMS
3. CMS responde ✅ con URLs de Cloudinary
4. Navegador intenta cargar imágenes de Cloudinary
5. Cloudinary no responde 🚫
6. ImageFallbackDirective detecta error de carga
7. Reemplaza automáticamente con imagen hardcodeada
```

## Datos Hardcodeados Disponibles

### Imágenes del Hero/Carrusel (4 slides)
- `assets/ninos.jpg`
- `assets/fotos-fundacion/portada.webp`
- `assets/fotos-fundacion/collage.webp`
- `assets/fotos-fundacion/collage-profe.webp`
- `assets/fotos-fundacion/apoyo.webp`

### Logos de Programas (14 programas)
1. Guías
2. Guías de Matemáticas
3. Talleres de Nivelación
4. Primaria
5. Plan Lector
6. Escuela de Padres
7. Programa Espiritual
8. Empleabilidad
9. Educa
10. Comunidades NARP
11. Comunitario
12. Donación de Ropa
13. Salidas Pedagógicas
14. Círculo Literario

### Actividades (4 tarjetas)
1. Tutorías Profe en Casa 🧠
2. Ruta Literaria María 📖
3. Huerta y alimentación 🥬
4. Arte, danza y fe 🎨

### Eventos del Calendario (5 eventos)
- Taller de Lectura
- Jornada de Tutorías
- Salida Pedagógica
- Reunión de Padres
- Celebración Fin de Año

### Otros
- Logo FACOPEC (`assets/logo.png`, `assets/logo.svg`)
- Logos de aliados (Ministerio del Interior, ICBF)
- 3 valores organizacionales
- Misión y Visión

## Configuración

### Timeouts y Reintentos

En `src/environments/environment.ts`:

```typescript
export const environment = {
  strapi: {
    url: 'http://localhost:1337',
    requestTimeoutMs: 5000,      // Timeout de 5 segundos
    cacheDurationMs: 300000       // Cache de 5 minutos en producción
  }
};
```

En `cms-fallback.service.ts`:

```typescript
private readonly cmsDownThreshold = 30000;  // 30 segundos para reintentar
```

## Uso en Otros Componentes

Para aplicar el mismo sistema de fallback en otros componentes:

### 1. Inyectar el Servicio

```typescript
import { CmsFallbackService } from '@core/services/cms-fallback.service';

export class MiComponente {
  private readonly fallbackService = inject(CmsFallbackService);
  private readonly strapiService = inject(StrapiService);
}
```

### 2. Usar Fallback en Imágenes

```typescript
// En el componente TypeScript
loadData() {
  this.strapiService.getData().subscribe({
    next: data => {
      // Si CMS está caído, usar solo hardcodeados
      if (this.fallbackService.isCmsDown()) {
        this.imagen = 'assets/fallback-image.jpg';
        return;
      }

      // Intentar usar imagen del CMS con fallback
      const imageUrl = this.strapiService.buildMediaUrl(data.image);
      this.imagen = imageUrl ?? 'assets/fallback-image.jpg';
    }
  });
}
```

### 3. Usar Directiva en HTML

```html
<!-- Importar ImageFallbackDirective en el componente -->
<img
  [src]="imagenDelCMS"
  alt="Descripción"
  [appImageFallback]="'assets/fallback-image.jpg'"
  loading="lazy"
/>
```

## Pruebas

### Simular CMS Caído

1. **Detener Strapi**:
   ```bash
   # Detener el servidor de Strapi
   # La app automáticamente usará datos hardcodeados
   ```

2. **Verificar Consola**:
   ```
   [CmsFallback] CMS marcado como caído. Usando solo datos hardcodeados.
   [HomeComponent] CMS caído, usando carrusel hardcodeado
   ```

### Simular Cloudinary Caído

1. **Usar DevTools**:
   - Abrir Chrome DevTools
   - Network → Block request URL → `*cloudinary*`
   - Recargar página
   - Las imágenes del CMS fallarán
   - ImageFallbackDirective las reemplazará automáticamente

2. **Verificar Consola**:
   ```
   [ImageFallback] Imagen del CMS falló al cargar: https://cloudinary.com/...
   Usando fallback: assets/logo.png
   ```

## Ventajas del Sistema

✅ **Alta Disponibilidad**: La app funciona siempre, incluso sin CMS
✅ **Recuperación Automática**: Se reconecta al CMS automáticamente
✅ **Fallback de 3 Capas**:
   1. Servicio detecta CMS caído → Usa datos hardcodeados
   2. TypeScript resuelve URLs con fallback → `url ?? fallback`
   3. Directiva detecta error de carga → Reemplaza imagen en HTML

✅ **Sin Imágenes Rotas**: Nunca muestra el ícono de imagen rota
✅ **Experiencia Consistente**: Los usuarios siempre ven contenido
✅ **Fácil Mantenimiento**: Sistema centralizado y bien documentado

## Archivos Modificados/Creados

### Nuevos Archivos
- `src/app/core/services/cms-fallback.service.ts`
- `src/app/shared/directives/image-fallback.directive.ts`
- `CMS_FALLBACK_SYSTEM.md` (este documento)

### Archivos Modificados
- `src/app/core/services/strapi.service.ts`
- `src/app/features/home/home.component.ts`
- `src/app/features/home/home.component.html`

## Próximos Pasos (Recomendado)

1. **Aplicar el sistema a otros componentes**:
   - `donate.component.ts`
   - `projects.component.ts`
   - `header.component.ts`

2. **Monitoreo**:
   - Implementar logging de errores del CMS
   - Alertas cuando el CMS esté caído por > 5 minutos

3. **Testing**:
   - Tests unitarios para CmsFallbackService
   - Tests E2E simulando CMS caído

## Soporte

Para preguntas o problemas con el sistema de fallback, consultar:
- `FRONTEND-CMS-INTEGRATION.md` - Documentación de integración con CMS
- `CMS_DATA_STRUCTURE.md` - Estructura de datos del CMS
- Este documento - Sistema de fallback

---

**Última actualización**: 2025-11-23
**Versión**: 1.0.0
