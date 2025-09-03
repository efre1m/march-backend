import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::impact.impact', ({ strapi }) => ({

  // ✅ Override find to always sort newest first
  async find(ctx) {
    const { query } = ctx;
    const entities = await strapi.entityService.findMany('api::impact.impact', {
      ...query,
      sort: { createdAt: 'desc' },
    });
    return entities;
  },

  // ✅ Create with validation
  async create(ctx) {
    const { data } = ctx.request.body;

    if (!data?.title) {
      return ctx.badRequest('❌ Title is required.');
    }

    const entity = await strapi.entityService.create('api::impact.impact', {
      data: {
        title: data.title,
        value: data.value,
        description: data.description,
        publishedAt: new Date(), // auto-publish
      },
    });

    return entity;
  },

  // ✅ Update with validation
  async update(ctx) {
    const { id } = ctx.params;
    const { data } = ctx.request.body;

    if (!data?.title) {
      return ctx.badRequest('❌ Title is required.');
    }

    const entity = await strapi.entityService.update('api::impact.impact', id, {
      data: {
        title: data.title,
        value: data.value,
        description: data.description,
      },
    });

    return entity;
  },

  // ✅ Delete (default, but explicit)
  async delete(ctx) {
    const { id } = ctx.params;
    const entity = await strapi.entityService.delete('api::impact.impact', id);
    return entity;
  },

}));
