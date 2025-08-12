import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::partner.partner', ({ strapi }) => ({
  // Fetch all partners, populate logo media
  async find(ctx) {
    try {
      const results = await strapi.entityService.findMany('api::partner.partner', {
        populate: ['logo'],
        ...ctx.query,
      });
      return { data: results };
    } catch (err) {
      ctx.throw(500, 'Error fetching partners');
    }
  },

  // Create new partner
  async create(ctx) {
    try {
      const { data } = ctx.request.body;

      // Validate required fields
      if (!data || !data.name || !data.websiteUrl) {
        return ctx.badRequest('Name and Website URL are required');
      }

      const newPartner = await strapi.entityService.create('api::partner.partner', {
        data: {
          name: data.name,
          websiteUrl: data.websiteUrl,
          logo: data.logo || null, // expects logo id if uploaded separately
        },
        populate: ['logo'],
      });

      return { data: newPartner };
    } catch (err) {
      ctx.throw(500, 'Error creating partner');
    }
  },

  // Update partner
  async update(ctx) {
    try {
      const { id } = ctx.params;
      const { data } = ctx.request.body;

      // Optional: add validation if needed

      const updatedPartner = await strapi.entityService.update('api::partner.partner', id, {
        data: {
          name: data.name,
          websiteUrl: data.websiteUrl,
          logo: data.logo || null,
        },
        populate: ['logo'],
      });

      return { data: updatedPartner };
    } catch (err) {
      ctx.throw(500, 'Error updating partner');
    }
  },

  // Delete partner
  async delete(ctx) {
    try {
      const { id } = ctx.params;
      const deletedPartner = await strapi.entityService.delete('api::partner.partner', id);
      return { data: deletedPartner };
    } catch (err) {
      ctx.throw(500, 'Error deleting partner');
    }
  },
}));
