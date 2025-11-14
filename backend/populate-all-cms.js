#!/usr/bin/env node

/**
 * Script MAESTRO para poblar TODO el CMS con datos del frontend
 * Ejecutar: node populate-all-cms.js (requiere Strapi ejecutándose)
 */

const { spawn } = require('child_process');
const path = require('path');

const scripts = [
  { name: 'Global Settings', file: 'populate-global-settings.js' },
  { name: 'Organization Info', file: 'populate-organization-info.js' },
  { name: 'Home Page', file: 'populate-home-complete.js' },
  { name: 'Donations Page', file: 'populate-donations-page.js' },
  { name: 'Projects', file: 'populate-projects.js' }
];

function runScript(scriptFile) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, scriptFile);
    const child = spawn('node', [scriptPath], {
      stdio: 'inherit',
      cwd: __dirname
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Script ${scriptFile} failed with code ${code}`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

async function main() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║                                                            ║');
  console.log('║       🚀 POBLANDO TODO EL CMS CON DATOS DEL FRONTEND       ║');
  console.log('║                                                            ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  console.log(`📋 Se ejecutarán ${scripts.length} scripts en orden:\n`);
  scripts.forEach((script, index) => {
    console.log(`   ${index + 1}. ${script.name} (${script.file})`);
  });
  console.log('\n' + '─'.repeat(60) + '\n');

  let completedCount = 0;
  const startTime = Date.now();

  for (const script of scripts) {
    try {
      console.log(`\n▶️  Ejecutando: ${script.name}...`);
      console.log('─'.repeat(60));

      await runScript(script.file);

      completedCount++;
      console.log('─'.repeat(60));
      console.log(`✅ Completado (${completedCount}/${scripts.length}): ${script.name}\n`);
    } catch (error) {
      console.error(`\n❌ Error en ${script.name}:`, error.message);
      console.error('⚠️  Abortando proceso...\n');
      process.exit(1);
    }
  }

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  console.log('\n' + '═'.repeat(60));
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║                                                            ║');
  console.log('║                  🎉 ¡PROCESO COMPLETADO!                   ║');
  console.log('║                                                            ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  console.log(`⏱️  Tiempo total: ${duration} segundos`);
  console.log(`✅ Scripts ejecutados: ${completedCount}/${scripts.length}\n`);

  console.log('📊 RESUMEN DE CONTENIDO MIGRADO:\n');
  console.log('   ✓ Global Settings');
  console.log('     • Navegación (6 items)');
  console.log('     • Redes sociales (4 plataformas)');
  console.log('     • Nombre del sitio y URL pública');
  console.log('');
  console.log('   ✓ Organization Info');
  console.log('     • Misión, visión e historia institucional');
  console.log('     • 3 valores corporativos');
  console.log('     • Contacto, dirección y horarios');
  console.log('');
  console.log('   ✓ Home Page');
  console.log('     • Hero section completa con estadísticas y acciones');
  console.log('     • 3 Impact highlights');
  console.log('     • Identidad, misión y visión');
  console.log('     • 4 Activity cards y 2 Program cards');
  console.log('     • 3 Catalog items y 3 Gallery items');
  console.log('     • 4 tarjetas de personas atendidas');
  console.log('     • 3 eventos en calendario');
  console.log('');
  console.log('   ✓ Donations Page');
  console.log('     • Hero section');
  console.log('     • 4 Donation amounts y 3 métricas');
  console.log('     • 4 Highlights y 3 historias');
  console.log('     • 3 acciones de apoyo y 3 pasarelas de pago');
  console.log('');
  console.log('   ✓ Projects');
  console.log('     • Creación/actualización de los 4 proyectos destacados');
  console.log('     • Publicación automática de cada registro');
  console.log('');
  console.log('─'.repeat(60));
  console.log('\n🌐 PRÓXIMOS PASOS:\n');
  console.log('   1. Verifica el contenido en Strapi Admin:');
  console.log('      http://localhost:1337/admin\n');
  console.log('   2. Verifica el frontend:');
  console.log('      http://localhost:4200\n');
  console.log('   3. Recarga el frontend con Ctrl+Shift+R\n');
  console.log('   4. Opcional: Sube imágenes/media a través del Admin\n');
  console.log('─'.repeat(60) + '\n');
}

main().catch(error => {
  console.error('\n❌ Error inesperado:', error);
  process.exit(1);
});
