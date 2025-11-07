import type { Core } from '@strapi/types';
import { seedDefaultContent } from './database/seed-content';

type Strapi = Core.Strapi;

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
