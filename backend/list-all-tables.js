const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'strapi.db');
const db = new Database(dbPath);

console.log('\n📊 Todas las tablas en la base de datos:\n');

const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").all();
tables.forEach(table => {
  console.log(`  ${table.name}`);
});

console.log('\n\n📊 Tablas relacionadas con home_page o componentes:\n');

const relevantTables = tables.filter(t =>
  t.name.includes('home') ||
  t.name.includes('component') ||
  t.name.includes('link')
);

relevantTables.forEach(table => {
  console.log(`\n  Table: ${table.name}`);
  const count = db.prepare(`SELECT COUNT(*) as count FROM ${table.name}`).get();
  console.log(`    Rows: ${count.count}`);
});

db.close();
