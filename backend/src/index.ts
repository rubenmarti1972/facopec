import type { Strapi } from '@strapi/types/dist/core';
import { seedDefaultContent } from './database/seed-content';

export default {
  register() {},
  async bootstrap({ strapi }: { strapi: Strapi }) {
    // Solo ejecutar seed si se solicita explícitamente o si la DB está vacía
    const shouldSeed =
      process.env.FORCE_SEED === 'true' ||
      process.env.SEED_ON_BOOTSTRAP === 'true';

    if (process.env.SKIP_BOOTSTRAP_SEED === 'true' || !shouldSeed) {
      strapi.log.info('Skipping default content seed during bootstrap.');
      strapi.log.info('Para ejecutar el seed, usa: SEED_ON_BOOTSTRAP=true npm run develop');
      return;
    }

    // Verificar si ya hay contenido en la base de datos
    try {
      const existingGlobal = await strapi.db
        .query('api::global.global')
        .findMany({ limit: 1 });

      if (existingGlobal && existingGlobal.length > 0 && !process.env.FORCE_SEED) {
        strapi.log.info(
          '✅ La base de datos ya contiene datos. Omitiendo seed automático.'
        );
        strapi.log.info(
          '   Para forzar el seed, usa: FORCE_SEED=true npm run develop'
        );
        return;
      }

      strapi.log.info('🌱 Ejecutando seed inicial de contenido...');
      await seedDefaultContent(strapi);
      strapi.log.info('✅ Seed completado exitosamente.');
    } catch (error) {
      strapi.log.error('Error while seeding default content during bootstrap:', error);
    }
  },
};
