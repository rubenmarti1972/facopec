import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::home-page.home-page', ({ strapi }) => ({
  async find(ctx) {
    // For Single Types, use the database query directly to avoid locale issues
    const entities = await strapi.db.query('api::home-page.home-page').findMany({
      where: { publishedAt: { $notNull: true } },
      populate: {
        hero: {
          populate: {
            image: true,
            titleLines: true,
            stats: true,
            actions: true,
            verse: true,
            carouselItems: {
              populate: {
                image: true,
              },
            },
          },
        },
        impactHighlights: {
          populate: {
            image: true,
          },
        },
        identity: {
          populate: {
            values: true,
          },
        },
        missionVision: true,
        activities: {
          populate: {
            logo: true,
          },
        },
        programs: {
          populate: {
            logo: true,
          },
        },
        programLogos: {
          populate: {
            logo: true,
          },
        },
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
        attendedPersons: true,
        eventCalendar: true,
      },
    });

    // Return the first entity (Single Type should only have one)
    return { data: Array.isArray(entities) && entities.length > 0 ? entities[0] : null };
  },
}));
