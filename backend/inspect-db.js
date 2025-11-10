#!/usr/bin/env node
/**
 * Script para inspeccionar la estructura de la base de datos de Strapi
 */

const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

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
  console.error('❌ No se encontró la base de datos');
  process.exit(1);
}

console.log('🔍 Inspeccionando base de datos de Strapi\n');
console.log(`📂 Ruta: ${dbPath}\n`);

try {
  const db = new Database(dbPath, { readonly: true });

  // Listar todas las tablas
  const tables = db.prepare(`
    SELECT name FROM sqlite_master
    WHERE type='table'
    ORDER BY name
  `).all();

  console.log('📋 Tablas encontradas:\n');
  tables.forEach(({ name }) => {
    console.log(`   - ${name}`);
  });

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Buscar tablas relacionadas con roles y permisos
  const roleTables = tables.filter(({ name }) =>
    name.includes('role') || name.includes('permission') || name.includes('user')
  );

  if (roleTables.length > 0) {
    console.log('🔐 Tablas de roles y permisos:\n');
    roleTables.forEach(({ name }) => {
      const count = db.prepare(`SELECT COUNT(*) as count FROM "${name}"`).get();
      console.log(`   - ${name} (${count.count} registros)`);

      // Mostrar estructura de la tabla
      const columns = db.prepare(`PRAGMA table_info("${name}")`).all();
      console.log('     Columnas:');
      columns.forEach(col => {
        console.log(`       • ${col.name} (${col.type})`);
      });
      console.log('');
    });
  }

  // Si existe una tabla de roles, mostrar los roles
  const possibleRoleTables = ['up_roles', 'strapi_roles', 'admin_roles', 'roles'];
  for (const tableName of possibleRoleTables) {
    const exists = tables.find(t => t.name === tableName);
    if (exists) {
      console.log(`\n🎭 Roles en la tabla "${tableName}":\n`);
      const roles = db.prepare(`SELECT * FROM "${tableName}"`).all();
      roles.forEach(role => {
        console.log(`   ID: ${role.id}`);
        console.log(`   Nombre: ${role.name || role.type || 'N/A'}`);
        console.log(`   Tipo: ${role.type || 'N/A'}`);
        console.log('   ---');
      });
    }
  }

  db.close();
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
