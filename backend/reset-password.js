/**
 * Script para resetear la contraseña de un usuario admin en Strapi
 * Uso: node reset-password.js <email> <nueva-contraseña>
 */

const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

const email = process.argv[2];
const newPassword = process.argv[3];

if (!email || !newPassword) {
  console.error('\n❌ Error: Debes proporcionar email y contraseña');
  console.log('\nUso: node reset-password.js <email> <nueva-contraseña>');
  console.log('Ejemplo: node reset-password.js admin@facopec.org MiNuevaPassword123\n');
  process.exit(1);
}

const dbPath = path.join(__dirname, '.tmp', 'data.db');

try {
  const db = new Database(dbPath);

  // Verificar que el usuario existe
  const user = db.prepare('SELECT id, email FROM admin_users WHERE email = ?').get(email);

  if (!user) {
    console.error(`\n❌ No existe un usuario con el email: ${email}\n`);
    console.log('Usuarios disponibles:');
    const users = db.prepare('SELECT email FROM admin_users').all();
    users.forEach(u => console.log(`  - ${u.email}`));
    console.log('');
    db.close();
    process.exit(1);
  }

  // Generar hash de la nueva contraseña
  const hashedPassword = bcrypt.hashSync(newPassword, 10);

  // Actualizar la contraseña
  const stmt = db.prepare('UPDATE admin_users SET password = ? WHERE email = ?');
  stmt.run(hashedPassword, email);

  console.log(`\n✅ Contraseña actualizada exitosamente para: ${email}`);
  console.log(`\nAhora puedes acceder con:`);
  console.log(`  Email: ${email}`);
  console.log(`  Password: ${newPassword}\n`);

  db.close();
} catch (error) {
  console.error('\n❌ Error:', error.message);
  console.log('\nAsegúrate de que:');
  console.log('  1. Strapi está detenido (Ctrl+C)');
  console.log('  2. Existe el archivo .tmp/data.db');
  console.log('  3. Tienes permisos de escritura\n');
  process.exit(1);
}
