import type { Strapi } from '@strapi/types/dist/core';
import { seedDefaultContent } from './database/seed-content';
import syncPublicPermissions from '../config/utils/sync-public-permissions';

export default {
  register() {},
  async bootstrap({ strapi }: { strapi: Strapi }) {
    // Always sync public permissions on bootstrap
    try {
      await syncPublicPermissions(strapi);
    } catch (error) {
      strapi.log.error('Error syncing public permissions:', error);
    }

    // En producción, SIEMPRE verificar si necesitamos seed
    // En desarrollo, solo si se pide explícitamente
    const isProduction = process.env.NODE_ENV === 'production';
    const shouldSeed =
      process.env.FORCE_SEED === 'true' ||
      process.env.SEED_ON_BOOTSTRAP === 'true' ||
      isProduction;

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
        if (!isProduction) {
          strapi.log.info(
            '   Para forzar el seed, usa: FORCE_SEED=true npm run develop'
          );
        }
        return;
      }

      strapi.log.info('🌱 Ejecutando seed inicial de contenido...');
      strapi.log.info('📦 Poblando base de datos PostgreSQL en producción...');
      await seedDefaultContent(strapi);
      strapi.log.info('✅ Seed completado exitosamente.');
      strapi.log.info('📝 Credenciales: facopec@facopec.org / F4c0pec@2025');
    } catch (error) {
      strapi.log.error('Error while seeding default content during bootstrap:', error);
    }
  },
};
