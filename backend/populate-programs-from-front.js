#!/usr/bin/env node

/**
 * Script para poblar el CMS con los 13 programas que estaban hardcodeados en el front
 *
 * IMPORTANTE: Este script carga los programas EXACTAMENTE como estaban en el front original
 * en la línea 204-218 de home.component.ts
 *
 * Ejecutar: node populate-programs-from-front.js
 */

const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:1337/api';

// Los 13 programas que estaban en el front original
const PROGRAMAS_FRONT = [
  {
    logo: 'assets/program-logos/guias.png',
    alt: 'Guías y Cuentos Cortos',
    href: 'https://cuentoscortosprofeencasa.blogspot.com/'
  },
  {
    logo: 'assets/program-logos/guias-mate.png',
    alt: 'Guías de Matemáticas',
    href: 'https://matematicasprofeencasa.blogspot.com/'
  },
  {
    logo: 'assets/program-logos/talleres-nivelacion.png',
    alt: 'Talleres de Nivelación',
    href: 'https://talleresdenivelacion.blogspot.com/'
  },
  {
    logo: 'assets/program-logos/plan-lector.png',
    alt: 'Plan Lector',
    href: 'https://rutaliterariamaria.blogspot.com/'
  },
  {
    logo: 'assets/program-logos/escuela-padres.png',
    alt: 'Escuela de Padres',
    href: 'https://consejosparapadresymadres.blogspot.com/'
  },
  {
    logo: 'assets/program-logos/espiritual.png',
    alt: 'Formación Espiritual',
    href: 'https://escueladominicalcreciendoconcristo.blogspot.com/'
  },
  {
    logo: 'assets/program-logos/comunidades-narp.png',
    alt: 'Comunidades NARP',
    href: 'https://docs.google.com/forms/d/e/1FAIpQLScI9v2p8Rgp892XzGbEcrN-yKsyMh4A5h1UGmRDeZw_9RqIGQ/viewform'
  },
  {
    logo: 'assets/program-logos/emplpeabilidad.png',
    alt: 'Empleabilidad',
    href: 'https://empleabilidad-facopec.blogspot.com/'
  },
  {
    logo: 'assets/program-logos/salida-pedagogica.png',
    alt: 'Salidas Pedagógicas',
    href: 'https://salidaspedagogicas-facopec.blogspot.com/'
  },
  {
    logo: 'assets/program-logos/educa.png',
    alt: 'FACOPEC Educa',
    href: 'https://facopeceduca.blogspot.com/'
  },
  {
    logo: 'assets/program-logos/dona-ropa.png',
    alt: 'Dona Ropa',
    href: 'https://quetienespararegalar.blogspot.com/'
  },
  {
    logo: 'assets/program-logos/comunitario.png',
    alt: 'Servicio Comunitario',
    href: 'https://serviciocomunitario-facopec.blogspot.com/'
  },
  {
    logo: 'assets/program-logos/primaria.png',
    alt: 'Desafío Matemáticos',
    href: 'https://desafio-matematicos.blogspot.com/'
  }
];

// Usar API pública (sin autenticación) ya que los permisos están configurados
// No necesitamos autenticación gracias a setup-public-api-access.js

async function uploadImage(imagePath) {
  // Por ahora, devolvemos null y usaremos las URLs de assets directamente
  // Los logos ya están en src/assets/program-logos/
  return null;
}

async function getHomePage() {
  try {
    const response = await fetch(`${API_URL}/home-page?populate=deep`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('❌ Error obteniendo home-page:', error.message);
    return null;
  }
}

async function updateHomePagePrograms(programs) {
  try {
    const response = await fetch(`${API_URL}/home-page`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: {
          programs: programs
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(JSON.stringify(error));
    }

    return await response.json();
  } catch (error) {
    console.error('❌ Error actualizando programs en home-page:', error.message);
    throw error;
  }
}

async function main() {
  console.log('🚀 Poblando CMS con los 13 programas del front original...\n');

  try {
    const homePage = await getHomePage();
    if (!homePage) {
      throw new Error('No se pudo obtener la página home');
    }

    console.log('📦 Creando programas desde el front...\n');

    const programsData = [];

    for (let i = 0; i < PROGRAMAS_FRONT.length; i++) {
      const programa = PROGRAMAS_FRONT[i];
      console.log(`${i + 1}. ${programa.alt}`);
      console.log(`   Logo: ${programa.logo} (se usará desde assets)`);
      console.log(`   URL: ${programa.href}`);

      // Crear objeto del programa
      // NOTA: Los logos se dejarán null por ahora, se usan directamente desde assets en el front
      programsData.push({
        title: programa.alt,
        link: programa.href,
        logo: null, // Los logos se manejan desde assets/program-logos/
        logoAlt: programa.alt,
        description: `Programa: ${programa.alt}`,
        highlights: [],
        strapiCollection: 'programs',
        strapiEntryId: `program-${i + 1}`
      });

      console.log('   ✅ Programa agregado\n');
    }

    // Actualizar home-page con los programas
    console.log('💾 Guardando 13 programas en home-page...');
    await updateHomePagePrograms(programsData);

    console.log('\n✅ COMPLETADO - 13 programas cargados en el CMS');
    console.log('\n📋 Resumen:');
    console.log(`   - Total de programas: ${programsData.length}`);
    console.log('   - Logos: Se usan desde assets/program-logos/ en el front');
    console.log('\n💡 Los programas están listos para consumirse desde el CMS');
    console.log('   El front usará programLogos[] que consume del CMS');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main();
