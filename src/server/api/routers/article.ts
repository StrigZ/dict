import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';

export const articleRouter = createTRPCRouter({
  getInfiniteArticlesByLetter: protectedProcedure
    .input(
      z.object({
        startsWith: z.string(),
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.number().nullish(), // <-- "cursor" needs to exist, but can be any type
      }),
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 50;
      const { cursor } = input;
      const items = await ctx.db.article.findMany({
        where: {
          title: { startsWith: input.startsWith, mode: 'insensitive' },
          createdById: ctx.session.user.id,
        },
        select: {
          id: true,
          title: true,
        },
        take: limit + 1, // get an extra item at the end which we'll use as next cursor
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          title: 'asc',
        },
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem!.id;
      }
      return {
        items,
        nextCursor,
      };
    }),
  getInfiniteArticlesSearch: protectedProcedure
    .input(
      z.object({
        contains: z.string(),
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.number().nullish(), // <-- "cursor" needs to exist, but can be any type
      }),
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 50;
      const { cursor } = input;
      const items = await ctx.db.article.findMany({
        where: {
          title: { contains: input.contains, mode: 'insensitive' },
          createdById: ctx.session.user.id,
        },
        select: {
          id: true,
          title: true,
        },
        take: limit + 1, // get an extra item at the end which we'll use as next cursor
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          title: 'asc',
        },
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem!.id;
      }
      return {
        items,
        nextCursor,
      };
    }),
  getSingle: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.article.findUnique({
        where: { id: input.id, createdById: ctx.session.user.id },
      });
    }),
  getByLetter: protectedProcedure
    .input(z.object({ startsWith: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.article.findMany({
        where: {
          title: { startsWith: input.startsWith, mode: 'insensitive' },
          createdById: ctx.session.user.id,
        },
        select: {
          id: true,
          title: true,
        },
      });
    }),
  getStartingLetters: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.$queryRaw`
    SELECT DISTINCT UPPER(SUBSTRING(title, 1, 1)) AS letter
    FROM "public"."Article"
    WHERE "createdById" = ${ctx.session.user.id}
    ORDER BY letter;
  ` as unknown as { letter: string }[];
  }),

  create: protectedProcedure
    .input(z.object({ title: z.string().min(1), content: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const doesExist = await ctx.db.article.findFirst({
        where: { title: input.title, createdById: ctx.session.user.id },
      });

      if (doesExist) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'An article with this title already exists.',
        });
      }

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
      const article = await ctx.db.article.findUnique({
        where: { id: input.id },
      });

      const doesExist = await ctx.db.article.findFirst({
        where: { title: input.title, createdById: ctx.session.user.id },
      });

      if (article?.title !== input.title && doesExist) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'An article with this title already exists.',
        });
      }
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
