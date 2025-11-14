#!/usr/bin/env node

/**
 * Script para poblar Global Settings con la data real del frontend
 * Ejecutar: node populate-global-settings.js (requiere Strapi ejecutándose)
 */

const { globalSettingsContent } = require('./frontend-content');
const {
  DEFAULT_ADMIN_EMAIL,
  DEFAULT_ADMIN_PASSWORD,
  createStrapiRequestContext
} = require('./strapi-http');

const strapi = createStrapiRequestContext();

const ADMIN_EMAIL = DEFAULT_ADMIN_EMAIL;
const ADMIN_PASSWORD = DEFAULT_ADMIN_PASSWORD;

async function login() {
  const response = await strapi.adminRequest('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Login failed: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  return data.data.token;
}

async function updateGlobalSettings(token) {
  const payload = {
    data: globalSettingsContent
  };

  const response = await strapi.adminRequest('/content-manager/single-types/api::global.global', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Update failed: ${response.status} - ${error}`);
  }

  return response.json();
}

async function publishGlobalSettings(token, documentId) {
  const response = await strapi.apiRequest('/global/actions/publish', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ documentId })
  });

  if (!response.ok) {
    console.warn(`Publish via action failed: ${response.status}. Trying alternative method...`);

    const altResponse = await strapi.apiRequest('/global', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        data: { publishedAt: new Date().toISOString() }
      })
    });

    if (!altResponse.ok) {
      throw new Error(`Alternative publish also failed: ${altResponse.status}`);
    }

    return altResponse.json();
  }

  return response.json();
}

async function main() {
  try {
    console.log('🔐 Autenticando...');
    const token = await login();
    console.log(`✅ Autenticación exitosa contra ${strapi.getBaseUrl()}\n`);

    console.log('📝 Poblando Global Settings con datos del frontend...');
    const result = await updateGlobalSettings(token);
    console.log('✅ Contenido actualizado\n');

    console.log('📤 Publicando contenido...');
    const documentId = result?.data?.documentId;
    if (!documentId) {
      throw new Error('No se recibió documentId tras la actualización.');
    }
    await publishGlobalSettings(token, documentId);
    console.log('✅ Contenido publicado\n');

    console.log('🎉 ¡Listo! Global Settings sincronizado con el frontend.');
    console.log('   📊 Datos migrados:');
    console.log(`      • ${globalSettingsContent.navigation.length} elementos de navegación`);
    console.log(`      • ${globalSettingsContent.socialLinks.length} enlaces sociales`);
    console.log('      • Nombre y URL de la aplicación\n');
    console.log('   🌐 Verifica en:');
    console.log(`      1. API: ${strapi.getBaseUrl()}/api/global`);
    console.log('      2. Frontend: http://localhost:4200 (header y footer)\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\n💡 Verifica que:');
    console.error(`   • Strapi esté corriendo en ${strapi.getBaseUrl()}`);
    console.error('   • Las credenciales sean correctas');
    console.error('   • El content type global exista');
    process.exit(1);
  }
}

main();
