#!/bin/bash
# Script para iniciar todo el stack de desarrollo

echo "🚀 Iniciando FACOPEC Development Stack"
echo "======================================"
echo ""

# Verificar si Strapi ya está corriendo
if curl -s http://localhost:1337 > /dev/null 2>&1; then
    echo "✅ Strapi ya está corriendo en localhost:1337"
else
    echo "❌ Strapi NO está corriendo"
    echo "   Iniciando backend..."
    echo ""
    echo "   📍 Ejecuta en otra terminal:"
    echo "   cd /home/user/facopec/backend && pnpm run develop"
    echo ""
fi

# Verificar si el frontend está corriendo
if curl -s http://localhost:4200 > /dev/null 2>&1; then
    echo "✅ Frontend ya está corriendo en localhost:4200"
else
    echo "❌ Frontend NO está corriendo"
    echo "   Iniciando frontend..."
    echo ""
    echo "   📍 Ejecuta en otra terminal:"
    echo "   cd /home/user/facopec && pnpm start"
    echo ""
fi

echo ""
echo "📋 URLs importantes:"
echo "   🔧 Strapi Admin: http://localhost:1337/admin"
echo "   🌐 Frontend:      http://localhost:4200"
echo "   📡 API:          http://localhost:1337/api"
echo ""
echo "🔑 Credenciales Strapi:"
echo "   Email: facopec@facopec.org"
echo "   Password: F4c0pec@2025"
echo ""
echo "✨ Cuando hagas cambios en Strapi:"
echo "   1. Haz clic en SAVE"
echo "   2. Haz clic en PUBLISH (muy importante)"
echo "   3. Recarga el frontend con Ctrl+Shift+R"
echo ""
