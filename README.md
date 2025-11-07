# Fundación Afrocolombiana Pro Encasa - Angular 20.3.8

Aplicación web profesional para la Fundación Afrocolombiana Pro Encasa

## Instalación

Requisitos previos (frontend Angular):

- Node.js 22.11.0 (usa `.nvmrc` en la raíz para seleccionar la versión recomendada)
- pnpm 9 o superior

```bash
pnpm install
```

Para el backend Strapi estable (v4.24.6) ubicado en `backend/` utiliza su propio `.nvmrc` (Node.js 18.18.2) y npm:

```bash
cd backend
npm install
cp .env.example .env # ajusta las variables sensibles
npm run seed # carga contenido y crea el superusuario facopec
npm run develop
# si necesitas reestablecer la instalación, ejecuta node upgrade-strapi-to-stable.mjs usando Node 18.18.2 (nvm use)
```

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
- PayPal Client ID
- URLs de redes sociales
- Datos bancarios

## Backend Strapi

El proyecto incluye un CMS Strapi v4.24.6 (estable, sin etiquetas beta) en la carpeta `backend/` con modelos para la página de inicio, donaciones, navegación global y proyectos. El script de semillas (`npm run seed`) crea el superusuario definido en las variables de entorno `SEED_ADMIN_USERNAME`, `SEED_ADMIN_EMAIL` y `SEED_ADMIN_PASSWORD` (por defecto `facopec / facopec@facopec.org / F4c0pec@2025`) y carga contenido base listo para ser editado desde el panel. Si necesitas reinstalar el CMS o comprobar la versión, ejecuta `node upgrade-strapi-to-stable.mjs` dentro de `backend/`; el script actualizará dependencias, limpiará `node_modules` y reportará la versión final instalada (debe indicar 4.24.6).

---

**Versión**: 1.0.0
**Angular**: 20.3.8
**TypeScript**: 5.5.2
