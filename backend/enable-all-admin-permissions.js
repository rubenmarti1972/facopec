#!/usr/bin/env node
const Database = require('better-sqlite3');
const path = require('path');
const crypto = require('crypto');

const dbPath = path.join(__dirname, 'data', 'strapi.db');
const db = new Database(dbPath);

console.log('🔧 Habilitando TODOS los permisos para el Super Admin...\n');

try {
  // Obtener el rol super admin
  const superAdminRole = db.prepare(`
    SELECT id FROM admin_roles WHERE code = 'strapi-super-admin'
  `).get();

  if (!superAdminRole) {
    console.error('❌ No se encontró el rol super-admin');
    process.exit(1);
  }

  console.log(`✅ Rol Super Admin encontrado (ID: ${superAdminRole.id})\n`);

  // ELIMINAR TODOS los permisos existentes del super admin para empezar limpio
  db.prepare(`
    DELETE FROM admin_permissions_role_lnk WHERE role_id = ?
  `).run(superAdminRole.id);

  console.log('✅ Permisos antiguos eliminados\n');

  // Lista COMPLETA de permisos que necesita el super admin
  const allPermissions = [
    // Content Manager - Single Types
    'plugin::content-manager.single-types.configure-view',
    'plugin::content-manager.single-types.api::global.global.find',
    'plugin::content-manager.single-types.api::global.global.update',
    'plugin::content-manager.single-types.api::home-page.home-page.find',
    'plugin::content-manager.single-types.api::home-page.home-page.update',
    'plugin::content-manager.single-types.api::organization-info.organization-info.find',
    'plugin::content-manager.single-types.api::organization-info.organization-info.update',
    'plugin::content-manager.single-types.api::donations-page.donations-page.find',
    'plugin::content-manager.single-types.api::donations-page.donations-page.update',

    // Content Manager - Collection Types
    'plugin::content-manager.collection-types.configure-view',
    'plugin::content-manager.collection-types.api::project.project.create',
    'plugin::content-manager.collection-types.api::project.project.read',
    'plugin::content-manager.collection-types.api::project.project.update',
    'plugin::content-manager.collection-types.api::project.project.delete',
    'plugin::content-manager.collection-types.api::project.project.publish',

    // Upload / Media Library
    'plugin::upload.read',
    'plugin::upload.assets.create',
    'plugin::upload.assets.update',
    'plugin::upload.assets.download',
    'plugin::upload.assets.copy-link',
    'plugin::upload.configure-view',
    'plugin::upload.settings.read',

    // Content Type Builder
    'plugin::content-type-builder.read',

    // Settings
    'admin::roles.create',
    'admin::roles.read',
    'admin::roles.update',
    'admin::roles.delete',
    'admin::users.create',
    'admin::users.read',
    'admin::users.update',
    'admin::users.delete',
    'admin::api-tokens.access',
    'admin::api-tokens.create',
    'admin::api-tokens.read',
    'admin::api-tokens.update',
    'admin::api-tokens.delete',
    'admin::api-tokens.regenerate',
    'admin::transfer.tokens.access',
    'admin::transfer.tokens.create',
    'admin::transfer.tokens.read',
    'admin::transfer.tokens.update',
    'admin::transfer.tokens.regenerate',
    'admin::transfer.tokens.delete',
    'admin::project-settings.read',
    'admin::project-settings.update',
    'admin::webhooks.create',
    'admin::webhooks.read',
    'admin::webhooks.update',
    'admin::webhooks.delete',

    // Marketplace
    'admin::marketplace.read',
    'admin::marketplace.plugins.install',
    'admin::marketplace.plugins.uninstall',
  ];

  console.log('📝 Creando permisos:\n');

  let created = 0;
  const now = new Date().toISOString();

  allPermissions.forEach(action => {
    const docId = crypto.randomBytes(12).toString('base64url');

    try {
      const result = db.prepare(`
        INSERT INTO admin_permissions (document_id, action, subject, created_at, updated_at, published_at)
        VALUES (?, ?, NULL, ?, ?, ?)
      `).run(docId, action, now, now, now);

      db.prepare(`
        INSERT INTO admin_permissions_role_lnk (permission_id, role_id)
        VALUES (?, ?)
      `).run(result.lastInsertRowid, superAdminRole.id);

      created++;
      console.log(`   ✅ ${action}`);
    } catch (error) {
      // Si ya existe, lo ignoramos
      console.log(`   ⚪ ${action} (ya existe)`);
    }
  });

  db.close();

  console.log(`\n✅ Se crearon ${created} permisos nuevos\n`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ PERMISOS COMPLETOS CONFIGURADOS');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('Ahora el Super Admin puede ver y editar TODO:\n');
  console.log('  ✅ Configuración global (menú/header)');
  console.log('  ✅ Página de inicio (home)');
  console.log('  ✅ Organization Info (nosotros)');
  console.log('  ✅ Página de donaciones');
  console.log('  ✅ Projects');
  console.log('  ✅ Media Library');
  console.log('  ✅ Settings\n');
  console.log('⚠️  Reinicia el servidor: npm run develop\n');

} catch (error) {
  console.error('❌ Error:', error.message);
  console.error(error);
  db.close();
  process.exit(1);
}
