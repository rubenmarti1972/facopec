import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::global.global', ({ strapi }) => ({
  async find(ctx) {
    // Populate all components and media
    const entity = await strapi.entityService.findMany('api::global.global', {
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

    return { data: entity };
  },
}));
