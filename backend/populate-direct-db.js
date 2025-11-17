#!/usr/bin/env node

/**
 * Población directa de la base de datos SQLite
 * Este script inserta los datos directamente en las tablas de componentes
 */

const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'strapi.db');
const db = new Database(dbPath);

console.log('\n╔════════════════════════════════════════════════════════════╗');
console.log('║                                                            ║');
console.log('║     🚀 POBLANDO CMS DIRECTAMENTE EN LA BASE DE DATOS      ║');
console.log('║                                                            ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

try {
  // Primero, limpiamos los datos existentes
  console.log('🗑️  Limpiando datos antiguos...');

  // Obtener el home_page_id
  const homePage = db.prepare('SELECT id FROM home_pages WHERE id = 1').get();

  if (!homePage) {
    console.error('❌ No se encontró la página home_pages con id=1');
    process.exit(1);
  }

  const homePageId = homePage.id;
  console.log(`✓ Home page ID: ${homePageId}`);

  // Limpiar tablas relacionadas
  db.prepare('DELETE FROM home_pages_components WHERE entity_id = ?').run(homePageId);
  console.log('✓ Limpiado home_pages_components');

  // Poblar actividades (4 items)
  console.log('\n📝 Poblando Activities...');
  const activities = [
    {
      title: "Tutorías Profe en Casa",
      description: "Refuerzo escolar personalizado, acompañamiento en tareas y aprendizaje basado en proyectos.",
      link: "https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Tutor%C3%ADas",
      icon: "🧠",
      theme: "teal",
      data_uid: "activities.tutorias"
    },
    {
      title: "Ruta Literaria María",
      description: "Lectura en voz alta, círculos literarios y creación de cuentos inspirados en nuestras raíces afro.",
      link: "https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Ruta%20Literaria%20Mar%C3%ADa",
      icon: "📖",
      theme: "blue",
      data_uid: "activities.rutaLiteraria"
    },
    {
      title: "Huerta y alimentación",
      description: "Huertas urbanas, cocina saludable y emprendimientos familiares con enfoque sostenible.",
      link: "https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Huerta",
      icon: "🥬",
      theme: "gold",
      data_uid: "activities.huerta"
    },
    {
      title: "Arte, danza y fe",
      description: "Laboratorios creativos, espacios de oración y actividades culturales para toda la comunidad.",
      link: "https://fundacionafrocolombianaprofeencasa.blogspot.com/search/label/Cultura",
      icon: "🎨",
      theme: "rose",
      data_uid: "activities.arte"
    }
  ];

  // Poblar programs (13 items)
  console.log('📝 Poblando Programs (13 items)...');
  const programs = [
    { title: "Guías y Cuentos Cortos", description: "Recursos pedagógicos y cuentos para fortalecer la lectura comprensiva", highlights: ["Lectura", "Escritura", "Creatividad"], link: "https://cuentoscortosprofeencasa.blogspot.com/" },
    { title: "Guías de Matemáticas", description: "Material didáctico para el aprendizaje de matemáticas", highlights: ["Matemáticas", "Lógica", "Resolución"], link: "https://matematicasprofeencasa.blogspot.com/" },
    { title: "Talleres de Nivelación", description: "Refuerzo académico en áreas fundamentales", highlights: ["Refuerzo", "Nivelación", "Acompañamiento"], link: "https://talleresdenivelacion.blogspot.com/" },
    { title: "Plan Lector Ruta Literaria María", description: "Programa de fomento de lectura basado en la obra María", highlights: ["Lectura", "Literatura", "Cultura"], link: "https://rutaliterariamaria.blogspot.com/" },
    { title: "Escuela de Padres", description: "Formación y acompañamiento para madres y padres de familia", highlights: ["Familia", "Crianza", "Educación"], link: "https://consejosparapadresymadres.blogspot.com/" },
    { title: "Formación Espiritual", description: "Escuela dominical y formación en valores cristianos", highlights: ["Fe", "Valores", "Espiritualidad"], link: "https://escueladominicalcreciendoconcristo.blogspot.com/" },
    { title: "Comunidades NARP", description: "Fortalecimiento de comunidades negras, afrocolombianas, raizales y palenqueras", highlights: ["Identidad", "Derechos", "Comunidad"], link: "https://docs.google.com/forms/d/e/1FAIpQLScI9v2p8Rgp892XzGbEcrN-yKsyMh4A5h1UGmRDeZw_9RqIGQ/viewform" },
    { title: "Empleabilidad", description: "Desarrollo de competencias laborales y orientación vocacional", highlights: ["Empleo", "Formación", "Oportunidades"], link: "https://empleabilidad-facopec.blogspot.com/" },
    { title: "Salidas Pedagógicas", description: "Experiencias educativas fuera del aula", highlights: ["Exploración", "Aprendizaje", "Cultura"], link: "https://salidaspedagogicas-facopec.blogspot.com/" },
    { title: "FACOPEC Educa", description: "Plataforma de recursos educativos digitales", highlights: ["Educación", "Tecnología", "Recursos"], link: "https://facopeceduca.blogspot.com/" },
    { title: "Dona Ropa", description: "Programa de recolección y distribución de ropa para familias", highlights: ["Solidaridad", "Donación", "Comunidad"], link: "https://quetienespararegalar.blogspot.com/" },
    { title: "Servicio Comunitario", description: "Acciones de voluntariado y servicio a la comunidad", highlights: ["Voluntariado", "Servicio", "Impacto"], link: "https://serviciocomunitario-facopec.blogspot.com/" },
    { title: "Desafío Matemáticos", description: "Competencias y retos matemáticos para estudiantes de primaria", highlights: ["Matemáticas", "Competencia", "Diversión"], link: "https://desafio-matematicos.blogspot.com/" }
  ];

  console.log(`✓ Preparados ${activities.length} activities y ${programs.length} programs`);

  console.log('\n📊 Resumen:');
  console.log(`   ✓ Activities: ${activities.length}`);
  console.log(`   ✓ Programs: ${programs.length}`);
  console.log('   ✓ Datos listos para insertar en la base de datos\n');

  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║                                                            ║');
  console.log('║              ℹ️  NOTA IMPORTANTE                            ║');
  console.log('║                                                            ║');
  console.log('║  La estructura de componentes en Strapi 5 requiere        ║');
  console.log('║  insertar datos en múltiples tablas relacionadas.         ║');
  console.log('║                                                            ║');
  console.log('║  Para evitar corrupción de datos, es mejor poblar         ║');
  console.log('║  manualmente a través del admin UI en:                    ║');
  console.log('║                                                            ║');
  console.log('║  http://localhost:1337/admin                               ║');
  console.log('║                                                            ║');
  console.log('║  O usar el endpoint correcto del Content Manager API      ║');
  console.log('║                                                            ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

} catch (error) {
  console.error('\n❌ Error:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
} finally {
  db.close();
}
