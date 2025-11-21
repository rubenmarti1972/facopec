import { existsSync, readFileSync, rmSync } from 'fs';
import { resolve } from 'path';
import Database from 'better-sqlite3';

const backendRoot = resolve(new URL('.', import.meta.url).pathname, '..');
const dbPath = resolve(backendRoot, 'data/strapi.db');
const dumpPath = resolve(backendRoot, 'data/strapi.sql');

function main() {
  try {
    const skipIfPresent = process.argv.includes('--if-missing');

    if (skipIfPresent && existsSync(dbPath)) {
      console.log(`ℹ️  Se encontró ${dbPath}; se omite la restauración (usa sin --if-missing para forzarla).`);
      return;
    }

    rmSync(dbPath, { force: true });
    const sqlDump = readFileSync(dumpPath, 'utf8');

    const db = new Database(dbPath);
    db.exec('PRAGMA foreign_keys=OFF;');
    db.exec(sqlDump);

    const { count: homeCount } = db.prepare('select count(*) as count from home_pages').get();
    const { count: globalCount } = db.prepare('select count(*) as count from globals').get();
    const { count: donationCount } = db.prepare('select count(*) as count from donations_pages').get();
    const { count: projectCount } = db.prepare('select count(*) as count from projects').get();

    db.close();

    console.log(`✅ Base restaurada en ${dbPath}`);
    console.log(`   home_pages: ${homeCount} registro(s)`);
    console.log(`   globals: ${globalCount} registro(s)`);
    console.log(`   donations_pages: ${donationCount} registro(s)`);
    console.log(`   projects: ${projectCount} registro(s)`);
  } catch (error) {
    console.error('❌ No se pudo restaurar el dump SQL:', error.message ?? error);
    console.error('Asegúrate de tener el archivo backend/data/strapi.sql disponible.');
    process.exitCode = 1;
  }
}

main();
