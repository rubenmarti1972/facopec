# FACOPEC CMS (Strapi v5.0.0)

Proyecto Strapi 5.0.0 (versión estable) que sirve como backend CMS para el sitio de la Fundación Afrocolombiana Profe en Casa.

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

### Configuración del servicio de correo (Email)

El proyecto incluye un endpoint `/api/email/send` para enviar correos desde formularios de contacto, empleabilidad y alianzas. Para que funcione correctamente, debes configurar las credenciales SMTP en tu archivo `.env`:

**Opción 1: Brevo (Recomendado - 300 emails/día GRATIS)**

1. Regístrate en [Brevo](https://app.brevo.com/account/register) (anteriormente Sendinblue)
2. Ve a **SMTP & API** → **SMTP** en tu panel
3. Copia tu **Login** (email) y crea una **Master Password** o SMTP key
4. Agrega estas variables a tu `.env`:

```bash
BREVO_SMTP_USER=tu-email@gmail.com
BREVO_SMTP_KEY=tu-smtp-key-aqui
EMAIL_FROM=profeencasasedeciudaddelsur@gmail.com
EMAIL_REPLY_TO=profeencasasedeciudaddelsur@gmail.com
```

**Opción 2: Gmail SMTP**

Si prefieres usar Gmail, configura:

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
BREVO_SMTP_USER=tu-email@gmail.com
BREVO_SMTP_KEY=tu-app-password  # Usa una App Password, no tu contraseña normal
EMAIL_FROM=tu-email@gmail.com
```

⚠️ **Importante**: Sin estas credenciales configuradas, el endpoint de email devolverá un error `400 Bad Request` con el código `SMTP_CREDENTIALS_MISSING`. Los detalles del email se registrarán en los logs del servidor para propósitos de depuración.

## Scripts disponibles

- `pnpm develop`: inicia Strapi en modo desarrollo con recarga en caliente.
- `pnpm start`: ejecuta Strapi en modo producción (requiere `pnpm build`).
- `pnpm build`: compila el panel de administración.
- `pnpm seed`: ejecuta el script de siembra inicial (`src/database/seed.ts`).
- `pnpm upgrade:stable`: ejecuta `upgrade-strapi-to-stable.mjs` para reinstalar Strapi 5.0.0 desde cero.

## Actualización a Strapi 5.0.0 estable

Todas las dependencias `@strapi/*` están fijadas explícitamente a la versión estable `5.0.0` para salir definitivamente de la serie beta. Después de hacer pull de estos cambios:

1. Elimina cualquier instalación previa (`rm -rf node_modules .cache build`) y ejecuta `pnpm install` para descargar la versión estable.
2. Corre `pnpm build` para reconstruir el panel de administración. En la cabecera del CMS debe mostrarse `Strapi v5.0.0` sin la etiqueta **beta**.
3. Si prefieres automatizar el proceso, puedes usar `node upgrade-strapi-to-stable.mjs`, que ahora borra `node_modules`, crea un respaldo de la base SQLite y vuelve a activar los permisos del Content Manager. Al finalizar el script mostrará la versión de Strapi instalada para que confirmes que estás en la rama estable.

## Superusuario preconfigurado

El script de semillas crea automáticamente el superusuario principal utilizando las variables de entorno
`SEED_ADMIN_USERNAME`, `SEED_ADMIN_EMAIL` y `SEED_ADMIN_PASSWORD`. Si no se especifican en `.env`, Strapi usará los
valores predeterminados `facopec`, `facopec@facopec.org` y `F4c0pec@2025` respectivamente.

Puedes regenerarlo ejecutando:

```bash
pnpm seed
```

> ⚠️ Ejecuta `pnpm seed` únicamente en entornos de desarrollo o inicialización. Si ya existe un usuario con el correo configurado, el script no lo modificará.

## Permisos públicos para el frontend Angular

El script de siembra (`pnpm seed`) ahora también sincroniza el rol **public** del plugin `users-permissions` para exponer en modo lectura los contenidos de `global`, `home-page`, `donations-page`, `organization-info` y `project`, además de los ficheros servidos por el plugin **Upload**. Esto permite que el frontend en Angular consulte los endpoints REST publicados sin depender de un token administrativo. Si modificas los permisos manualmente desde el panel, vuelve a ejecutar `pnpm seed` para restablecer la configuración sugerida.

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

## Navegación administrable

La single type `global` incorpora ahora componentes anidados para construir la navegación principal (niveles, grupos e ítems secundarios) desde el CMS. Cada enlace admite `dataUid` para rastrear elementos desde el frontend y los seeds iniciales cargan la misma estructura usada en la SPA. Desde el editor puedes reordenar, ocultar o crear nuevas secciones sin tocar código.

## Flujo recomendado de despliegue

1. Ejecuta `pnpm install` y `pnpm build`.
2. Corre `pnpm seed` para cargar el contenido base y el superusuario.
3. Inicia el servidor con `pnpm develop` (desarrollo) o `pnpm start` (producción).
4. Configura las variables de entorno del frontend (`environment.ts`) apuntando a la URL pública de Strapi y un token API válido.

## Licencia

Strapi Community Edition (open source). Puedes desplegarlo en cualquier proveedor compatible (Render, Railway, Fly.io, etc.).
