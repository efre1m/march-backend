// src/api/vacancy/controllers/vacancy.ts
import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::vacancy.vacancy', ({ strapi }) => ({

  // 📌 Fetch all vacancies with related applications
  async find(ctx) {
    try {
      const results = await strapi.entityService.findMany('api::vacancy.vacancy', {
        populate: ['applications'],
        ...ctx.query,
      });
      return { data: results };
    } catch (err) {
      strapi.log.error('Error fetching vacancies', err);
      ctx.throw(500, 'Error fetching vacancies');
    }
  },

  // 📌 Create a new vacancy
  async create(ctx) {
    try {
      const { data } = ctx.request.body;

      // ✅ Validate required fields
      if (
        !data?.title ||
        !data?.location ||
        !data?.department ||
        !data?.jobType ||
        !data?.postedAt ||
        !data?.deadline ||
        !data?.description
      ) {
        return ctx.badRequest('All required fields must be filled');
      }

      // ✅ Default requiredCandidates
      const requiredCandidates =
        typeof data.requiredCandidates === 'number'
          ? data.requiredCandidates
          : 1;

      // ✅ Determine initial status
      const now = new Date();
      const deadline = new Date(data.deadline);
      let vacancyStatus: 'opened' | 'closed' = 'opened';
      if (deadline < now) {
        vacancyStatus = 'closed';
      }

      const newVacancy = await strapi.entityService.create('api::vacancy.vacancy', {
        data: {
          ...data,
          requiredCandidates,
          vacancyStatus,
        },
      });

      return { data: newVacancy };
    } catch (err) {
      strapi.log.error('Error creating vacancy', err);
      ctx.throw(500, 'Error creating vacancy');
    }
  },

  // 📌 Update a vacancy
  async update(ctx) {
    try {
      const { id } = ctx.params;
      const { data } = ctx.request.body;

      // ✅ Fetch existing vacancy to check current state and applications
      const existing = await strapi.entityService.findOne('api::vacancy.vacancy', id, {
        populate: ['applications'],
      });
      if (!existing) {
        return ctx.notFound('Vacancy not found');
      }

      // ✅ Determine required candidates
      const requiredCandidates =
        typeof data.requiredCandidates === 'number'
          ? data.requiredCandidates
          : existing.requiredCandidates || 1;

      // ✅ Check how many have "pass"
      const qualifiedCount = ((existing as any).applications || []).filter(
          (app: any) => app.qualification === 'pass').length;


      // ✅ Compute deadline and status
      const now = new Date();
      const deadline = data.deadline
        ? new Date(data.deadline)
        : new Date(existing.deadline);

      let vacancyStatus: 'opened' | 'closed' = 'opened';
      if (deadline < now || qualifiedCount >= requiredCandidates) {
        vacancyStatus = 'closed';
      }

      const updatedVacancy = await strapi.entityService.update('api::vacancy.vacancy', id, {
        data: {
          ...data,
          requiredCandidates,
          vacancyStatus,
        },
      });

      return { data: updatedVacancy };
    } catch (err) {
      strapi.log.error('Error updating vacancy', err);
      ctx.throw(500, 'Error updating vacancy');
    }
  },

  // 📌 Delete a vacancy
  async delete(ctx) {
    try {
      const { id } = ctx.params;
      const deletedVacancy = await strapi.entityService.delete('api::vacancy.vacancy', id);
      return { data: deletedVacancy };
    } catch (err) {
      strapi.log.error('Error deleting vacancy', err);
      ctx.throw(500, 'Error deleting vacancy');
    }
  },
}));
