import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::home-page.home-page', ({ strapi }) => ({
  async find(ctx) {
    // Populate all fields including dynamic zones and components
    ctx.query = {
      ...ctx.query,
      populate: 'deep',
    };

    const { data, meta } = await super.find(ctx);
    return { data, meta };
  },
}));
