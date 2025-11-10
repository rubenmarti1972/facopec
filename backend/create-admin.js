const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = path.join(__dirname, '.tmp', 'data.db');

// Usuario admin por defecto
const adminUser = {
  firstname: 'Admin',
  lastname: 'FACOPEC',
  username: null,
  email: 'admin@facopec.org',
  password: 'Admin123456', // Cambia esto después
  isActive: true,
  blocked: false,
  preferedLanguage: null
};

try {
  const db = new Database(dbPath);

  // Limpiar usuarios existentes
  db.prepare('DELETE FROM admin_users').run();
  console.log('✅ Usuarios anteriores eliminados');

  // Hash de la contraseña
  const hashedPassword = bcrypt.hashSync(adminUser.password, 10);

  // Insertar nuevo usuario
  const stmt = db.prepare(`
    INSERT INTO admin_users (
      firstname, lastname, username, email, password,
      isActive, blocked, preferedLanguage,
      createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `);

  const result = stmt.run(
    adminUser.firstname,
    adminUser.lastname,
    adminUser.username,
    adminUser.email,
    hashedPassword,
    adminUser.isActive ? 1 : 0,
    adminUser.blocked ? 1 : 0,
    adminUser.preferedLanguage
  );

  console.log('\n✅ Usuario admin creado exitosamente!');
  console.log('\n📧 Credenciales de acceso:');
  console.log(`   Email: ${adminUser.email}`);
  console.log(`   Password: ${adminUser.password}`);
  console.log('\n⚠️  IMPORTANTE: Cambia la contraseña después de entrar');
  console.log('\n🌐 Accede a: http://localhost:1337/admin\n');

  db.close();
} catch (error) {
  console.error('\n❌ Error:', error.message);
  console.log('\nAsegúrate de que:');
  console.log('  1. Strapi está corriendo (pnpm run develop)');
  console.log('  2. La base de datos existe (.tmp/data.db)');
  console.log('  3. Tienes permisos de escritura\n');
  process.exit(1);
}
