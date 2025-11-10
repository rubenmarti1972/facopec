/**
 * Script para configurar permisos públicos directamente en la base de datos
 * Ejecutar con: node scripts/setup-public-permissions-db.js
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Ruta a la base de datos SQLite
const dbPath = path.join(__dirname, '../.strapi/data.db');

console.log('🔧 Configurando permisos públicos en Strapi...\n');
console.log(`📂 Base de datos: ${dbPath}\n`);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error al abrir la base de datos:', err.message);
    process.exit(1);
  }
});

// 1. Buscar el ID del rol "Public"
db.get(`SELECT id, name, type FROM up_roles WHERE type = 'public'`, (err, role) => {
  if (err) {
    console.error('❌ Error al buscar el rol Public:', err.message);
    db.close();
    process.exit(1);
  }

  if (!role) {
    console.error('❌ No se encontró el rol "Public"');
    db.close();
    process.exit(1);
  }

  console.log(`✅ Rol "Public" encontrado (ID: ${role.id})\n`);
  console.log('📝 Configurando permisos:\n');

  const roleId = role.id;

  // 2. Definir los permisos a habilitar
  const permissions = [
    'api::home-page.home-page.find',
    'api::global.global.find',
    'api::donations-page.donations-page.find',
    'api::organization-info.organization-info.find',
    'api::project.project.find',
    'api::project.project.findOne',
  ];

  let completed = 0;
  const total = permissions.length;

  permissions.forEach((action) => {
    // Verificar si el permiso existe
    db.get(
      `SELECT id, enabled FROM up_permissions WHERE action = ? AND role = ?`,
      [action, roleId],
      (err, perm) => {
        if (err) {
          console.log(`   ⚠️  ${action} → error: ${err.message}`);
          completed++;
          checkCompletion();
          return;
        }

        if (perm) {
          // Actualizar permiso existente
          db.run(
            `UPDATE up_permissions SET enabled = 1 WHERE id = ?`,
            [perm.id],
            (err) => {
              if (err) {
                console.log(`   ⚠️  ${action} → error al actualizar: ${err.message}`);
              } else {
                console.log(`   ✅ ${action} → ${perm.enabled ? 'ya estaba' : ''} habilitado`);
              }
              completed++;
              checkCompletion();
            }
          );
        } else {
          // Crear nuevo permiso
          db.run(
            `INSERT INTO up_permissions (action, role, enabled, created_at, updated_at, created_by_id, updated_by_id)
             VALUES (?, ?, 1, datetime('now'), datetime('now'), NULL, NULL)`,
            [action, roleId],
            (err) => {
              if (err) {
                console.log(`   ⚠️  ${action} → error al crear: ${err.message}`);
              } else {
                console.log(`   ✅ ${action} → creado y habilitado`);
              }
              completed++;
              checkCompletion();
            }
          );
        }
      }
    );
  });

  function checkCompletion() {
    if (completed === total) {
      console.log('\n✅ Permisos públicos configurados correctamente\n');
      console.log('💡 Ahora puedes acceder a las APIs públicas sin autenticación:');
      console.log('   - http://localhost:1337/api/home-page');
      console.log('   - http://localhost:1337/api/global');
      console.log('   - http://localhost:1337/api/donations-page');
      console.log('   - http://localhost:1337/api/organization-info');
      console.log('   - http://localhost:1337/api/projects\n');
      console.log('⚠️  IMPORTANTE: Necesitas reiniciar Strapi para que los cambios tomen efecto\n');

      db.close((err) => {
        if (err) {
          console.error('Error al cerrar la base de datos:', err.message);
        }
        process.exit(0);
      });
    }
  }
});
