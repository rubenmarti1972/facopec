#!/usr/bin/env node
/**
 * Script que verifica si la base de datos está vacía y ejecuta seed automáticamente
 * Se ejecuta antes de iniciar Strapi en producción
 */

import { createRequire } from 'module';
import { execSync } from 'child_process';

const require = createRequire(import.meta.url);
const pg = require('pg');
const { Client } = pg;

const pgConfig = {
  host: process.env.DATABASE_HOST || '127.0.0.1',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  database: process.env.DATABASE_NAME || 'facopec_strapi',
  user: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
};

async function checkAndSeed() {
  // Solo ejecutar en producción con PostgreSQL
  if (process.env.NODE_ENV !== 'production' || process.env.DATABASE_CLIENT !== 'postgres') {
    console.log('ℹ️  Entorno de desarrollo o SQLite - omitiendo auto-seed');
    return;
  }

  const client = new Client(pgConfig);

  try {
    await client.connect();
    console.log('✅ Conectado a PostgreSQL');

    // Verificar si hay usuarios admin
    const result = await client.query('SELECT COUNT(*) as count FROM admin_users');
    const userCount = parseInt(result.rows[0].count);

    console.log(`📊 Usuarios admin encontrados: ${userCount}`);

    if (userCount === 0) {
      console.log('🌱 Base de datos vacía - ejecutando seed...');
      console.log('');

      // Ejecutar seed
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
        console.error('💡 Puedes ejecutar manualmente con:');
        console.error('   SEED_ON_BOOTSTRAP=true pnpm run seed');
      }
    } else {
      console.log('✅ Base de datos ya tiene usuarios - omitiendo seed');
    }

    await client.end();
  } catch (error) {
    console.error('❌ Error al verificar base de datos:', error.message);
    console.error('');

    // Si la tabla no existe, es porque es la primera vez
    if (error.message.includes('does not exist')) {
      console.log('ℹ️  Tablas no existen aún - Strapi las creará al iniciar');
      console.log('ℹ️  El seed se ejecutará en el próximo deploy');
    }

    await client.end().catch(() => {});
  }
}

checkAndSeed();
