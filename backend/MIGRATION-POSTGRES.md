# 🚀 Migración de SQLite a PostgreSQL + Cloudinary

## 📋 Resumen del Problema

**Problema en Render:**
- ❌ SQLite se pierde en cada reinicio (filesystem efímero)
- ❌ Imágenes guardadas localmente se pierden
- ❌ Los datos del CMS no persisten

**Solución:**
- ✅ PostgreSQL para base de datos persistente
- ✅ Cloudinary para almacenamiento de imágenes
- ✅ Todo persiste entre despliegues

---

## 🛠️ Migración Local (Desarrollo)

### Paso 1: Instalar PostgreSQL

#### macOS (con Homebrew)
```bash
brew install postgresql@15
brew services start postgresql@15
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### Windows
Descarga el instalador desde: https://www.postgresql.org/download/windows/

### Paso 2: Configurar PostgreSQL

Crea un usuario y base de datos:

```bash
# Crear usuario (si no existe)
createuser -s postgres

# Establecer contraseña
psql -c "ALTER USER postgres PASSWORD 'postgres';"

# Crear base de datos
createdb facopec_strapi
```

### Paso 3: Configurar Variables de Entorno

El archivo `.env` ya está creado con la configuración necesaria. **Actualiza estos valores:**

```bash
# En backend/.env

# ============================================================
# DATABASE - PostgreSQL
# ============================================================
DATABASE_CLIENT=postgres
DATABASE_HOST=127.0.0.1
DATABASE_PORT=5432
DATABASE_NAME=facopec_strapi
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres  # ⚠️ Cambiar en producción
DATABASE_SCHEMA=public
DATABASE_SSL=false

# ============================================================
# CLOUDINARY - Obtener en https://cloudinary.com/console
# ============================================================
UPLOAD_PROVIDER=cloudinary
CLOUDINARY_NAME=tu-cloud-name        # ⚠️ REQUERIDO
CLOUDINARY_KEY=tu-api-key            # ⚠️ REQUERIDO
CLOUDINARY_SECRET=tu-api-secret      # ⚠️ REQUERIDO

# ============================================================
# SEGURIDAD - Generar nuevos secretos con: openssl rand -base64 32
# ============================================================
APP_KEYS=key1,key2,key3,key4         # ⚠️ CAMBIAR en producción
ADMIN_JWT_SECRET=tu-secret           # ⚠️ CAMBIAR
API_TOKEN_SALT=tu-salt               # ⚠️ CAMBIAR
TRANSFER_TOKEN_SALT=tu-salt          # ⚠️ CAMBIAR
JWT_SECRET=tu-secret                 # ⚠️ CAMBIAR
```

### Paso 4: Obtener Credenciales de Cloudinary

1. Ve a https://cloudinary.com/ y crea una cuenta (gratis)
2. En el Dashboard, copia:
   - **Cloud Name**
   - **API Key**
   - **API Secret**
3. Pégalos en tu archivo `.env`

### Paso 5: Verificar Conexión a PostgreSQL

```bash
cd backend
npm run setup:postgres
```

Esto verificará:
- ✅ Conexión al servidor PostgreSQL
- ✅ Existencia de la base de datos (la crea si no existe)
- ✅ Permisos del usuario

### Paso 6: Iniciar Strapi (Primera vez)

```bash
npm run develop
```

Strapi detectará PostgreSQL y creará todas las tablas automáticamente.

### Paso 7: Migrar Datos desde SQLite (Opcional)

Si tienes datos en SQLite que quieres migrar:

```bash
npm run migrate:postgres
```

**O manualmente:**

```bash
# Opción A: Usar el script de seed
npm run seed

# Opción B: Migrar desde SQLite
node scripts/migrate-sqlite-to-postgres.mjs
```

---

## 🌐 Despliegue en Render

### Paso 1: Agregar PostgreSQL Database

1. Ve a tu servicio en Render
2. En el dashboard, ve a la pestaña **"Environment"** o **"New"**
3. Selecciona **"PostgreSQL"**
4. Crea una nueva base de datos:
   - **Name:** `facopec-postgres` (o el nombre que prefieras)
   - **Database:** `facopec_strapi`
   - **User:** Se crea automáticamente
   - **Region:** Misma que tu web service
   - **Plan:** Free (o el que necesites)

5. **Conecta** la base de datos a tu web service

### Paso 2: Configurar Variables de Entorno en Render

En la sección **Environment** de tu web service, agrega:

#### Base de Datos PostgreSQL

Render auto-crea la variable `DATABASE_URL`, pero necesitamos configurar individualmente:

```bash
# Si Render crea DATABASE_URL, puedes extraer los valores de ahí
# Formato: postgresql://user:password@host:port/database

# O configurarlas manualmente:
DATABASE_CLIENT=postgres
DATABASE_HOST=dpg-xxxxx.region.render.com    # De la conexión interna
DATABASE_PORT=5432
DATABASE_NAME=facopec_strapi
DATABASE_USERNAME=facopec_strapi_user        # Usuario generado por Render
DATABASE_PASSWORD=xxxxxxxxxxxxx               # Contraseña generada por Render
DATABASE_SCHEMA=public
DATABASE_SSL=true                             # ⚠️ IMPORTANTE: true en Render
```

#### Cloudinary

```bash
UPLOAD_PROVIDER=cloudinary
CLOUDINARY_NAME=tu-cloud-name
CLOUDINARY_KEY=tu-api-key
CLOUDINARY_SECRET=tu-api-secret
```

#### Seguridad (Generar nuevos valores)

```bash
# Generar con: openssl rand -base64 32 (4 veces)
APP_KEYS=nuevo-key1,nuevo-key2,nuevo-key3,nuevo-key4
ADMIN_JWT_SECRET=nuevo-admin-jwt-secret
API_TOKEN_SALT=nuevo-api-token-salt
TRANSFER_TOKEN_SALT=nuevo-transfer-token-salt
JWT_SECRET=nuevo-jwt-secret
```

#### Otras Variables

```bash
HOST=0.0.0.0
PORT=1337
NODE_ENV=production
PUBLIC_URL=https://tu-servicio.onrender.com
APP_URL=https://tu-servicio.onrender.com
CORS_ORIGINS=https://tu-frontend.com,https://tu-frontend.onrender.com
STRAPI_TELEMETRY_DISABLED=true

