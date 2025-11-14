#!/usr/bin/env node
const Database = require('better-sqlite3');
const crypto = require('crypto');
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'strapi.db');
const db = new Database(dbPath);

console.log('🔧 Creando usuario admin funcional...\n');

try {
  // Limpiar usuarios corruptos
  db.prepare('DELETE FROM admin_users_roles_lnk').run();
  db.prepare('DELETE FROM admin_users').run();

  console.log('✅ Usuarios antiguos eliminados\n');

  // Obtener el rol super admin
  const superAdminRole = db.prepare(`
    SELECT id FROM admin_roles WHERE code = 'strapi-super-admin'
  `).get();

  if (!superAdminRole) {
    console.error('❌ No se encontró el rol super-admin');
    process.exit(1);
  }

  // Crear hash de password usando bcryptjs que viene con Strapi
  const bcrypt = require('bcryptjs');
  const password = 'Admin123456';
  const hashedPassword = bcrypt.hashSync(password, 10);

  const now = new Date().toISOString();
  const documentId = crypto.randomBytes(12).toString('base64url');

  // Insertar usuario admin
  const result = db.prepare(`
    INSERT INTO admin_users (
      document_id, firstname, lastname, username, email, password,
      is_active, blocked, prefered_language, created_at, updated_at, published_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    documentId,
    'Admin',
    'FACOPEC',
    'admin',
    'admin@facopec.org',
    hashedPassword,
    1, // is_active
    0, // blocked
    'es',
    now,
    now,
    now
  );

  const userId = result.lastInsertRowid;

  // Asignar rol super admin
  db.prepare(`
    INSERT INTO admin_users_roles_lnk (user_id, role_id, role_ord, user_ord)
    VALUES (?, ?, 1.0, 1.0)
  `).run(userId, superAdminRole.id);

  db.close();

  console.log('✅ Usuario admin creado exitosamente\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 CREDENCIALES DE ACCESO:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  console.log('   URL: http://localhost:1337/admin');
  console.log('   Email: admin@facopec.org');
  console.log('   Password: Admin123456');
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  console.log('⚠️  Inicia el servidor: npm run develop\n');

} catch (error) {
  console.error('❌ Error:', error.message);
  console.error(error);
  db.close();
  process.exit(1);
}
