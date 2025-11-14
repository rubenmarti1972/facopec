#!/usr/bin/env node
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'strapi.db');
const db = new Database(dbPath);

console.log('📊 Tablas en la base de datos:\n');

const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").all();

const contentTables = tables.filter(t =>
  t.name.includes('global') ||
  t.name.includes('home') ||
  t.name.includes('donation') ||
  t.name.includes('organization')
);

console.log('Tablas de contenido relevantes:');
contentTables.forEach(t => console.log('  -', t.name));

console.log('\nEstructura de home_pages:');
const homeStructure = db.prepare("PRAGMA table_info(home_pages)").all();
homeStructure.forEach(col => console.log(`  ${col.name} (${col.type})`));

db.close();
