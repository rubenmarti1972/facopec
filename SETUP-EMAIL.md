# 📧 Configuración del Sistema de Envío de Correos

Este documento explica cómo activar el envío de correos electrónicos desde los formularios de la aplicación.

## 📋 Requisitos Previos

- Cuenta de Gmail para enviar correos
- Acceso al backend de Strapi
- Node.js y npm instalados

---

## 🚀 Pasos de Configuración

### 1️⃣ Crear Cuenta de Gmail para Enviar

1. Ve a https://accounts.google.com/signup
2. Crea una cuenta nueva (recomendado):
   - **Ejemplo**: `notificaciones.facopec@gmail.com`
   - **O**: `noreply.facopec@gmail.com`
   - Usa un nombre relacionado con la fundación

3. Una vez creada la cuenta, **habilita la verificación en 2 pasos**:
   - Ve a: https://myaccount.google.com/security
   - Habilita "Verificación en dos pasos"

4. **Genera una Contraseña de Aplicación**:
   - Ve a: https://myaccount.google.com/apppasswords
   - Nombre: "Strapi FACOPEC"
   - Copia la contraseña generada (16 caracteres como: `xxxx xxxx xxxx xxxx`)
   - ⚠️ **Guarda esta contraseña** - la necesitarás en el paso 3

---

### 2️⃣ Verificar que el paquete de email está instalado

El paquete `@strapi/provider-email-nodemailer` ya debería estar instalado.

Si necesitas reinstalarlo:

```bash
cd backend
npm install @strapi/provider-email-nodemailer
```

---

### 3️⃣ Configurar Variables de Entorno

1. **Copia el archivo de ejemplo** para crear tu archivo `.env`:

```bash
cd backend
cp .env.example .env
```

2. **Edita el archivo `.env`** y actualiza estas líneas:

```env
# Email provider (SMTP) - Gmail configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=tu-correo-de-envio@gmail.com
SMTP_PASSWORD=xxxx xxxx xxxx xxxx
SMTP_DEFAULT_FROM=tu-correo-de-envio@gmail.com
SMTP_DEFAULT_REPLY_TO=profeencasasedeciudaddelsur@gmail.com
```

**Reemplaza:**
- `tu-correo-de-envio@gmail.com` → El Gmail que creaste en el Paso 1
- `xxxx xxxx xxxx xxxx` → La contraseña de aplicación del Paso 1

**Ejemplo real:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=notificaciones.facopec@gmail.com
SMTP_PASSWORD=abcd efgh ijkl mnop
SMTP_DEFAULT_FROM=notificaciones.facopec@gmail.com
SMTP_DEFAULT_REPLY_TO=profeencasasedeciudaddelsur@gmail.com
```

---

### 4️⃣ Reiniciar Strapi

Para que los cambios surtan efecto:

```bash
cd backend
npm run develop
```

O si está en producción:

```bash
npm run build
npm start
```

---

### 5️⃣ Dar Permisos Públicos al Endpoint de Email

1. Abre el panel de administración de Strapi: http://localhost:1337/admin
2. Ve a **Settings > Roles > Public**
3. En la sección **Permissions**, busca **Email**
4. Marca la casilla ✅ **send**
5. Haz clic en **Save**

---

### 6️⃣ Probar el Envío de Correos

1. Inicia el frontend de Angular:

```bash
npm start
```

2. Ve a cualquier formulario:
   - http://localhost:4200/contacto
   - http://localhost:4200/donate (sección "Quieres ser aliado")
   - http://localhost:4200 (sección de Empleabilidad)

3. Llena el formulario y envíalo

4. **Verifica** que el correo llegó a `profeencasasedeciudaddelsur@gmail.com`

---

## 🔍 Verificación y Debugging

### Ver logs del backend

Cuando se envía un formulario, deberías ver en la consola del backend:

```
[2024-11-16 10:30:00.000] info: Email sent successfully to profeencasasedeciudaddelsur@gmail.com with subject: Nueva inscripción al programa de empleabilidad - Juan Pérez
```

### Ver logs del frontend

En la consola del navegador (F12):

```
📧 Enviando email a: profeencasasedeciudaddelsur@gmail.com
📝 Asunto: Nueva inscripción al programa de empleabilidad - Juan Pérez
✅ Email enviado exitosamente: {success: true, ...}
```

### Si no funciona

1. **Verifica la contraseña de aplicación**:
   - Asegúrate de copiarla correctamente (sin espacios extra)
   - Debe ser de 16 caracteres

2. **Verifica que la verificación en 2 pasos está activa**:
   - Gmail requiere esto para contraseñas de aplicación

3. **Revisa los logs de Strapi**:
   - Busca errores en la consola del backend

4. **Verifica los permisos**:
   - El endpoint `/api/email/send` debe tener permisos públicos

---

## 📧 Cómo Funciona el Sistema

1. **Usuario llena formulario** → Frontend (Angular)
2. **EmailService.ts** → Envía datos a `/api/email/send`
3. **Strapi API** → Recibe datos y usa plugin de email
4. **Nodemailer** → Se conecta a Gmail SMTP
5. **Gmail** → Envía el correo a `profeencasasedeciudaddelsur@gmail.com`

```
[Formulario] → [Angular] → [Strapi] → [Gmail SMTP] → [📬 Correo recibido]
```

---

## ✅ Checklist de Configuración

- [ ] Cuenta de Gmail creada
- [ ] Verificación en 2 pasos habilitada
- [ ] Contraseña de aplicación generada
- [ ] Archivo `.env` creado y configurado
- [ ] Backend reiniciado
- [ ] Permisos públicos dados al endpoint
- [ ] Prueba de envío exitosa

---

## 🆘 Soporte

Si tienes problemas:

1. Revisa este documento paso a paso
2. Verifica los logs del backend y frontend
3. Asegúrate de que todas las variables en `.env` estén correctas

---

## 📝 Notas Adicionales

- **Seguridad**: Nunca compartas tu archivo `.env` o subes a Git
- **Producción**: Usa variables de entorno del servidor, no el archivo `.env`
- **Gmail Limits**: Cuenta gratuita tiene límite de ~500 emails/día
- **Alternativas**: Si necesitas más capacidad, considera SendGrid o Mailgun

