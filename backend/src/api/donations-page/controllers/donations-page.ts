import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::donations-page.donations-page', ({ strapi }) => ({
  async find(ctx) {
    // Populate all components
    // IMPORTANT: publicationState: 'live' ensures we only return published content
    const entity = await strapi.entityService.findMany('api::donations-page.donations-page', {
      publicationState: 'live',
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

    return { data: entity };
  },
}));
