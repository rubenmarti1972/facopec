/**
 * Script para agregar los datos faltantes al CMS sin borrar nada
 * Ejecutar con: npm run add-missing-data
 */

import 'ts-node/register/transpile-only';
import { createStrapi } from '@strapi/strapi';

async function addMissingData() {
  process.env.SKIP_BOOTSTRAP_SEED = 'true';

  const appDir = process.cwd();
  const strapi = createStrapi({ appDir, distDir: appDir });

  try {
    await strapi.start();

    console.log('📝 Agregando datos faltantes al CMS...');

    // 1. AGREGAR PROGRAMA FALTANTE A programLogos
    console.log('\n1️⃣ Verificando programLogos en home-page...');

    const homePage = await strapi.db.query('api::home-page.home-page').findOne({
      where: { id: 1 },
      populate: '*'
    });

    if (homePage) {
      const currentLogos = (homePage as any).programLogos || [];
      console.log(`   Programas actuales: ${currentLogos.length}`);

      // Verificar si ya existe "Escuela de Formación para Jóvenes"
      const exists = currentLogos.some((logo: any) =>
        logo.alt === 'Escuela de Formación para Jóvenes' ||
        logo.link?.includes('personerosestudiantilesylideres')
      );

      if (!exists) {
        console.log('   ➕ Agregando: Escuela de Formación para Jóvenes');

        // Buscar el logo educa.png en uploads
        const educaLogo = await strapi.db.query('plugin::upload.file').findOne({
          where: { name: 'educa.png' }
        });

        currentLogos.push({
          alt: 'Escuela de Formación para Jóvenes',
          link: 'https://personerosestudiantilesylideres.blogspot.com/',
          logo: educaLogo?.id
        });

        await strapi.db.query('api::home-page.home-page').update({
          where: { id: 1 },
          data: { programLogos: currentLogos }
        });

        console.log('   ✅ Programa agregado exitosamente');
      } else {
        console.log('   ℹ️  Programa ya existe');
      }
    }

    // 2. AGREGAR EVENTOS FALTANTES AL CALENDARIO
    console.log('\n2️⃣ Verificando eventos en eventCalendar...');

    const homePageWithEvents = await strapi.db.query('api::home-page.home-page').findOne({
      where: { id: 1 },
      populate: ['eventCalendar']
    });

    if (homePageWithEvents) {
      const currentEvents = (homePageWithEvents as any).eventCalendar || [];
      console.log(`   Eventos actuales: ${currentEvents.length}`);

      const eventsToAdd = [
        {
          title: 'Cierre del programa de nivelación',
          description: 'Cierre del programa de nivelación académica',
          eventDate: '2025-11-27T15:00:00',
          location: 'Sede FACOPEC',
          category: 'evento',
          color: 'teal',
          isHighlighted: true,
        },
        {
          title: 'Mujeres Equidad y Empleo',
          description: 'Programa de empleabilidad y formación para mujeres',
          eventDate: '2025-11-10T09:00:00',
          endDate: '2026-01-10T17:00:00',
          location: 'Sede FACOPEC',
          category: 'formacion',
          color: 'purple',
          isHighlighted: true,
        }
      ];

      for (const newEvent of eventsToAdd) {
        const exists = currentEvents.some((event: any) =>
          event.title === newEvent.title
        );

        if (!exists) {
          console.log(`   ➕ Agregando evento: ${newEvent.title}`);
          currentEvents.push(newEvent);
        } else {
          console.log(`   ℹ️  Evento ya existe: ${newEvent.title}`);
        }
      }

      await strapi.db.query('api::home-page.home-page').update({
        where: { id: 1 },
        data: { eventCalendar: currentEvents }
      });

      console.log(`   ✅ Calendario actualizado. Total eventos: ${currentEvents.length}`);
    }

    // 3. ACTUALIZAR NAVEGACIÓN CON 8 CATEGORÍAS
    console.log('\n3️⃣ Actualizando navegación con 8 categorías...');

    const global = await strapi.db.query('api::global.global').findOne({
      where: { id: 1 },
      populate: ['navigation']
    });

    if (global) {
      const newNavigation = [
        {
          label: 'Inicio',
          url: '/inicio',
          order: 1,
          exact: true,
          dataUid: 'navigation.home',
        },
        {
          label: 'Programas',
          url: '/inicio',
          fragment: 'programas',
          order: 2,
          dataUid: 'navigation.programs',
          children: [
            {
              title: '📚 Educación y Refuerzo Académico',
              items: [
                { label: 'Guías y Cuentos Cortos', url: 'https://cuentoscortosprofeencasa.blogspot.com/', target: '_blank' },
                { label: 'Guías de Matemáticas', url: 'https://matematicasprofeencasa.blogspot.com/', target: '_blank' },
                { label: 'Talleres de Nivelación', url: 'https://talleresdenivelacion.blogspot.com/', target: '_blank' },
                { label: 'Desafío Matemáticos', url: 'https://desafio-matematicos.blogspot.com/', target: '_blank' },
              ],
            },
            {
              title: '📖 Cultura y Lectura',
              items: [
                { label: 'Plan Lector - Ruta Literaria María', url: 'https://rutaliterariamaria.blogspot.com/', target: '_blank' },
              ],
            },
            {
              title: '👨‍👩‍👧‍👦 Desarrollo Familiar y Comunitario',
              items: [
                { label: 'Escuela de Padres', url: 'https://consejosparapadresymadres.blogspot.com/', target: '_blank' },
                { label: 'Formación Espiritual', url: 'https://escueladominicalcreciendoconcristo.blogspot.com/', target: '_blank' },
              ],
            },
            {
              title: '💼 Empleabilidad y Desarrollo',
              items: [
                { label: 'Empleabilidad', url: 'https://empleabilidad-facopec.blogspot.com/', target: '_blank' },
              ],
            },
            {
              title: '💻 Innovación y Tecnología Educativa',
              items: [
                { label: 'FACOPEC Educa', url: 'https://facopeceduca.blogspot.com/', target: '_blank' },
              ],
            },
            {
              title: '🌍 Etnoeducación y Cultura (Identidad)',
              items: [
                { label: 'Comunidades NARP', url: 'https://docs.google.com/forms/d/e/1FAIpQLScI9v2p8Rgp892XzGbEcrN-yKsyMh4A5h1UGmRDeZw_9RqIGQ/viewform', target: '_blank' },
              ],
            },
            {
              title: '🕊️ Liderazgo, Gobernanza y Paz',
              items: [
                { label: 'Escuela de Formación para Jóvenes', url: 'https://personerosestudiantilesylideres.blogspot.com/', target: '_blank' },
              ],
            },
            {
              title: '🎉 Impacto Directo y Bienestar',
              items: [
                { label: 'Servicio Comunitario', url: 'https://serviciocomunitario-facopec.blogspot.com/', target: '_blank' },
                { label: 'Dona Ropa', url: 'https://quetienespararegalar.blogspot.com/', target: '_blank' },
                { label: 'Salidas Pedagógicas', url: 'https://salidaspedagogicas-facopec.blogspot.com/', target: '_blank' },
              ],
            },
          ],
        },
        {
          label: 'Proyectos',
          url: '/proyectos',
          order: 3,
          dataUid: 'navigation.projects',
        },
        {
          label: 'Donaciones',
          url: '/donaciones',
          order: 4,
          dataUid: 'navigation.donations',
        },
        {
          label: 'Contáctanos',
          url: '/contactanos',
          order: 5,
          dataUid: 'navigation.contact',
        },
        {
          label: 'Nosotros',
          url: '/about',
          order: 6,
          dataUid: 'navigation.about',
        },
      ];

      await strapi.db.query('api::global.global').update({
        where: { id: 1 },
        data: { navigation: newNavigation }
      });

      console.log('   ✅ Navegación actualizada con 8 categorías y 14 programas');
    }

    console.log('\n✅ ¡Todos los datos faltantes han sido agregados exitosamente!');

  } catch (error) {
    console.error('\n❌ Error al agregar datos:', error);
  } finally {
    await strapi.destroy();
  }
}

addMissingData();
