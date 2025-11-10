# Integración Frontend Angular con CMS Strapi

## 📋 Resumen

El frontend Angular ahora consume **dinámicamente** todo el contenido desde el backend Strapi v5.30.1. Esto permite que el super-admin actualice el contenido del sitio web sin necesidad de modificar código.

## 🎯 Componentes Integrados

### ✅ Home Component (`/`)
**Archivo**: `src/app/features/home/home.component.ts`

Consume la API `/api/home-page` que incluye:
- **Hero**: Título, descripción, estadísticas, botones de acción, verso bíblico, imagen
- **Highlights de Impacto**: Tarjetas de impacto con íconos, títulos y descripciones
- **Identidad**: Descripción de la fundación y valores
- **Misión y Visión**: Textos completos
- **Actividades**: Tarjetas de actividades con enlaces externos
- **Programas**: Tarjetas de programas destacados
- **Supporters**: Logos de aliados
- **Catálogo**: Artículos disponibles (catálogo WhatsApp)
- **Galería**: Imágenes y videos destacados

**Características**:
- Fallback a datos por defecto si Strapi no responde
- Carga del logo global desde Strapi
- Resolución automática de URLs de medios
- Manejo de errores con mensajes descriptivos

### ✅ Donate Component (`/donate`)
**Archivo**: `src/app/features/donate/donate.component.ts`

Consume la API `/api/donations-page` que incluye:
- **Hero**: Título y subtítulo personalizables
- **Montos de Donación**: Lista de montos sugeridos con íconos e impacto
- **Métricas**: Estadísticas de impacto
- **Highlights**: Áreas de enfoque de las donaciones
- **Historias**: Historias de impacto con imágenes
- **Acciones de Apoyo**: Formas alternativas de apoyar
- **Pasarelas de Pago**: Opciones de pago disponibles

**Características**:
- Cálculo dinámico de impacto basado en el monto
- Soporte para donaciones únicas o recurrentes
- Integración con pasarelas de pago PSE y PayPal

### ✅ Projects Component (`/projects`)
**Archivo**: `src/app/features/donate/projects.component.ts`

Consume la API `/api/projects` que incluye:
- **Lista de Proyectos**: Título, descripción, tag, enlace, orden
- **Imagen de Portada**: Media asset de Strapi

**Características**:
- Ordenamiento por campo `order`
- Fallback a datos estáticos si no hay proyectos en Strapi
- Enlaces a páginas externas (Blog de la fundación)

## 🛠️ Servicio Strapi

### Ubicación
`src/app/core/services/strapi.service.ts`

### Características Principales

#### 1. **Caching Inteligente**
```typescript
cacheDurationMs: 0 // Desarrollo: sin cache
cacheDurationMs: 300000 // Producción: 5 minutos
```

#### 2. **Normalización de Respuestas**
Strapi v5 devuelve datos en formato:
```json
{
  "data": {
    "id": 1,
    "attributes": { ... }
  }
}
```

El servicio normaliza automáticamente a:
```typescript
{
  "id": 1,
  ...attributes
}
```

#### 3. **Gestión de Medios**
```typescript
buildMediaUrl(media: MediaAsset | null): string | null
```
- Convierte rutas relativas de Strapi a URLs absolutas
- Maneja URLs externas (http/https)
- Devuelve null si no hay media

#### 4. **APIs Disponibles**

**Single Types** (contenido único):
- `getHomePage()` → `/api/home-page`
- `getDonationsPage()` → `/api/donations-page`
- `getOrganizationInfo()` → `/api/organization-info`
- `getGlobalSettings()` → `/api/global`

**Collection Types** (colecciones):
- `getProjects()` → `/api/projects`
- `getProject(id)` → `/api/projects/:id`
- `getProjectSummaries()` → `/api/projects` (simplificado)

**Admin APIs** (requieren autenticación):
- `createDonation()` → POST `/api/donations`
- `updateContent()` → PUT `/api/:contentType/:id`
- `createContent()` → POST `/api/:contentType`
- `deleteContent()` → DELETE `/api/:contentType/:id`

