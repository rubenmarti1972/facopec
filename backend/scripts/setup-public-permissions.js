/**
 * Script para configurar permisos públicos en Strapi v5
 * Ejecutar con: node scripts/setup-public-permissions.js
 */

const path = require('path');

// Configurar el entorno de Strapi
process.chdir(path.join(__dirname, '..'));

async function setupPublicPermissions() {
  console.log('🔧 Configurando permisos públicos en Strapi...\n');

  try {
    // Cargar Strapi
    const strapi = await require('@strapi/strapi').default({
      appDir: process.cwd(),
      distDir: './dist',
      autoReload: false,
    }).load();

    // Buscar el rol "Public"
    const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
      where: { type: 'public' }
    });

    if (!publicRole) {
      console.error('❌ No se encontró el rol "Public"');
      await strapi.destroy();
      process.exit(1);
    }

    console.log(`✅ Rol "Public" encontrado (ID: ${publicRole.id})\n`);

    // Permisos a configurar
    const permissionsToEnable = [
      { controller: 'home-page', action: 'find' },
      { controller: 'global', action: 'find' },
      { controller: 'donations-page', action: 'find' },
      { controller: 'organization-info', action: 'find' },
      { controller: 'project', action: 'find' },
      { controller: 'project', action: 'findOne' },
    ];

    console.log('📝 Configurando permisos:\n');

    for (const perm of permissionsToEnable) {
      try {
        // Buscar el permiso existente
        const existingPermission = await strapi.query('plugin::users-permissions.permission').findOne({
          where: {
            action: `api::${perm.controller}.${perm.controller}.${perm.action}`,
            role: publicRole.id,
          }
        });

        if (existingPermission) {
          // Actualizar el permiso existente
          await strapi.query('plugin::users-permissions.permission').update({
            where: { id: existingPermission.id },
            data: { enabled: true }
          });
          console.log(`   ✅ ${perm.controller}.${perm.action} → habilitado`);
        } else {
          // Crear el permiso si no existe
          await strapi.query('plugin::users-permissions.permission').create({
            data: {
              action: `api::${perm.controller}.${perm.controller}.${perm.action}`,
              role: publicRole.id,
              enabled: true,
            }
          });
          console.log(`   ✅ ${perm.controller}.${perm.action} → creado y habilitado`);
        }
      } catch (error) {
        console.log(`   ⚠️  ${perm.controller}.${perm.action} → error: ${error.message}`);
      }
    }

    console.log('\n✅ Permisos públicos configurados correctamente\n');
    console.log('💡 Ahora puedes acceder a las APIs públicas sin autenticación:');
    console.log('   - http://localhost:1337/api/home-page');
    console.log('   - http://localhost:1337/api/global');
    console.log('   - http://localhost:1337/api/donations-page');
    console.log('   - http://localhost:1337/api/organization-info');
    console.log('   - http://localhost:1337/api/projects\n');

    await strapi.destroy();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

setupPublicPermissions();
