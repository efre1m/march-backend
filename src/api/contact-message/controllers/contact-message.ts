import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::contact-message.contact-message', ({ strapi }) => ({
  async find(ctx) {
    try {
      const { contactStatus, ...restQuery } = ctx.query;

      const filters = contactStatus ? { contactStatus } : {};

      const results = await strapi.entityService.findMany('api::contact-message.contact-message', {
        filters,
        sort: { createdAt: 'desc' },
        ...restQuery,
      });

      ctx.body = {
        data: results,
        meta: {}, // optional, used for pagination or additional metadata
      };
    } catch (err) {
      ctx.throw(500, 'Error fetching contact messages');
    }
  },

  async create(ctx) {
    try {
      const { data } = ctx.request.body;

      if (!data?.name || !data?.email || !data?.subject || !data?.message) {
        return ctx.badRequest('Missing required fields');
      }

      // Convert richtext HTML to plain text before checking word count
      const plainText = data.message.replace(/<[^>]*>/g, ''); // strip HTML tags
      if (plainText.split(/\s+/).length > 100) {
        return ctx.badRequest('Message exceeds maximum allowed length of 100 words');
      }

      const newMessage = await strapi.entityService.create('api::contact-message.contact-message', {
        data: {
          name: data.name,
          email: data.email,
          subject: data.subject,
          message: data.message,
          contactStatus: 'new',
        },
      });

      ctx.body = {
        data: newMessage,
      };
    } catch (err) {
      ctx.throw(500, 'Error creating contact message');
    }
  },

  async update(ctx) {
    try {
      const { id } = ctx.params;
      const { data } = ctx.request.body;

      const updated = await strapi.entityService.update('api::contact-message.contact-message', id, {
        data,
      });

      ctx.body = {
        data: updated,
      };
    } catch (err) {
      ctx.throw(500, 'Error updating contact message');
    }
  },

  async delete(ctx) {
    try {
      const { id } = ctx.params;

      const deleted = await strapi.entityService.delete('api::contact-message.contact-message', id);

      ctx.body = {
        data: deleted,
      };
    } catch (err) {
      ctx.throw(500, 'Error deleting contact message');
    }
  },
}));
