# Fundación Afrocolombiana Pro Encasa - Angular 20.3.8

Aplicación web profesional para la Fundación Afrocolombiana Pro Encasa

## Instalación

Requisitos previos:

- Node.js 22.x (usa `.nvmrc` para seleccionar la versión recomendada)
- pnpm 9 o superior

```bash
pnpm install
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

---

**Versión**: 1.0.0
**Angular**: 20.3.8
**TypeScript**: 5.5.2
