# Guía de Migración a Strapi 5.30.1

## Resumen de la Migración

Se ha actualizado exitosamente el backend de **Strapi 5.0.0** a **Strapi 5.30.1** (versión estable).

## Cambios Realizados

### 1. Actualización de Dependencias

- **Strapi**: 5.0.0 → 5.30.1
- **Node.js**: Ahora soporta hasta Node 22
- **TypeScript**: 5.5.4 → 5.7.2
- **React**: 18.2.0 → 18.3.1
- **better-sqlite3**: 12.4.1 → 11.8.1

### 2. Simplificación de Dependencias

En Strapi 5, los plugins están integrados en el paquete principal `@strapi/strapi`. Ya no es necesario instalar plugins por separado:

```json
{
  "dependencies": {
    "@strapi/strapi": "5.30.1",
    "better-sqlite3": "11.8.1",
    "pg": "8.13.1",
    ...
  }
}
```

### 3. Configuración de TypeScript

Se actualizó `tsconfig.json` para usar una configuración base de TypeScript en lugar de `@strapi/typescript-utils/tsconfigs/server`.

## APIs Disponibles

El backend expone las siguientes APIs REST:

### Content Types (Single Type)

Estas son páginas únicas que se acceden directamente:

1. **Home Page** - `/api/home-page`
   - Hero section
   - Impact highlights
   - Identity
   - Mission/Vision
   - Activities
   - Programs
   - Supporters
   - Catalog
   - Gallery

2. **Donations Page** - `/api/donations-page`
   - Información de donaciones

3. **Organization Info** - `/api/organization-info`
   - Información general de la organización

4. **Global** - `/api/global`
   - Configuración global del sitio

### Content Types (Collection Type)

Estas son colecciones de múltiples elementos:

1. **Projects** - `/api/projects`
   - Lista de proyectos
   - Endpoints:
     - `GET /api/projects` - Listar todos
     - `GET /api/projects/:id` - Obtener uno
     - `POST /api/projects` - Crear (requiere autenticación)
     - `PUT /api/projects/:id` - Actualizar (requiere autenticación)
     - `DELETE /api/projects/:id` - Eliminar (requiere autenticación)

## Cómo Iniciar el Backend

### Modo Desarrollo

```bash
cd backend
pnpm install
pnpm run develop
```

El backend estará disponible en: `http://localhost:1337`
El panel de administración: `http://localhost:1337/admin`

### Modo Producción

```bash
cd backend
pnpm run build
pnpm run start
```

## Configuración de Permisos

Para que el frontend pueda consumir el contenido del CMS, debes configurar los permisos:

1. Accede al panel de administración: `http://localhost:1337/admin`
2. Ve a **Settings → Users & Permissions → Roles → Public**
3. Habilita los permisos de **FIND** y **FIND ONE** para:
   - home-page
   - donations-page
   - organization-info
   - global
   - project (find y findOne)

## Configuración de Base de Datos

### SQLite (Por Defecto)

El archivo `.env` está configurado para usar SQLite:

```env
DATABASE_CLIENT=sqlite
```

Los datos se guardan en: `backend/.tmp/data.db`

### PostgreSQL (Opcional)

Si prefieres usar PostgreSQL, actualiza el archivo `.env`:

```env
DATABASE_CLIENT=postgres
DATABASE_HOST=127.0.0.1
DATABASE_PORT=5432
DATABASE_NAME=strapi
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=strapi
DATABASE_SCHEMA=public
DATABASE_SSL=false
```

## Consumir desde el Frontend (Angular)

### Crear un Servicio

```typescript
// src/app/services/cms.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CmsService {
  private apiUrl = 'http://localhost:1337/api';

  constructor(private http: HttpClient) {}

  // Obtener página de inicio
  getHomePage(): Observable<any> {
    return this.http.get(`${this.apiUrl}/home-page?populate=deep`)
      .pipe(map((response: any) => response.data));
  }

  // Obtener proyectos
  getProjects(): Observable<any[]> {
    return this.http.get(`${this.apiUrl}/projects?populate=*`)
      .pipe(map((response: any) => response.data));
  }

  // Obtener un proyecto por ID
  getProject(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/projects/${id}?populate=*`)
      .pipe(map((response: any) => response.data));
  }

  // Obtener información de la organización
  getOrganizationInfo(): Observable<any> {
    return this.http.get(`${this.apiUrl}/organization-info?populate=deep`)
      .pipe(map((response: any) => response.data));
  }
}
```

### Usar en un Componente

```typescript
import { Component, OnInit } from '@angular/core';
import { CmsService } from './services/cms.service';

@Component({
  selector: 'app-home',
  template: `
    <div *ngIf="homePage">
      <h1>{{ homePage.attributes.hero.title }}</h1>
      <p>{{ homePage.attributes.hero.description }}</p>
    </div>
  `
})
export class HomeComponent implements OnInit {
  homePage: any;

  constructor(private cms: CmsService) {}

  ngOnInit() {
    this.cms.getHomePage().subscribe(data => {
      this.homePage = data;
    });
  }
}
```

## Crear Usuario Super Admin

Al iniciar el backend por primera vez, se creará automáticamente un usuario administrador con las credenciales configuradas en `.env`:

```env
SEED_ADMIN_USERNAME=facopec
SEED_ADMIN_EMAIL=facopec@facopec.org
SEED_ADMIN_PASSWORD=F4c0pec@2025
```

**IMPORTANTE**: Cambia estas credenciales en producción.

## Notas Importantes

1. **CORS**: El backend está configurado para aceptar peticiones desde `http://localhost:4200` (Angular dev server)
2. **Población de relaciones**: Usa el parámetro `?populate=*` o `?populate=deep` para obtener datos relacionados
3. **Draftand Publish**: Los Content Types tienen draft/publish habilitado. Solo se obtienen los publicados por defecto
4. **Media Files**: Las imágenes subidas se guardan en `backend/public/uploads/`

## Troubleshooting

### Error: "Cannot find module '@strapi/types'"

Ejecuta:
```bash
pnpm install
```

### Error: "Port 1337 already in use"

Cambia el puerto en `.env`:
```env
PORT=1338
```

### Error de permisos en las APIs

Revisa la configuración de permisos en Settings → Users & Permissions → Roles → Public

## Próximos Pasos

1. ✅ Backend actualizado a Strapi 5.30.1
2. ✅ Content Types configurados y funcionando
3. ✅ Base de datos SQLite lista
4. 🔄 Configurar permisos para APIs públicas
5. 🔄 Poblar contenido desde el panel admin
6. 🔄 Conectar el frontend Angular al CMS
7. 🔄 Desplegar a producción

## Soporte

Para más información sobre Strapi 5, consulta la documentación oficial:
- [Strapi 5 Documentation](https://docs.strapi.io)
- [REST API Reference](https://docs.strapi.io/dev-docs/api/rest)
- [Content API](https://docs.strapi.io/dev-docs/api/content-api)
