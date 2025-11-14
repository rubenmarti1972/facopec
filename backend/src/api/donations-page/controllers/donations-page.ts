import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::donations-page.donations-page', ({ strapi }) => ({
  async find(ctx) {
    // For Single Types, use the database query directly to avoid locale issues
    const entities = await strapi.db.query('api::donations-page.donations-page').findMany({
      where: { publishedAt: { $notNull: true } },
      populate: {
        donationAmounts: true,
        metrics: true,
        highlights: true,
        stories: {
          populate: {
            cover: true,
          },
        },
        supportActions: true,
        paymentGateways: true,
      },
    });

    // Return the first entity (Single Type should only have one)
    return { data: Array.isArray(entities) && entities.length > 0 ? entities[0] : null };
  },
}));
