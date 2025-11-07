import { promises as fs } from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const cwd = process.cwd();

async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch (error) {
    return false;
  }
}

async function detectPackageManager() {
  const pnpmLock = path.join(cwd, 'pnpm-lock.yaml');
  if (await pathExists(pnpmLock)) {
    return { manager: 'pnpm', installCmd: ['pnpm', ['install']], buildCmd: ['pnpm', ['run', 'build']] };
  }

  const yarnLock = path.join(cwd, 'yarn.lock');
  if (await pathExists(yarnLock)) {
    return { manager: 'yarn', installCmd: ['yarn', ['install']], buildCmd: ['yarn', ['build']] };
  }

  const npmLock = path.join(cwd, 'package-lock.json');
  if (await pathExists(npmLock)) {
    return { manager: 'npm', installCmd: ['npm', ['install']], buildCmd: ['npm', ['run', 'build']] };
  }

  throw new Error('No se detectó ningún lockfile de npm, pnpm o yarn en el directorio actual.');
}

async function backupDatabase() {
  const dbPath = path.join(cwd, '.tmp', 'data.db');
  if (!(await pathExists(dbPath))) {
    return null;
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupName = `data.backup.${timestamp}.db`;
  const backupPath = path.join(cwd, '.tmp', backupName);
  await fs.copyFile(dbPath, backupPath);
  console.log(`Backup de base de datos creado en ${path.relative(cwd, backupPath)}`);
  return backupName;
}

function updateStrapiDependencies(section = {}) {
  let updated = false;
  for (const [depName, version] of Object.entries(section)) {
    if (depName.startsWith('@strapi/')) {
      if (version !== '^5.2.2') {
        section[depName] = '^5.2.2';
        updated = true;
      }
    }
  }
  return updated;
}

async function updatePackageJson() {
  const packageJsonPath = path.join(cwd, 'package.json');
  const raw = await fs.readFile(packageJsonPath, 'utf8');
  const pkg = JSON.parse(raw);
  const depsChanged = updateStrapiDependencies(pkg.dependencies || {});
  const devDepsChanged = updateStrapiDependencies(pkg.devDependencies || {});

  if (depsChanged || devDepsChanged) {
    await fs.writeFile(packageJsonPath, `${JSON.stringify(pkg, null, 2)}\n`, 'utf8');
    console.log('package.json actualizado con @strapi/* -> ^5.2.2');
    return true;
  }

  console.log('No se encontraron dependencias de @strapi/ para actualizar.');
  return false;
}

function findBlock(content, keyword) {
  const index = content.indexOf(keyword);
  if (index === -1) {
    return null;
  }
  const braceStart = content.indexOf('{', index);
  if (braceStart === -1) {
    return null;
  }
  let depth = 0;
  for (let i = braceStart; i < content.length; i += 1) {
    const char = content[i];
    if (char === '{') {
      depth += 1;
    } else if (char === '}') {
      depth -= 1;
      if (depth === 0) {
        return { start: braceStart, end: i };
      }
    }
  }
  return null;
}

function getIndentation(content, index) {
  const lineStart = content.lastIndexOf('\n', index) + 1;
  const line = content.slice(lineStart, index);
  const match = line.match(/^[ \t]*/);
  return match ? match[0] : '';
}

async function ensureAdminSettings() {
  const candidates = ['config/admin.ts', 'config/admin.js'];
  for (const relativePath of candidates) {
    const fullPath = path.join(cwd, relativePath);
    if (!(await pathExists(fullPath))) {
      continue;
    }

    let content = await fs.readFile(fullPath, 'utf8');
    if (content.includes('enablePermissions')) {
      return false;
    }

    const settingsBlock = findBlock(content, 'settings');
    if (!settingsBlock) {
      const closingIndex = Math.max(content.lastIndexOf('\n});'), content.lastIndexOf('\n};'));
      const insertPosition = closingIndex !== -1 ? closingIndex + 1 : content.length;
      const indent = '  ';
      const snippet = `${indent}settings: {\n${indent}  contentManager: {\n${indent}    enablePermissions: true,\n${indent}  },\n${indent}},\n`;
      content = `${content.slice(0, insertPosition)}${snippet}${content.slice(insertPosition)}`;
      await fs.writeFile(fullPath, content, 'utf8');
      console.log(`${relativePath}: se agregó settings.contentManager.enablePermissions`);
      return true;
    }

    const settingsIndent = getIndentation(content, settingsBlock.start);
    const settingsInnerIndent = `${settingsIndent}  `;
    const contentManagerBlock = findBlock(content.slice(settingsBlock.start, settingsBlock.end + 1), 'contentManager');
    if (!contentManagerBlock) {
      const insertPosition = settingsBlock.start + 1;
      const snippet = `\n${settingsInnerIndent}contentManager: {\n${settingsInnerIndent}  enablePermissions: true,\n${settingsInnerIndent}},`;
      content = `${content.slice(0, insertPosition)}${snippet}${content.slice(insertPosition)}`;
      await fs.writeFile(fullPath, content, 'utf8');
      console.log(`${relativePath}: se añadió contentManager con enablePermissions`);
      return true;
    }

    const contentManagerStart = settingsBlock.start + contentManagerBlock.start;
    const cmIndent = getIndentation(content, contentManagerStart);
    const cmInnerIndent = `${cmIndent}  `;
    const insertPosition = contentManagerStart + 1;
    const snippet = `\n${cmInnerIndent}enablePermissions: true,`;
    content = `${content.slice(0, insertPosition)}${snippet}${content.slice(insertPosition)}`;
    await fs.writeFile(fullPath, content, 'utf8');
    console.log(`${relativePath}: se agregó enablePermissions dentro de contentManager`);
    return true;
  }

  console.warn('No se encontró config/admin.ts ni config/admin.js para actualizar.');
  return false;
}

async function removeDirectories() {
  const targets = ['.cache', 'build'];
  for (const dir of targets) {
    const fullPath = path.join(cwd, dir);
    await fs.rm(fullPath, { recursive: true, force: true });
  }
  console.log('Directorios .cache y build eliminados (si existían).');
}

function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit', cwd });
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${command} ${args.join(' ')} salió con código ${code}`));
      }
    });
    child.on('error', (error) => {
      reject(error);
    });
  });
}

async function main() {
  console.log('Detectando gestor de paquetes...');
  const managerInfo = await detectPackageManager();
  console.log(`Gestor detectado: ${managerInfo.manager}`);

  const backupName = await backupDatabase();

  await updatePackageJson();
  await ensureAdminSettings();
  await removeDirectories();

  console.log('Instalando dependencias actualizadas...');
  await runCommand(...managerInfo.installCmd);

  console.log('Construyendo la aplicación...');
  await runCommand(...managerInfo.buildCmd);

  const backupLine = backupName ? `.tmp/${backupName}` : '.tmp/data.backup.<timestamp>.db';
  console.log('\nActualización lista ✅');
  console.log('Ejecuta: npm run develop');
  console.log('Luego ve a: Settings → Content Manager → Permissions');
  console.log('Habilita Read + Update en home-page, organization-info, donations-page y sus componentes.');
  console.log(`Si algo sale mal: restaura ${backupLine} y haz git reset --hard.`);
}

main().catch((error) => {
  console.error('Error durante la actualización:', error);
  process.exit(1);
});
