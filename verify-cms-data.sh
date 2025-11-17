#!/bin/bash

echo "🔍 Verificando datos cargados en el CMS..."
echo ""

# Iniciar el backend temporalmente
echo "📡 Levantando backend..."
cd /home/user/facopec/backend
npm run develop > /tmp/strapi-temp.log 2>&1 &
BACKEND_PID=$!

# Esperar a que el backend esté listo
echo "⏳ Esperando a que el backend esté listo..."
for i in {1..30}; do
    if curl -s http://localhost:1337/api/home-page > /dev/null 2>&1; then
        echo "✅ Backend listo"
        break
    fi
    sleep 1
done

# Verificar datos
echo ""
echo "📊 Verificando datos del home..."
RESPONSE=$(curl -s "http://localhost:1337/api/home-page?populate=deep")

# Verificar carouselItems
CAROUSEL_COUNT=$(echo "$RESPONSE" | jq -r '.data.hero.carouselItems | length' 2>/dev/null)
echo "  📸 Carousel Items: $CAROUSEL_COUNT"

# Verificar attendedPersons
ATTENDED_COUNT=$(echo "$RESPONSE" | jq -r '.data.attendedPersons | length' 2>/dev/null)
echo "  👥 Attended Persons: $ATTENDED_COUNT"

# Verificar eventCalendar
EVENTS_COUNT=$(echo "$RESPONSE" | jq -r '.data.eventCalendar | length' 2>/dev/null)
echo "  📅 Event Calendar: $EVENTS_COUNT"

# Verificar activities
ACTIVITIES_COUNT=$(echo "$RESPONSE" | jq -r '.data.activities | length' 2>/dev/null)
echo "  🎯 Activities: $ACTIVITIES_COUNT"

# Verificar programs
PROGRAMS_COUNT=$(echo "$RESPONSE" | jq -r '.data.programs | length' 2>/dev/null)
echo "  📚 Programs: $PROGRAMS_COUNT"

# Verificar gallery
GALLERY_COUNT=$(echo "$RESPONSE" | jq -r '.data.gallery | length' 2>/dev/null)
echo "  🖼️  Gallery: $GALLERY_COUNT"

echo ""
echo "✨ Verificación completa!"
echo ""
echo "💡 El backend está corriendo en http://localhost:1337"
echo "   Accede al admin en http://localhost:1337/admin"
echo "   Usuario: facopec@facopec.org"
echo "   Password: F4c0pec@2025"

# No matar el backend, dejarlo corriendo
echo ""
echo "⚠️  El backend quedará corriendo para que puedas verificar."
echo "   Para detenerlo: kill $BACKEND_PID"
