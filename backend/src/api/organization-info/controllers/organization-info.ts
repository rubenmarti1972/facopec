import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::organization-info.organization-info', ({ strapi }) => ({
  async find(ctx) {
    // Populate all components and media
    const entity = await strapi.entityService.findMany('api::organization-info.organization-info', {
      populate: {
        values: true,
        logo: true,
        banner: true,
        address: true,
        hours: true,
        socialLinks: true,
      },
    });

    return { data: entity };
  },
}));