## 🔧 Configuración

### 1. Environment Development
**Archivo**: `src/environments/environment.ts`

```typescript
strapi: {
  url: 'http://localhost:1337',
  publicUrl: 'http://localhost:1337',
  apiToken: '', // No requerido para APIs públicas
  previewToken: '', // Solo para contenido draft
  cacheDurationMs: 0 // Sin cache en desarrollo
}
```

### 2. Proxy Configuration
**Archivo**: `proxy.conf.json`

```json
{
  "/api": {
    "target": "http://localhost:1337",
    "secure": false,
    "logLevel": "debug",
    "changeOrigin": true
  },
  "/uploads": {
    "target": "http://localhost:1337",
    "secure": false,
    "logLevel": "debug",
    "changeOrigin": true
  }
}
```

**Configurado en**: `angular.json`
```json
"serve": {
  "options": {
    "proxyConfig": "proxy.conf.json"
  }
}
```

### 3. CORS en Strapi
**Archivo**: `backend/config/middlewares.ts`

Asegúrate de que el backend permita peticiones desde `http://localhost:4200`:

```typescript
export default [
  'strapi::errors',
  {
    name: 'strapi::cors',
    config: {
      origin: ['http://localhost:4200', 'http://localhost:1337'],
      credentials: true,
    }
  },
  // ...
];
```

## 🚀 Cómo Iniciar la Aplicación

### 1. Iniciar Backend (Terminal 1)
```bash
cd backend
pnpm install
pnpm run develop
```

Backend disponible en: `http://localhost:1337`
Panel admin: `http://localhost:1337/admin`

**Credenciales por defecto**:
- Usuario: `facopec`
- Email: `facopec@facopec.org`
- Password: `F4c0pec@2025`

### 2. Iniciar Frontend (Terminal 2)
```bash
cd /home/user/facopec
pnpm install
pnpm start
```

Frontend disponible en: `http://localhost:4200`

## 📝 Configurar Permisos en Strapi

Para que el frontend pueda consumir las APIs, configura los permisos:

1. Accede al panel admin: `http://localhost:1337/admin`
2. Ve a **Settings → Users & Permissions → Roles → Public**
3. Habilita los siguientes permisos:

**Home-page**:
- ✅ find

**Donations-page**:
- ✅ find

**Organization-info**:
- ✅ find

**Global**:
- ✅ find

**Project**:
- ✅ find
- ✅ findOne

4. Guarda los cambios

## 🎨 Poblar Contenido desde el Panel Admin

### Paso 1: Acceder al Content Manager
1. Ingresa a `http://localhost:1337/admin`
2. Ve a **Content Manager** en el menú lateral

### Paso 2: Configurar Home Page
1. Selecciona **Home-page** (Single Type)
2. Llena los campos:
   - **Hero**: Título, descripción, stats, acciones, imagen
   - **Impact Highlights**: Íconos, títulos, descripciones
   - **Identity**: Descripción, valores
   - **Mission & Vision**: Textos completos
   - **Activities**: Actividades con enlaces
   - **Programs**: Programas destacados
   - **Supporters**: Logos de aliados
   - **Catalog**: Productos WhatsApp
   - **Gallery**: Imágenes/videos
3. Click **Save**
4. Click **Publish**

### Paso 3: Configurar Donations Page
1. Selecciona **Donations-page** (Single Type)
2. Llena los campos según las necesidades
3. Save & Publish

### Paso 4: Agregar Proyectos
1. Selecciona **Project** (Collection Type)
2. Click **Create new entry**
3. Llena:
   - **Title**: Nombre del proyecto
   - **Description**: Descripción corta
   - **Tag**: Categoría
   - **Link**: URL externa o interna
   - **Cover**: Imagen de portada
   - **Order**: Orden de aparición (número)
4. Save & Publish
5. Repite para cada proyecto

## 🧪 Testing

### Verificar Integración

1. **Verifica que el backend esté corriendo**:
```bash
curl http://localhost:1337/api/home-page
```

