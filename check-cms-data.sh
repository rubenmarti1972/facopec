#!/bin/bash

echo "🔍 Verificando datos del CMS..."
echo ""

# Verificar que el backend esté corriendo
if ! curl -s http://localhost:1337/api/home-page > /dev/null 2>&1; then
    echo "❌ El backend no está corriendo en http://localhost:1337"
    echo "   Ejecuta: cd backend && npm run develop"
    exit 1
fi

echo "✅ Backend corriendo"
echo ""

# Obtener datos de home page
echo "📡 Obteniendo datos de /api/home-page?populate=deep..."
RESPONSE=$(curl -s "http://localhost:1337/api/home-page?populate=deep")

# Verificar si hero.carouselItems existe
CAROUSEL_COUNT=$(echo "$RESPONSE" | jq -r '.data.hero.carouselItems | length' 2>/dev/null)

if [ "$CAROUSEL_COUNT" = "null" ] || [ -z "$CAROUSEL_COUNT" ]; then
    echo "⚠️  El campo hero.carouselItems no existe o está vacío"
    echo ""
    echo "📋 Pasos para agregar imágenes al carrusel:"
    echo "   1. Abre http://localhost:1337/admin"
    echo "   2. Ve a Content Manager > Single Types > Página de inicio"
    echo "   3. En la sección 'Hero' (Sección héroe), busca 'Carousel Items'"
    echo "   4. Haz clic en 'Add component'"
    echo "   5. Sube una imagen y agrega título/descripción"
    echo "   6. Haz clic en 'Publish' (no solo Save Draft)"
    exit 0
fi

echo "✅ Encontrados $CAROUSEL_COUNT items en el carrusel"
echo ""

# Mostrar detalles de cada item
echo "📸 Items del carrusel:"
for i in $(seq 0 $((CAROUSEL_COUNT - 1))); do
    TITLE=$(echo "$RESPONSE" | jq -r ".data.hero.carouselItems[$i].title // \"Sin título\"")
    HAS_IMAGE=$(echo "$RESPONSE" | jq -r ".data.hero.carouselItems[$i].image.url // \"no\"")

    if [ "$HAS_IMAGE" = "no" ]; then
        echo "   $((i + 1)). ⚠️  $TITLE - SIN IMAGEN"
    else
        IMAGE_URL=$(echo "$RESPONSE" | jq -r ".data.hero.carouselItems[$i].image.url")
        echo "   $((i + 1)). ✅ $TITLE - $IMAGE_URL"
    fi
done

echo ""
echo "✨ Datos del CMS verificados correctamente"
