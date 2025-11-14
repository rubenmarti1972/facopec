#!/usr/bin/env node

/**
 * Script para poblar TODO el CMS ejecutándose dentro del contexto de Strapi
 * Ejecutar: cd backend && node populate-cms-direct.js
 */

const {
  globalSettingsContent,
  organizationInfoContent,
  homePageContent,
  donationsPageContent,
  projectsContent
} = require('./frontend-content');

async function bootstrap() {
  const Strapi = require('@strapi/strapi');
  const strapi = await Strapi.createStrapi().load();

  try {
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║                                                            ║');
    console.log('║       🚀 POBLANDO TODO EL CMS CON DATOS DEL FRONTEND       ║');
    console.log('║                                                            ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    // 1. GLOBAL SETTINGS
    console.log('📝 1/5 Poblando Global Settings...');
    await strapi.documents('api::global.global').createOrUpdate({
      documentId: await getDocumentId(strapi, 'api::global.global'),
      data: clone(globalSettingsContent),
      status: 'published'
    });
    console.log('✅ Global Settings actualizado\n');

    // 2. ORGANIZATION INFO
    console.log('📝 2/5 Poblando Organization Info...');
    await strapi.documents('api::organization-info.organization-info').createOrUpdate({
      documentId: await getDocumentId(strapi, 'api::organization-info.organization-info'),
      data: clone(organizationInfoContent),
      status: 'published'
    });
    console.log('✅ Organization Info actualizado\n');

    // 3. HOME PAGE
    console.log('📝 3/5 Poblando Home Page...');
    await strapi.documents('api::home-page.home-page').createOrUpdate({
      documentId: await getDocumentId(strapi, 'api::home-page.home-page'),
      data: clone(homePageContent),
      status: 'published'
    });
    console.log('✅ Home Page actualizado\n');

    // 4. DONATIONS PAGE
    console.log('📝 4/5 Poblando Donations Page...');
    await strapi.documents('api::donations-page.donations-page').createOrUpdate({
      documentId: await getDocumentId(strapi, 'api::donations-page.donations-page'),
      data: clone(donationsPageContent),
      status: 'published'
    });
    console.log('✅ Donations Page actualizada\n');

    // 5. PROJECTS COLLECTION
    console.log('📝 5/5 Poblando Projects (colección)...');
    for (let index = 0; index < projectsContent.length; index++) {
      const project = projectsContent[index];
      const documentId = await getProjectDocumentId(strapi, project.slug);
      await strapi.documents('api::project.project').createOrUpdate({
        documentId,
        data: clone(project),
        status: 'published'
      });
      console.log(`   • Proyecto ${index + 1}/${projectsContent.length}: ${project.title}`);
    }
    console.log('✅ Projects actualizados\n');

    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║                                                            ║');
    console.log('║                  🎉 ¡PROCESO COMPLETADO!                   ║');
    console.log('║                                                            ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    console.log('📊 RESUMEN DE CONTENIDO MIGRADO:');
    console.log('   • Global Settings con navegación y redes sociales');
    console.log('   • Organization Info con misión, visión, valores y contacto');
    console.log('   • Home Page completa con hero, actividades, programas y eventos');
    console.log('   • Donations Page con montos, métricas, historias y pasarelas');
    console.log(`   • ${projectsContent.length} proyectos publicados\n`);

    console.log('🌐 Verifica en:');
    console.log('   • Frontend: http://localhost:4200');
    console.log('   • Admin:    http://localhost:1337/admin\n');
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error);
  } finally {
    await strapi.destroy();
  }
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

async function getDocumentId(strapi, uid) {
  try {
    const existing = await strapi.documents(uid).findMany({ limit: 1 });
    return existing[0]?.documentId ?? null;
  } catch (error) {
    console.warn(`⚠️  No se pudo obtener documentId para ${uid}:`, error.message);
    return null;
  }
}

async function getProjectDocumentId(strapi, slug) {
  if (!slug) {
    return null;
  }

  const result = await strapi
    .documents('api::project.project')
    .findMany({ filters: { slug: { $eq: slug } }, limit: 1 });

  return result[0]?.documentId ?? null;
}

bootstrap();
