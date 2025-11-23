#!/usr/bin/env node
/**
 * Script de diagnóstico para verificar la conexión con Strapi
 * y el estado del contenido publicado
 */

const http = require('http');

const STRAPI_URL = 'http://localhost:1337';
const endpoints = [
  '/api/home-page',
  '/api/global',
  '/api/donations-page',
  '/api/organization-info'
];

console.log('🔍 Verificando conexión con Strapi...\n');
console.log(`📍 URL: ${STRAPI_URL}\n`);

function testEndpoint(endpoint) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 1337,
      path: endpoint,
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve({
          endpoint,
          status: res.statusCode,
          success: res.statusCode === 200,
          data: data ? JSON.parse(data) : null
        });
      });
    });

    req.on('error', (error) => {
      resolve({
        endpoint,
        status: 'ERROR',
        success: false,
        error: error.message
      });
    });

    req.setTimeout(20000, () => {
      req.destroy();
      resolve({
        endpoint,
        status: 'TIMEOUT',
        success: false,
        error: 'Timeout después de 5 segundos'
      });
    });

    req.end();
  });
}

async function runTests() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  for (const endpoint of endpoints) {
    const result = await testEndpoint(endpoint);

    console.log(`📌 Endpoint: ${endpoint}`);
    console.log(`   Status: ${result.status}`);

    if (result.success) {
      console.log('   ✅ Contenido publicado y accesible\n');

      // Mostrar preview del contenido
      if (result.data && result.data.data) {
        const attributes = result.data.data.attributes || result.data.data;
        const keys = Object.keys(attributes).slice(0, 5);
        console.log('   📄 Primeros campos:');
        keys.forEach(key => {
          const value = attributes[key];
          const preview = typeof value === 'string'
            ? value.substring(0, 50) + (value.length > 50 ? '...' : '')
            : typeof value === 'object' && value !== null
            ? '[Object/Array]'
            : value;
          console.log(`      - ${key}: ${preview}`);
        });
        console.log('');
      }
    } else {
      console.log(`   ❌ Error: ${result.error || 'No se pudo acceder'}`);

      if (result.status === 404) {
        console.log('   💡 El contenido puede no estar publicado o no existe\n');
      } else if (result.status === 403) {
        console.log('   💡 Permisos no configurados para Public role\n');
      } else {
        console.log('   💡 Verifica que Strapi esté corriendo en localhost:1337\n');
      }
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  }

  console.log('\n📋 Resumen:');
  console.log('   Si ves ❌ 404 → El contenido NO está publicado');
  console.log('   Si ves ❌ 403 → Permisos no configurados');
  console.log('   Si ves ❌ TIMEOUT/ERROR → Strapi no está corriendo');
  console.log('   Si ves ✅ → Todo funciona correctamente\n');
}

runTests().catch(console.error);
