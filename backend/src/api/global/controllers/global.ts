import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::global.global', ({ strapi }) => ({
  async find(ctx) {
    // For Single Types, use the database query directly to avoid locale issues
    const entities = await strapi.db.query('api::global.global').findMany({
      where: { publishedAt: { $notNull: true } },
      populate: {
        logo: true,
        navigation: {
          populate: {
            children: {
              populate: {
                items: true,
              },
            },
          },
        },
        socialLinks: true,
      },
    });

    // Return the first entity (Single Type should only have one)
    return { data: Array.isArray(entities) && entities.length > 0 ? entities[0] : null };
  },
}));
