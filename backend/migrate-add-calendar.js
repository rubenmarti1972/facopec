/**
 * Script para agregar eventos al calendario del CMS
 * Este script usa strapi directamente para evitar problemas de autenticación
 */

const path = require('path');

// Configurar entorno para strapi
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const Strapi = require('@strapi/strapi');

async function migrateCalendar() {
  let strapi;

  try {
    console.log('🔧 Iniciando migración de calendario...\n');

    // Compilar e iniciar Strapi
    strapi = await Strapi({
      appDir: __dirname,
      distDir: path.join(__dirname, 'dist'),
    }).load();

    console.log('✅ Strapi cargado\n');

    // Obtener la home page existente
    const homePage = await strapi.documents('api::home-page.home-page').findMany({
      populate: '*'
    });

    if (!homePage || homePage.length === 0) {
      console.error('❌ No se encontró la home page');
      process.exit(1);
    }

    const firstHomePage = homePage[0];
    const documentId = firstHomePage.documentId;

    console.log(`📄 Home page encontrada: ${documentId}\n`);

    // Crear eventos de ejemplo
    const events = [
      {
        title: "Taller de Matemáticas",
        description: "Taller de nivelación en matemáticas para estudiantes de primaria",
        eventDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        category: "taller",
        color: "blue",
        isHighlighted: true,
        link: "https://matematicasprofeencasa.blogspot.com/"
      },
      {
        title: "Club de Lectura - Ruta Literaria María",
        description: "Sesión de lectura en voz alta y discusión de cuentos",
        eventDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        category: "actividad",
        color: "teal",
        isHighlighted: false,
        link: "https://rutaliterariamaria.blogspot.com/"
      },
      {
        title: "Escuela de Padres",
        description: "Charla sobre acompañamiento pedagógico en el hogar",
        eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        category: "formacion",
        color: "rose",
        isHighlighted: false,
        link: "https://consejosparapadresymadres.blogspot.com/"
      },
      {
        title: "Servicio Comunitario",
        description: "Jornada de voluntariado en el barrio",
        eventDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        category: "evento",
        color: "green",
        isHighlighted: false,
        link: "https://serviciocomunitario-facopec.blogspot.com/"
      },
      {
        title: "Talleres de Nivelación",
        description: "Refuerzo escolar para estudiantes de todas las edades",
        eventDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        category: "taller",
        color: "purple",
        isHighlighted: false,
        link: "https://talleresdenivelacion.blogspot.com/"
      }
    ];

    // Actualizar la home page con los eventos
    await strapi.documents('api::home-page.home-page').update({
      documentId: documentId,
      data: {
        eventCalendar: events
      }
    });

    console.log(`✅ ${events.length} eventos agregados al calendario:\n`);

    events.forEach((event, index) => {
      console.log(`${index + 1}. ${event.title}`);
      console.log(`   📅 ${new Date(event.eventDate).toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`);
      console.log(`   🏷️  ${event.category} | ${event.color}`);
      console.log(`   🔗 ${event.link}\n`);
    });

    console.log('✅ Migración completada exitosamente!');

  } catch (error) {
    console.error('❌ Error en migración:', error);
    process.exit(1);
  } finally {
    if (strapi) {
      await strapi.destroy();
    }
  }
}

migrateCalendar();
