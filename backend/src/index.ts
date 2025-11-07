import type { Strapi } from '@strapi/types/dist/core';
import { seedDefaultContent } from './database/seed-content';

export default {
  register() {},
  async bootstrap({ strapi }: { strapi: Strapi }) {
    if (process.env.SKIP_BOOTSTRAP_SEED === 'true') {
      strapi.log.info('Skipping default content seed during bootstrap.');
      return;
    }

    try {
      await seedDefaultContent(strapi);
    } catch (error) {
      strapi.log.error('Error while seeding default content during bootstrap:', error);
    }
  },
};
