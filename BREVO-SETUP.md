# 📧 Guía Súper Fácil: Activar Emails con Brevo

**Brevo es LA opción más fácil** - Solo 3 pasos y listo.

## ✅ Por qué Brevo es la Mejor Opción

- ✅ **300 emails/día GRATIS** para siempre (3x más que SendGrid)
- ✅ **NO requiere verificación de dominio**
- ✅ **Solo necesitas tu email** (puedes usar `profeencasasedeciudaddelsur@gmail.com`)
- ✅ **3 minutos de configuración total**
- ✅ **Funciona inmediatamente**

---

## 🚀 Configuración en 3 Minutos

### Paso 1: Crear Cuenta (1 minuto)

1. **Ve a**: https://app.brevo.com/account/register

2. **Completa el formulario**:
   - First Name: Tu nombre
   - Last Name: Tu apellido
   - Email: Tu email personal (cualquiera)
   - Password: La que quieras
   - Company: FACOPEC
   - Website: https://facopec.org (o déjalo en blanco)

3. **Marca** "I agree to the Terms of Service"

4. **Haz clic** en "Sign up"

5. **Verifica tu email** (revisa tu bandeja de entrada)

---

### Paso 2: Obtener Credenciales SMTP (1 minuto)

1. **Inicia sesión** en Brevo: https://app.brevo.com/

2. **Ve a**: Settings (esquina superior derecha) → **SMTP & API**
   - O directo: https://app.brevo.com/settings/keys/smtp

3. **Verás tus credenciales SMTP**:
   ```
   Server: smtp-relay.brevo.com
   Port: 587
   Login: tu-email@gmail.com (el que usaste para registrarte)
   Master Password: [Click "Show" para verla]
   ```

4. **COPIA**:
   - El **Login** (tu email)
   - La **Master Password** (haz clic en "Show")

**Alternativa - Crear SMTP Key nueva** (recomendado):
- Scroll down hasta "SMTP Keys"
- Haz clic en "Generate a new SMTP key"
- Nombre: "FACOPEC Production"
- **Copia la key generada**

---

### Paso 3: Configurar Backend (1 minuto)

1. **Ve a la carpeta backend**:
   ```bash
   cd backend
   ```

2. **Crea el archivo `.env`** si no existe:
   ```bash
   cp .env.example .env
   ```

3. **Edita `.env`**:
   ```bash
   nano .env
   # o usa tu editor favorito (VS Code, vim, etc.)
   ```

4. **Busca estas líneas y actualízalas**:

   **Si usaste Master Password:**
   ```env
   SMTP_HOST=smtp-relay.brevo.com
   SMTP_PORT=587
   BREVO_SMTP_USER=tu-email@gmail.com
   BREVO_SMTP_KEY=tu-master-password-aqui
   EMAIL_FROM=profeencasasedeciudaddelsur@gmail.com
   EMAIL_REPLY_TO=profeencasasedeciudaddelsur@gmail.com
   ```

   **Si creaste SMTP Key nueva:**
   ```env
   SMTP_HOST=smtp-relay.brevo.com
   SMTP_PORT=587
   BREVO_SMTP_USER=tu-email@gmail.com
   BREVO_SMTP_KEY=tu-smtp-key-generada
   EMAIL_FROM=profeencasasedeciudaddelsur@gmail.com
   EMAIL_REPLY_TO=profeencasasedeciudaddelsur@gmail.com
   ```

5. **Guarda el archivo** (Ctrl+O, Enter, Ctrl+X en nano)

---

### Paso 4: Reiniciar Strapi

```bash
cd backend
npm run develop
```

Espera a que diga: `Server started on port 1337`

---

### Paso 5: Dar Permisos en Strapi Admin

1. **Ve a**: http://localhost:1337/admin

2. **Navega a**: Settings → Roles → Public (en el menú izquierdo)

3. **Busca** la sección **Email**

4. **Marca** ✅ la casilla **send**

5. **Haz clic** en **Save** (arriba a la derecha)

---

### Paso 6: ¡Probar!

1. **Inicia Angular**:
   ```bash
   npm start
   ```

2. **Ve a cualquier formulario**:
   - http://localhost:4200/contacto
   - http://localhost:4200/donate (sección "Quieres ser aliado")
   - http://localhost:4200 (sección Empleabilidad)

