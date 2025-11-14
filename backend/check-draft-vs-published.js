#!/usr/bin/env node
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'strapi.db');
const db = new Database(dbPath, { readonly: true });

console.log('🔍 Comparando versiones DRAFT vs PUBLISHED:\n');

const tables = [
  { name: 'Globals', table: 'globals', field: 'siteName' },
  { name: 'Home Pages', table: 'home_pages', field: 'id' },
  { name: 'Organization Infos', table: 'organization_infos', field: 'name' },
  { name: 'Donations Pages', table: 'donations_pages', field: 'heroTitle' }
];

tables.forEach(t => {
  console.log(`━━━ ${t.name} ━━━`);
  const rows = db.prepare(`
    SELECT id, document_id, ${t.field}, published_at,
           CASE WHEN published_at IS NULL THEN 'DRAFT' ELSE 'PUBLISHED' END as status
    FROM ${t.table}
    WHERE id IN (5, 6)
    ORDER BY id
  `).all();

  rows.forEach(row => {
    console.log(`   ${row.status.padEnd(10)} | ID: ${row.id} | ${t.field}: ${row[t.field] || '(empty)'}`);
  });
  console.log('');
});

db.close();
