import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::donations-page.donations-page', ({ strapi }) => ({
  async find(ctx) {
    // Populate all components
    const entity = await strapi.entityService.findMany('api::donations-page.donations-page', {
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
        paymentGateways: {
          populate: {
            logo: true,
          },
        },
      },
    });

    return { data: entity };
  },
}));
