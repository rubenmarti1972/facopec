import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::organization-info.organization-info', ({ strapi }) => ({
  async find(ctx) {
    // For Single Types, use the database query directly to avoid locale issues
    const entities = await strapi.db.query('api::organization-info.organization-info').findMany({
      where: { publishedAt: { $notNull: true } },
      populate: {
        values: true,
        logo: true,
        banner: true,
        address: true,
        hours: true,
        socialLinks: true,
      },
    });

    // Return the first entity (Single Type should only have one)
    return { data: Array.isArray(entities) && entities.length > 0 ? entities[0] : null };
  },
}));
