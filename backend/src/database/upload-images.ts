/**
 * Script para cargar todas las imágenes al CMS de Strapi
 * Carga logos de programas y fotos del carrusel
 */

import 'ts-node/register/transpile-only';
import path from 'node:path';
import fs from 'node:fs/promises';
import { createStrapi } from '@strapi/strapi';
import tsUtils from '@strapi/typescript-utils';

type CompileFn = (srcDir: string, options?: { configOptions?: Record<string, unknown> }) => Promise<unknown> | unknown;

const MIME_TYPES: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
};

const ensureMimeType = (filePath: string): string => {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_TYPES[ext] ?? 'application/octet-stream';
};

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

async function uploadImage(strapi: any, absolutePath: string, alternativeText: string) {
  try {
    const stats = await fs.stat(absolutePath);
    if (!stats.isFile()) {
      console.log(`❌ ${absolutePath} no es un archivo`);
      return null;
    }

    const fileName = path.basename(absolutePath);

    // Verificar si ya existe
    const existing = await strapi.db
      .query('plugin::upload.file')
      .findOne({ where: { name: fileName } });

    if (existing) {
      console.log(`✅ ${fileName} ya existe (ID: ${existing.id})`);
      return existing;
    }

    const uploadService = strapi.plugin('upload').service('upload');
    const uploaded = await uploadService.upload({
      data: {
        alternativeText,
        caption: alternativeText,
      },
      files: {
        filepath: absolutePath,
        originalFilename: fileName,
        mimetype: ensureMimeType(absolutePath),
        size: stats.size,
      },
    });

    if (Array.isArray(uploaded) && uploaded.length > 0) {
      console.log(`✅ ${fileName} cargado exitosamente (ID: ${uploaded[0].id})`);
      return uploaded[0];
    }

    return null;
  } catch (error) {
    console.error(`❌ Error al cargar ${absolutePath}:`, error);
    return null;
  }
}

async function uploadAllImages() {
  process.env.SKIP_BOOTSTRAP_SEED = 'true';

  const appDir = process.cwd();
  const distDir = await prepareDistDirectory(appDir);

  const strapi = createStrapi({ appDir, distDir });

  try {
    await strapi.start();

    console.log('📸 Cargando imágenes al CMS...\n');

    const frontendAssetsDir = path.resolve(appDir, '..', 'src', 'assets');

    // 1. CARGAR LOGOS DE PROGRAMAS
    console.log('1️⃣ Cargando logos de programas...');
    const programLogosDir = path.join(frontendAssetsDir, 'program-logos');
    const programLogos = await fs.readdir(programLogosDir);

    for (const logo of programLogos) {
      const logoPath = path.join(programLogosDir, logo);
      const stats = await fs.stat(logoPath);

      if (stats.isFile() && /\.(png|jpg|jpeg|webp|svg)$/i.test(logo)) {
        const altText = logo.replace(/\.(png|jpg|jpeg|webp|svg)$/i, '').replace(/-/g, ' ');
        await uploadImage(strapi, logoPath, altText);
      }
    }

    // 2. CARGAR FOTOS DEL CARRUSEL
    console.log('\n2️⃣ Cargando fotos del carrusel...');
    const carouselDir = path.join(frontendAssetsDir, 'fotos-fundacion');
    const carouselPhotos = await fs.readdir(carouselDir);

    for (const photo of carouselPhotos) {
      const photoPath = path.join(carouselDir, photo);
      const stats = await fs.stat(photoPath);

      if (stats.isFile() && /\.(png|jpg|jpeg|webp|svg)$/i.test(photo)) {
        const altText = photo.replace(/\.(png|jpg|jpeg|webp|svg)$/i, '').replace(/-/g, ' ');
        await uploadImage(strapi, photoPath, altText);
      }
    }

    console.log('\n✅ ¡Todas las imágenes han sido cargadas exitosamente!');
  } catch (error) {
    console.error('❌ Error al cargar imágenes:', error);
    process.exitCode = 1;
  } finally {
    await strapi.destroy();
  }
}

uploadAllImages();
