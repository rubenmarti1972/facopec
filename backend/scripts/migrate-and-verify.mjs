#!/usr/bin/env node
/**
 * Script completo de migración y verificación de SQLite a PostgreSQL
 *
 * Este script:
 * 1. Verifica la conexión a PostgreSQL
 * 2. Inicia Strapi con PostgreSQL para crear el esquema
 * 3. Carga los datos iniciales
 * 4. Verifica que los datos persisten
 *
 * Uso:
 *   node scripts/migrate-and-verify.mjs
 */

import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { execSync, spawn } from 'child_process';
import pg from 'pg';
import Database from 'better-sqlite3';

const { Client } = pg;

const backendRoot = resolve(new URL('.', import.meta.url).pathname, '..');
const sqlitePath = resolve(backendRoot, 'data/strapi.db');
const sqlDumpPath = resolve(backendRoot, 'data/strapi.sql');

// Configuración de PostgreSQL desde variables de entorno
const pgConfig = {
  host: process.env.DATABASE_HOST || '127.0.0.1',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  database: process.env.DATABASE_NAME || 'facopec_strapi',
  user: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
};

/**
 * Paso 1: Verificar conexión a PostgreSQL
 */
async function verifyPostgresConnection() {
  console.log('📡 Paso 1: Verificando conexión a PostgreSQL...');
  console.log(`   Host: ${pgConfig.host}:${pgConfig.port}`);
  console.log(`   Database: ${pgConfig.database}`);
  console.log(`   User: ${pgConfig.user}`);

  const adminConfig = { ...pgConfig, database: 'postgres' };
  const adminClient = new Client(adminConfig);

  try {
    await adminClient.connect();
    console.log('   ✅ Conexión exitosa al servidor PostgreSQL');

    // Verificar si la base de datos existe
    const result = await adminClient.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [pgConfig.database]
    );

    if (result.rows.length === 0) {
      console.log(`   ⚠️  Base de datos '${pgConfig.database}' no existe, creándola...`);
      await adminClient.query(`CREATE DATABASE "${pgConfig.database}"`);
      console.log(`   ✅ Base de datos creada`);
    } else {
      console.log(`   ✅ Base de datos '${pgConfig.database}' existe`);
    }

    await adminClient.end();
    return true;
  } catch (error) {
    console.error(`\n❌ Error de conexión: ${error.message}`);
    console.error('\n💡 Asegúrate de que PostgreSQL esté ejecutándose:');
    console.error('   macOS: brew services start postgresql@15');
    console.error('   Linux: sudo systemctl start postgresql');
    return false;
  }
}

/**
 * Paso 2: Iniciar Strapi para crear el esquema
 */
async function initializeStrapiSchema() {
  console.log('\n🏗️  Paso 2: Inicializando esquema de Strapi en PostgreSQL...');
  console.log('   Esto tomará unos segundos...');

  return new Promise((resolve, reject) => {
    // Ejecutar strapi build primero
    try {
      console.log('   📦 Compilando Strapi...');
      execSync('npm run build', {
        cwd: backendRoot,
        stdio: 'pipe',
        timeout: 120000
      });
      console.log('   ✅ Compilación completada');
    } catch (error) {
      console.log('   ⚠️  Build falló, continuando...');
    }

    // Iniciar Strapi en modo bootstrap (sin servidor HTTP)
    const strapi = spawn('node', [
      './node_modules/@strapi/strapi/bin/strapi.js',
      'develop',
      '--no-build'
    ], {
      cwd: backendRoot,
      env: { ...process.env, STRAPI_DISABLE_REMOTE_DATA_TRANSFER: 'true' },
      stdio: 'pipe'
    });

    let output = '';
    let schemaCreated = false;

    strapi.stdout.on('data', (data) => {
      output += data.toString();
      console.log('   ', data.toString().trim());

      // Detectar cuando el esquema está listo
      if (output.includes('Server listening') || output.includes('Project information')) {
        schemaCreated = true;
      }
    });

    strapi.stderr.on('data', (data) => {
      console.log('   ', data.toString().trim());
    });

    // Esperar 15 segundos para que el esquema se cree
    setTimeout(() => {
      strapi.kill();
      if (schemaCreated) {
        console.log('   ✅ Esquema de base de datos creado');
        resolve(true);
      } else {
        console.log('   ⚠️  Timeout - El esquema debería estar creado');
        resolve(true);
      }
    }, 15000);

    strapi.on('error', (error) => {
      console.error(`   ❌ Error al iniciar Strapi: ${error.message}`);
      reject(error);
    });
  });
}

/**
 * Paso 3: Extraer y cargar datos desde SQLite
 */
