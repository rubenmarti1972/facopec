# 🚀 Migración SQLite → PostgreSQL - GUÍA RÁPIDA

## ⚡ Setup en 1 Comando (Recomendado)

```bash
cd backend
bash scripts/setup-completo.sh
```

**Eso es todo.** Este script hace TODO automáticamente:
- ✅ Configura PostgreSQL
- ✅ Crea la base de datos
- ✅ Crea el esquema de Strapi
- ✅ Carga TODOS los datos hardcodeados

---

## 📚 Documentación Disponible

Tenemos **4 guías** según tu nivel de detalle:

### 1. **SETUP-AUTOMATICO.md** ⚡ (Empieza aquí)
   - Setup en 1 comando
   - Lista de datos que se cargan
   - Verificación rápida
   - **Más rápido y fácil**

### 2. **MIGRACION-PASO-A-PASO.md** 📋
   - Guía detallada paso a paso
   - Checklist completo
   - Tests de persistencia
   - Solución de problemas
   - **Más didáctico**

### 3. **MIGRATION-POSTGRES.md** 🔧
   - Documentación técnica completa
   - Instalación de PostgreSQL
   - Configuración avanzada
   - **Más técnico**

### 4. **RENDER-SETUP.md** 🌐
   - Configuración para producción
   - Variables de entorno en Render
   - Despliegue paso a paso
   - **Para cuando despliegues**

---

## 🎯 Flujo Recomendado

```
1. SETUP-AUTOMATICO.md
   ↓ (ejecutar script)
2. Configurar Cloudinary en .env
   ↓
3. pnpm run develop
   ↓
4. Verificar que todo funciona
   ↓
5. RENDER-SETUP.md (para desplegar)
```

---

## 🔑 Datos de Acceso por Defecto

Después del setup automático:

- **Admin Panel:** http://localhost:1337/admin
- **Email:** `facopec@facopec.org`
- **Password:** `F4c0pec@2025`

---

## ⚙️ Scripts Disponibles

```bash
# Setup y configuración
pnpm run setup:postgres      # Verificar PostgreSQL
bash scripts/setup-completo.sh  # Setup automático completo

# Desarrollo
pnpm run develop              # Iniciar Strapi (desarrollo)
pnpm run build                # Compilar
pnpm run start                # Iniciar Strapi (producción)

# Datos
pnpm run seed                 # Cargar datos hardcodeados
pnpm run migrate:postgres     # Migrar desde SQLite
pnpm run migrate:verify       # Migrar + verificar
```

---

## 🚨 ¿Problemas?

1. **PostgreSQL no está corriendo:**
   ```bash
   brew services start postgresql@15
   ```

2. **Error de permisos:**
   ```bash
   psql postgres -c "CREATE USER postgres WITH SUPERUSER PASSWORD 'postgres';"
   ```

3. **Empezar de cero:**
   ```bash
   psql -U postgres -c "DROP DATABASE facopec_strapi;"
   bash scripts/setup-completo.sh
   ```

4. **Consulta las guías detalladas** para más soluciones

---

## ✅ Checklist Rápido

- [ ] PostgreSQL instalado y corriendo
- [ ] Script ejecutado: `bash scripts/setup-completo.sh`
- [ ] Cloudinary configurado en `.env`
- [ ] `pnpm run develop` funciona
- [ ] Puedes acceder a http://localhost:1337/admin
- [ ] Los datos persisten después de reiniciar
- [ ] Las imágenes se suben a Cloudinary
- [ ] Listo para desplegar en Render

---

## 🎉 Resultado Final

Después de completar el setup:

- ✅ PostgreSQL funcionando con persistencia
- ✅ Cloudinary para almacenamiento de imágenes
- ✅ Todos los datos de FACOPEC cargados
- ✅ Usuario admin creado
- ✅ Listo para desarrollo
- ✅ Listo para producción en Render

---

**¿Listo para empezar?** → Abre **`SETUP-AUTOMATICO.md`** 🚀
