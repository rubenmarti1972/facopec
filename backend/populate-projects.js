#!/usr/bin/env node

/**
 * Script para poblar la colección de Projects con los datos del frontend
 * Ejecutar: node populate-projects.js (requiere Strapi ejecutándose)
 */

const { projectsContent } = require('./frontend-content');
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

async function fetchExistingProject(token, slug) {
  if (!slug) {
    return null;
  }

  const params = new URLSearchParams({
    'filters[slug][$eq]': slug,
    'pagination[pageSize]': '1',
    publicationState: 'preview'
  });

  const response = await strapi.apiRequest(`/projects?${params.toString()}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Fetch existing failed: ${response.status} - ${error}`);
  }

  const json = await response.json();
  return json.data?.[0] ?? null;
}

async function saveProject(token, project, existing) {
  const payload = { data: project };
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };

  if (existing) {
    const targetId = existing.documentId ?? existing.id;
    const response = await strapi.apiRequest(`/projects/${targetId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Update project failed: ${response.status} - ${error}`);
    }

    return response.json();
  }

  const response = await strapi.apiRequest('/projects', {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Create project failed: ${response.status} - ${error}`);
  }

  return response.json();
}

async function publishProject(token, documentId) {
  const response = await strapi.apiRequest(`/projects/${documentId}/actions/publish`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({})
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Publish project failed: ${response.status} - ${error}`);
  }

  return response.json();
}

async function main() {
  try {
    console.log('🔐 Autenticando...');
    const token = await login();
    console.log(`✅ Autenticación exitosa contra ${strapi.getBaseUrl()}\n`);

    console.log('📝 Poblando Projects...');

    for (let index = 0; index < projectsContent.length; index++) {
      const project = projectsContent[index];
      const existing = await fetchExistingProject(token, project.slug);
      const result = await saveProject(token, project, existing);
      const documentId = result?.data?.documentId ?? existing?.documentId ?? existing?.id;
      if (!documentId) {
        throw new Error(`No se obtuvo documentId para el proyecto ${project.title}`);
      }
      await publishProject(token, documentId);
      console.log(`   • Proyecto ${index + 1}/${projectsContent.length}: ${project.title}`);
    }

    console.log('✅ Proyectos publicados correctamente\n');
    console.log('🎉 ¡Listo! Colección Projects sincronizada con el frontend.');
    console.log('   🌐 Verifica en:');
    console.log(`      1. API: ${strapi.getBaseUrl()}/api/projects`);
    console.log('      2. Frontend: http://localhost:4200/proyectos\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\n💡 Verifica que:');
    console.error(`   • Strapi esté corriendo en ${strapi.getBaseUrl()}`);
    console.error('   • Las credenciales sean correctas');
    console.error('   • El content type project exista');
    process.exit(1);
  }
}

main();
