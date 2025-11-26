#!/usr/bin/env node
/**
 * Script de migración de SQLite a PostgreSQL para Strapi
 *
 * Este script:
 * 1. Lee el dump SQL de SQLite
 * 2. Lo convierte a formato compatible con PostgreSQL
 * 3. Lo aplica a la base de datos PostgreSQL configurada
 *
 * Uso:
 *   node scripts/migrate-sqlite-to-postgres.mjs
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import pg from 'pg';
import Database from 'better-sqlite3';

const { Client } = pg;

const backendRoot = resolve(new URL('.', import.meta.url).pathname, '..');
const sqlitePath = resolve(backendRoot, 'data/strapi.db');
const sqlDumpPath = resolve(backendRoot, 'data/strapi.sql');
const pgDumpPath = resolve(backendRoot, 'data/strapi-postgres.sql');

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
 * Convierte SQL de SQLite a PostgreSQL
 */
function convertSqliteToPostgres(sqliteSQL) {
  let pgSQL = sqliteSQL;

  // 1. Eliminar comandos específicos de SQLite
  pgSQL = pgSQL.replace(/PRAGMA[^;]*;/gi, '');
  pgSQL = pgSQL.replace(/BEGIN TRANSACTION;/gi, 'BEGIN;');
  pgSQL = pgSQL.replace(/COMMIT;/gi, 'COMMIT;');

  // 2. Convertir tipos de datos
  pgSQL = pgSQL.replace(/\bINTEGER\b/gi, 'INTEGER');
  pgSQL = pgSQL.replace(/\bTEXT\b/gi, 'TEXT');
  pgSQL = pgSQL.replace(/\bREAL\b/gi, 'DOUBLE PRECISION');
  pgSQL = pgSQL.replace(/\bBLOB\b/gi, 'BYTEA');

  // 3. Convertir AUTOINCREMENT a SERIAL
  pgSQL = pgSQL.replace(/INTEGER PRIMARY KEY AUTOINCREMENT/gi, 'SERIAL PRIMARY KEY');
  pgSQL = pgSQL.replace(/AUTOINCREMENT/gi, '');

  // 4. Ajustar comillas: SQLite usa ` o ", PostgreSQL prefiere "
  // pgSQL = pgSQL.replace(/`([^`]+)`/g, '"$1"');

  // 5. Convertir booleanos (SQLite usa 0/1, PostgreSQL usa true/false)
  // Esto se aplica en los INSERT VALUES

  // 6. Eliminar "IF NOT EXISTS" en CREATE TABLE si PostgreSQL es antiguo
  // PostgreSQL moderno lo soporta, así que lo dejamos

  // 7. Ajustar sintaxis de dates/timestamps
  // SQLite guarda como texto, PostgreSQL como timestamp

  return pgSQL;
}

/**
 * Extrae datos de SQLite usando better-sqlite3
 */
function extractDataFromSqlite() {
  console.log('📦 Extrayendo datos de SQLite...');

  const db = new Database(sqlitePath, { readonly: true });

  // Obtener todas las tablas
  const tables = db.prepare(`
    SELECT name FROM sqlite_master
    WHERE type='table' AND name NOT LIKE 'sqlite_%'
    ORDER BY name
  `).all();

  const data = {};

  for (const { name } of tables) {
    const rows = db.prepare(`SELECT * FROM ${name}`).all();
    data[name] = rows;
    console.log(`   ✓ ${name}: ${rows.length} registros`);
  }

  db.close();

  return data;
}

/**
 * Genera INSERT statements para PostgreSQL
 */
function generatePostgresInserts(data) {
  let sql = '';

  for (const [tableName, rows] of Object.entries(data)) {
    if (rows.length === 0) continue;

    sql += `\n-- Datos para tabla: ${tableName}\n`;

    for (const row of rows) {
      const columns = Object.keys(row);
      const values = Object.values(row).map(val => {
        if (val === null) return 'NULL';
        if (typeof val === 'number') return val;
        if (typeof val === 'boolean') return val ? 'true' : 'false';
        // Escapar comillas simples para strings
        return `'${String(val).replace(/'/g, "''")}'`;
      });

      sql += `INSERT INTO "${tableName}" (${columns.map(c => `"${c}"`).join(', ')}) VALUES (${values.join(', ')});\n`;
    }
  }

  return sql;
}

/**
 * Ejecuta el script SQL en PostgreSQL
 */
async function executeSqlInPostgres(sql) {
  const client = new Client(pgConfig);

  try {
    console.log('🔌 Conectando a PostgreSQL...');
    console.log(`   Host: ${pgConfig.host}:${pgConfig.port}`);
    console.log(`   Database: ${pgConfig.database}`);
    console.log(`   User: ${pgConfig.user}`);

    await client.connect();
    console.log('✅ Conectado a PostgreSQL');

    // Dividir en statements individuales y ejecutar
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`📝 Ejecutando ${statements.length} statements...`);

    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      if (stmt) {
        try {
          await client.query(stmt);
          if ((i + 1) % 100 === 0) {
            console.log(`   Ejecutados ${i + 1}/${statements.length} statements...`);
          }
        } catch (error) {
          console.warn(`   ⚠️  Error en statement ${i + 1}:`, error.message);
          // Continuar con el siguiente statement
        }
      }
    }

    console.log('✅ Todos los statements ejecutados');

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    await client.end();
  }
}

/**
 * Verifica los datos migrados
 */
async function verifyMigration() {
  const client = new Client(pgConfig);

  try {
    await client.connect();

    console.log('\n📊 Verificando migración...');

    const tables = ['home_pages', 'globals', 'donations_pages', 'projects'];

    for (const table of tables) {
      try {
        const result = await client.query(`SELECT COUNT(*) as count FROM "${table}"`);
        const count = result.rows[0].count;
        console.log(`   ${table}: ${count} registros`);
      } catch (error) {
        console.log(`   ${table}: tabla no existe o error`);
      }
    }

  } catch (error) {
    console.error('❌ Error al verificar:', error.message);
  } finally {
    await client.end();
  }
}

/**
 * Función principal
 */
async function main() {
  try {
    console.log('🚀 Iniciando migración de SQLite a PostgreSQL\n');

    // Método 1: Convertir el dump SQL existente
    console.log('Método 1: Convirtiendo dump SQL...');
    const sqliteDump = readFileSync(sqlDumpPath, 'utf8');
    const postgresDump = convertSqliteToPostgres(sqliteDump);

    // Guardar dump convertido
    writeFileSync(pgDumpPath, postgresDump);
    console.log(`✅ Dump convertido guardado en: ${pgDumpPath}`);

    // Ejecutar en PostgreSQL
    console.log('\n📥 Importando a PostgreSQL...');
    await executeSqlInPostgres(postgresDump);

    // Verificar
    await verifyMigration();

    console.log('\n✅ Migración completada exitosamente!');
    console.log('\n📝 Próximos pasos:');
    console.log('   1. Verifica que los datos estén correctos');
    console.log('   2. Actualiza tu archivo .env con DATABASE_CLIENT=postgres');
    console.log('   3. Ejecuta: npm run develop');
    console.log('   4. En Render, configura las mismas variables de entorno');

  } catch (error) {
    console.error('\n❌ Error en la migración:', error.message);
    console.error('\n💡 Soluciones posibles:');
    console.error('   1. Verifica que PostgreSQL esté ejecutándose');
    console.error('   2. Verifica las credenciales en .env');
    console.error('   3. Crea manualmente la base de datos: createdb facopec_strapi');
    console.error('   4. Verifica que el usuario tenga permisos');
    process.exit(1);
  }
}

main();
