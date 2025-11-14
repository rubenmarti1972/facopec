#!/usr/bin/env node
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'strapi.db');
const db = new Database(dbPath);

const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").all();

console.log('Tablas relacionadas con permisos y roles:\n');
const relevantTables = tables.filter(t => t.name.startsWith('up_') || t.name.includes('permission') || t.name.includes('role'));
relevantTables.forEach(t => console.log('  -', t.name));

db.close();