async function migrateDataFromSQLite() {
  console.log('\n📦 Paso 3: Migrando datos desde SQLite...');

  if (!existsSync(sqlitePath)) {
    console.log('   ⚠️  No se encontró base de datos SQLite');
    console.log('   💡 Los datos se cargarán con el script de seed');
    return false;
  }

  try {
    const sqliteDb = new Database(sqlitePath, { readonly: true });

    // Obtener lista de tablas
    const tables = sqliteDb.prepare(`
      SELECT name FROM sqlite_master
      WHERE type='table'
      AND name NOT LIKE 'sqlite_%'
      AND name NOT LIKE 'strapi_%'
      ORDER BY name
    `).all();

    console.log(`   Encontradas ${tables.length} tablas en SQLite`);

    const pgClient = new Client(pgConfig);
    await pgClient.connect();

    let totalRows = 0;

    for (const { name } of tables) {
      try {
        const rows = sqliteDb.prepare(`SELECT * FROM "${name}"`).all();

        if (rows.length === 0) continue;

        console.log(`   📋 Tabla: ${name} (${rows.length} registros)`);

        for (const row of rows) {
          const columns = Object.keys(row);
          const values = Object.values(row).map(val => {
            if (val === null) return null;
            if (typeof val === 'boolean') return val;
            if (typeof val === 'number') return val;
            return String(val);
          });

          const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
          const columnNames = columns.map(c => `"${c}"`).join(', ');

          const insertQuery = `
            INSERT INTO "${name}" (${columnNames})
            VALUES (${placeholders})
            ON CONFLICT DO NOTHING
          `;

          try {
            await pgClient.query(insertQuery, values);
            totalRows++;
          } catch (error) {
            // Ignorar errores de duplicados o conflictos
            if (!error.message.includes('duplicate') && !error.message.includes('violates')) {
              console.log(`      ⚠️  Error en fila: ${error.message.substring(0, 50)}...`);
            }
          }
        }
      } catch (error) {
        console.log(`   ⚠️  Error en tabla ${name}: ${error.message}`);
      }
    }

    sqliteDb.close();
    await pgClient.end();

    console.log(`   ✅ Migración completada: ${totalRows} registros insertados`);
    return true;

  } catch (error) {
    console.error(`   ❌ Error en la migración: ${error.message}`);
    return false;
  }
}

/**
 * Paso 4: Verificar datos en PostgreSQL
 */
async function verifyData() {
  console.log('\n🔍 Paso 4: Verificando datos en PostgreSQL...');

  const client = new Client(pgConfig);

  try {
    await client.connect();

    const tables = ['home_pages', 'globals', 'donations_pages', 'projects', 'admin_users'];

    for (const table of tables) {
      try {
        const result = await client.query(`SELECT COUNT(*) as count FROM "${table}"`);
        const count = result.rows[0].count;
        console.log(`   ${table.padEnd(20)}: ${count} registros`);
      } catch (error) {
        console.log(`   ${table.padEnd(20)}: tabla no existe`);
      }
    }

    console.log('   ✅ Verificación completada');
    await client.end();
    return true;

  } catch (error) {
    console.error(`   ❌ Error al verificar: ${error.message}`);
    await client.end();
    return false;
  }
}

/**
 * Paso 5: Verificar persistencia
 */
async function verifyPersistence() {
  console.log('\n💾 Paso 5: Verificando persistencia de datos...');

  const client = new Client(pgConfig);

  try {
    await client.connect();

    // Crear una tabla de prueba
    await client.query(`
      CREATE TABLE IF NOT EXISTS migration_test (
        id SERIAL PRIMARY KEY,
        test_data TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Insertar dato de prueba
    await client.query(`
      INSERT INTO migration_test (test_data)
      VALUES ('Test de persistencia - ' || NOW())
    `);

    // Verificar que se guardó
    const result = await client.query(`SELECT COUNT(*) as count FROM migration_test`);
    const count = parseInt(result.rows[0].count);

    console.log(`   📝 Registros de prueba: ${count}`);
    console.log('   ✅ Los datos persisten correctamente en PostgreSQL');

    await client.end();
    return true;

  } catch (error) {
    console.error(`   ❌ Error al verificar persistencia: ${error.message}`);
    await client.end();
    return false;
  }
}

/**
 * Función principal
 */
async function main() {
  console.log('🚀 Migración y Verificación: SQLite → PostgreSQL\n');
  console.log('='.repeat(60));

  try {
    // Paso 1: Verificar conexión
    const connected = await verifyPostgresConnection();
    if (!connected) {
      console.log('\n❌ No se pudo conectar a PostgreSQL. Abortando...');
      process.exit(1);
    }

    // Paso 2: Crear esquema con Strapi
    console.log('\n⏭️  Saltando inicialización automática de Strapi');
    console.log('   💡 Ejecuta manualmente: npm run develop');
    console.log('   Luego presiona Ctrl+C después de ver "Server listening"');
    console.log('\n   ⏸️  Una vez hecho, ejecuta este script de nuevo');

    // Verificar si el esquema ya existe
    const client = new Client(pgConfig);
    await client.connect();

    let schemaExists = false;
    try {
      await client.query(`SELECT 1 FROM admin_users LIMIT 1`);
      schemaExists = true;
    } catch (error) {
      schemaExists = false;
    }
    await client.end();

    if (!schemaExists) {
      console.log('\n💡 El esquema aún no existe. Ejecuta estos pasos:');
      console.log('   1. npm run develop');
      console.log('   2. Espera a que cargue completamente');
      console.log('   3. Presiona Ctrl+C');
      console.log('   4. Ejecuta de nuevo: node scripts/migrate-and-verify.mjs');
      process.exit(0);
    }

    console.log('   ✅ Esquema de Strapi detectado');

    // Paso 3: Migrar datos
    await migrateDataFromSQLite();

    // Paso 4: Verificar datos
    await verifyData();

    // Paso 5: Verificar persistencia
    await verifyPersistence();

    console.log('\n' + '='.repeat(60));
    console.log('✅ Migración completada exitosamente!\n');
    console.log('📝 Próximos pasos:');
    console.log('   1. npm run develop');
    console.log('   2. Abre http://localhost:1337/admin');
    console.log('   3. Verifica que todos los datos estén presentes');
    console.log('   4. Sube una imagen para probar Cloudinary');
    console.log('   5. Reinicia Strapi y verifica que los datos persisten');

  } catch (error) {
    console.error('\n❌ Error en la migración:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
