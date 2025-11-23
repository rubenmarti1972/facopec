# 🚀 Migración Paso a Paso: SQLite → PostgreSQL

Esta guía te llevará paso a paso para migrar tu base de datos de SQLite a PostgreSQL y verificar que todo funcione correctamente.

---

## ✅ Pre-requisitos

Antes de empezar, asegúrate de tener:

- [x] PostgreSQL instalado (`brew install postgresql@15`)
- [x] PostgreSQL ejecutándose (`brew services start postgresql@15`)
- [x] Usuario postgres creado
- [x] Base de datos facopec_strapi creada
- [x] Archivo `.env` configurado con credenciales de PostgreSQL

---

## 📋 Paso 1: Verificar PostgreSQL

```bash
cd backend

# Verificar que PostgreSQL esté ejecutándose
brew services list | grep postgresql

# Debería mostrar: postgresql@15 started

# Verificar conexión y crear base de datos
pnpm run setup:postgres
```

**Resultado esperado:**
```
✅ Conexión exitosa al servidor PostgreSQL
✅ La base de datos 'facopec_strapi' existe
✅ Conexión exitosa a la base de datos 'facopec_strapi'
```

---

## 📋 Paso 2: Iniciar Strapi con PostgreSQL (Primera Vez)

Esto creará todas las tablas automáticamente:

```bash
pnpm run develop
```

**Qué va a pasar:**
1. Strapi detectará PostgreSQL
2. Creará todas las tablas necesarias
3. Iniciará el servidor en http://localhost:1337

**Espera a ver este mensaje:**
```
Server listening on http://0.0.0.0:1337
```

**Luego:**
1. Abre http://localhost:1337/admin
2. Crea tu usuario administrador:
   - Email: `admin@facopec.org`
   - Password: (elige uno seguro)
3. Presiona **Ctrl+C** para detener Strapi

---

## 📋 Paso 3: Migrar Datos desde SQLite

Ahora vamos a migrar los datos existentes:

```bash
# Opción A: Usar el script automático
node scripts/migrate-and-verify.mjs

# Opción B: Usar el script de migración directo
pnpm run migrate:postgres
```

**Resultado esperado:**
```
✅ Migración completada: XXX registros insertados
```

---

## 📋 Paso 4: Cargar Datos Iniciales (Si no tienes SQLite)

Si no tenías datos en SQLite, carga los datos de prueba:

```bash
pnpm run seed
```

**Resultado esperado:**
```
✅ Datos cargados exitosamente
```

---

## 📋 Paso 5: Verificar que Todo Funciona

```bash
# Iniciar Strapi de nuevo
pnpm run develop
```

1. Abre http://localhost:1337/admin
2. Inicia sesión
3. Ve a **Content Manager**
4. Verifica que veas:
   - Home Pages
   - Globals
   - Projects
   - Donations Pages
   - Etc.

---

## 📋 Paso 6: Probar Persistencia de Datos

Vamos a verificar que los datos persisten después de reiniciar:

### Test 1: Crear Contenido

1. En Strapi admin, ve a **Content Manager → Projects**
2. Crea un nuevo proyecto de prueba:
   - Title: "Test de Persistencia"
   - Description: "Verificando que PostgreSQL persiste datos"
   - Guarda como **Published**

### Test 2: Reiniciar Strapi

```bash
# Detener Strapi (Ctrl+C en la terminal)
# Volver a iniciar
pnpm run develop
```

### Test 3: Verificar el Dato

1. Abre http://localhost:1337/admin de nuevo
2. Ve a **Content Manager → Projects**
3. **¿Ves el proyecto "Test de Persistencia"?**
   - ✅ **SÍ** → ¡Persistencia funcionando!
   - ❌ **NO** → Algo está mal, revisa la configuración

---

## 📋 Paso 7: Configurar Cloudinary (Para Imágenes)

Edita `backend/.env`:

```bash
UPLOAD_PROVIDER=cloudinary
CLOUDINARY_NAME=tu-cloud-name       # De cloudinary.com/console
CLOUDINARY_KEY=tu-api-key
CLOUDINARY_SECRET=tu-api-secret
```

**Reinicia Strapi:**
```bash
# Ctrl+C
pnpm run develop
```

**Probar subida de imágenes:**
1. Ve a **Media Library**
2. Sube una imagen
3. **Verifica en Cloudinary Dashboard** que aparece la imagen

---

## 📋 Paso 8: Test Final de Persistencia

Vamos a hacer una prueba completa:

### 1. Crear contenido con imagen

1. **Content Manager → Projects → Create new entry**
2. Llena los campos:
   - Title: "Proyecto Final de Prueba"
   - Description: "Test completo"
   - Sube una imagen
3. **Save** y **Publish**

