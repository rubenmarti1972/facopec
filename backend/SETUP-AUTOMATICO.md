# ⚡ Setup Automático - Un Solo Comando

Este script automatiza **TODO** el proceso de configuración de PostgreSQL y carga de datos.

---

## 🚀 Opción 1: Script Automático (RECOMENDADO)

### Ejecuta un solo comando:

```bash
cd backend
bash scripts/setup-completo.sh
```

**Eso es todo.** El script hará automáticamente:

1. ✅ Verificar que PostgreSQL esté instalado y corriendo
2. ✅ Crear el usuario `postgres`
3. ✅ Crear la base de datos `facopec_strapi`
4. ✅ Verificar que `node_modules` esté instalado
5. ✅ Verificar configuración en `.env`
6. ✅ Compilar TypeScript
7. ✅ Iniciar Strapi temporalmente para crear el esquema
8. ✅ Cargar **TODOS** los datos hardcodeados con `pnpm run seed`
9. ✅ Verificar que los datos se cargaron correctamente

---

## 🛠️ Opción 2: Paso a Paso Manual

Si prefieres hacerlo manualmente, sigue estos pasos:

### 1. Iniciar PostgreSQL

```bash
brew services start postgresql@15
```

### 2. Crear usuario y base de datos

```bash
# Crear usuario
psql postgres -c "CREATE USER postgres WITH SUPERUSER PASSWORD 'postgres';"

# Crear base de datos
psql postgres -c "CREATE DATABASE facopec_strapi OWNER postgres;"
```

### 3. Verificar conexión

```bash
cd backend
pnpm run setup:postgres
```

### 4. Iniciar Strapi para crear esquema

```bash
pnpm run develop
```

Espera a ver: `Server listening on http://0.0.0.0:1337`

Luego presiona **Ctrl+C**

### 5. Cargar datos

```bash
pnpm run seed
```

Este comando cargará:
- ✅ Usuario administrador (facopec@facopec.org)
- ✅ Configuración global del sitio
- ✅ Página de inicio (Home)
- ✅ Navegación completa
- ✅ Proyectos
- ✅ Página de donaciones
- ✅ Todos los enlaces a blogs externos
- ✅ Imágenes (si están en `../../src/assets/`)

### 6. Verificar datos

```bash
# Conectar a PostgreSQL
psql -U postgres -d facopec_strapi

# Ver tablas
\dt

# Ver registros en home_pages
SELECT COUNT(*) FROM home_pages;

# Ver registros en globals
SELECT COUNT(*) FROM globals;

# Ver registros en projects
SELECT COUNT(*) FROM projects;

# Salir
\q
```

---

## 🎯 Datos que se Cargan Automáticamente

El script `pnpm run seed` carga:

### 👤 Usuario Administrador
- **Email:** `facopec@facopec.org`
- **Password:** `F4c0pec@2025`
- **Rol:** Super Administrador

### 🌐 Global (Configuración del sitio)
- Nombre del sitio
- URL de la aplicación
- Logo de FACOPEC
- Navegación completa con todos los programas:
  - 📚 Educación y Refuerzo Académico
  - 📖 Cultura y Lectura
  - 👨‍👩‍👧‍👦 Desarrollo Familiar y Comunitario
  - 💼 Empleabilidad y Desarrollo
  - 💻 Innovación y Tecnología Educativa
  - 🌍 Etnoeducación y Cultura
  - 🕊️ Liderazgo, Gobernanza y Paz
  - 🎉 Impacto Directo y Bienestar

### 🏠 Home Page
- Sección Hero con imagen
- Sección de Programas Destacados
- Sección de Proyectos
- Sección de Donaciones
- Sección de Voluntariado
- Footer con redes sociales

### 📋 Proyectos
- Proyectos de ejemplo cargados
- Con descripciones completas
- Imágenes asociadas

### 💝 Página de Donaciones
- Configuración de donaciones
- Métodos de pago
- Información bancaria

### 📸 Imágenes
- Logo de FACOPEC
- Imagen hero
- Logos de aliados (Bienestar Familiar, Min. Interior)

---

## ✅ Verificación Post-Setup

Después de ejecutar el script, verifica:

### 1. Iniciar Strapi

```bash
pnpm run develop
```

### 2. Abrir el Admin Panel

Abre en tu navegador: http://localhost:1337/admin

### 3. Iniciar Sesión

- Email: `facopec@facopec.org`
- Password: `F4c0pec@2025`

### 4. Verificar Contenido

Navega a **Content Manager** y verifica que existan:

