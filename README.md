# Fundación Afrocolombiana Pro Encasa - Angular 20.3.8

Aplicación web profesional para la Fundación Afrocolombiana Pro Encasa

## Instalación

Requisitos previos:

- Node.js 22.x (usa `.nvmrc` para seleccionar la versión recomendada)
- pnpm 9 o superior

```bash
pnpm install
```

Para el backend Strapi estable (v5.0.0) ubicado en `backend/`:

```bash
cd backend
pnpm install
cp .env.example .env # ajusta las variables sensibles
pnpm seed # carga contenido y crea el superusuario facopec
pnpm develop
```

## Integración con el CMS

- Configura un **API Token** desde *Settings → API Tokens* en Strapi y colócalo en `environment.ts` (`environment.strapi.apiToken`). El frontend lo usará automáticamente para consumir los single types y colecciones.
- Después de cada `pnpm seed`, el rol público queda habilitado para leer `global`, `home-page`, `donations-page`, `organization-info`, `project` y los archivos del plugin Upload, por lo que los visitantes anónimos verán el contenido actualizado sin pasos adicionales.
- La navegación principal del sitio (header) ahora se construye íntegramente desde la single type `global`. Puedes reordenar o crear enlaces, grupos y subgrupos desde el editor y los cambios aparecerán en el sitio inmediatamente tras publicar.
- El frontend invalida el caché de Strapi automáticamente en desarrollo. En producción puedes ajustar la caducidad con la variable de entorno `STRAPI_CACHE_MS` (valor por defecto: 300000 ms ≈ 5 minutos) o sobrescribir `environment.strapi.cacheDurationMs`.

## Desarrollo

```bash
pnpm start
```

Abre http://localhost:4200

## Compilación

```bash
pnpm run build:prod
```

## Características

- ✅ Angular 20.3.8
- ✅ Componentes Standalone
- ✅ Signals para reactividad
- ✅ TypeScript strict mode
- ✅ Strapi CMS integrado
- ✅ PayPal + Transferencias bancarias
- ✅ Sistema de colores de marca
- ✅ Navegación administrable desde Strapi 5

## Estructura

```
src/
├── app/
│   ├── core/
│   │   ├── design-system/
│   │   ├── interceptors/
│   │   ├── models/
│   │   └── services/
│   ├── shared/
│   │   └── components/
│   │       ├── header/
│   │       └── footer/
│   └── features/
│       ├── home/
│       ├── donate/
│       └── ...
└── environments/
```

## Configuración

Edita `src/environments/environment.ts`:
- Strapi URL y API Key
- Duración de caché opcional (`cacheDurationMs` en los environments o `STRAPI_CACHE_MS` en producción)
- PayPal Client ID
- URLs de redes sociales
- Datos bancarios

## Backend Strapi

El proyecto incluye un CMS Strapi v5.0.0 (estable, sin etiquetas beta) en la carpeta `backend/` con modelos para la página de inicio, donaciones, navegación global y proyectos. El script de semillas (`pnpm seed`) crea el superusuario definido en las variables de entorno `SEED_ADMIN_USERNAME`, `SEED_ADMIN_EMAIL` y `SEED_ADMIN_PASSWORD` (por defecto `facopec / facopec@facopec.org / F4c0pec@2025`) y carga contenido base listo para ser editado desde el panel. Si necesitas reinstalar el CMS o comprobar la versión, ejecuta `node upgrade-strapi-to-stable.mjs` dentro de `backend/`; el script actualizará dependencias, limpiará `node_modules` y reportará la versión final instalada (debe indicar 5.0.0).

---

**Versión**: 1.0.0
**Angular**: 20.3.8
**TypeScript**: 5.5.2
