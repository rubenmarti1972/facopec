#!/usr/bin/env node
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'strapi.db');
const db = new Database(dbPath);

console.log('🔧 Configurando TODOS los permisos...\n');

try {
  // 1. Obtener rol Public
  const publicRole = db.prepare(`SELECT id FROM up_roles WHERE type = 'public'`).get();
  if (!publicRole) {
    console.error('❌ No se encontró el rol Public');
    process.exit(1);
  }

  // 2. Obtener rol Super Admin
  const superAdminRole = db.prepare(`SELECT id FROM admin_roles WHERE code = 'strapi-super-admin'`).get();
  if (!superAdminRole) {
    console.error('❌ No se encontró el rol Super Admin');
    process.exit(1);
  }

  console.log('✅ Roles encontrados\n');

  // 3. Habilitar permisos públicos para las APIs
  const publicPermissions = [
    'api::home-page.home-page.find',
    'api::global.global.find',
    'api::donations-page.donations-page.find',
    'api::organization-info.organization-info.find',
    'api::project.project.find',
    'api::project.project.findOne',
  ];

  console.log('📝 Configurando permisos públicos:\n');

  publicPermissions.forEach(action => {
    // Verificar si existe el permiso con este action y vinculado al rol public
    const existing = db.prepare(`
      SELECT p.id FROM up_permissions p
      INNER JOIN up_permissions_role_lnk l ON p.id = l.permission_id
      WHERE p.action = ? AND l.role_id = ?
    `).get(action, publicRole.id);

    if (!existing) {
      const now = new Date().toISOString();
      const docId = require('crypto').randomBytes(12).toString('base64url');

      const result = db.prepare(`
        INSERT INTO up_permissions (document_id, action, created_at, updated_at, published_at)
        VALUES (?, ?, ?, ?, ?)
      `).run(docId, action, now, now, now);

      db.prepare(`
        INSERT INTO up_permissions_role_lnk (permission_id, role_id)
        VALUES (?, ?)
      `).run(result.lastInsertRowid, publicRole.id);

      console.log(`   ✅ ${action} (creado)`);
    } else {
      console.log(`   ✅ ${action}`);
    }
  });

  // 4. Habilitar TODOS los permisos para el Super Admin
  console.log('\n📝 Configurando permisos de Super Admin:\n');

  const adminActions = [
    'api::home-page.home-page.find',
    'api::home-page.home-page.update',
    'api::global.global.find',
    'api::global.global.update',
    'api::donations-page.donations-page.find',
    'api::donations-page.donations-page.update',
    'api::organization-info.organization-info.find',
    'api::organization-info.organization-info.update',
    'api::project.project.find',
    'api::project.project.findOne',
    'api::project.project.create',
    'api::project.project.update',
    'api::project.project.delete',
    'plugin::upload.read',
    'plugin::upload.assets.create',
    'plugin::upload.assets.update',
    'plugin::upload.assets.download',
    'plugin::upload.assets.copy-link',
  ];

  adminActions.forEach(action => {
    const existing = db.prepare(`
      SELECT p.id FROM admin_permissions p
      WHERE p.action = ?
      AND EXISTS (SELECT 1 FROM admin_permissions_role_lnk l WHERE l.permission_id = p.id AND l.role_id = ?)
    `).get(action, superAdminRole.id);

    if (!existing) {
      const now = new Date().toISOString();
      const docId = require('crypto').randomBytes(12).toString('base64url');

      const result = db.prepare(`
        INSERT INTO admin_permissions (document_id, action, subject, created_at, updated_at, published_at)
        VALUES (?, ?, NULL, ?, ?, ?)
      `).run(docId, action, now, now, now);

      db.prepare(`
        INSERT INTO admin_permissions_role_lnk (permission_id, role_id)
        VALUES (?, ?)
      `).run(result.lastInsertRowid, superAdminRole.id);

      console.log(`   ✅ ${action} (creado)`);
    } else {
      console.log(`   ✅ ${action}`);
    }
  });

  db.close();

  console.log('\n✅ Todos los permisos configurados correctamente\n');
  console.log('⚠️  Reinicia el servidor: npm run develop\n');

} catch (error) {
  console.error('❌ Error:', error.message);
  console.error(error);
  db.close();
  process.exit(1);
}
