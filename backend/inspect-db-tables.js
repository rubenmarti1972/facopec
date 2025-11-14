#!/usr/bin/env node
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'strapi.db');
const db = new Database(dbPath, { readonly: true });

try {
  // Obtener todas las tablas
  const tables = db.prepare(`
    SELECT name FROM sqlite_master
    WHERE type='table'
    ORDER BY name
  `).all();

  console.log('📋 Tablas en la base de datos:\n');
  tables.forEach(t => console.log(`  - ${t.name}`));
  console.log(`\nTotal: ${tables.length} tablas\n`);

  // Buscar tablas relacionadas con permisos
  const permTables = tables.filter(t =>
    t.name.includes('permission') ||
    t.name.includes('role') ||
    t.name.includes('user')
  );

  if (permTables.length > 0) {
    console.log('🔐 Tablas relacionadas con permisos/roles:\n');
    permTables.forEach(t => {
      console.log(`\n📊 ${t.name}:`);
      const info = db.pragma(`table_info(${t.name})`);
      info.forEach(col => console.log(`     ${col.name} (${col.type})`));
    });
  }

  db.close();
} catch (error) {
  console.error('Error:', error);
  db.close();
  process.exit(1);
}
