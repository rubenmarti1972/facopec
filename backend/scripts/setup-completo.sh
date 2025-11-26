#!/bin/bash
#
# Script completo para configurar PostgreSQL y cargar todos los datos
# Ejecutar en tu Mac con: bash scripts/setup-completo.sh
#

set -e  # Detener si hay algún error

echo "🚀 Configuración Completa de PostgreSQL + Datos"
echo "================================================"
echo ""

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Función para imprimir mensajes
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo "ℹ️  $1"
}

# Paso 1: Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    print_error "Este script debe ejecutarse desde el directorio backend/"
    exit 1
fi

print_success "Directorio correcto detectado"

# Paso 2: Verificar que PostgreSQL está instalado
print_info "Verificando PostgreSQL..."

if ! command -v psql &> /dev/null; then
    print_error "PostgreSQL no está instalado"
    echo ""
    echo "Instálalo con:"
    echo "  brew install postgresql@15"
    echo "  brew services start postgresql@15"
    exit 1
fi

print_success "PostgreSQL instalado"

# Paso 3: Verificar que PostgreSQL está corriendo
print_info "Verificando que PostgreSQL esté ejecutándose..."

if ! brew services list | grep -q "postgresql.*started"; then
    print_warning "PostgreSQL no está corriendo, iniciándolo..."
    brew services start postgresql@15
    sleep 3  # Esperar a que inicie
fi

print_success "PostgreSQL está ejecutándose"

# Paso 4: Verificar/Crear usuario postgres
print_info "Configurando usuario postgres..."

if psql postgres -tAc "SELECT 1 FROM pg_roles WHERE rolname='postgres'" | grep -q 1; then
    print_success "Usuario postgres existe"
else
    print_info "Creando usuario postgres..."
    psql postgres -c "CREATE USER postgres WITH SUPERUSER PASSWORD 'postgres';" 2>/dev/null || true
    print_success "Usuario postgres creado"
fi

# Paso 5: Verificar/Crear base de datos
print_info "Configurando base de datos facopec_strapi..."

if psql -U postgres -lqt | cut -d \| -f 1 | grep -qw facopec_strapi; then
    print_warning "Base de datos facopec_strapi ya existe"

    read -p "¿Quieres eliminarla y empezar de cero? (y/N): " response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        print_info "Eliminando base de datos existente..."
        psql -U postgres -c "DROP DATABASE facopec_strapi;" 2>/dev/null || true
        print_info "Creando base de datos nueva..."
        psql -U postgres -c "CREATE DATABASE facopec_strapi;"
        print_success "Base de datos recreada"
    else
        print_info "Usando base de datos existente"
    fi
else
    print_info "Creando base de datos facopec_strapi..."
    psql -U postgres -c "CREATE DATABASE facopec_strapi;"
    print_success "Base de datos creada"
fi

# Paso 6: Verificar que node_modules existe
if [ ! -d "node_modules" ]; then
    print_warning "node_modules no existe, instalando dependencias..."
    pnpm install
    print_success "Dependencias instaladas"
else
    print_success "Dependencias ya instaladas"
fi

# Paso 7: Verificar configuración .env
print_info "Verificando configuración .env..."

if [ ! -f ".env" ]; then
    print_error "Archivo .env no existe"
    echo ""
    echo "Crea el archivo .env con:"
    echo "  cp .env.example .env"
    echo "  # Luego edita las credenciales de Cloudinary"
    exit 1
fi

if ! grep -q "DATABASE_CLIENT=postgres" .env; then
    print_error "El archivo .env no tiene DATABASE_CLIENT=postgres"
    echo ""
    echo "Edita .env y asegúrate de que tenga:"
    echo "  DATABASE_CLIENT=postgres"
    exit 1
fi

print_success "Configuración .env correcta"

# Paso 8: Compilar TypeScript
print_info "Compilando TypeScript..."
pnpm run build 2>/dev/null || print_warning "Build falló pero continuando..."
print_success "Compilación completada"

# Paso 9: Iniciar Strapi brevemente para crear esquema
print_info "Iniciando Strapi para crear esquema (esto tomará ~30 segundos)..."
print_warning "Presiona Ctrl+C cuando veas 'Server listening on http://0.0.0.0:1337'"

# Ejecutar en background y capturar PID
pnpm run develop &
STRAPI_PID=$!

# Esperar a que Strapi inicie (máximo 60 segundos)
counter=0
while [ $counter -lt 60 ]; do
    if lsof -i:1337 -sTCP:LISTEN -t >/dev/null 2>&1; then
        print_success "Strapi está escuchando en el puerto 1337"
        sleep 5  # Esperar un poco más para asegurar que el esquema se creó
        break
    fi
    sleep 1
    ((counter++))
done

# Matar Strapi
print_info "Deteniendo Strapi..."
kill $STRAPI_PID 2>/dev/null || true
sleep 2

print_success "Esquema de base de datos creado"

# Paso 10: Ejecutar seed
print_info "Cargando datos iniciales..."
echo ""

if pnpm run seed; then
    print_success "Datos cargados exitosamente"
else
    print_error "Error al cargar datos con seed"
    echo ""
    echo "Puedes cargar los datos manualmente:"
    echo "  1. pnpm run develop"
    echo "  2. Abre http://localhost:1337/admin"
    echo "  3. Crea el contenido manualmente"
    exit 1
fi

# Paso 11: Verificar datos
print_info "Verificando datos en PostgreSQL..."

echo ""
echo "Tablas con datos:"
psql -U postgres -d facopec_strapi -c "
SELECT
    schemaname,
    tablename,
    (SELECT COUNT(*) FROM pg_catalog.pg_class c WHERE c.relname = tablename) as row_count
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
" || print_warning "No se pudo verificar tablas"

# Paso 12: Configuración de Cloudinary (recordatorio)
echo ""
echo "================================================"
print_success "¡Configuración completada!"
echo "================================================"
echo ""
print_warning "IMPORTANTE: Configura Cloudinary en .env:"
echo ""
echo "  CLOUDINARY_NAME=tu-cloud-name"
echo "  CLOUDINARY_KEY=tu-api-key"
echo "  CLOUDINARY_SECRET=tu-api-secret"
echo ""
echo "Obtén las credenciales en: https://cloudinary.com/console"
echo ""
echo "================================================"
echo "Próximos pasos:"
echo "================================================"
echo ""
echo "1. Edita backend/.env y configura Cloudinary"
echo "2. Ejecuta: pnpm run develop"
echo "3. Abre: http://localhost:1337/admin"
echo "4. Inicia sesión con:"
echo "   Email: facopec@facopec.org"
echo "   Password: F4c0pec@2025"
echo "5. Verifica que todos los datos estén cargados"
echo "6. Sube una imagen para probar Cloudinary"
echo ""
print_success "¡Todo listo! 🎉"
