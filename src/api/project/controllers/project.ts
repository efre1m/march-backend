import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::project.project', ({ strapi }) => ({
  // Fetch all projects
  async find(ctx) {
    try {
      const results = await strapi.entityService.findMany('api::project.project', {
        populate: ['image'],
        ...ctx.query,
      });
      return { data: results };
    } catch (err) {
      ctx.throw(500, 'Error fetching projects');
    }
  },

  // Create new project
  async create(ctx) {
    try {
      const { data } = ctx.request.body;

      // Validate required fields
      if (
        !data ||
        !data.title ||
        !data.summary ||
        !data.description ||
        !data.projectStatus ||
        !data.startDate // startDate required if projectStatus is ongoing
      ) {
        return ctx.badRequest(
          'Title, summary, description, projectStatus, and startDate are required'
        );
      }

      const newProject = await strapi.entityService.create('api::project.project', {
        data: {
          title: data.title,
          summary: data.summary,
          description: data.description,
          projectStatus: data.projectStatus,
          startDate: data.startDate,
          endDate: data.endDate || null,
          image: data.image || null,
        },
        populate: ['image'],
      });

      return { data: newProject };
    } catch (err) {
      ctx.throw(500, 'Error creating project');
    }
  },

  // Update project
  async update(ctx) {
    try {
      const { id } = ctx.params;
      const { data } = ctx.request.body;

      // Optional: validate here too if needed

      const updatedProject = await strapi.entityService.update('api::project.project', id, {
        data: {
          title: data.title,
          summary: data.summary,
          description: data.description,
          projectStatus: data.projectStatus,
          startDate: data.startDate,
          endDate: data.endDate || null,
          image: data.image || null,
        },
        populate: ['image'],
      });

      return { data: updatedProject };
    } catch (err) {
      ctx.throw(500, 'Error updating project');
    }
  },

  // Delete project
  async delete(ctx) {
    try {
      const { id } = ctx.params;
      const deletedProject = await strapi.entityService.delete('api::project.project', id);
      return { data: deletedProject };
    } catch (err) {
      ctx.throw(500, 'Error deleting project');
    }
  },
}));