- ✅ **Global** (1 entrada) → Configuración del sitio
- ✅ **Home Page** (1 entrada) → Página de inicio
- ✅ **Donations Page** (1 entrada) → Página de donaciones
- ✅ **Projects** (varias entradas) → Proyectos
- ✅ **Media Library** → Imágenes cargadas

### 5. Probar Persistencia

```bash
# Detener Strapi (Ctrl+C)

# Volver a iniciar
pnpm run develop

# Abrir http://localhost:1337/admin de nuevo
# ¿Los datos siguen ahí? ✅ = Persistencia funcionando
```

---

## 🔧 Configurar Cloudinary (Obligatorio para Imágenes)

Después de que todo funcione, configura Cloudinary para que las imágenes persistan:

### 1. Obtener credenciales

1. Ve a https://cloudinary.com/
2. Crea una cuenta gratis (si no tienes)
3. En el Dashboard, copia:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

### 2. Editar .env

```bash
# backend/.env

UPLOAD_PROVIDER=cloudinary
CLOUDINARY_NAME=tu-cloud-name        # 👈 Pegar aquí
CLOUDINARY_KEY=tu-api-key            # 👈 Pegar aquí
CLOUDINARY_SECRET=tu-api-secret      # 👈 Pegar aquí
```

### 3. Reiniciar Strapi

```bash
# Ctrl+C para detener
pnpm run develop
```

### 4. Probar subida de imágenes

1. Ve a **Media Library**
2. Sube una imagen
3. Ve a https://cloudinary.com/console → **Media Library**
4. ¿Aparece la imagen? ✅ = Cloudinary funcionando

---

## 🚨 Solución de Problemas

### Error: "PostgreSQL no está corriendo"

```bash
brew services start postgresql@15
```

### Error: "Role postgres does not exist"

```bash
psql postgres -c "CREATE USER postgres WITH SUPERUSER PASSWORD 'postgres';"
```

### Error: "Database facopec_strapi does not exist"

```bash
psql -U postgres -c "CREATE DATABASE facopec_strapi;"
```

### Error: "pnpm run seed failed"

1. Verifica que Strapi se haya iniciado al menos una vez:
   ```bash
   pnpm run develop
   # Espera a que cargue, luego Ctrl+C
   ```

2. Intenta el seed de nuevo:
   ```bash
   pnpm run seed
   ```

### Los datos no aparecen en el admin

1. Verifica en PostgreSQL directamente:
   ```bash
   psql -U postgres -d facopec_strapi -c "SELECT COUNT(*) FROM home_pages;"
   ```

2. Si hay datos en la BD pero no aparecen:
   - Verifica que estén publicados (tienen `publishedAt`)
   - Revisa los permisos públicos

### Empezar de cero

```bash
# Eliminar base de datos
psql -U postgres -c "DROP DATABASE facopec_strapi;"

# Crear de nuevo
psql -U postgres -c "CREATE DATABASE facopec_strapi;"

# Ejecutar setup completo
bash scripts/setup-completo.sh
```

---

## 📊 Comandos Útiles de Verificación

```bash
# Ver todas las tablas y sus registros
psql -U postgres -d facopec_strapi -c "
SELECT
    tablename,
    (SELECT COUNT(*) FROM pg_catalog.pg_class c WHERE c.relname = tablename) as rows
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
"

# Ver contenido de home_pages
psql -U postgres -d facopec_strapi -c "SELECT id, published_at FROM home_pages;"

# Ver contenido de projects
psql -U postgres -d facopec_strapi -c "SELECT id, title FROM projects;"

# Ver usuario admin
psql -U postgres -d facopec_strapi -c "SELECT id, email, username FROM admin_users;"
```

---

## 🎉 Resultado Final

Al completar el setup, tendrás:

1. ✅ PostgreSQL configurado y corriendo
2. ✅ Base de datos `facopec_strapi` creada
3. ✅ Esquema completo de Strapi creado
4. ✅ Usuario administrador creado
5. ✅ Todos los datos de FACOPEC cargados
6. ✅ Imágenes de ejemplo cargadas
7. ✅ Listo para configurar Cloudinary
8. ✅ Listo para desarrollo local
9. ✅ Listo para desplegar en Render

---

## 🚀 Siguiente Paso: Desplegar en Render

Una vez que todo funcione localmente con PostgreSQL:

1. Lee **`RENDER-SETUP.md`** para configurar en producción
2. Configura las variables de entorno en Render
3. Deploya tu aplicación
4. ¡Los datos persistirán! 🎉

---

**¿Problemas?** Consulta la guía completa en `MIGRATION-POSTGRES.md` o `MIGRACION-PASO-A-PASO.md`
