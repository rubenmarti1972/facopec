# Solución a Problemas de Inestabilidad en Strapi CMS - FACOPEC

**Fecha**: 14 de Noviembre de 2025
**Estado**: ✅ RESUELTO

## Resumen Ejecutivo

Se identificaron y resolvieron **problemas críticos** que causaban inestabilidad en el CMS de Strapi, incluyendo pérdida de datos al reiniciar el servidor, imágenes que no persistían, y comportamiento inconsistente general.

---

## Problemas Identificados

### 1. ⚠️ **PROBLEMA CRÍTICO: Seed Ejecutándose en Cada Inicio**
**Archivo afectado**: `backend/src/index.ts`

**Descripción**:
El script de seed (`seedDefaultContent`) se ejecutaba **automáticamente cada vez que se iniciaba el servidor**, causando:
- Sobreescritura de cambios del usuario con datos por defecto
- Creación masiva de archivos duplicados
- Pérdida de modificaciones al reiniciar el servidor
- Comportamiento inconsistente del CMS

**Evidencia**:
```typescript
// ANTES (PROBLEMÁTICO):
async bootstrap({ strapi }: { strapi: Strapi }) {
  try {
    await seedDefaultContent(strapi);  // ❌ SE EJECUTABA SIEMPRE
  } catch (error) {
    strapi.log.error('Error while seeding...', error);
  }
}
```

**Solución aplicada**:
```typescript
// DESPUÉS (CORREGIDO):
async bootstrap({ strapi }: { strapi: Strapi }) {
  // Solo ejecutar seed si se solicita explícitamente
  const shouldSeed =
    process.env.FORCE_SEED === 'true' ||
    process.env.SEED_ON_BOOTSTRAP === 'true';

  if (process.env.SKIP_BOOTSTRAP_SEED === 'true' || !shouldSeed) {
    strapi.log.info('Skipping default content seed during bootstrap.');
    return;
  }

  // Verificar si ya hay contenido antes de ejecutar seed
  const existingGlobal = await strapi.db
    .query('api::global.global')
    .findMany({ limit: 1 });

  if (existingGlobal && existingGlobal.length > 0 && !process.env.FORCE_SEED) {
    strapi.log.info('✅ La base de datos ya contiene datos. Omitiendo seed automático.');
    return;
  }

  await seedDefaultContent(strapi);
}
```

**Resultado**: El seed ahora solo se ejecuta cuando es necesario, protegiendo los datos del usuario.

---

### 2. 🗃️ **Configuración Incorrecta de Base de Datos**
**Archivo afectado**: `backend/config/database.ts`

**Descripción**:
La configuración de la base de datos SQLite usaba `__dirname` que apuntaba a ubicaciones diferentes en desarrollo vs compilado, causando inconsistencias.

**Antes**:
```typescript
filename: path.join(__dirname, '..', 'data', 'strapi.db')
// Resultaba en: dist/data/strapi.db (después de compilar)
```

**Después**:
```typescript
filename: path.join(process.cwd(), 'data', 'strapi.db')
// Siempre: backend/data/strapi.db
```

**Resultado**: La base de datos ahora se guarda consistentemente en `backend/data/strapi.db`.

---

### 3. 📁 **Archivos Duplicados Masivos**
**Problema**: Se encontraron **100 archivos duplicados** ocupando **6.17 MB** en `/backend/public/uploads`

**Evidencia**:
- 11 copias de `logo.png`
- 11 copias de `ninos.jpg`
- 11 copias de `icbf_logo.svg`
- 11 copias de `pnud_logo.svg`
- Y muchos más...

**Solución**:
- Se creó el script `cleanup-duplicate-uploads.js` que:
  - Identifica archivos no referenciados en la base de datos
  - Analiza y calcula espacio a liberar
  - Permite limpieza segura de duplicados

**Uso**:
```bash
# Analizar duplicados
node cleanup-duplicate-uploads.js

# Eliminar duplicados
node cleanup-duplicate-uploads.js --delete
```

**Resultado**: Se liberaron 6.17 MB y se eliminaron 100 archivos duplicados.

---

### 4. ⚙️ **Configuración de Variables de Entorno**
**Archivo creado**: `backend/.env`

Se creó un archivo `.env` con configuraciones óptimas para desarrollo:

