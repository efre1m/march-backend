import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::news-article.news-article",
  ({ strapi }) => ({
    async find(ctx) {
      try {
        const results = await strapi.entityService.findMany(
          "api::news-article.news-article",
          {
            populate: ["content_blocks.image", "document"],
            ...ctx.query,
          }
        );
        return { data: results };
      } catch (err) {
        ctx.throw(500, "Error fetching news articles");
      }
    },

    async findOne(ctx) {
      try {
        const { id } = ctx.params;

        const entity = await strapi.entityService.findOne(
          "api::news-article.news-article",
          id,
          {
            populate: ["content_blocks.image", "document"],
          }
        );

        if (!entity) {
          return ctx.notFound("News article not found");
        }

        return { data: entity };
      } catch (err) {
        ctx.throw(500, "Error fetching single news article");
      }
    },

    async create(ctx) {
      try {
        const { data } = ctx.request.body;

        if (!data || !data.title || !data.date) {
          return ctx.badRequest("Title and date are required");
        }

        // No description field now, content in content_blocks or document
        const newArticle = await strapi.entityService.create(
          "api::news-article.news-article",
          {
            data: {
              title: data.title,
              date: data.date,
              content_blocks: data.content_blocks || [],
              document: data.document || null,
            },
            populate: ["content_blocks.image", "document"],
          }
        );

        return { data: newArticle };
      } catch (err) {
        ctx.throw(500, "Error creating news article");
      }
    },

    async update(ctx) {
      try {
        const { id } = ctx.params;
        const { data } = ctx.request.body;

        const updatedArticle = await strapi.entityService.update(
          "api::news-article.news-article",
          id,
          {
            data: {
              title: data.title,
              date: data.date,
              content_blocks: data.content_blocks || [],
              document: data.document || null,
            },
            populate: ["content_blocks.image", "document"],
          }
        );

        return { data: updatedArticle };
      } catch (err) {
        ctx.throw(500, "Error updating news article");
      }
    },

    async delete(ctx) {
      try {
        const { id } = ctx.params;
        const deletedArticle = await strapi.entityService.delete(
          "api::news-article.news-article",
          id
        );
        return { data: deletedArticle };
      } catch (err) {
        ctx.throw(500, "Error deleting news article");
      }
    },
  })
);
