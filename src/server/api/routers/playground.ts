import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';

export const playgroundRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    const playground = await ctx.db.playground.findUnique({
      where: { createdById: ctx.session.user.id },
    });

    if (!playground) {
      return ctx.db.playground.create({
        data: {
          createdById: ctx.session.user.id,
          content:
            '{"type":"doc","content":[{"type":"heading","attrs":{"level":1},"content":[{"type":"text","text":"This is your playground!"}]}]}',
        },
      });
    }

    return playground;
  }),

  update: protectedProcedure
    .input(
      z.object({
        content: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.playground.update({
        where: { createdById: ctx.session.user.id },
        data: { content: input.content },
      });
    }),
});
