#!/usr/bin/env node
/**
 * Script que fuerza la creación del usuario admin
 * Se ejecuta antes de iniciar Strapi en producción
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pg = require('pg');
const { Client } = pg;
const bcrypt = require('bcryptjs');

const pgConfig = {
  host: process.env.DATABASE_HOST || '127.0.0.1',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  database: process.env.DATABASE_NAME || 'facopec_strapi',
  user: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
};

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || 'facopec@facopec.org';
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || 'F4c0pec@2025';
const ADMIN_USERNAME = process.env.SEED_ADMIN_USERNAME || 'facopec';

async function forceCreateAdmin() {
  // Solo ejecutar en producción con PostgreSQL
  if (process.env.DATABASE_CLIENT !== 'postgres') {
    console.log('ℹ️  SQLite detectado - omitiendo force-create-admin');
    return;
  }

  const client = new Client(pgConfig);

  try {
    await client.connect();
    console.log('✅ Conectado a PostgreSQL');

    // Verificar si existe la tabla admin_users
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'admin_users'
      );
    `);

    if (!tableCheck.rows[0].exists) {
      console.log('ℹ️  Tabla admin_users no existe aún - será creada por Strapi');
      await client.end();
      return;
    }

    // Verificar si existe el rol de super admin
    const roleCheck = await client.query(`
      SELECT id FROM admin_roles WHERE code = 'strapi-super-admin' LIMIT 1;
    `);

    if (roleCheck.rows.length === 0) {
      console.log('⚠️  Rol super-admin no existe - será creado por Strapi');
      await client.end();
      return;
    }

    const superAdminRoleId = roleCheck.rows[0].id;

    // Verificar si ya existe el usuario
    const userCheck = await client.query(
      'SELECT id FROM admin_users WHERE email = $1 LIMIT 1',
      [ADMIN_EMAIL]
    );

    if (userCheck.rows.length > 0) {
      console.log(`✅ Usuario admin ${ADMIN_EMAIL} ya existe`);

      // Actualizar contraseña por si acaso
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
      await client.query(
        'UPDATE admin_users SET password = $1, blocked = false WHERE email = $2',
        [hashedPassword, ADMIN_EMAIL]
      );
      console.log(`🔄 Contraseña actualizada para ${ADMIN_EMAIL}`);

    } else {
      console.log(`🔨 Creando usuario admin ${ADMIN_EMAIL}...`);

      // Hash de la contraseña
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

      // Crear usuario
      const result = await client.query(`
        INSERT INTO admin_users (
          firstname,
          lastname,
          username,
          email,
          password,
          blocked,
          is_active,
          created_at,
          updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, NOW(), NOW()
        ) RETURNING id
      `, [
        'FACOPEC',
        'Administrador',
        ADMIN_USERNAME,
        ADMIN_EMAIL,
        hashedPassword,
        false,
        true
      ]);

      const userId = result.rows[0].id;

      // Asignar rol de super admin
      await client.query(`
        INSERT INTO admin_users_roles_links (user_id, role_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING
      `, [userId, superAdminRoleId]);

      console.log('✅ Usuario admin creado exitosamente');
    }

    console.log('');
    console.log('📝 Credenciales de acceso:');
    console.log(`   Email: ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
    console.log('');

    await client.end();

  } catch (error) {
    console.error('❌ Error:', error.message);

    if (error.message.includes('does not exist')) {
      console.log('ℹ️  Las tablas aún no existen - Strapi las creará');
    }

    await client.end().catch(() => {});
  }
}

forceCreateAdmin();
