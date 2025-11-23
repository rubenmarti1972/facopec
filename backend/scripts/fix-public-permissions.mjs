#!/usr/bin/env node
/**
 * Script para verificar y arreglar permisos públicos del API
 *
 * Ejecutar con: node scripts/fix-public-permissions.mjs
 */

import { createStrapi } from '@strapi/strapi';
import path from 'path';

const appDir = path.resolve(process.cwd());
const distDir = path.join(appDir, 'dist');

async function fixPublicPermissions() {
  console.log('🔧 Verificando y arreglando permisos públicos...\n');

  const strapi = createStrapi({ appDir, distDir });

  try {
    await strapi.load();

    // Encontrar el rol público
    const publicRole = await strapi.db.query('plugin::users-permissions.role').findOne({
      where: { type: 'public' },
    });

    if (!publicRole) {
      console.error('❌ No se encontró el rol público');
      process.exit(1);
    }

    console.log('✅ Rol público encontrado (ID:', publicRole.id, ')\n');

    // APIs que deben ser públicas
    const apisToMakePublic = [
      { api: 'api::global.global', actions: ['find'] },
      { api: 'api::organization-info.organization-info', actions: ['find'] },
      { api: 'api::home-page.home-page', actions: ['find'] },
      { api: 'api::donations-page.donations-page', actions: ['find'] },
      { api: 'api::project.project', actions: ['find', 'findOne'] },
    ];

    // Obtener todos los permisos actuales
    const currentPermissions = await strapi.db.query('plugin::users-permissions.permission').findMany({
      where: { role: publicRole.id },
    });

    console.log('Permisos públicos actuales:', currentPermissions.length, '\n');

    // Crear o actualizar permisos
    for (const { api, actions } of apisToMakePublic) {
      for (const action of actions) {
        const existing = currentPermissions.find(
          p => p.action === `${api}.${action}`
        );

        if (existing && existing.enabled) {
          console.log(`✅ ${api}.${action} - ya habilitado`);
        } else if (existing && !existing.enabled) {
          // Actualizar para habilitar
          await strapi.db.query('plugin::users-permissions.permission').update({
            where: { id: existing.id },
            data: { enabled: true },
          });
          console.log(`🔄 ${api}.${action} - habilitado`);
        } else {
          // Crear nuevo permiso
          await strapi.db.query('plugin::users-permissions.permission').create({
            data: {
              action: `${api}.${action}`,
              role: publicRole.id,
              enabled: true,
            },
          });
          console.log(`✨ ${api}.${action} - creado y habilitado`);
        }
      }
    }

    console.log('\n✅ Permisos públicos configurados correctamente');
    console.log('\nAhora prueba estos endpoints en tu navegador:');
    console.log('  http://localhost:1337/api/global?populate=*');
    console.log('  http://localhost:1337/api/organization-info?populate=*');
    console.log('  http://localhost:1337/api/home-page?populate=deep');
    console.log('  http://localhost:1337/api/projects?populate=*');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await strapi.destroy();
  }
}

fixPublicPermissions();
