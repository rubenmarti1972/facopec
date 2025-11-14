#!/usr/bin/env node
/**
 * Script para limpiar archivos duplicados en /public/uploads
 * Mantiene solo los archivos que están referenciados en la base de datos
 */

const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'data', 'strapi.db');
const uploadsDir = path.join(__dirname, 'public', 'uploads');

if (!fs.existsSync(dbPath)) {
  console.error('❌ Base de datos no encontrada en:', dbPath);
  process.exit(1);
}

if (!fs.existsSync(uploadsDir)) {
  console.error('❌ Directorio de uploads no encontrado:', uploadsDir);
  process.exit(1);
}

console.log('🧹 Analizando archivos duplicados...\n');
console.log(`📂 Base de datos: ${dbPath}`);
console.log(`📂 Directorio uploads: ${uploadsDir}\n`);

const db = new Database(dbPath, { readonly: true });

try {
  // Obtener todos los archivos referenciados en la base de datos
  const files = db.prepare('SELECT name, hash, url FROM files').all();

  console.log(`✅ Archivos en la base de datos: ${files.length}\n`);

  const referencedFiles = new Set();
  files.forEach(file => {
    // Extraer el nombre del archivo de la URL
    const fileName = path.basename(file.url || file.name);
    referencedFiles.add(fileName);

    // También incluir las variantes (thumbnail, small, medium, large)
    const baseName = fileName.replace(/\.[^/.]+$/, ''); // sin extensión
    const ext = path.extname(fileName);

    ['thumbnail_', 'small_', 'medium_', 'large_'].forEach(prefix => {
      referencedFiles.add(`${prefix}${baseName}${ext}`);
    });
  });

  console.log(`📋 Archivos referenciados (incluyendo variantes): ${referencedFiles.size}\n`);

  // Leer todos los archivos en el directorio uploads
  const allFiles = fs.readdirSync(uploadsDir);
  console.log(`📁 Total de archivos en uploads: ${allFiles.length}\n`);

  // Identificar archivos no referenciados
  const unreferencedFiles = allFiles.filter(file => {
    if (file === '.gitkeep') return false;
    return !referencedFiles.has(file);
  });

  console.log(`🗑️  Archivos NO referenciados (candidatos para eliminar): ${unreferencedFiles.length}\n`);

  if (unreferencedFiles.length === 0) {
    console.log('✅ No hay archivos duplicados para limpiar.\n');
    db.close();
    process.exit(0);
  }

  // Mostrar algunos ejemplos
  console.log('Ejemplos de archivos no referenciados:');
  unreferencedFiles.slice(0, 10).forEach(file => {
    const stats = fs.statSync(path.join(uploadsDir, file));
    const sizeKB = (stats.size / 1024).toFixed(2);
    console.log(`  - ${file} (${sizeKB} KB)`);
  });

  if (unreferencedFiles.length > 10) {
    console.log(`  ... y ${unreferencedFiles.length - 10} más\n`);
  }

  // Calcular espacio a liberar
  let totalSize = 0;
  unreferencedFiles.forEach(file => {
    const stats = fs.statSync(path.join(uploadsDir, file));
    totalSize += stats.size;
  });

  const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);
  console.log(`💾 Espacio total a liberar: ${totalSizeMB} MB\n`);

  // Preguntar si desea eliminar
  console.log('⚠️  Para eliminar estos archivos, ejecuta:');
  console.log('   node cleanup-duplicate-uploads.js --delete\n');

  if (process.argv.includes('--delete')) {
    console.log('🗑️  Eliminando archivos...\n');
    let deleted = 0;

    unreferencedFiles.forEach(file => {
      try {
        fs.unlinkSync(path.join(uploadsDir, file));
        deleted++;
      } catch (error) {
        console.error(`❌ Error al eliminar ${file}:`, error.message);
      }
    });

    console.log(`✅ Eliminados ${deleted} archivos.`);
    console.log(`💾 Espacio liberado: ${totalSizeMB} MB\n`);
  }

  db.close();
} catch (error) {
  console.error('❌ Error:', error);
  db.close();
  process.exit(1);
}
