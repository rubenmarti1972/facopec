const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'strapi.db');
const db = new Database(dbPath);

console.log('\n📊 Estructura de la tabla home_pages:\n');

const tableInfo = db.prepare("PRAGMA table_info(home_pages)").all();
tableInfo.forEach(col => {
  console.log(`  ${col.name} (${col.type})`);
});

console.log('\n📄 Contenido actual:\n');
const currentData = db.prepare("SELECT * FROM home_pages WHERE id = 1").get();
if (currentData) {
  Object.keys(currentData).forEach(key => {
    const value = currentData[key];
    if (typeof value === 'string' && value.length > 100) {
      console.log(`  ${key}: ${value.substr(0, 100)}...`);
    } else {
      console.log(`  ${key}: ${value}`);
    }
  });
} else {
  console.log('  No hay datos en la tabla');
}

db.close();
