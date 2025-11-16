# 📧 Guía Rápida: Activar Envío de Correos con SendGrid

**SendGrid es MUCHO más fácil que Gmail** - Solo necesitas una API key, sin contraseñas complicadas.

## ✅ Ventajas de SendGrid

- ✅ **100 emails/día GRATIS** para siempre
- ✅ **Solo necesitas un email existente** (puedes usar `profeencasasedeciudaddelsur@gmail.com`)
- ✅ **No necesita contraseña de aplicación**
- ✅ **Solo una API key** (como una contraseña normal)
- ✅ **5 minutos de configuración**

---

## 🚀 Configuración en 5 Minutos

### Paso 1: Crear Cuenta SendGrid (2 minutos)

1. **Ve a**: https://signup.sendgrid.com/
2. **Completa el formulario**:
   - Email: Tu email personal
   - Contraseña: La que quieras
   - Nombre y empresa: FACOPEC
3. **Verifica tu email** (revisa tu bandeja de entrada)

### Paso 2: Obtener API Key (1 minuto)

1. **Inicia sesión** en SendGrid
2. **Ve a**: Settings → API Keys (menú izquierdo)
   - O directo: https://app.sendgrid.com/settings/api_keys
3. **Haz clic** en "Create API Key"
4. **Configuración**:
   - Name: `FACOPEC Production`
   - Permissions: Selecciona **"Full Access"**
5. **Haz clic** en "Create & View"
6. **COPIA LA API KEY** (empieza con `SG.`)
   - ⚠️ **IMPORTANTE**: Solo se muestra una vez, guárdala bien

### Paso 3: Verificar Remitente (2 minutos)

SendGrid requiere verificar que eres dueño del email desde el que enviarás.

1. **Ve a**: Settings → Sender Authentication → Single Sender Verification
   - O directo: https://app.sendgrid.com/settings/sender_auth/senders
2. **Haz clic** en "Create New Sender"
3. **Completa el formulario**:
   ```
   From Name: FACOPEC
   From Email: profeencasasedeciudaddelsur@gmail.com
   Reply To: profeencasasedeciudaddelsur@gmail.com
   Company Address: Puerto Tejada, Cauca, Colombia
   City: Puerto Tejada
   Country: Colombia
   ```
4. **Haz clic** en "Save"
5. **Ve al correo** `profeencasasedeciudaddelsur@gmail.com`
6. **Abre el email** de SendGrid y haz clic en "Verify Single Sender"
7. ✅ **Listo!** Ya está verificado

### Paso 4: Configurar Backend (1 minuto)

1. **Crea el archivo `.env`** (si no existe):
   ```bash
   cd backend
   cp .env.example .env
   ```

2. **Edita `.env`** y agrega tu API key:
   ```bash
   nano .env
   # o usa tu editor favorito
   ```

3. **Busca estas líneas y actualízalas**:
   ```env
   SENDGRID_API_KEY=SG.tu_api_key_aqui
   EMAIL_FROM=profeencasasedeciudaddelsur@gmail.com
   EMAIL_REPLY_TO=profeencasasedeciudaddelsur@gmail.com
   ```

4. **Guarda el archivo** (Ctrl+O, Enter, Ctrl+X en nano)

### Paso 5: Reiniciar Strapi

```bash
cd backend
npm run develop
```

### Paso 6: Dar Permisos en Strapi Admin

1. **Ve a**: http://localhost:1337/admin
2. **Settings → Roles → Public**
3. **En Permissions**, busca **Email**
4. **Marca** ✅ la casilla **send**
5. **Haz clic** en **Save**

### Paso 7: ¡Probar!

1. **Inicia Angular**:
   ```bash
   npm start
   ```

2. **Ve a cualquier formulario**:
   - http://localhost:4200/contacto
   - http://localhost:4200/donate (sección "Quieres ser aliado")
   - http://localhost:4200 (sección Empleabilidad)

3. **Llena el formulario y envíalo**

4. **¡Revisa el correo!** Debe llegar a `profeencasasedeciudaddelsur@gmail.com`

---

## 🔍 Verificar que Funciona

### En el navegador (Consola - F12):
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
Deberías recibir un email con los datos del formulario.

---

## 🐛 Troubleshooting

### "Error: API key invalid"
- Verifica que copiaste la API key completa (empieza con `SG.`)
- Asegúrate de que no hay espacios extra en el `.env`
- Recrea la API key en SendGrid si es necesario

### "Error: Sender email not verified"
- Ve a SendGrid → Sender Authentication
- Verifica que el email esté verificado (debe tener un ✅ verde)
- Revisa el correo y haz clic en el link de verificación

### "No llega el email"
- Revisa la carpeta de Spam
- Verifica en SendGrid → Activity que el email se envió
- Asegúrate de que usaste el mismo email verificado en `EMAIL_FROM`

---

## 📊 Monitorear Emails

Ve a SendGrid → Activity para ver todos los emails enviados:
https://app.sendgrid.com/email_activity

---

## ⚡ Checklist Rápido

- [ ] Cuenta SendGrid creada y verificada
- [ ] API Key creada y copiada
- [ ] Email del remitente verificado en SendGrid
- [ ] Archivo `.env` creado y configurado
- [ ] Backend reiniciado
- [ ] Permisos públicos dados en Strapi Admin
- [ ] Prueba de envío exitosa

---

## 💡 Consejos

1. **Límite gratuito**: 100 emails/día es suficiente para empezar
2. **Producción**: Si necesitas más, el plan "Essentials" ($20/mes) da 50,000 emails/mes
3. **Dominio propio**: Puedes configurar tu propio dominio (ej: `contacto@facopec.org`) en SendGrid

---

## 📞 ¿Necesitas Ayuda?

- **Documentación SendGrid**: https://docs.sendgrid.com/
- **Soporte**: https://support.sendgrid.com/

---

**¡Listo! Con SendGrid NO necesitas contraseñas de aplicación ni verificación en 2 pasos.**
