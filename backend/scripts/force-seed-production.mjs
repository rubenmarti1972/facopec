#!/usr/bin/env node
/**
 * Script que FUERZA la ejecución del seed en producción
 * Usar solo cuando necesitas repoblar la base de datos
 */

import { execSync } from 'child_process';

console.log('');
console.log('🌱 FORZANDO seed en producción...');
console.log('⚠️  ADVERTENCIA: Esto puede duplicar datos si ya existen');
console.log('');

try {
  execSync('pnpm run seed', {
    stdio: 'inherit',
    env: {
      ...process.env,
      SEED_ON_BOOTSTRAP: 'true',
    },
  });

  console.log('');
  console.log('✅ Seed completado exitosamente');
  console.log('');
  console.log('📝 Credenciales de acceso:');
  console.log('   Email: facopec@facopec.org');
  console.log('   Password: F4c0pec@2025');
  console.log('');
} catch (error) {
  console.error('❌ Error al ejecutar seed:', error.message);
  console.error('');
  process.exit(1);
}
