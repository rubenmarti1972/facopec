#!/usr/bin/env node
/**
 * Script para configurar PostgreSQL y verificar la conexión
 *
 * Este script:
 * 1. Verifica la conexión a PostgreSQL
 * 2. Crea la base de datos si no existe
 * 3. Valida las credenciales
 *
 * Uso:
 *   node scripts/setup-postgres.mjs
 */

import pg from 'pg';

const { Client } = pg;

// Configuración desde variables de entorno
const pgConfig = {
  host: process.env.DATABASE_HOST || '127.0.0.1',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  database: process.env.DATABASE_NAME || 'facopec_strapi',
  user: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
};

async function checkConnection() {
  console.log('🔍 Verificando conexión a PostgreSQL...');
  console.log(`   Host: ${pgConfig.host}:${pgConfig.port}`);
  console.log(`   Database: ${pgConfig.database}`);
  console.log(`   User: ${pgConfig.user}`);
  console.log(`   SSL: ${pgConfig.ssl ? 'Habilitado' : 'Deshabilitado'}`);

  // Intentar conectar a la base de datos 'postgres' primero
  const adminConfig = { ...pgConfig, database: 'postgres' };
  const adminClient = new Client(adminConfig);

  try {
    await adminClient.connect();
    console.log('✅ Conexión exitosa al servidor PostgreSQL');

    // Verificar si la base de datos existe
    const result = await adminClient.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [pgConfig.database]
    );

    if (result.rows.length === 0) {
      console.log(`⚠️  La base de datos '${pgConfig.database}' no existe`);
      console.log(`   Creando base de datos...`);

      try {
        await adminClient.query(`CREATE DATABASE "${pgConfig.database}"`);
        console.log(`✅ Base de datos '${pgConfig.database}' creada exitosamente`);
      } catch (error) {
        console.error(`❌ Error al crear la base de datos:`, error.message);
        throw error;
      }
    } else {
      console.log(`✅ La base de datos '${pgConfig.database}' existe`);
    }

    await adminClient.end();

    // Ahora conectar a la base de datos específica
    const client = new Client(pgConfig);
    await client.connect();
    console.log(`✅ Conexión exitosa a la base de datos '${pgConfig.database}'`);

    // Verificar permisos
    const versionResult = await client.query('SELECT version()');
    console.log(`   PostgreSQL: ${versionResult.rows[0].version.split(',')[0]}`);

    await client.end();

    console.log('\n✅ Todo listo! PostgreSQL está correctamente configurado.');
    console.log('\n📝 Próximos pasos:');
    console.log('   1. Ejecuta: npm run develop (Strapi creará las tablas automáticamente)');
    console.log('   2. Luego ejecuta: npm run seed (para cargar datos iniciales)');
    console.log('   3. O ejecuta: node scripts/migrate-sqlite-to-postgres.mjs (para migrar desde SQLite)');

    return true;
  } catch (error) {
    console.error('\n❌ Error de conexión:', error.message);
    console.error('\n💡 Soluciones posibles:');
    console.error('   1. Instala PostgreSQL: https://www.postgresql.org/download/');
    console.error('   2. Inicia el servicio PostgreSQL');
    console.error('   3. Crea un usuario y contraseña:');
    console.error('      $ createuser -s postgres');
    console.error('      $ psql -c "ALTER USER postgres PASSWORD \'postgres\';"');
    console.error('   4. Verifica las credenciales en tu archivo .env');
    console.error('\n   En macOS con Homebrew:');
    console.error('      $ brew install postgresql@15');
    console.error('      $ brew services start postgresql@15');
    console.error('\n   En Linux (Ubuntu/Debian):');
    console.error('      $ sudo apt-get install postgresql');
    console.error('      $ sudo systemctl start postgresql');
    console.error('\n   En Windows:');
    console.error('      Descarga el instalador desde: https://www.postgresql.org/download/windows/');

    return false;
  }
}

async function main() {
  console.log('🚀 Configuración de PostgreSQL para FACOPEC CMS\n');

  const success = await checkConnection();

  if (!success) {
    process.exit(1);
  }
}

main();
