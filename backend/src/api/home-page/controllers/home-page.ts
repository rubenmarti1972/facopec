import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::home-page.home-page', ({ strapi }) => ({
  async find(ctx) {
    // Populate all components deeply
    // IMPORTANT: publicationState: 'live' ensures we only return published content
    const entity = await strapi.entityService.findMany('api::home-page.home-page', {
      publicationState: 'live',
      populate: {
        hero: {
          populate: {
            image: true,
            titleLines: true,
            stats: true,
            actions: true,
            verse: true,
          },
        },
        impactHighlights: true,
        identity: {
          populate: {
            values: true,
          },
        },
        missionVision: true,
        activities: true,
        programs: true,
        supporters: {
          populate: {
            logo: true,
          },
        },
        catalog: true,
        gallery: {
          populate: {
            media: true,
          },
        },
      },
    });

    return { data: entity };
  },
}));
