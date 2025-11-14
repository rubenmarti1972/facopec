#!/usr/bin/env node
/**
 * Script para crear/restaurar el super admin de Strapi
 */

const Database = require('better-sqlite3');
const path = require('path');
const crypto = require('crypto');

const dbPath = path.join(__dirname, 'data', 'strapi.db');
const db = new Database(dbPath);

console.log('🔧 Restaurando acceso de super admin...\n');

try {
  // 1. Obtener el rol de super admin
  const superAdminRole = db.prepare(`
    SELECT id, code FROM admin_roles WHERE code = 'strapi-super-admin'
  `).get();

  if (!superAdminRole) {
    console.error('❌ No se encontró el rol strapi-super-admin');
    process.exit(1);
  }

  console.log(`✅ Rol super-admin encontrado (ID: ${superAdminRole.id})\n`);

  // 2. Verificar si existe el usuario facopec
  const existingUser = db.prepare(`
    SELECT id, email, username FROM admin_users WHERE email = 'facopec@facopec.org'
  `).get();

  if (existingUser) {
    console.log(`✅ Usuario encontrado: ${existingUser.email}\n`);

    // Asignar rol al usuario existente
    const existingLink = db.prepare(`
      SELECT * FROM admin_users_roles_lnk WHERE user_id = ? AND role_id = ?
    `).get(existingUser.id, superAdminRole.id);

    if (!existingLink) {
      db.prepare(`
        INSERT INTO admin_users_roles_lnk (user_id, role_id, role_ord, user_ord)
        VALUES (?, ?, 1.0, 1.0)
      `).run(existingUser.id, superAdminRole.id);
      console.log('✅ Rol de super admin asignado al usuario\n');
    } else {
      console.log('✅ El usuario ya tiene el rol de super admin\n');
    }
  } else {
    console.log('⚠️  Usuario facopec@facopec.org no existe, necesitas crearlo desde el navegador\n');
  }

  // 3. Verificar todos los usuarios sin rol y asignarles super admin
  const usersWithoutRole = db.prepare(`
    SELECT u.id, u.email, u.username
    FROM admin_users u
    LEFT JOIN admin_users_roles_lnk r ON u.id = r.user_id
    WHERE r.role_id IS NULL
  `).all();

  if (usersWithoutRole.length > 0) {
    console.log(`⚠️  Encontrados ${usersWithoutRole.length} usuarios sin rol:\n`);
    usersWithoutRole.forEach(user => {
      console.log(`   - ${user.email || user.username || 'Usuario sin email'}`);

      // Asignar rol de super admin
      db.prepare(`
        INSERT INTO admin_users_roles_lnk (user_id, role_id, role_ord, user_ord)
        VALUES (?, ?, 1.0, 1.0)
      `).run(user.id, superAdminRole.id);
    });
    console.log(`\n✅ Rol de super admin asignado a todos los usuarios\n`);
  }

  db.close();

  console.log('✅ Acceso restaurado correctamente\n');
  console.log('📋 Credenciales de acceso:');
  console.log('   URL: http://localhost:1337/admin');
  console.log('   Email: facopec@facopec.org');
  console.log('   Password: F4c0pec@2025\n');
  console.log('⚠️  IMPORTANTE: Reinicia el servidor para que los cambios tomen efecto:\n');
  console.log('   1. Presiona Ctrl+C para detener el servidor');
  console.log('   2. Ejecuta: npm run develop\n');

} catch (error) {
  console.error('❌ Error:', error.message);
  console.error(error);
  db.close();
  process.exit(1);
}
