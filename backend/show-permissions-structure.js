#!/usr/bin/env node
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'strapi.db');
const db = new Database(dbPath);

console.log('📊 Estructura de up_permissions:\n');
const structure = db.prepare("PRAGMA table_info(up_permissions)").all();
structure.forEach(col => console.log(`  ${col.name} (${col.type})`));

console.log('\n📊 Estructura de up_roles:\n');
const rolesStructure = db.prepare("PRAGMA table_info(up_roles)").all();
rolesStructure.forEach(col => console.log(`  ${col.name} (${col.type})`));

console.log('\n📋 Primeros 5 permisos de ejemplo:\n');
const samples = db.prepare(`SELECT * FROM up_permissions LIMIT 5`).all();
samples.forEach((perm, i) => {
  console.log(`\nPermiso ${i + 1}:`);
  Object.entries(perm).forEach(([key, value]) => {
    console.log(`  ${key}: ${value}`);
  });
});

console.log('\n📋 Roles:\n');
const roles = db.prepare(`SELECT * FROM up_roles`).all();
roles.forEach(role => {
  console.log(`  ID: ${role.id}, Name: ${role.name}, Type: ${role.type}`);
});

db.close();
