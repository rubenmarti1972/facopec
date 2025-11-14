# 📝 Guía para Poblar el CMS con Datos del Frontend

## ✅ Scripts Creados

Se han creado los siguientes scripts para migrar todos los datos del frontend al CMS Strapi:

### 1. **populate-global-settings.js**
Migra configuración global:
- Navegación (6 items)
- Redes sociales (4 plataformas)
- Información de contacto
- Configuración de footer

### 2. **populate-organization-info.js**
Migra información de la organización:
- Nombre y descripción
- Misión y Visión completas
- Valores corporativos (3)
- Información de contacto

### 3. **populate-home-complete.js**
Migra TODO el contenido de la Home Page:
- Hero section con stats y actions
- 3 Impact highlights
- Identity section con 3 valores
- Misión y Visión
- 4 Activity cards
- 2 Program cards
- 2 Supporters
- 3 Catalog items
- 3 Gallery items
- 4 Attended persons
- 3 Event calendar items

### 4. **populate-donations-page.js**
Migra contenido de la página de donaciones:
- Hero section
- 4 Donation amounts presets
- 3 Impact metrics
- 4 Highlight cards
- 3 Impact stories
- 3 Support actions
- 3 Payment gateway options

### 5. **populate-all-cms.js** (Script Maestro)
Ejecuta TODOS los scripts anteriores en orden automáticamente.

---

## 🚀 Cómo Ejecutar

### Opción 1: Ejecutar TODO de una vez

```bash
cd /home/user/facopec/backend
node populate-all-cms.js
```

### Opción 2: Ejecutar scripts individuales

```bash
cd /home/user/facopec/backend

# 1. Global Settings
node populate-global-settings.js

# 2. Organization Info
node populate-organization-info.js

# 3. Home Page
node populate-home-complete.js

# 4. Donations Page
node populate-donations-page.js
```

---

## ⚠️ IMPORTANTE: Configurar Permisos de Autenticación

Actualmente hay un problema con los permisos de autenticación en Strapi. Necesitas configurar los permisos públicos para el endpoint de autenticación:

### Solución: Configurar permisos en Strapi Admin

1. **Abre Strapi Admin:**
   ```
   http://localhost:1337/admin
   ```

2. **Login con:**
   - Email: `admin@facopec.org`
   - Password: `Admin123456`

3. **Configurar permisos públicos:**
   - Ve a **Settings** → **Users & Permissions Plugin** → **Roles**
   - Selecciona el rol **Public**
   - En la sección **Users-permissions**, habilita:
     - ✅ `auth.callback`
     - ✅ `auth.connect`
     - ✅ `auth.emailConfirmation`
     - ✅ `auth.forgotPassword`
     - ✅ `auth.register`
     - ✅ `auth.resetPassword`
     - ✅ `auth.sendEmailConfirmation`
   - Haz clic en **Save**

4. **Ejecuta los scripts de población:**
   ```bash
   cd /home/user/facopec/backend
   node populate-all-cms.js
   ```

---

## 🔍 Verificación

Después de ejecutar los scripts, verifica que todo se haya poblado correctamente:

### 1. Verificar en la API

```bash
# Global Settings
curl http://localhost:1337/api/global

# Organization Info
curl http://localhost:1337/api/organization-info

# Home Page
curl http://localhost:1337/api/home-page

# Donations Page
curl http://localhost:1337/api/donations-page
```

### 2. Verificar en Strapi Admin

Ve a **Content Manager** y verifica que cada content type tenga datos:
- Global
- Organization Info
- Home Page
- Donations Page

### 3. Verificar en el Frontend

```bash
# Inicia el frontend (en otra terminal)
cd /home/user/facopec
npm start

# Abre en el navegador:
http://localhost:4200
```

Recarga con `Ctrl+Shift+R` para ver los datos del CMS.

---

## 📊 Resumen de Datos Migrados

**Total de elementos migrados: ~60 items**

| Content Type | Items |
|--------------|-------|
| Global Settings | 10 items |
| Organization Info | 5 items |
| Home Page | 35+ items |
| Donations Page | 21 items |

---

## 🐛 Solución de Problemas

### Error: "Login failed: 500 Internal Server Error"

**Causa:** Los permisos públicos no están configurados.

**Solución:** Sigue los pasos de la sección "Configurar Permisos de Autenticación" arriba.

### Error: "Strapi no está corriendo"

**Solución:**
```bash
cd /home/user/facopec/backend
npm run develop
```

### Error: "Content type no existe"

**Causa:** Los content types no están definidos en Strapi.

**Solución:** Verifica que los content types existan en:
```bash
ls /home/user/facopec/backend/src/api/
```

Deberías ver:
- donations-page/
- global/
- home-page/
- organization-info/
- project/

---

## 📝 Notas Adicionales

- **Imágenes:** Los scripts NO migran imágenes. Necesitarás subir las imágenes manualmente a través del Strapi Admin en la sección Media Library.

- **URLs de imágenes:** Los datos incluyen URLs de Unsplash como placeholders para las galerías. Puedes reemplazarlas con tus propias imágenes.

- **Publicación:** Los scripts automáticamente publican el contenido. Si algo falla, puedes publicar manualmente desde el Content Manager.

- **Actualización:** Si necesitas actualizar los datos, simplemente ejecuta los scripts de nuevo. Sobrescribirán los datos existentes.

---

## ✨ Próximos Pasos

1. ✅ Configurar permisos de autenticación en Strapi Admin
2. ✅ Ejecutar `node populate-all-cms.js`
3. ✅ Verificar los datos en Strapi Admin
4. ✅ Subir imágenes/logos a Media Library
5. ✅ Verificar el frontend
6. ✅ Hacer commit y push de los cambios

---

## 🎉 ¡Listo!

Una vez completados estos pasos, tu CMS estará completamente poblado con todos los datos del frontend y tu aplicación estará lista para producción.
