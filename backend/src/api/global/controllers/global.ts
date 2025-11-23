import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::global.global', ({ strapi }) => ({
  async find(ctx) {
    // Authenticated requests (e.g., from the admin panel) should be able to see draft data
    // while unauthenticated requests only receive published content.
    const isAuthenticated = Boolean(ctx.state.user);
    const publicationState = isAuthenticated ? 'preview' : 'live';

    const entities = await strapi.entityService.findMany('api::global.global', {
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
      publicationState,
      filters: publicationState === 'live' ? { publishedAt: { $notNull: true } } : undefined,
    });

    // Return the first entity (Single Type should only have one)
    const entry = Array.isArray(entities) && entities.length > 0 ? entities[0] : null;
    return this.transformResponse(entry);
  },
}));
