#!/bin/bash
# Script para forzar la actualización del contenido del CMS

echo "🔄 Forzando actualización del contenido..."
echo "=========================================="
echo ""

# 1. Verificar que Strapi esté corriendo
echo "1️⃣ Verificando Strapi..."
if curl -s http://localhost:1337/api/home-page > /dev/null 2>&1; then
    echo "   ✅ Strapi está respondiendo"
else
    echo "   ❌ ERROR: Strapi no está corriendo"
    echo "   📍 Inicia Strapi primero:"
    echo "      cd backend && pnpm run develop"
    exit 1
fi

echo ""
echo "2️⃣ Verificando contenido publicado..."

# Test home-page
RESPONSE=$(curl -s -w "%{http_code}" http://localhost:1337/api/home-page -o /tmp/strapi-test.json)
if [ "$RESPONSE" = "200" ]; then
    echo "   ✅ /api/home-page - OK"
elif [ "$RESPONSE" = "404" ]; then
    echo "   ❌ /api/home-page - NO PUBLICADO"
    echo "      Ve a: http://localhost:1337/admin/content-manager/single-types/api::home-page.home-page"
    echo "      Y haz clic en PUBLISH"
elif [ "$RESPONSE" = "403" ]; then
    echo "   ❌ /api/home-page - SIN PERMISOS"
    echo "      Ejecuta: cd backend && node fix-permissions.js"
else
    echo "   ❌ /api/home-page - Error $RESPONSE"
fi

# Test donations-page
RESPONSE=$(curl -s -w "%{http_code}" http://localhost:1337/api/donations-page -o /tmp/strapi-test.json)
if [ "$RESPONSE" = "200" ]; then
    echo "   ✅ /api/donations-page - OK"
elif [ "$RESPONSE" = "404" ]; then
    echo "   ❌ /api/donations-page - NO PUBLICADO"
elif [ "$RESPONSE" = "403" ]; then
    echo "   ❌ /api/donations-page - SIN PERMISOS"
fi

echo ""
echo "3️⃣ Limpiando cache del navegador..."
echo "   📝 En el navegador, presiona:"
echo "      • Chrome/Edge: Ctrl + Shift + R (Windows/Linux) o Cmd + Shift + R (Mac)"
echo "      • Firefox: Ctrl + F5 (Windows/Linux) o Cmd + Shift + R (Mac)"
echo ""
echo "   O abre DevTools (F12) → Application → Clear Storage → Clear site data"
echo ""

echo "4️⃣ Pasos para publicar contenido en Strapi:"
echo "   1. Ve a: http://localhost:1337/admin"
echo "   2. Content Manager → Single Types → Home Page"
echo "   3. Haz tus cambios"
echo "   4. Haz clic en SAVE (botón verde arriba a la derecha)"
echo "   5. Haz clic en PUBLISH (botón azul que aparece después de guardar)"
echo "   6. Recarga el frontend con Ctrl+Shift+R"
echo ""

echo "✅ Checklist completo"
echo "   □ Strapi corriendo en http://localhost:1337"
echo "   □ Frontend corriendo en http://localhost:4200"
echo "   □ Contenido PUBLICADO (no solo guardado)"
echo "   □ Permisos públicos configurados"
echo "   □ Cache del navegador limpiado"
echo ""
