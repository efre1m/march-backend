import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::contact-info.contact-info', ({ strapi }) => ({
  async find(ctx) {
    try {
      const results = await strapi.entityService.findMany('api::contact-info.contact-info', {
        sort: { createdAt: 'desc' },
        ...ctx.query,
      });

      ctx.body = {
        data: results,
        meta: {},
      };
    } catch (err) {
      ctx.throw(500, 'Error fetching contact info');
    }
  },

  async create(ctx) {
    try {
      const { data } = ctx.request.body;

      if (!data?.email || !data?.phone || !data?.address) {
        return ctx.badRequest('Missing required fields');
      }

      const created = await strapi.entityService.create('api::contact-info.contact-info', {
        data,
      });

      ctx.body = {
        data: created,
      };
    } catch (err) {
      ctx.throw(500, 'Error creating contact info');
    }
  },

  async update(ctx) {
    try {
      const { id } = ctx.params;
      const { data } = ctx.request.body;

      const updated = await strapi.entityService.update('api::contact-info.contact-info', id, {
        data,
      });

      ctx.body = {
        data: updated,
      };
    } catch (err) {
      ctx.throw(500, 'Error updating contact info');
    }
  },

  async delete(ctx) {
    try {
      const { id } = ctx.params;

      const deleted = await strapi.entityService.delete('api::contact-info.contact-info', id);

      ctx.body = {
        data: deleted,
      };
    } catch (err) {
      ctx.throw(500, 'Error deleting contact info');
    }
  },
}));