3. **Llena el formulario y envíalo**

4. **¡Revisa el correo en `profeencasasedeciudaddelsur@gmail.com`!**

---

## 🔍 Verificar que Funciona

### En el navegador (F12 - Consola):
```
📧 Enviando email a: profeencasasedeciudaddelsur@gmail.com
📝 Asunto: Nueva inscripción al programa de empleabilidad
✅ Email enviado exitosamente
```

### En el terminal de Strapi:
```
info: Email sent successfully to profeencasasedeciudaddelsur@gmail.com
```

### En el correo:
Deberías recibir un email bonito con HTML y los datos del formulario.

---

## 🐛 Troubleshooting

### "Error: Invalid credentials"
- ❌ Verifica que copiaste bien el **Login** (tu email de registro)
- ❌ Verifica que copiaste bien la **Master Password** o **SMTP Key**
- ❌ Asegúrate de que no hay espacios extra en el `.env`
- ✅ Si usas SMTP Key, crea una nueva y vuelve a copiarla

### "Error: Connection timeout"
- ❌ Verifica que el puerto sea `587`
- ❌ Verifica que el host sea `smtp-relay.brevo.com`
- ✅ Revisa tu firewall/antivirus

### "No llega el email"
- ✅ Revisa la carpeta de Spam
- ✅ Ve a Brevo → Statistics → Email para ver si se envió
- ✅ Verifica que `EMAIL_FROM` sea el email que registraste en Brevo

### "Forbidden sender"
- ❌ Brevo requiere que uses un email verificado en `EMAIL_FROM`
- ✅ Agrega `profeencasasedeciudaddelsur@gmail.com` como sender en Brevo:
  - Ve a: Settings → Senders & IP
  - Add a Sender
  - Verifica el email

---

## 📊 Monitorear Emails

Ve a **Statistics → Email** en Brevo para ver:
- ✅ Emails enviados
- ✅ Emails entregados
- ✅ Emails abiertos
- ❌ Errores

Dashboard: https://app.brevo.com/statistics/email

---

## ⚡ Checklist Rápido

- [ ] Cuenta Brevo creada
- [ ] Email de registro verificado
- [ ] SMTP credentials copiadas (Login + Master Password o SMTP Key)
- [ ] Archivo `.env` creado y configurado
- [ ] Backend reiniciado
- [ ] Permisos públicos dados en Strapi Admin
- [ ] Prueba de envío exitosa ✅

---

## 💡 Tips Pro

1. **SMTP Key vs Master Password**:
   - Master Password: Más fácil, pero es tu contraseña de cuenta
   - SMTP Key: Más seguro, puedes revocarla sin cambiar tu password
   - **Recomendado**: Usa SMTP Key

2. **Límites gratuitos**:
   - 300 emails/día
   - Si necesitas más, el plan Lite ($25/mes) da 20,000 emails/mes

3. **Verificar Senders**:
   - Brevo te permite verificar múltiples emails como remitentes
   - Ve a Settings → Senders & IP → Add a Sender
   - Usa esto si quieres enviar desde diferentes emails

4. **Templates**:
   - Brevo tiene un editor de templates HTML
   - Puedes crear plantillas visuales para tus emails
   - Usa esto si quieres emails más bonitos

---

## 🎯 Diferencias con SendGrid

| Feature | Brevo | SendGrid |
|---------|-------|----------|
| Emails gratis/día | **300** ✅ | 100 |
| Configuración | **Más fácil** ✅ | Requiere verificación de sender |
| SMTP Setup | **Inmediato** ✅ | Requiere pasos extra |
| Dashboard | Simple y claro | Más complejo |
| Verificación | Solo email de cuenta | Email + verificación de sender |

---

## 📞 Ayuda

- **Documentación Brevo**: https://developers.brevo.com/docs
- **Soporte**: https://help.brevo.com/

---

**¡Listo! Brevo es la opción más fácil. Solo 3 minutos y emails funcionando.**

Si tienes problemas, revisa el Troubleshooting arriba. 99% de los problemas son por:
1. Credenciales mal copiadas (verifica espacios extra)
2. Email FROM no verificado (usa el mismo email de registro)
