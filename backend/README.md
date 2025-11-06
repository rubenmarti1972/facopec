# FACOPEC CMS (Strapi v5)

Proyecto Strapi v5 que sirve como backend CMS para el sitio de la Fundación Afrocolombiana Profe en Casa.

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

Ajusta los valores de `APP_KEYS`, `API_TOKEN_SALT`, `ADMIN_JWT_SECRET`, `TRANSFER_TOKEN_SALT` y `JWT_SECRET` con cadenas seguras. Si vas a usar PostgreSQL o un proveedor externo de archivos, actualiza las variables correspondientes.

## Scripts disponibles

- `pnpm develop`: inicia Strapi en modo desarrollo con recarga en caliente.
- `pnpm start`: ejecuta Strapi en modo producción (requiere `pnpm build`).
- `pnpm build`: compila el panel de administración.
- `pnpm seed`: ejecuta el script de siembra inicial (`src/database/seed.ts`).

## Superusuario preconfigurado

El script de semillas crea automáticamente el superusuario principal:

- **Usuario**: `facopec`
- **Correo**: `facopec@facopec.org`
- **Contraseña**: `F4c0pec@2025`

Puedes regenerarlo ejecutando:

```bash
pnpm seed
```

> ⚠️ Ejecuta `pnpm seed` únicamente en entornos de desarrollo o inicialización. Si ya existe un usuario con el correo configurado, el script no lo modificará.

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
