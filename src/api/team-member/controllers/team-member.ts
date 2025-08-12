import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::team-member.team-member',
  ({ strapi }) => ({

    // GET /api/team-members
    async find(ctx) {
      try {
        const results = await strapi.entityService.findMany(
          'api::team-member.team-member',
          {
            populate: ['Image'],
          }
        );
        return { data: results };
      } catch (err) {
        ctx.throw(500, 'Error fetching team members');
      }
    },

    // POST /api/team-members
    async create(ctx) {
      try {
        const { data } = ctx.request.body;

        if (!data?.Name || !data?.Position || !data?.Email) {
          return ctx.badRequest('Name, Position and Email are required');
        }

        const newMember = await strapi.entityService.create(
          'api::team-member.team-member',
          {
            data: {
              Name: data.Name,
              Position: data.Position,
              Email: data.Email,
              bio: data.bio || "", // ✅ Add bio
              quote: data.quote || "",
              Image: data.Image || null,
            },
            populate: ['Image'],
          }
        );

        return { data: newMember };
      } catch (err) {
        ctx.throw(500, 'Error creating team member');
      }
    },

    // PUT /api/team-members/:id
    async update(ctx) {
      try {
        const { id } = ctx.params;
        const { data } = ctx.request.body;

        const updatedMember = await strapi.entityService.update(
          'api::team-member.team-member',
          id,
          {
            data: {
              Name: data.Name,
              Position: data.Position,
              Email: data.Email,
              bio: data.bio || "", // ✅ Add bio
               quote: data.quote || "",
              Image: data.Image || null,
            },
            populate: ['Image'],
          }
        );

        return { data: updatedMember };
      } catch (err) {
        ctx.throw(500, 'Error updating team member');
      }
    },

    // DELETE /api/team-members/:id
    async delete(ctx) {
      try {
        const { id } = ctx.params;

        const deletedMember = await strapi.entityService.delete(
          'api::team-member.team-member',
          id
        );

        return { data: deletedMember };
      } catch (err) {
        ctx.throw(500, 'Error deleting team member');
      }
    }
  })
);
