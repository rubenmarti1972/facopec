#!/usr/bin/env node
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'strapi.db');
const db = new Database(dbPath, { readonly: true });

console.log('🔍 Estado de publicación:\n');

try {
  const tables = [
    { name: 'Globals', table: 'globals' },
    { name: 'Home Pages', table: 'home_pages' },
    { name: 'Organization Infos', table: 'organization_infos' },
    { name: 'Donations Pages', table: 'donations_pages' },
    { name: 'Projects', table: 'projects' }
  ];

  tables.forEach(t => {
    const data = db.prepare(`SELECT id, document_id, published_at, created_at, updated_at FROM ${t.table}`).all();
    console.log(`━━━ ${t.name} ━━━`);
    if (data.length === 0) {
      console.log('   ❌ Sin datos\n');
    } else {
      data.forEach(row => {
        console.log(`   ID: ${row.id} | Doc: ${row.document_id}`);
        console.log(`   Publicado: ${row.published_at ? '✅ SÍ - ' + row.published_at : '❌ NO (draft)'}`);
        console.log('');
      });
    }
  });

  db.close();
} catch (error) {
  console.error('❌ Error:', error.message);
  db.close();
  process.exit(1);
}
