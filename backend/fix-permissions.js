#!/usr/bin/env node
/**
 * Script para habilitar permisos públicos directamente en la base de datos
 * Usa better-sqlite3 que ya está instalado en el proyecto
 */

const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Buscar la base de datos
const possiblePaths = [
  path.join(__dirname, '.tmp', 'data.db'),
  path.join(__dirname, '.strapi', 'data.db'),
  path.join(__dirname, 'data.db'),
];

let dbPath = null;
for (const p of possiblePaths) {
  if (fs.existsSync(p)) {
    dbPath = p;
    break;
  }
}

if (!dbPath) {
  console.error('❌ No se encontró la base de datos. Asegúrate de que Strapi se haya iniciado al menos una vez.');
  console.log('\nRutas buscadas:');
  possiblePaths.forEach(p => console.log(`  - ${p}`));
  process.exit(1);
}

console.log('🔧 Configurando permisos públicos en Strapi v5...\n');
console.log(`📂 Base de datos: ${dbPath}\n`);

try {
  const db = new Database(dbPath);

  // 1. Buscar el ID del rol "Public"
  const role = db.prepare(`SELECT id, name, type FROM up_roles WHERE type = 'public'`).get();

  if (!role) {
    console.error('❌ No se encontró el rol "Public"');

    // Intentar crear el rol Public si no existe
    console.log('⚙️  Intentando crear el rol Public...');
    const result = db.prepare(`
      INSERT INTO up_roles (name, description, type, created_at, updated_at)
      VALUES ('Public', 'Default role given to unauthenticated user.', 'public', datetime('now'), datetime('now'))
    `).run();

    const newRole = db.prepare(`SELECT id, name, type FROM up_roles WHERE type = 'public'`).get();
    if (!newRole) {
      console.error('❌ No se pudo crear el rol Public');
      db.close();
      process.exit(1);
    }
    console.log(`✅ Rol "Public" creado (ID: ${newRole.id})\n`);
  } else {
    console.log(`✅ Rol "Public" encontrado (ID: ${role.id})\n`);
  }

  const roleId = (role || db.prepare(`SELECT id FROM up_roles WHERE type = 'public'`).get()).id;

  // 2. Definir los permisos a habilitar
  const permissions = [
    'api::home-page.home-page.find',
    'api::global.global.find',
    'api::donations-page.donations-page.find',
    'api::organization-info.organization-info.find',
    'api::project.project.find',
    'api::project.project.findOne',
  ];

  console.log('📝 Configurando permisos:\n');

  permissions.forEach((action) => {
    // Verificar si el permiso existe
    const perm = db.prepare(`
      SELECT id, enabled FROM up_permissions WHERE action = ? AND role = ?
    `).get(action, roleId);

    if (perm) {
      // Actualizar permiso existente
      db.prepare(`UPDATE up_permissions SET enabled = 1 WHERE id = ?`).run(perm.id);
      console.log(`   ✅ ${action} → ${perm.enabled ? 'ya estaba' : ''} habilitado`);
    } else {
      // Crear nuevo permiso
      const now = new Date().toISOString();
      db.prepare(`
        INSERT INTO up_permissions (action, role, enabled, created_at, updated_at)
        VALUES (?, ?, 1, ?, ?)
      `).run(action, roleId, now, now);
      console.log(`   ✅ ${action} → creado y habilitado`);
    }
  });

  db.close();

  console.log('\n✅ Permisos públicos configurados correctamente\n');
  console.log('💡 Prueba acceder a las APIs públicas:');
  console.log('   curl http://localhost:1337/api/home-page');
  console.log('   curl http://localhost:1337/api/global');
  console.log('   curl http://localhost:1337/api/donations-page');
  console.log('   curl http://localhost:1337/api/organization-info');
  console.log('   curl http://localhost:1337/api/projects\n');
  console.log('⚠️  IMPORTANTE: Si Strapi está corriendo, reinícialo para que los cambios tomen efecto\n');

} catch (error) {
  console.error('❌ Error:', error.message);
  console.error(error);
  process.exit(1);
}
