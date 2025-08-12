import { factories } from '@strapi/strapi';

interface EventWithImage {
  id: number;
  title?: string;
  description?: string;
  slug?: string;
  mode?: string;
  eventStatus?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  image?: {
    id: number;
    url?: string;
  } | null;
}

export default factories.createCoreController('api::event.event', ({ strapi }) => ({

  // Custom find method with image population
  async find(ctx) {
    try {
      const results = await strapi.entityService.findMany('api::event.event', {
        populate: ['image'],
        ...ctx.query,
      });
      return { data: results };
    } catch (err) {
      ctx.throw(500, 'Error fetching events');
    }
  },

  // Create event
  async create(ctx) {
    try {
      const { data } = ctx.request.body;
      if (!data || !data.title || !data.description || !data.startDate || !data.endDate) {
        return ctx.badRequest('Title, description, startDate and endDate are required');
      }

      const newEvent = await strapi.entityService.create('api::event.event', {
        data: {
          title: data.title,
          description: data.description,
          slug: data.slug,
          mode: data.mode,
          eventStatus: data.eventStatus,
          startDate: data.startDate,
          endDate: data.endDate,
          location: data.location,
          image: data.image || null,
        },
        populate: ['image'],
      });

      return { data: newEvent };
    } catch (err) {
      ctx.throw(500, 'Error creating event');
    }
  },

  // Update event
  async update(ctx) {
    try {
      const { id } = ctx.params;
      const { data } = ctx.request.body;

      const updatedEvent = await strapi.entityService.update('api::event.event', id, {
        data: {
          title: data.title,
          description: data.description,
          slug: data.slug,
          mode: data.mode,
          eventStatus: data.eventStatus,
          startDate: data.startDate,
          endDate: data.endDate,
          location: data.location,
          image: data.image || null,
        },
        populate: ['image'],
      });

      return { data: updatedEvent };
    } catch (err) {
      ctx.throw(500, 'Error updating event');
    }
  },

  // Delete event
  async delete(ctx) {
    try {
      const { id } = ctx.params;

      const event = await strapi.entityService.findOne('api::event.event', id, {
        populate: ['image'],
      }) as EventWithImage;

      if (event?.image?.id) {
        try {
          await strapi.entityService.delete('plugin::upload.file', event.image.id);
        } catch (imgErr) {
          strapi.log.error('Failed to delete image:', imgErr);
        }
      }

      const deletedEvent = await strapi.entityService.delete('api::event.event', id);
      return { data: deletedEvent };
    } catch (err) {
      ctx.throw(500, 'Error deleting event');
    }
  },

}));
