const Database = require('better-sqlite3');
const db = new Database('./data/strapi.db');

console.log('\n🔍 Verificando contenido real de la base de datos...\n');

// Verificar home_pages
const homePages = db.prepare('SELECT * FROM home_pages').all();
console.log(`📄 Home pages encontradas: ${homePages.length}`);
if (homePages.length > 0) {
  console.log('   IDs:', homePages.map(h => h.id).join(', '));
}

// Verificar componentes de programs
const programsComponents = db.prepare('SELECT COUNT(*) as count FROM components_home_program_cards').get();
console.log(`📚 Program cards en components: ${programsComponents.count}`);

// Verificar activities
const activitiesComponents = db.prepare('SELECT COUNT(*) as count FROM components_home_activity_cards').get();
console.log(`🎯 Activity cards en components: ${activitiesComponents.count}`);

// Verificar relaciones
const homePageComponents = db.prepare('SELECT * FROM home_pages_components WHERE field = "programs"').all();
console.log(`🔗 Relaciones home_page->programs: ${homePageComponents.length}`);

// Listar todos los program cards
if (programsComponents.count > 0) {
  const programs = db.prepare('SELECT id, title FROM components_home_program_cards LIMIT 15').all();
  console.log('\n📝 Títulos de programs encontrados:');
  programs.forEach(p => console.log(`   - ${p.title}`));
}

db.close();