### 2. Verificar en PostgreSQL

```bash
psql -U postgres -d facopec_strapi
```

Dentro de psql:
```sql
-- Ver proyectos
SELECT id, title FROM projects;

-- Ver archivos subidos
SELECT id, name, url FROM files;

-- Salir
\q
```

### 3. Reiniciar completamente

```bash
# Detener Strapi (Ctrl+C)

# Reiniciar PostgreSQL (simula un reinicio del servidor)
brew services restart postgresql@15

# Esperar 5 segundos
sleep 5

# Iniciar Strapi de nuevo
pnpm run develop
```

### 4. Verificar que todo persiste

1. Abre http://localhost:1337/admin
2. Ve a **Content Manager → Projects**
3. **¿Está el "Proyecto Final de Prueba"?** ✅
4. **¿Se ve la imagen correctamente?** ✅
5. Ve a **Media Library**
6. **¿Están todas las imágenes?** ✅

---

## ✅ Checklist Final

Marca cada item después de verificarlo:

### Base de Datos
- [ ] PostgreSQL está ejecutándose
- [ ] Base de datos `facopec_strapi` existe
- [ ] Strapi se conecta a PostgreSQL sin errores
- [ ] Las tablas están creadas (verifica con `psql`)

### Datos
- [ ] Los datos de SQLite se migraron (o se cargaron con seed)
- [ ] Puedo crear nuevo contenido
- [ ] El contenido persiste después de reiniciar Strapi
- [ ] El contenido persiste después de reiniciar PostgreSQL

### Imágenes (Cloudinary)
- [ ] Variables de Cloudinary configuradas en `.env`
- [ ] Puedo subir imágenes
- [ ] Las imágenes aparecen en Cloudinary Dashboard
- [ ] Las imágenes se muestran correctamente
- [ ] Las imágenes persisten después de reiniciar

### API
- [ ] El API responde: http://localhost:1337/api/projects
- [ ] Los datos incluyen las imágenes con URLs de Cloudinary

---

## 🚨 Solución de Problemas

### Error: "Cannot connect to database"

```bash
# Verificar que PostgreSQL esté corriendo
brew services list | grep postgresql

# Si no está corriendo, iniciarlo
brew services start postgresql@15

# Verificar credenciales en .env
cat .env | grep DATABASE
```

### Error: "Tablas no existen"

```bash
# Eliminar la base de datos y empezar de nuevo
psql -U postgres -c "DROP DATABASE facopec_strapi;"
psql -U postgres -c "CREATE DATABASE facopec_strapi;"

# Volver a ejecutar Strapi
pnpm run develop
```

### Los datos no persisten

```bash
# Verificar que estás usando PostgreSQL, no SQLite
cat .env | grep DATABASE_CLIENT

# Debe decir: DATABASE_CLIENT=postgres
# NO debe decir: DATABASE_CLIENT=sqlite
```

### Imágenes no se suben a Cloudinary

```bash
# Verificar configuración
cat .env | grep CLOUDINARY

# Verificar que UPLOAD_PROVIDER esté en cloudinary
cat .env | grep UPLOAD_PROVIDER

# Debe decir: UPLOAD_PROVIDER=cloudinary
```

### Verificar en PostgreSQL directamente

```bash
# Conectar a la base de datos
psql -U postgres -d facopec_strapi

# Ver todas las tablas
\dt

# Ver contenido de una tabla
SELECT * FROM projects;

# Salir
\q
```

---

## 📊 Comandos de Verificación Útiles

```bash
# Ver logs de PostgreSQL
brew services list

# Conectar a PostgreSQL
psql -U postgres -d facopec_strapi

# Dentro de psql:
\dt                          # Listar tablas
\d+ projects                 # Describir tabla projects
SELECT COUNT(*) FROM projects;  # Contar registros
\q                           # Salir

# Ver datos en tiempo real (en otra terminal mientras Strapi corre)
watch -n 2 'psql -U postgres -d facopec_strapi -c "SELECT COUNT(*) FROM projects"'
```

---

## 🎯 Resultado Esperado Final

Al completar todos los pasos, deberías tener:

1. ✅ Strapi ejecutándose con PostgreSQL
2. ✅ Todos los datos migrados y accesibles
3. ✅ Las imágenes subiéndose a Cloudinary
4. ✅ Los datos persisten después de reiniciar
5. ✅ El API funcionando correctamente
6. ✅ Todo listo para desplegar en Render

---

## 🚀 Próximo Paso: Desplegar en Render

Una vez que todo funcione localmente, lee **`RENDER-SETUP.md`** para configurar en producción.

---

**¿Tienes problemas?** Revisa la sección de Solución de Problemas o consulta la documentación completa en `MIGRATION-POSTGRES.md`.