Deberías ver una respuesta JSON con los datos.

2. **Verifica el proxy**:
Con el frontend corriendo, abre DevTools → Network y recarga la página.
Deberías ver peticiones a `/api/home-page` sin errores CORS.

3. **Verifica en el navegador**:
- Abre `http://localhost:4200`
- La página home debería cargar el contenido desde Strapi
- Si hay errores, revisa la consola del navegador

## 🐛 Troubleshooting

### Error: CORS Policy
**Problema**: `Access to XMLHttpRequest has been blocked by CORS policy`

**Solución**:
1. Verifica que el proxy esté configurado en `angular.json`
2. Reinicia el servidor Angular: `pnpm start`
3. Verifica CORS en `backend/config/middlewares.ts`

### Error: 403 Forbidden
**Problema**: La API devuelve 403

**Solución**:
1. Verifica los permisos en Strapi Admin
2. Settings → Users & Permissions → Roles → Public
3. Habilita `find` para los Content Types

### Contenido No Se Actualiza
**Problema**: Los cambios en Strapi no se reflejan en el frontend

**Solución**:
1. Verifica que hayas hecho **Publish** en Strapi (no solo Save)
2. En producción, limpia la cache: `strapiService.clearCache()`
3. Recarga la página con Ctrl+Shift+R (hard refresh)

### Imágenes No Cargan
**Problema**: Las imágenes devuelven 404

**Solución**:
1. Verifica que el proxy incluya `/uploads`:
```json
"/uploads": {
  "target": "http://localhost:1337",
  ...
}
```
2. Verifica que las imágenes estén publicadas en Strapi
3. Revisa que la URL se resuelva correctamente: debe ser `http://localhost:1337/uploads/...`

## 📊 Modelo de Datos

### HomePageContent
```typescript
{
  hero: {
    eyebrow: string,
    titleLines: [{line: string}],
    lead: string,
    stats: [{value: string, label: string}],
    actions: [{label: string, url: string, variant: string}],
    verse: {reference: string, text: string, description: string},
    image: MediaAsset
  },
  impactHighlights: [{icon: string, title: string, label: string}],
  identity: {
    description: string,
    values: [{title: string, description: string, icon: string}]
  },
  missionVision: {mission: string, vision: string},
  activities: [{title: string, description: string, icon: string, link: string}],
  programs: [{title: string, description: string, highlights: string[], link: string}],
  supporters: [{name: string, logo: MediaAsset}],
  catalog: [{title: string, description: string, price: string, link: string}],
  gallery: [{title: string, description: string, media: MediaAsset, type: string, link: string}]
}
```

### ProjectCardSummary
```typescript
{
  id: number,
  title: string,
  description: string,
  tag: string,
  link: string,
  order: number,
  cover: MediaAsset
}
```

## 🎯 Próximos Pasos

1. ✅ Backend actualizado a Strapi 5.30.1
2. ✅ Frontend configurado para consumir CMS
3. ✅ Componentes Home, Donate y Projects integrados
4. 🔄 Poblar contenido desde el panel admin
5. 🔄 Configurar componentes About, Organization Info
6. 🔄 Implementar autenticación para admin
7. 🔄 Desplegar a producción

## 📚 Recursos

- [Strapi v5 Documentation](https://docs.strapi.io)
- [Angular Proxy Configuration](https://angular.io/guide/build#proxying-to-a-backend-server)
- [Strapi REST API](https://docs.strapi.io/dev-docs/api/rest)
- [Strapi Users & Permissions](https://docs.strapi.io/user-docs/users-roles-permissions)

## 🤝 Soporte

Si tienes problemas con la integración:
1. Revisa la guía de troubleshooting arriba
2. Revisa los logs del backend: `backend/` (console output)
3. Revisa la consola del navegador (F12 → Console)
4. Revisa el Network tab para ver las peticiones HTTP

---

**¡La aplicación ya está lista para consumir contenido dinámico desde Strapi!** 🎉
