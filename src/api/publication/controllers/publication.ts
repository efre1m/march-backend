import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::publication.publication', ({ strapi }) => ({
  // Get all publications
  async find(ctx) {
    try {
      const results = await strapi.entityService.findMany('api::publication.publication', {
        populate: ['image'],
        ...ctx.query,
      });
      return { data: results };
    } catch (err) {
      ctx.throw(500, 'Error fetching publications');
    }
  },

  // Create new publication
  async create(ctx) {
    try {
      const { data } = ctx.request.body;

      if (!data || !data.title || !data.authors || !data.journal || !data.year || !data.link) {
        return ctx.badRequest('Missing required fields');
      }

      const newPub = await strapi.entityService.create('api::publication.publication', {
        data: {
          title: data.title,
          authors: data.authors,
          journal: data.journal,
          year: data.year,
          link: data.link,
          abstract: data.abstract || null,
          image: data.image || null,
        },
        populate: ['image'],
      });

      return { data: newPub };
    } catch (err) {
      ctx.throw(500, 'Error creating publication');
    }
  },

  // Update publication
  async update(ctx) {
    try {
      const { id } = ctx.params;
      const { data } = ctx.request.body;

      const updated = await strapi.entityService.update('api::publication.publication', id, {
        data: {
          title: data.title,
          authors: data.authors,
          journal: data.journal,
          year: data.year,
          link: data.link,
          abstract: data.abstract || null,
          image: data.image || null,
        },
        populate: ['image'],
      });

      return { data: updated };
    } catch (err) {
      ctx.throw(500, 'Error updating publication');
    }
  },

  // Delete publication
  async delete(ctx) {
    try {
      const { id } = ctx.params;
      const deleted = await strapi.entityService.delete('api::publication.publication', id);
      return { data: deleted };
    } catch (err) {
      ctx.throw(500, 'Error deleting publication');
    }
  }
}));
