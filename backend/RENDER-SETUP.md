# 🚀 Configuración Rápida para Render

## Variables de Entorno en Render

Copia y pega estas variables en **Render Dashboard > Environment**:

### 🔐 Seguridad (Generar nuevos valores)

```bash
# Generar con: openssl rand -base64 32
NODE_ENV=production
APP_KEYS=GENERA_NUEVO_KEY1,GENERA_NUEVO_KEY2,GENERA_NUEVO_KEY3,GENERA_NUEVO_KEY4
ADMIN_JWT_SECRET=GENERA_NUEVO_SECRET
API_TOKEN_SALT=GENERA_NUEVO_SALT
TRANSFER_TOKEN_SALT=GENERA_NUEVO_SALT
JWT_SECRET=GENERA_NUEVO_SECRET
```

### 🗄️ PostgreSQL (Auto-configurado por Render)

```bash
DATABASE_CLIENT=postgres
# Render crea DATABASE_URL automáticamente, extrae estos valores:
DATABASE_HOST=dpg-xxxxx-internal.region.render.com
DATABASE_PORT=5432
DATABASE_NAME=facopec_strapi
DATABASE_USERNAME=facopec_strapi_user
DATABASE_PASSWORD=xxxxxxxxxxxxx
DATABASE_SCHEMA=public
DATABASE_SSL=true
```

> 💡 **Tip:** Cuando crees el PostgreSQL database en Render, él te dará estos valores.
> Usa la **Internal Database URL** para mejor rendimiento.

### 📸 Cloudinary (Obligatorio)

```bash
UPLOAD_PROVIDER=cloudinary
CLOUDINARY_NAME=tu-cloud-name
CLOUDINARY_KEY=tu-api-key
CLOUDINARY_SECRET=tu-api-secret
```

> 📝 Obtén las credenciales en: https://cloudinary.com/console

### 🌐 URLs y CORS

```bash
HOST=0.0.0.0
PORT=1337
PUBLIC_URL=https://tu-backend.onrender.com
APP_URL=https://tu-backend.onrender.com
CORS_ORIGINS=https://tu-frontend.com,https://tu-frontend.onrender.com
```

### 📧 Email (Opcional - Brevo)

```bash
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
BREVO_SMTP_USER=tu-email@gmail.com
BREVO_SMTP_KEY=tu-smtp-key
EMAIL_FROM=tu-email@gmail.com
EMAIL_REPLY_TO=tu-email@gmail.com
```

### 🔧 Otros

```bash
STRAPI_TELEMETRY_DISABLED=true
SEED_ADMIN_USERNAME=admin
SEED_ADMIN_EMAIL=admin@facopec.org
SEED_ADMIN_PASSWORD=TuPasswordSegura123!
# Si el admin se bloqueó en producción, forzar desbloqueo y reset
# (solo durante el siguiente arranque)
SEED_ADMIN_FORCE_RESET=true
```

---

## 📋 Checklist de Configuración

### 1. Crear PostgreSQL Database

- [ ] En Render, ve a **New → PostgreSQL**
- [ ] Name: `facopec-postgres`
- [ ] Database: `facopec_strapi`
- [ ] Plan: Free (o el que necesites)
- [ ] Región: Misma que tu web service
- [ ] Copia las credenciales (host, port, user, password)

### 2. Configurar Web Service

- [ ] Ve a tu web service
- [ ] Environment → Add Environment Variable
- [ ] Pega todas las variables de arriba
- [ ] **Importante:** Cambia todos los valores marcados con `GENERA_NUEVO_`
- [ ] **Importante:** Cambia las credenciales de Cloudinary
- [ ] Verifica que `DATABASE_SSL=true`

### 3. Build Configuration

Verifica en **Settings**:

```bash
Build Command: pnpm install && pnpm run build
Start Command: pnpm run start
```

### 4. Desplegar

- [ ] Guarda las variables de entorno
- [ ] Render redesplega automáticamente
- [ ] Espera 3-5 minutos
- [ ] Ve a los logs para verificar: `Server listening on http://0.0.0.0:1337`

### 5. Verificar

