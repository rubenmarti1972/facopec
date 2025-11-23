# Estado de las Correcciones - FACOPEC Backend

## ✅ Problemas Resueltos

### 1. **Problema: SQLite restaurándose en producción**
**Síntoma**: El script `restore-sql.mjs` se ejecutaba en Render, creando una base de datos SQLite en el filesystem efímero, mientras Strapi se conectaba a PostgreSQL (vacío).

**Solución implementada**:
- ✅ Modificado `restore-sql.mjs` para detectar producción con PostgreSQL y omitirse automáticamente
- ✅ Removido del hook `prestart` para mayor seguridad
- ✅ Se mantiene solo en `predevelop` para desarrollo local

**Código agregado en restore-sql.mjs**:
```javascript
// NUNCA ejecutar en producción con PostgreSQL
if (process.env.NODE_ENV === 'production' && process.env.DATABASE_CLIENT === 'postgres') {
  console.log('ℹ️  Producción con PostgreSQL detectada - omitiendo restore-sql.mjs');
  return;
}
```

### 2. **Problema: Usuario admin sin rol asignado**
**Síntoma**: Logs mostraban "Your application doesn't have a super admin user" y "Some users (1) don't have any role"

**Solución implementada**:
- ✅ Creado script `force-create-admin.mjs` que se ejecuta en cada inicio
- ✅ Garantiza que exista un usuario admin con rol super-admin
- ✅ Actualiza contraseña si el usuario ya existe
- ✅ Asigna rol correctamente usando bcryptjs para hash de contraseña

### 3. **Problema: Base de datos vacía en primer deploy**
**Síntoma**: PostgreSQL vacío causaba errores de "null" en el frontend

**Solución implementada**:
- ✅ Creado script `auto-seed-if-empty.mjs` que detecta si la BD está vacía
- ✅ Ejecuta seed automáticamente en primer deploy
- ✅ Idempotente: puede ejecutarse múltiples veces sin problemas

---

## 📋 Configuración Actual

### Scripts de Inicio (package.json)

**Desarrollo local**:
```json
"predevelop": "node scripts/restore-sql.mjs --if-missing"
```
- Restaura SQLite si no existe (solo para desarrollo)

**Producción (Render)**:
```json
"prestart": "node scripts/auto-seed-if-empty.mjs && node scripts/force-create-admin.mjs"
```
1. Verifica si la BD está vacía y ejecuta seed si es necesario
2. Crea/actualiza usuario admin con rol correcto

---

## 🚀 Próximos Pasos en Render

### Paso 1: Redesplegar con los Cambios
Los cambios ya están en la rama `claude/migrate-sqlite-postgres-01S2FKHnMibzejfmRfVKSTtp`.

**En Render**:
1. Ve a tu servicio backend
2. Si Render no detectó el push automáticamente, haz "Manual Deploy" → selecciona la rama
3. Espera a que termine el deploy

### Paso 2: Verificar los Logs
Después del deploy, revisa los logs de Render. Deberías ver:

✅ **Logs esperados (CORRECTOS)**:
```
ℹ️  Producción con PostgreSQL detectada - omitiendo restore-sql.mjs
✅ Base de datos ya tiene datos - omitiendo seed
✅ Usuario admin creado/actualizado exitosamente
✅ Usuario: facopec@facopec.org
```

❌ **NO deberías ver**:
```
✅ Base restaurada en /opt/render/project/src/backend/data/strapi.db
warn: Your application doesn't have a super admin user
warn: Some users (1) don't have any role
```

### Paso 3: Probar Acceso al Admin
Una vez que veas los logs correctos:

**URL**: `https://tu-backend.onrender.com/admin`

**Credenciales por defecto**:
- Email: `facopec@facopec.org`
- Password: `F4c0pec@2025`

Si no funciona, revisa los logs y busca mensajes de error específicos.

---

## 📧 Problema Pendiente: Emails No Se Envían

### Diagnóstico
El controlador de email ya está correctamente implementado y valida las credenciales SMTP antes de enviar.

**Archivo**: `backend/src/api/email/controllers/email.ts`

El código verifica:
```typescript
const hasSmtpUser = !!process.env.BREVO_SMTP_USER;
const hasSmtpKey = !!process.env.BREVO_SMTP_KEY;

if (!hasSmtpUser || !hasSmtpKey) {
  return ctx.badRequest({
    success: false,
    message: 'Email service is not fully configured',
    error: 'SMTP_CREDENTIALS_MISSING'
  });
}
```

### Solución: Configurar Brevo (Sendinblue)

