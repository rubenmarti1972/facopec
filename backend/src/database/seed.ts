import 'ts-node/register/transpile-only';
import path from 'node:path';
import fs from 'node:fs/promises';
import createStrapi from '@strapi/strapi';
import tsUtils from '@strapi/typescript-utils';
import { seedDefaultContent } from './seed-content';

type CompileFn = (srcDir: string, options?: { configOptions?: Record<string, unknown> }) => Promise<unknown> | unknown;

async function prepareDistDirectory(appDir: string) {
  const distDir = path.join(appDir, 'dist');

  await fs.rm(distDir, { recursive: true, force: true });

  const { compile } = tsUtils as { compile: CompileFn };
  await compile(appDir, {
    configOptions: {
      ignoreDiagnostics: true,
      options: {
        sourceMap: false,
        inlineSourceMap: false,
        inlineSources: false,
        declarationMap: false,
      },
    },
  });

  return distDir;
}

async function seed() {
  process.env.SKIP_BOOTSTRAP_SEED = 'true';

  const appDir = process.cwd();
  const distDir = await prepareDistDirectory(appDir);

  const app = createStrapi({ appDir, distDir });

  try {
    await app.start();
    await seedDefaultContent(app);
    console.log('Seed completed successfully.');
  } catch (error) {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  } finally {
    await app.destroy();
  }
}

seed();
