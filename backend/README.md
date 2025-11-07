# FACOPEC CMS (Strapi v5.2.x)

Proyecto Strapi 5.2.x (versión estable) que sirve como backend CMS para el sitio de la Fundación Afrocolombiana Profe en Casa.

## Requisitos

- Node.js 20 LTS
- pnpm 9+

## Instalación

```bash
cd backend
pnpm install
```

## Variables de entorno

Duplica `.env.example` y crea `.env`.

```bash
cp .env.example .env
```

Ajusta los valores de `APP_KEYS`, `API_TOKEN_SALT`, `ADMIN_JWT_SECRET`, `TRANSFER_TOKEN_SALT` y `JWT_SECRET` con cadenas seguras.

Por defecto el proyecto arranca con SQLite, por lo que no necesitas ningún servicio adicional para el entorno local. Si prefieres PostgreSQL, completa las variables `DATABASE_HOST`, `DATABASE_NAME`, `DATABASE_USERNAME` y `DATABASE_PASSWORD` y asegúrate de tener la base de datos en ejecución antes de iniciar Strapi.

## Scripts disponibles

- `pnpm develop`: inicia Strapi en modo desarrollo con recarga en caliente.
- `pnpm start`: ejecuta Strapi en modo producción (requiere `pnpm build`).
- `pnpm build`: compila el panel de administración.
- `pnpm seed`: ejecuta el script de siembra inicial (`src/database/seed.ts`).

## Actualización a Strapi 5.2.2 estable

Todas las dependencias `@strapi/*` están fijadas a la serie estable `^5.2.2`. Después de hacer pull de estos cambios:

1. Ejecuta `pnpm install` para descargar las nuevas versiones estables (si tienes restos de versiones beta, borra `node_modules`, `.cache` y `build` antes de instalar).
2. Corre `pnpm build` para reconstruir el panel de administración. En la cabecera del CMS ya no debe aparecer la etiqueta **beta**; debería mostrarse algo como `Strapi v5.2.x`.
3. Si prefieres automatizar el proceso, puedes usar `node upgrade-strapi-to-stable.mjs`, que también crea un respaldo de la base SQLite y vuelve a activar los permisos del Content Manager.

## Superusuario preconfigurado

El script de semillas crea automáticamente el superusuario principal utilizando las variables de entorno
`SEED_ADMIN_USERNAME`, `SEED_ADMIN_EMAIL` y `SEED_ADMIN_PASSWORD`. Si no se especifican en `.env`, Strapi usará los
valores predeterminados `facopec`, `facopec@facopec.org` y `F4c0pec@2025` respectivamente.

Puedes regenerarlo ejecutando:

```bash
pnpm seed
```

> ⚠️ Ejecuta `pnpm seed` únicamente en entornos de desarrollo o inicialización. Si ya existe un usuario con el correo configurado, el script no lo modificará.

## Validaciones flexibles en el Content Manager

Todos los componentes y tipos de contenido vienen ahora sin campos obligatorios. Esto te permite guardar los documentos aunque dejes títulos, enlaces o imágenes vacíos mientras decides la versión final del contenido.

- Si quieres ocultar una tarjeta o elemento específico, simplemente elimina el bloque desde el editor o deja sus campos vacíos; el frontend ignorará automáticamente los registros incompletos.
- Si necesitas volver a exigir algún dato (por ejemplo, que una tarjeta tenga título), puedes marcarlo como obligatorio desde **Settings → Content Manager → Configuración** dentro del panel de Strapi.

## Endpoints clave

- `GET /api/home-page?populate=deep` – Contenido de la página de inicio.
- `GET /api/donations-page?populate=deep` – Configuración de la página de donaciones.
- `GET /api/projects?sort=order:asc` – Proyectos destacados.
- `GET /api/global?populate=deep` – Navegación, logos y redes.
- `GET /api/organization-info?populate=deep` – Información institucional y redes sociales.

Todas las rutas exponen datos listos para ser consumidos por el frontend Angular.

## Flujo recomendado de despliegue

1. Ejecuta `pnpm install` y `pnpm build`.
2. Corre `pnpm seed` para cargar el contenido base y el superusuario.
3. Inicia el servidor con `pnpm develop` (desarrollo) o `pnpm start` (producción).
4. Configura las variables de entorno del frontend (`environment.ts`) apuntando a la URL pública de Strapi y un token API válido.

## Licencia

Strapi Community Edition (open source). Puedes desplegarlo en cualquier proveedor compatible (Render, Railway, Fly.io, etc.).
