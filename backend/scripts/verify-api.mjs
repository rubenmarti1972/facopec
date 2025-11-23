#!/usr/bin/env node
/**
 * Script para verificar que el API está retornando datos correctamente
 *
 * Ejecutar con: node scripts/verify-api.mjs
 * (Requiere que Strapi esté corriendo en http://localhost:1337)
 */

async function checkEndpoint(url, expectedFields) {
  try {
    const response = await fetch(url);
    const data = await response.json();

    console.log(`\n📡 ${url}`);
    console.log('Status:', response.status);

    if (response.status !== 200) {
      console.log('❌ Error:', data);
      return false;
    }

    console.log('✅ Respuesta OK');

    // Verificar campos esperados
    if (data.data) {
      console.log('   Datos recibidos:', JSON.stringify(data.data, null, 2).substring(0, 300) + '...');

      for (const field of expectedFields) {
        if (data.data[field] !== undefined && data.data[field] !== null) {
          console.log(`   ✅ Campo '${field}': presente`);
        } else {
          console.log(`   ❌ Campo '${field}': FALTANTE O NULL`);
        }
      }
    } else {
      console.log('❌ No hay data en la respuesta');
      console.log('   Respuesta:', JSON.stringify(data).substring(0, 200));
    }

    return true;
  } catch (error) {
    console.log(`❌ Error al consultar: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🔍 Verificando API de Strapi...\n');
  console.log('Asegúrate de que Strapi esté corriendo en http://localhost:1337\n');

  const checks = [
    {
      url: 'http://localhost:1337/api/global?populate=*',
      fields: ['siteName', 'navigation', 'logo'],
      name: 'Global'
    },
    {
      url: 'http://localhost:1337/api/organization-info?populate=*',
      fields: ['name', 'description'],
      name: 'Organization Info'
    },
    {
      url: 'http://localhost:1337/api/home-page?populate=deep',
      fields: ['hero', 'featuredPrograms'],
      name: 'Home Page'
    },
    {
      url: 'http://localhost:1337/api/projects?populate=*',
      fields: [],
      name: 'Projects'
    },
  ];

  console.log('='.repeat(60));

  for (const check of checks) {
    await checkEndpoint(check.url, check.fields);
  }

  console.log('\n' + '='.repeat(60));
  console.log('\n💡 Si ves campos FALTANTES O NULL:');
  console.log('   1. Verifica en Strapi Admin que los datos estén guardados');
  console.log('   2. Verifica que estén PUBLICADOS (publishedAt no null)');
  console.log('   3. Ejecuta: pnpm run seed (para recargar datos)');
  console.log('\n💡 Si ves errores 403 (Forbidden):');
  console.log('   1. Ve a Settings → Users & Permissions → Roles → Public');
  console.log('   2. Habilita find/findOne para cada Content Type');
}

main();
