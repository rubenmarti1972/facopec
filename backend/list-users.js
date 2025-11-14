#!/usr/bin/env node
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'strapi.db');
const db = new Database(dbPath, { readonly: true });

console.log('🔍 Usuarios en la base de datos:\n');

try {
  const users = db.prepare(`
    SELECT u.id, u.email, u.username, u.firstname, u.lastname, u.is_active, u.blocked,
           r.name as role_name, r.code as role_code
    FROM admin_users u
    LEFT JOIN admin_users_roles_lnk ur ON u.id = ur.user_id
    LEFT JOIN admin_roles r ON ur.role_id = r.id
  `).all();

  if (users.length === 0) {
    console.log('❌ No hay usuarios en la base de datos\n');
  } else {
    users.forEach(user => {
      console.log(`📧 Email: ${user.email || 'N/A'}`);
      console.log(`👤 Username: ${user.username || 'N/A'}`);
      console.log(`   Nombre: ${user.firstname || ''} ${user.lastname || ''}`);
      console.log(`   Rol: ${user.role_name || 'SIN ROL'} (${user.role_code || 'N/A'})`);
      console.log(`   Activo: ${user.is_active ? 'Sí' : 'No'}`);
      console.log(`   Bloqueado: ${user.blocked ? 'Sí' : 'No'}`);
      console.log('');
    });
  }

  db.close();
} catch (error) {
  console.error('❌ Error:', error.message);
  db.close();
  process.exit(1);
}
