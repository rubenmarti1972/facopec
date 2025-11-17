#!/usr/bin/env node

/**
 * Script para actualizar los campos faltantes en Home Page
 */

const Strapi = require('@strapi/strapi');

async function updateMissingFields() {
  console.log('🚀 Iniciando actualización de campos faltantes...\n');

  const strapi = await Strapi.createStrapi(/* no config needed for scripts */).load();

  try {
    // Obtener el entry actual
    const entry = await strapi.documents('api::home-page.home-page').findFirst();

    if (!entry) {
      console.error('❌ No se encontró la home page');
      process.exit(1);
    }

    console.log(`✓ Home page encontrada (ID: ${entry.documentId})\n`);

    // Datos a actualizar
    const updateData = {
      attendedPersons: [
        {
          program: 'Tutorías Profe en Casa',
          count: 120,
          description: 'Estudiantes en refuerzo escolar',
          icon: '🧠',
          theme: 'teal',
        },
        {
          program: 'Ruta Literaria María',
          count: 65,
          description: 'Participantes en círculos de lectura',
          icon: '📖',
          theme: 'blue',
        },
        {
          program: 'Semillero Digital',
          count: 45,
          description: 'Jóvenes en talleres STEAM',
          icon: '💻',
          theme: 'purple',
        },
        {
          program: 'Club Familias',
          count: 80,
          description: 'Familias acompañadas',
          icon: '👨‍👩‍👧‍👦',
          theme: 'rose',
        },
      ],
      eventCalendar: [
        {
          title: 'Taller de lectura en voz alta',
          description: 'Círculo literario con familias',
          eventDate: '2025-12-15T15:00:00',
          location: 'Biblioteca Comunitaria',
          category: 'taller',
          color: 'blue',
          isHighlighted: true,
        },
        {
          title: 'Reunión Club Familias',
          description: 'Escuela de padres mensual',
          eventDate: '2025-12-20T17:00:00',
          location: 'Sede FACOPEC',
          category: 'reunion',
          color: 'rose',
        },
        {
          title: 'Celebración Fin de Año',
          description: 'Cierre de actividades 2025',
          eventDate: '2025-12-22T14:00:00',
          location: 'Parque Central',
          category: 'celebracion',
          color: 'gold',
          isHighlighted: true,
        },
      ],
    };

    console.log('📝 Actualizando campos...');
    await strapi.documents('api::home-page.home-page').update({
      documentId: entry.documentId,
      data: updateData,
    });

    console.log('✅ Campos actualizados exitosamente\n');
    console.log('📊 Actualizado:');
    console.log('   ✓ attendedPersons: 4 items');
    console.log('   ✓ eventCalendar: 3 items\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await strapi.destroy();
  }
}

updateMissingFields();
