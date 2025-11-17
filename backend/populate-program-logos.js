#!/usr/bin/env node

/**
 * Poblar solo el campo programLogos con los 13 programas
 */

const BASE_URL = 'http://localhost:1337';
const ADMIN_EMAIL = 'admin@facopec.org';
const ADMIN_PASSWORD = 'Admin123456';

// Los 13 programas que se muestran en el frontend
const PROGRAM_LOGOS = [
  { alt: 'Guías y Cuentos Cortos', link: 'https://cuentoscortosprofeencasa.blogspot.com/' },
  { alt: 'Guías de Matemáticas', link: 'https://matematicasprofeencasa.blogspot.com/' },
  { alt: 'Talleres de Nivelación', link: 'https://talleresdenivelacion.blogspot.com/' },
  { alt: 'Plan Lector', link: 'https://rutaliterariamaria.blogspot.com/' },
  { alt: 'Escuela de Padres', link: 'https://consejosparapadresymadres.blogspot.com/' },
  { alt: 'Formación Espiritual', link: 'https://escueladominicalcreciendoconcristo.blogspot.com/' },
  { alt: 'Comunidades NARP', link: 'https://docs.google.com/forms/d/e/1FAIpQLScI9v2p8Rgp892XzGbEcrN-yKsyMh4A5h1UGmRDeZw_9RqIGQ/viewform' },
  { alt: 'Empleabilidad', link: 'https://empleabilidad-facopec.blogspot.com/' },
  { alt: 'Salidas Pedagógicas', link: 'https://salidaspedagogicas-facopec.blogspot.com/' },
  { alt: 'FACOPEC Educa', link: 'https://facopeceduca.blogspot.com/' },
  { alt: 'Dona Ropa', link: 'https://quetienespararegalar.blogspot.com/' },
  { alt: 'Servicio Comunitario', link: 'https://serviciocomunitario-facopec.blogspot.com/' },
  { alt: 'Desafío Matemáticos', link: 'https://desafio-matematicos.blogspot.com/' }
];

async function getAdminToken() {
  const response = await fetch(`${BASE_URL}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    })
  });

  if (!response.ok) {
    throw new Error(`Admin login failed: ${response.status}`);
  }

  const data = await response.json();
  return data.data.token;
}

async function updateProgramLogos(token) {
  // Primero obtener el contenido actual de home-page
  const getResponse = await fetch(`${BASE_URL}/content-manager/single-types/api::home-page.home-page`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (!getResponse.ok) {
    throw new Error(`Failed to get current content: ${getResponse.status}`);
  }

  const currentData = await getResponse.json();

  // Actualizar solo el campo programLogos
  const updatedData = {
    ...currentData,
    programLogos: PROGRAM_LOGOS
  };

  // Guardar usando la API de Content Manager
  const response = await fetch(`${BASE_URL}/content-manager/single-types/api::home-page.home-page`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(updatedData)
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Content Manager API failed: ${response.status} - ${error}`);
  }

  return await response.json();
}

async function publishHomePage(token) {
  const response = await fetch(`${BASE_URL}/content-manager/single-types/api::home-page.home-page/actions/publish`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const error = await response.text();
    console.warn(`Warning: Could not publish: ${response.status} - ${error}`);
    return null;
  }

  return await response.json();
}

async function main() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║                                                            ║');
  console.log('║     🚀 POBLANDO 13 PROGRAM LOGOS                           ║');
  console.log('║                                                            ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  try {
    console.log('🔐 Autenticando como admin...');
    const token = await getAdminToken();
    console.log('✅ Autenticación exitosa\n');

    console.log('📝 Actualizando programLogos en Home Page...');
    await updateProgramLogos(token);
    console.log('✅ programLogos actualizado con 13 programas\n');

    console.log('📢 Publicando Home Page...');
    await publishHomePage(token);
    console.log('✅ Home Page publicado\n');

    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║                                                            ║');
    console.log('║              🎉 ¡COMPLETADO!                               ║');
    console.log('║                                                            ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    console.log('📊 Se poblaron los 13 programLogos:\n');
    PROGRAM_LOGOS.forEach((program, index) => {
      console.log(`   ${index + 1}. ${program.alt}`);
    });
    console.log('');

    console.log('🌐 Verifica en:');
    console.log('   • CMS: http://localhost:1337/admin/content-manager/single-types/api::home-page.home-page');
    console.log('   • Frontend: http://localhost:4200 (sección de Programas)\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main();
