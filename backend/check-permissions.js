#!/usr/bin/env node
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'strapi.db');
const db = new Database(dbPath);

console.log('🔍 Permisos existentes:\n');

const permissions = db.prepare(`
  SELECT p.id, p.action, p.subject, r.name as role_name, r.type as role_type
  FROM up_permissions p
  JOIN up_roles r ON p.role_id = r.id
  WHERE p.action LIKE '%global%' OR p.action LIKE '%home%' OR p.action LIKE '%donation%' OR p.action LIKE '%organization%'
  ORDER BY r.type, p.action
`).all();

if (permissions.length === 0) {
  console.log('No hay permisos configurados para estos content types.\n');
  console.log('Mostrando estructura de permisos existentes...\n');

  const allPerms = db.prepare(`
    SELECT p.action, r.name as role_name, r.type
    FROM up_permissions p
    JOIN up_roles r ON p.role_id = r.id
    LIMIT 10
  `).all();

  allPerms.forEach(p => {
    console.log(`  Role: ${p.role_name} (${p.type})`);
    console.log(`  Action: ${p.action}\n`);
  });
} else {
  permissions.forEach(p => {
    console.log(`  Role: ${p.role_name} (${p.role_type})`);
    console.log(`  Action: ${p.action}`);
    console.log(`  Subject: ${p.subject || 'null'}\n`);
  });
}

db.close();
