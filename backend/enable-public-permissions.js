#!/usr/bin/env node
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'strapi.db');
const db = new Database(dbPath);

console.log('🔧 Habilitando permisos públicos para la API...\n');

try {
  // Obtener el ID del rol Public
  const publicRole = db.prepare(`
    SELECT id FROM up_roles WHERE type = 'public'
  `).get();

  if (!publicRole) {
    console.error('❌ No se encontró el rol Public');
    process.exit(1);
  }

  console.log(`✅ Rol Public encontrado (ID: ${publicRole.id})\n`);

  // Permisos necesarios para los content types
  const permissions = [
    { action: 'api::global.global.find', subject: null },
    { action: 'api::global.global.update', subject: null },
    { action: 'api::home-page.home-page.find', subject: null },
    { action: 'api::home-page.home-page.update', subject: null },
    { action: 'api::donations-page.donations-page.find', subject: null },
    { action: 'api::donations-page.donations-page.update', subject: null },
    { action: 'api::organization-info.organization-info.find', subject: null },
    { action: 'api::organization-info.organization-info.update', subject: null },
  ];

  console.log('📝 Configurando permisos...\n');

  permissions.forEach(perm => {
    // Verificar si ya existe
    const existing = db.prepare(`
      SELECT id FROM up_permissions
      WHERE action = ? AND role_id = ?
    `).get(perm.action, publicRole.id);

    if (!existing) {
      const now = new Date().toISOString();
      db.prepare(`
        INSERT INTO up_permissions (action, subject, properties, conditions, role_id, created_at, updated_at)
        VALUES (?, ?, '{}', '[]', ?, ?, ?)
      `).run(perm.action, perm.subject, publicRole.id, now, now);

      console.log(`  ✅ ${perm.action}`);
    } else {
      console.log(`  ⏭️  ${perm.action} (ya existe)`);
    }
  });

  console.log('\n✅ Permisos públicos habilitados correctamente\n');
  console.log('Ahora puedes ejecutar los scripts de población:');
  console.log('  node populate-all-cms.js\n');

} catch (error) {
  console.error('❌ Error:', error.message);
  console.error(error);
} finally {
  db.close();
}
