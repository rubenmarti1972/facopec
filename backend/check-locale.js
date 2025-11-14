#!/usr/bin/env node
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'strapi.db');
const db = new Database(dbPath, { readonly: true });

console.log('🔍 Verificando locale:\n');

const tables = ['globals', 'home_pages', 'organization_infos', 'donations_pages'];

tables.forEach(table => {
  console.log(`━━━ ${table.toUpperCase()} ━━━`);
  const data = db.prepare(`SELECT id, locale, published_at FROM ${table}`).all();
  data.forEach(row => {
    console.log(`   ID: ${row.id} | Locale: ${row.locale || 'NULL'} | Published: ${row.published_at ? 'Sí' : 'No'}`);
  });
  console.log('');
});

db.close();