```bash
# Prevenir seed automático (IMPORTANTE)
SKIP_BOOTSTRAP_SEED=true

# Configuración del servidor
HOST=0.0.0.0
PORT=1337
PUBLIC_URL=http://localhost:1337

# Base de datos
DATABASE_CLIENT=sqlite

# Credenciales del super admin
SEED_ADMIN_USERNAME=facopec
SEED_ADMIN_EMAIL=facopec@facopec.org
SEED_ADMIN_PASSWORD=F4c0pec@2025
```

---

## Cómo Usar el Sistema Correctamente

### Inicio Normal del Servidor (Sin Seed)
```bash
cd backend
npm run develop
```
Esto **NO ejecutará el seed** y preservará todos tus datos.

### Primera Vez / Resetear Datos
Si necesitas inicializar la base de datos con datos por defecto:
```bash
cd backend
SKIP_BOOTSTRAP_SEED=false FORCE_SEED=true npm run develop
```

### Limpiar Archivos Duplicados
```bash
cd backend
node cleanup-duplicate-uploads.js --delete
```

---

## Archivos Modificados

1. ✅ `backend/src/index.ts` - Seed condicional
2. ✅ `backend/config/database.ts` - Ruta consistente de BD
3. ✅ `backend/.env` - Variables de entorno
4. ✅ `backend/cleanup-duplicate-uploads.js` - Script de limpieza (NUEVO)
5. ✅ `backend/fix-permissions.js` - Actualizada ruta de BD

---

## Estado del Sistema

### ✅ Verificado y Funcionando:

- [x] Base de datos en ubicación correcta: `data/strapi.db`
- [x] Seed NO se ejecuta automáticamente
- [x] Servidor inicia correctamente
- [x] Archivos duplicados eliminados
- [x] Super admin configurado: `facopec@facopec.org`
- [x] API de Projects funcionando (4 proyectos)
- [x] Permisos públicos configurados

### ⚠️ Para Verificar Manualmente:

1. Accede al panel de administración: http://localhost:1337/admin
2. Inicia sesión con:
   - Email: `facopec@facopec.org`
   - Password: `F4c0pec@2025`

3. Verifica que puedas:
   - Modificar contenido del Hero
   - Cambiar imágenes
   - Publicar cambios
   - Reiniciar el servidor
   - Verificar que los cambios persisten

---

## Comandos Útiles

### Reiniciar la base de datos completamente:
```bash
cd backend
rm -rf data/strapi.db
rm -rf public/uploads/*
SKIP_BOOTSTRAP_SEED=false FORCE_SEED=true npm run develop
```

### Ver logs del servidor:
```bash
cd backend
npm run develop
```

### Verificar APIs públicas:
```bash
curl http://localhost:1337/api/projects
curl http://localhost:1337/api/global?populate=deep
curl http://localhost:1337/api/home-page?populate=deep
```

---

## Commit y Push

Para guardar todos estos cambios:

```bash
git add .
git commit -m "fix: Resolver problemas críticos de inestabilidad en Strapi CMS

- Prevenir seed automático que sobreescribía cambios del usuario
- Corregir configuración de base de datos para persistencia correcta
- Limpiar 100 archivos duplicados (6.17 MB liberados)
- Configurar variables de entorno para desarrollo estable
- Actualizar scripts de utilidad con rutas correctas

Fixes: Inestabilidad general, pérdida de datos al reiniciar, imágenes no persistentes"

git push -u origin claude/fix-strapi-cms-instability-01DCsNFGdNXebiEWi4siJxYx
```

---

## Próximos Pasos Recomendados

1. **Pruebas exhaustivas**: Modifica contenido, reinicia el servidor varias veces y verifica persistencia
2. **Configurar PostgreSQL**: Para producción, migrar de SQLite a PostgreSQL
3. **Backup automático**: Configurar respaldos regulares de `backend/data/strapi.db`
4. **Monitoreo**: Implementar logs y monitoreo para detectar problemas temprano

---

## Soporte

Si encuentras algún problema:

1. Revisa los logs del servidor
2. Verifica que el archivo `.env` esté configurado correctamente
3. Asegúrate de que la base de datos está en `backend/data/strapi.db`
4. Si persisten problemas, ejecuta el seed completo (ver sección "Primera Vez / Resetear Datos")

**Contacto**: Equipo de Desarrollo FACOPEC

---

**Autor**: Claude (Asistente de IA)
**Revisión**: Pendiente
