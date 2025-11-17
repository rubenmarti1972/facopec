const axios = require('axios');

const STRAPI_URL = 'http://localhost:1337';

async function addCalendarEvents() {
  try {
    console.log('📅 Agregando eventos al calendario...\n');

    // Primero, obtener el ID del documento de home-page
    const homePageResponse = await axios.get(`${STRAPI_URL}/api/home-page`);
    const documentId = homePageResponse.data.data.documentId;

    console.log(`✅ Home page documentId: ${documentId}\n`);

    // Crear eventos de ejemplo para el calendario
    const events = [
      {
        title: "Taller de Matemáticas",
        description: "Taller de nivelación en matemáticas para estudiantes de primaria",
        eventDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // en 3 días
        category: "taller",
        color: "blue",
        isHighlighted: true,
        link: "https://matematicasprofeencasa.blogspot.com/"
      },
      {
        title: "Club de Lectura",
        description: "Sesión de lectura en voz alta y discusión de cuentos",
        eventDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // en 5 días
        category: "actividad",
        color: "teal",
        isHighlighted: false,
        link: "https://rutaliterariamaria.blogspot.com/"
      },
      {
        title: "Escuela de Padres",
        description: "Charla sobre acompañamiento pedagógico en el hogar",
        eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // en 7 días
        category: "formacion",
        color: "rose",
        isHighlighted: false,
        link: "https://consejosparapadresymadres.blogspot.com/"
      },
      {
        title: "Servicio Comunitario",
        description: "Jornada de voluntariado en el barrio",
        eventDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // en 10 días
        category: "evento",
        color: "green",
        isHighlighted: false,
        link: "https://serviciocomunitario-facopec.blogspot.com/"
      }
    ];

    // Actualizar la home page con los eventos
    const updateResponse = await axios.put(
      `${STRAPI_URL}/api/home-page`,
      {
        data: {
          eventCalendar: events
        }
      }
    );

    console.log(`✅ ${events.length} eventos agregados al calendario\n`);

    events.forEach((event, index) => {
      console.log(`${index + 1}. ${event.title}`);
      console.log(`   Fecha: ${new Date(event.eventDate).toLocaleDateString('es-CO')}`);
      console.log(`   Categoría: ${event.category}`);
      console.log(`   Color: ${event.color}\n`);
    });

    console.log('✅ Calendario actualizado exitosamente!');

  } catch (error) {
    console.error('❌ Error agregando eventos:', error.response?.data || error.message);
    process.exit(1);
  }
}

addCalendarEvents();
