#!/bin/bash

echo "🔥 RESETEO COMPLETO DE STRAPI 🔥"
echo ""

# Detener cualquier proceso de Strapi
echo "1️⃣ Deteniendo procesos de Node.js..."
killall node 2>/dev/null || true
lsof -ti:1337 | xargs kill -9 2>/dev/null || true

# Esperar a que los procesos terminen
sleep 2

# Borrar TODA la base de datos y cache
echo "2️⃣ Eliminando base de datos y cache..."
rm -rf .tmp .cache build dist node_modules/.cache node_modules/.vite

# Verificar que se borró
if [ -f ".tmp/data.db" ]; then
    echo "❌ Error: No se pudo borrar la base de datos"
    exit 1
fi

echo "3️⃣ Reconstruyendo admin panel..."
pnpm run build

echo "4️⃣ Iniciando Strapi..."
echo ""
echo "✅ TODO LIMPIO - Accede a: http://localhost:1337/admin"
echo "⚠️  IMPORTANTE: Usa modo incógnito (Cmd+Shift+N)"
echo ""

pnpm run develop
