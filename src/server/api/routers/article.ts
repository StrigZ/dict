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
  getSingle: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.article.findUnique({
        where: { id: input.id },
      });
    }),
  getByLetter: protectedProcedure
    .input(z.object({ startsWith: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.article.findMany({
        where: { title: { startsWith: input.startsWith, mode: 'insensitive' } },
      });
    }),
  getStartingLetters: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.$queryRaw`
    SELECT DISTINCT UPPER(SUBSTRING(title, 1, 1)) AS letter
    FROM "public"."Article"
    ORDER BY letter;
  ` as unknown as { letter: string }[];
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
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        content: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.article.update({
        where: { id: input.id },
        data: {
          title: input.title,
          content: input.content,
        },
      });
    }),
  delete: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.article.delete({
        where: { id: input.id },
      });
    }),
});
