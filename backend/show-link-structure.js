#!/usr/bin/env node
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'strapi.db');
const db = new Database(dbPath);

console.log('📊 Estructura de up_permissions_role_lnk:\n');
const structure = db.prepare("PRAGMA table_info(up_permissions_role_lnk)").all();
structure.forEach(col => console.log(`  ${col.name} (${col.type})`));

console.log('\n📋 Ejemplos de vínculos:\n');
const samples = db.prepare(`SELECT * FROM up_permissions_role_lnk LIMIT 5`).all();
samples.forEach((link, i) => {
  console.log(`\nVínculo ${i + 1}:`);
  Object.entries(link).forEach(([key, value]) => {
    console.log(`  ${key}: ${value}`);
  });
});

db.close();
