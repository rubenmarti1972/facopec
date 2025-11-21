import { existsSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import Database from 'better-sqlite3';

const backendRoot = resolve(new URL('.', import.meta.url).pathname, '..');
const dbPath = resolve(backendRoot, 'data/strapi.db');
const dumpPath = resolve(backendRoot, 'data/strapi.sql');

function main() {
  try {
    if (!existsSync(dbPath)) {
      console.error(`❌ No se encontró la base de datos en ${dbPath}`);
      process.exitCode = 1;
      return;
    }

    const db = new Database(dbPath, { readonly: true });

    // Generar el dump SQL
    const sqlDump = db.prepare("SELECT sql || ';' as sql FROM sqlite_master WHERE sql NOT NULL").all();
    const data = db.prepare("SELECT * FROM sqlite_master WHERE type='table'").all();

    let fullDump = '';

    // Agregar comandos iniciales
    fullDump += 'PRAGMA foreign_keys=OFF;\n';
    fullDump += 'BEGIN TRANSACTION;\n\n';

    // Agregar esquema (CREATE TABLE statements)
    sqlDump.forEach(row => {
      if (row.sql && !row.sql.includes('sqlite_sequence')) {
        fullDump += row.sql + '\n';
      }
    });

    fullDump += '\n';

    // Exportar datos de cada tabla
    data.forEach(table => {
      if (table.name.startsWith('sqlite_')) return;

      const rows = db.prepare(`SELECT * FROM "${table.name}"`).all();
      if (rows.length === 0) return;

      rows.forEach(row => {
        const columns = Object.keys(row);
        const values = Object.values(row).map(val => {
          if (val === null) return 'NULL';
          if (typeof val === 'number') return val;
          // Escape single quotes in strings
          return "'" + String(val).replace(/'/g, "''") + "'";
        });

        fullDump += `INSERT INTO "${table.name}" (${columns.map(c => `"${c}"`).join(', ')}) VALUES (${values.join(', ')});\n`;
      });

      fullDump += '\n';
    });

    fullDump += 'COMMIT;\n';

    // Guardar el dump
    writeFileSync(dumpPath, fullDump, 'utf8');

    // Estadísticas
    const { count: homeCount } = db.prepare('select count(*) as count from home_pages').get();
    const { count: globalCount } = db.prepare('select count(*) as count from globals').get();
    const { count: donationCount } = db.prepare('select count(*) as count from donations_pages').get();
    const { count: filesCount } = db.prepare('select count(*) as count from files').get();
    const { count: programsCount } = db.prepare('select count(*) as count from components_home_program_cards').get();

    db.close();

    console.log(`✅ SQL dump generado en ${dumpPath}`);
    console.log(`   home_pages: ${homeCount} registro(s)`);
    console.log(`   globals: ${globalCount} registro(s)`);
    console.log(`   donations_pages: ${donationCount} registro(s)`);
    console.log(`   files: ${filesCount} archivo(s)`);
    console.log(`   program_cards: ${programsCount} tarjeta(s)`);
  } catch (error) {
    console.error('❌ Error al generar el dump SQL:', error.message ?? error);
    process.exitCode = 1;
  }
}

main();
