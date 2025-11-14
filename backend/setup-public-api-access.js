#!/usr/bin/env node
const Database = require('better-sqlite3');
const crypto = require('crypto');
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'strapi.db');
const db = new Database(dbPath);

console.log('🔧 Configurando acceso público a la API de contenido...\n');

try {
  // 1. Obtener el rol Public
  const publicRole = db.prepare(`SELECT id, document_id FROM up_roles WHERE type = 'public'`).get();

  if (!publicRole) {
    console.error('❌ No se encontró el rol Public');
    process.exit(1);
  }

  console.log(`✅ Rol Public encontrado (ID: ${publicRole.id})\n`);

  // 2. Acciones que necesitamos habilitar
  const actions = [
    'api::global.global.find',
    'api::global.global.update',
    'api::home-page.home-page.find',
    'api::home-page.home-page.update',
    'api::donations-page.donations-page.find',
    'api::donations-page.donations-page.update',
    'api::organization-info.organization-info.find',
    'api::organization-info.organization-info.update',
  ];

  console.log('📝 Configurando permisos...\n');

  const now = Date.now();

  actions.forEach(action => {
    // Verificar si el permiso existe
    let permission = db.prepare(`SELECT id, document_id FROM up_permissions WHERE action = ?`).get(action);

    if (!permission) {
      // Crear el permiso
      const documentId = crypto.randomBytes(12).toString('base64url');
      const result = db.prepare(`
        INSERT INTO up_permissions (document_id, action, created_at, updated_at, published_at)
        VALUES (?, ?, ?, ?, ?)
      `).run(documentId, action, now, now, now);

      permission = {
        id: result.lastInsertRowid,
        document_id: documentId
      };

      console.log(`  ✅ Creado permiso: ${action}`);
    } else {
      console.log(`  ⏭️  Permiso ya existe: ${action}`);
    }

    // Verificar si ya está vinculado al rol Public
    const link = db.prepare(`
      SELECT * FROM up_permissions_role_lnk
      WHERE permission_id = ? AND role_id = ?
    `).get(permission.id, publicRole.id);

    if (!link) {
      // Obtener el próximo ord
      const maxOrd = db.prepare(`
        SELECT MAX(permission_ord) as max FROM up_permissions_role_lnk WHERE role_id = ?
      `).get(publicRole.id);

      const nextOrd = (maxOrd.max || 0) + 1;

      // Vincular el permiso al rol Public
      db.prepare(`
        INSERT INTO up_permissions_role_lnk (permission_id, role_id, permission_ord)
        VALUES (?, ?, ?)
      `).run(permission.id, publicRole.id, nextOrd);

      console.log(`  ✅ Vinculado al rol Public`);
    } else {
      console.log(`  ⏭️  Ya vinculado al rol Public`);
    }
  });

  console.log('\n' + '='.repeat(60));
  console.log('✅ Acceso público configurado correctamente');
  console.log('='.repeat(60));

  console.log('\n🚀 Ahora puedes poblar el CMS con:');
  console.log('   node populate-all-cms-public.js\n');

} catch (error) {
  console.error('\n❌ Error:', error.message);
  console.error(error);
} finally {
  db.close();
}
