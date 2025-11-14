#!/usr/bin/env node

/**
 * Script para poblar Organization Info con la data real del frontend
 * Ejecutar: node populate-organization-info.js (requiere Strapi ejecutándose)
 */

const BASE_URL = process.env.STRAPI_BASE_URL ?? 'http://localhost:1337';
const API_URL = `${BASE_URL}/api`;
const ADMIN_EMAIL = process.env.STRAPI_ADMIN_EMAIL ?? 'admin@facopec.org';
const ADMIN_PASSWORD = process.env.STRAPI_ADMIN_PASSWORD ?? 'Admin123456';

const { organizationInfoContent } = require('./frontend-content');

async function login() {
  const response = await fetch(`${BASE_URL}/admin/login`, {
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

async function updateOrganizationInfo(token) {
  const payload = {
    data: organizationInfoContent
  };

  const response = await fetch(`${API_URL}/organization-info`, {
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

async function publishOrganizationInfo(token, documentId) {
  const response = await fetch(`${API_URL}/organization-info/actions/publish`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ documentId })
  });

  if (!response.ok) {
    console.warn(`Publish via action failed: ${response.status}. Trying alternative method...`);

    const altResponse = await fetch(`${API_URL}/organization-info`, {
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
    console.log('✅ Autenticación exitosa\n');

    console.log('📝 Poblando Organization Info con datos del frontend...');
    const result = await updateOrganizationInfo(token);
    console.log('✅ Contenido actualizado\n');

    console.log('📤 Publicando contenido...');
    const documentId = result?.data?.documentId;
    if (!documentId) {
      throw new Error('No se recibió documentId tras la actualización.');
    }
    await publishOrganizationInfo(token, documentId);
    console.log('✅ Contenido publicado\n');

    console.log('🎉 ¡Listo! Organization Info sincronizado.');
    console.log('   📊 Datos migrados:');
    console.log('      • Misión, visión e historia');
    console.log(`      • ${organizationInfoContent.values.length} valores institucionales`);
    console.log('      • Información de contacto, dirección y horarios');
    console.log(`      • ${organizationInfoContent.socialLinks.length} enlaces sociales\n`);
    console.log('   🌐 Verifica en:');
    console.log(`      1. API: ${API_URL}/organization-info`);
    console.log('      2. Frontend: http://localhost:4200/nosotros\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\n💡 Verifica que:');
    console.error('   • Strapi esté corriendo en http://localhost:1337');
    console.error('   • Las credenciales sean correctas');
    console.error('   • El content type organization-info exista');
    process.exit(1);
  }
}

main();
