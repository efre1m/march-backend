import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::application.application', ({ strapi }) => ({

  async find(ctx) {
  try {
    const { populate, ...restQuery } = ctx.query;

    const results = await strapi.entityService.findMany('api::application.application', {
      populate: {
        vacancy: {
          populate: ['applications'], // for computing vacancyStatus
        },
        resume: true,
      },
      ...restQuery,
    });

    const enriched = results.map((app: any) => {
      const vacancy = app.vacancy;
      const now = new Date();
      const deadline = vacancy?.deadline ? new Date(vacancy.deadline) : null;
      const passedCount = vacancy?.applications?.filter((a: any) => a.qualification === 'pass').length || 0;
      const required = vacancy?.requiredCandidates ?? 1;

      let vacancyStatus = 'opened';
      if ((deadline && deadline <= now) || passedCount >= required) {
        vacancyStatus = 'closed';
      }

      return {
        ...app,
        vacancy: vacancy ? { ...vacancy, vacancyStatus } : null,
      };
    });

    return { data: enriched };
  } catch (err) {
    ctx.throw(500, 'Error fetching applications');
  }
},

  async create(ctx) {
    try {
      const { data } = ctx.request.body;

      if (
        !data?.name ||
        !data?.email ||
        !data?.appliedAt ||
        !data?.vacancy ||
        !data?.resume ||
        !data?.phoneNumber
      ) {
        return ctx.badRequest('Missing required fields');
      }

      // Fetch the vacancy title from the vacancy relation
      const vacancyId = data.vacancy;
      const vacancy = await strapi.entityService.findOne('api::vacancy.vacancy', vacancyId);

      const newApplication = await strapi.entityService.create('api::application.application', {
        data: {
          ...data,
          qualification: data.qualification || 'not_assessed',
          vacancyTitle: vacancy?.title || 'Deleted Job',
        },
      });

      return { data: newApplication };
    } catch (err) {
      ctx.throw(500, 'Error creating application');
    }
  },

  async update(ctx) {
    try {
      const { id } = ctx.params;
      const { data } = ctx.request.body;

      let vacancyTitle: string | undefined;

      if (data?.vacancy) {
        const vacancy = await strapi.entityService.findOne('api::vacancy.vacancy', data.vacancy);
        vacancyTitle = vacancy?.title || 'Deleted Job';
      }

      const updatedApplication = await strapi.entityService.update('api::application.application', id, {
        data: {
          ...data,
          vacancyTitle: vacancyTitle, // Only updates title if vacancy is reselected
        },
      });

      return { data: updatedApplication };
    } catch (err) {
      ctx.throw(500, 'Error updating application');
    }
  },

  async delete(ctx) {
    try {
      const { id } = ctx.params;
      const deletedApplication = await strapi.entityService.delete('api::application.application', id);
      return { data: deletedApplication };
    } catch (err) {
      ctx.throw(500, 'Error deleting application');
    }
  },
}));
