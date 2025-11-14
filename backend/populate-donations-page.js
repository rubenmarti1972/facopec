#!/usr/bin/env node

/**
 * Script para poblar Donations Page con todos los datos reales del frontend
 * Ejecutar: node populate-donations-page.js (requiere Strapi ejecutándose)
 */

const { donationsPageContent } = require('./frontend-content');
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

async function updateDonationsPage(token) {
  const payload = {
    data: donationsPageContent
  };

  const response = await strapi.apiRequest('/donations-page', {
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

async function publishDonationsPage(token, documentId) {
  const response = await strapi.apiRequest('/donations-page/actions/publish', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ documentId })
  });

  if (!response.ok) {
    console.warn(`Publish via action failed: ${response.status}. Trying alternative method...`);

    const altResponse = await strapi.apiRequest('/donations-page', {
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

    console.log('📝 Poblando Donations Page con todos los datos del frontend...');
    const result = await updateDonationsPage(token);
    console.log('✅ Contenido actualizado\n');

    console.log('📤 Publicando contenido...');
    const documentId = result?.data?.documentId;
    if (!documentId) {
      throw new Error('No se recibió documentId tras la actualización.');
    }
    await publishDonationsPage(token, documentId);
    console.log('✅ Contenido publicado\n');

    console.log('🎉 ¡Listo! Donations Page poblada con todos los datos.');
    console.log('   📊 Datos migrados:');
    console.log(`      • Hero section con título y subtítulo personalizados`);
    console.log(`      • ${donationsPageContent.donationAmounts.length} montos predefinidos`);
    console.log(`      • ${donationsPageContent.metrics.length} métricas de impacto`);
    console.log(`      • ${donationsPageContent.highlights.length} tarjetas destacadas`);
    console.log(`      • ${donationsPageContent.stories.length} historias de impacto`);
    console.log(`      • ${donationsPageContent.supportActions.length} acciones de apoyo`);
    console.log(`      • ${donationsPageContent.paymentGateways.length} pasarelas de pago\n`);
    console.log('   🌐 Verifica en:');
    console.log(`      1. API: ${strapi.getBaseUrl()}/api/donations-page`);
    console.log('      2. Frontend: http://localhost:4200/donaciones\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\n💡 Verifica que:');
    console.error(`   • Strapi esté corriendo en ${strapi.getBaseUrl()}`);
    console.error('   • Las credenciales sean correctas');
    console.error('   • El content type donations-page exista');
    process.exit(1);
  }
}

main();
