#!/usr/bin/env node
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'strapi.db');
const db = new Database(dbPath);

console.log('🔧 LIMPIANDO Y ARREGLANDO SINGLE TYPES...\n');

try {
  const tables = ['globals', 'home_pages', 'organization_infos', 'donations_pages'];

  tables.forEach(table => {
    console.log(`━━━ ${table.toUpperCase()} ━━━`);

    // Obtener todas las entradas
    const all = db.prepare(`SELECT id, document_id, published_at FROM ${table}`).all();
    console.log(`Total de entradas: ${all.length}`);

    if (all.length === 0) {
      console.log('❌ No hay datos\n');
      return;
    }

    // Mantener solo la última entrada publicada
    const published = all.filter(e => e.published_at);
    const toKeep = published.length > 0 ? published[published.length - 1] : all[all.length - 1];

    console.log(`✅ Manteniendo ID: ${toKeep.id}`);

    // Eliminar las demás
    const toDelete = all.filter(e => e.id !== toKeep.id);
    toDelete.forEach(e => {
      db.prepare(`DELETE FROM ${table} WHERE id = ?`).run(e.id);
      console.log(`   🗑️  Eliminado ID: ${e.id}`);
    });

    // Asegurarse que la entrada mantenida tenga locale='es' y esté publicada
    const now = Date.now();
    db.prepare(`
      UPDATE ${table}
      SET locale = 'es',
          published_at = COALESCE(published_at, ${now}),
          updated_at = datetime('now')
      WHERE id = ?
    `).run(toKeep.id);

    console.log(`✅ Configurado: locale=es, publicado=sí\n`);
  });

  db.close();

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ BASE DE DATOS LIMPIA Y LISTA');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('⚠️  Ahora DEBES ejecutar el seed para poblar el contenido:\n');
  console.log('   SKIP_BOOTSTRAP_SEED=false FORCE_SEED=true npm run develop\n');

} catch (error) {
  console.error('❌ Error:', error.message);
  console.error(error);
  db.close();
  process.exit(1);
}
