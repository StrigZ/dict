import { z } from 'zod';

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '~/server/api/trpc';

export const articleRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.article.findMany({
      where: { createdById: ctx.session.user.id },
    });
  }),
  create: protectedProcedure
    .input(z.object({ title: z.string().min(1), content: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.article.create({
        data: {
          createdBy: { connect: { id: ctx.session.user.id } },
          title: input.title,
          content: input.content,
        },
      });
    }),
});