- [ ] Abre `https://tu-backend.onrender.com/admin`
- [ ] Crea el usuario admin
- [ ] Sube una imagen de prueba
- [ ] Verifica que aparece en Cloudinary Dashboard
- [ ] Redeploying (Deploy → Manual Deploy)
- [ ] Verifica que los datos persisten

---

## 🚨 Errores Comunes

### "Cannot connect to database"

- ✅ Verifica que PostgreSQL database esté creado
- ✅ Verifica que las credenciales sean correctas
- ✅ Usa la **Internal Database URL** (mejor rendimiento)
- ✅ Asegúrate que `DATABASE_SSL=true`

### "Cloudinary upload failed"

- ✅ Verifica las credenciales en Cloudinary Dashboard
- ✅ Asegúrate que `UPLOAD_PROVIDER=cloudinary`
- ✅ No uses espacios en los valores

### "Build failed"

- ✅ Asegúrate que el archivo `.env` NO esté en el repositorio
- ✅ Verifica que todas las variables estén en Render
- ✅ Revisa los logs de build

### "Port scan timeout reached"

- ✅ Render necesita que el comando de inicio abra un puerto (web service)
- ✅ Usa **Start Command: `pnpm run start`** para levantar Strapi
- ✅ **No** uses `pnpm run seed` ni `pnpm run seed:production` como comando principal: son scripts cortos que cierran el proceso y Render detiene el despliegue al no detectar el puerto
- ✅ El seed se ejecuta automáticamente al iniciar Strapi en producción; solo necesitas configurar correctamente las variables de entorno
- ✅ **Si Render inicia con SQLite, el CMS quedará vacío en cada redeploy.** Asegúrate de que `DATABASE_CLIENT=postgres` esté configurado en Environment para obligar a Strapi a usar PostgreSQL

### "Los datos se pierden"

- ✅ Estás usando PostgreSQL (no SQLite)
- ✅ `DATABASE_CLIENT=postgres` está configurado
- ✅ La conexión a PostgreSQL es exitosa (ve los logs)

---

## 📦 Poblar Producción con los Mismos Datos que Local

Una vez que el arranque en Render funcione, la base de datos queda vacía. Usa los scripts de población existentes para copiar el mismo contenido que tienes en local.

1. **Confirma credenciales del Admin de producción** (las que creaste en `https://tu-backend.onrender.com/admin`).
2. **Desde tu máquina local** (no necesita SSH en Render), ejecuta:
   ```bash
   cd backend
   STRAPI_BASE_URL=https://tu-backend.onrender.com \
   STRAPI_ADMIN_EMAIL=admin@facopec.org \
   STRAPI_ADMIN_PASSWORD="tu-password-admin" \
   node populate-all-cms.js
   ```
   - Los scripts llaman a la API de Strapi usando `STRAPI_BASE_URL`; por defecto apuntan a `http://localhost:1337`, por eso es obligatorio sobreescribirla con la URL pública de Render.
   - Usa el email y contraseña reales del Admin de producción (no los valores por defecto) para que la autenticación funcione.
3. **Verifica el contenido** en `https://tu-backend.onrender.com/admin` o con:
   ```bash
   curl https://tu-backend.onrender.com/api/home-page
   curl https://tu-backend.onrender.com/api/global
   ```
4. **Persistencia**: si el contenido aparece después de refrescar la página o tras un redeploy, está guardado en PostgreSQL y ya queda disponible para el frontend.

> ℹ️ Estos scripts solo envían datos vía API; no requieren acceso directo a la base de datos ni interrumpen el servicio en Render.

---

## 🔄 Actualizar Secretos

```bash
# Generar nuevos secretos en tu terminal local:
openssl rand -base64 32

# Generar 4 keys para APP_KEYS:
openssl rand -base64 32
openssl rand -base64 32
openssl rand -base64 32
openssl rand -base64 32

# Luego pégalos en Render separados por comas
```

---

## 📞 Soporte

Si algo no funciona:

1. 🔍 Revisa los **logs** en Render Dashboard
2. 🔧 Verifica que **todas** las variables estén configuradas
3. 🔑 Asegúrate que los secretos no tengan espacios
4. 🌐 Verifica que CORS_ORIGINS incluya tu dominio frontend
5. 🔄 Intenta un **Manual Deploy**

---

**✅ Todo listo! Tu CMS ahora persiste datos e imágenes en Render.**
