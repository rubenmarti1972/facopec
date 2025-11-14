#!/usr/bin/env node
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'strapi.db');
const db = new Database(dbPath, { readonly: true });

console.log('🔍 VERIFICANDO CONTENIDO REAL:\n');

try {
  // Global
  console.log('━━━ GLOBAL ━━━');
  const globals = db.prepare('SELECT * FROM globals').all();
  console.log(`Registros: ${globals.length}`);
  if (globals.length > 0) {
    globals.forEach(g => {
      console.log(`ID: ${g.id}, siteName: ${g.site_name}, published: ${g.published_at ? 'Sí' : 'No'}`);
    });
  }

  // Home Pages
  console.log('\n━━━ HOME PAGE ━━━');
  const homes = db.prepare('SELECT * FROM home_pages').all();
  console.log(`Registros: ${homes.length}`);
  if (homes.length > 0) {
    homes.forEach(h => {
      console.log(`ID: ${h.id}, published: ${h.published_at ? 'Sí' : 'No'}`);
    });
  }

  // Organization Info
  console.log('\n━━━ ORGANIZATION INFO ━━━');
  const orgs = db.prepare('SELECT * FROM organization_infos').all();
  console.log(`Registros: ${orgs.length}`);
  if (orgs.length > 0) {
    orgs.forEach(o => {
      console.log(`ID: ${o.id}, name: ${o.name}, published: ${o.published_at ? 'Sí' : 'No'}`);
    });
  }

  // Donations Page
  console.log('\n━━━ DONATIONS PAGE ━━━');
  const donations = db.prepare('SELECT * FROM donations_pages').all();
  console.log(`Registros: ${donations.length}`);
  if (donations.length > 0) {
    donations.forEach(d => {
      console.log(`ID: ${d.id}, heroTitle: ${d.hero_title}, published: ${d.published_at ? 'Sí' : 'No'}`);
    });
  }

  // Verificar componentes del home
  console.log('\n━━━ COMPONENTES HOME (HERO) ━━━');
  const homeComponents = db.prepare('SELECT * FROM home_pages_cmps WHERE field = ?').all('hero');
  console.log(`Hero components: ${homeComponents.length}`);

  db.close();
} catch (error) {
  console.error('❌ Error:', error.message);
  db.close();
}