#### 1. Crear Cuenta en Brevo
1. Ve a https://www.brevo.com/
2. Crea una cuenta gratuita (300 emails/día gratis)
3. Confirma tu email

#### 2. Generar SMTP Key
1. Inicia sesión en Brevo
2. Ve a **Settings** (Configuración)
3. Click en **SMTP & API**
4. En la sección **SMTP**, click en **Create a new SMTP key**
5. Dale un nombre (ej: "FACOPEC Render")
6. Copia la clave generada (solo se muestra una vez)

#### 3. Configurar Variables de Entorno en Render
1. Ve a tu servicio backend en Render
2. Click en **Environment** (Variables de entorno)
3. Agrega las siguientes variables:

```bash
# SMTP Configuration
BREVO_SMTP_USER=tu-email@gmail.com         # El email que usaste para registrarte en Brevo
BREVO_SMTP_KEY=xkeysib-xxxxxxxxxxxxx       # La clave SMTP que copiaste
SMTP_HOST=smtp-relay.brevo.com             # (Ya está en el código por defecto)
SMTP_PORT=587                               # (Ya está en el código por defecto)

# Opcional - Configurar emails "From" y "Reply-To"
EMAIL_FROM=notificaciones.facopec@gmail.com
EMAIL_REPLY_TO=profeencasasedeciudaddelsur@gmail.com
```

4. Click **Save Changes**
5. Render redesplegará automáticamente

#### 4. Verificar Configuración de Email
Después del redeploy, puedes probar el endpoint directamente:

```bash
curl -X POST https://tu-backend.onrender.com/api/email/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": "tu-email-de-prueba@gmail.com",
    "subject": "Prueba desde FACOPEC",
    "text": "Este es un email de prueba",
    "replyTo": "profeencasasedeciudaddelsur@gmail.com"
  }'
```

Respuesta esperada:
```json
{
  "success": true,
  "message": "Email sent successfully",
  "to": "tu-email-de-prueba@gmail.com",
  "subject": "Prueba desde FACOPEC"
}
```

---

## 🔍 Verificación Final

### Checklist de Verificación

- [ ] Deploy completado sin errores
- [ ] Logs muestran "omitiendo restore-sql.mjs"
- [ ] NO hay warnings sobre "super admin user"
- [ ] Puedes entrar al admin con `facopec@facopec.org` / `F4c0pec@2025`
- [ ] API devuelve datos correctos en `/api/global?populate=deep`
- [ ] Frontend muestra contenido sin errores de "null"
- [ ] Variables SMTP configuradas en Render
- [ ] Emails se envían correctamente desde formularios

### Comandos de Verificación Rápida

**Verificar API devuelve datos**:
```bash
curl https://tu-backend.onrender.com/api/global?populate=deep
```

**Verificar que el endpoint de email existe**:
```bash
curl -X POST https://tu-backend.onrender.com/api/email/send \
  -H "Content-Type: application/json" \
  -d '{"to":"test@test.com","subject":"test","text":"test"}'
```

---

## 📝 Resumen de Commits Recientes

```
579ac1e - fix: Evitar restore-sql en producción con PostgreSQL
f6b8961 - feat: Agregar script para forzar creación de usuario admin
81a5cb4 - feat: Script de auto-seed inteligente para producción
2e098d9 - fix: Remover prestart hook que restauraba SQLite en producción
```

---

## 🆘 Si Algo Falla

### Admin Login No Funciona
1. Revisa logs de Render para mensajes de error
2. Verifica que `force-create-admin.mjs` se ejecutó correctamente
3. Busca en logs: "✅ Usuario admin creado/actualizado exitosamente"

### Emails No Llegan
1. Verifica que agregaste las variables de entorno SMTP en Render
2. Revisa logs del backend cuando intentas enviar email
3. Verifica que el email "to" no esté en spam
4. Confirma que tu cuenta Brevo está activa

### Frontend Muestra "null"
1. Verifica que el API devuelve datos: `curl https://tu-backend.onrender.com/api/global?populate=deep`
2. Si el API está vacío, revisa logs para ver si el seed se ejecutó
3. Busca en logs: "✅ Base de datos ya tiene datos" o mensajes de seed

---

## 📚 Documentación Adicional

- `MIGRATION-POSTGRES.md` - Guía completa de migración
- `RENDER-SETUP.md` - Setup rápido para Render
- `MIGRACION-PASO-A-PASO.md` - Guía detallada paso a paso
- `README-MIGRACION.md` - README rápido

---

**Última actualización**: 2025-11-23
**Branch**: `claude/migrate-sqlite-postgres-01S2FKHnMibzejfmRfVKSTtp`
**Estado**: ✅ Listo para redeploy en Render