# Email (opcional)
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
BREVO_SMTP_USER=tu-email@gmail.com
BREVO_SMTP_KEY=tu-smtp-key
EMAIL_FROM=tu-email@gmail.com
EMAIL_REPLY_TO=tu-email@gmail.com
```

### Paso 3: Desplegar

1. Guarda las variables de entorno
2. Render hará un redespliegue automático
3. Strapi creará las tablas en PostgreSQL automáticamente

### Paso 4: Cargar Datos Iniciales

**Opción A: Desde el Admin Panel**
1. Ve a `https://tu-servicio.onrender.com/admin`
2. Crea el usuario admin
3. Carga el contenido manualmente

**Opción B: Usando el Seed Script**

Si tienes acceso SSH o puedes ejecutar comandos:

```bash
npm run seed
```

**Opción C: Restaurar desde Backup**

Si tienes un backup SQL de PostgreSQL:

```bash
psql $DATABASE_URL < backup.sql
```

---

## ✅ Verificación

### En Local

```bash
# 1. Verificar que Strapi inicie correctamente
npm run develop

# 2. Abrir http://localhost:1337/admin

# 3. Subir una imagen - debe ir a Cloudinary
# 4. Verificar en Cloudinary Dashboard que la imagen aparece
```

### En Render

```bash
# 1. Verificar logs en Render Dashboard
# Buscar líneas como:
# - "PostgreSQL connection established"
# - "Server listening on http://0.0.0.0:1337"

# 2. Abrir tu URL de producción
# https://tu-servicio.onrender.com/admin

# 3. Crear contenido y verificar que persiste después de redesplegar
```

---

## 🔧 Scripts Disponibles

```bash
# Configuración y migración
npm run setup:postgres      # Verificar y configurar PostgreSQL
npm run migrate:postgres    # Migrar datos de SQLite a PostgreSQL

# Desarrollo
npm run develop             # Modo desarrollo
npm run start              # Modo producción
npm run build              # Construir admin panel

# Datos
npm run seed               # Cargar datos de prueba
npm run restore:db         # Restaurar desde backup SQL (SQLite)
```

---

## 🚨 Solución de Problemas

### Error: "Cannot connect to PostgreSQL"

```bash
# Verificar que PostgreSQL está ejecutándose
# macOS:
brew services list

# Linux:
sudo systemctl status postgresql

# Verificar configuración
npm run setup:postgres
```

### Error: "Role 'postgres' does not exist"

```bash
createuser -s postgres
psql -c "ALTER USER postgres PASSWORD 'postgres';"
```

### Error: "Database does not exist"

```bash
createdb facopec_strapi
```

### Error: "Cloudinary upload failed"

- Verifica que las credenciales en `.env` son correctas
- Verifica que `UPLOAD_PROVIDER=cloudinary`
- Ve al Dashboard de Cloudinary para verificar el estado de tu cuenta

### Las imágenes siguen guardándose localmente

Verifica que en `backend/config/plugins.ts` la línea 22 tiene:

```typescript
env('UPLOAD_PROVIDER', 'cloudinary') === 'cloudinary'
```

Y que tu `.env` tiene:

```bash
UPLOAD_PROVIDER=cloudinary
```

---

## 📚 Recursos Adicionales

- [Strapi PostgreSQL Configuration](https://docs.strapi.io/dev-docs/configurations/database#postgres-configuration)
- [Cloudinary Upload Provider](https://market.strapi.io/providers/@strapi-provider-upload-cloudinary)
- [Render PostgreSQL](https://render.com/docs/databases)
- [Render Environment Variables](https://render.com/docs/environment-variables)

---

## 🎯 Checklist Final

### Desarrollo Local

- [ ] PostgreSQL instalado y ejecutándose
- [ ] Base de datos `facopec_strapi` creada
- [ ] Archivo `.env` configurado con credenciales correctas
- [ ] `npm run setup:postgres` exitoso
- [ ] `npm run develop` inicia sin errores
- [ ] Puedes subir imágenes a Cloudinary
- [ ] Los datos persisten después de reiniciar

### Producción (Render)

- [ ] PostgreSQL database creado en Render
- [ ] Todas las variables de entorno configuradas
- [ ] `DATABASE_SSL=true` configurado
- [ ] CORS_ORIGINS incluye tu dominio frontend
- [ ] Cloudinary credenciales configuradas
- [ ] Secretos de seguridad regenerados (no usar los de ejemplo)
- [ ] Servicio desplegado exitosamente
- [ ] `/admin` accesible
- [ ] Contenido persiste después de redesplegar
- [ ] Imágenes se suben a Cloudinary

---

## 🆘 Soporte

Si tienes problemas:

1. Revisa los logs de Render
2. Verifica que todas las variables de entorno estén configuradas
3. Asegúrate de que DATABASE_SSL=true en producción
4. Verifica las credenciales de Cloudinary en su Dashboard
5. Intenta redesplegar después de configurar las variables

---

**✨ ¡Listo! Ahora tu CMS está configurado para persistir datos e imágenes en Render.**
