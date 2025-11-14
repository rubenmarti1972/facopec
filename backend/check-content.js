#!/usr/bin/env node
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'strapi.db');
const db = new Database(dbPath, { readonly: true });

console.log('🔍 Contenido en la base de datos:\n');

try {
  // Verificar Single Types
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('SINGLE TYPES:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const singleTypes = [
    { name: 'Global (Navigation, Logo)', table: 'globals' },
    { name: 'Home Page', table: 'home_pages' },
    { name: 'Organization Info', table: 'organization_infos' },
    { name: 'Donations Page', table: 'donations_pages' }
  ];

  singleTypes.forEach(type => {
    const count = db.prepare(`SELECT COUNT(*) as count FROM ${type.table}`).get();
    const published = db.prepare(`SELECT COUNT(*) as count FROM ${type.table} WHERE published_at IS NOT NULL`).get();
    console.log(`${count.count > 0 ? '✅' : '❌'} ${type.name}:`);
    console.log(`   Total: ${count.count} | Publicados: ${published.count}`);
  });

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('COLLECTION TYPES:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const projects = db.prepare(`SELECT COUNT(*) as count FROM projects`).get();
  const publishedProjects = db.prepare(`SELECT COUNT(*) as count FROM projects WHERE published_at IS NOT NULL`).get();
  console.log(`${projects.count > 0 ? '✅' : '❌'} Projects:`);
  console.log(`   Total: ${projects.count} | Publicados: ${publishedProjects.count}`);

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('ARCHIVOS SUBIDOS:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const files = db.prepare(`SELECT COUNT(*) as count FROM files`).get();
  console.log(`   Total de archivos: ${files.count}`);

  db.close();
} catch (error) {
  console.error('❌ Error:', error.message);
  db.close();
  process.exit(1);
}
