'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Article } from '@prisma/client';
import { useParams, useRouter } from 'next/navigation';
import type { JSONContent } from 'novel';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { api } from '~/trpc/react';

import { useToast } from './use-toast';

export default function useArticleForm({
  onComplete,
  defaultValues,
}: {
  defaultValues?: {
    title: Article['title'];
    content: Article['content'];
  };
  onComplete?: () => void;
}) {
  const { toast } = useToast();

  const router = useRouter();
  const params = useParams();
  const utils = api.useUtils();

  const articleSchema = z.object({
    title: z.string().min(1, { message: 'Title cannot be empty' }),
    content: z
      .record(z.unknown())
      .refine(
        (schema) => Object.keys(schema).length > 0,
        'Content cannot be empty',
      ),
  });

  const form = useForm<z.infer<typeof articleSchema>>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: defaultValues?.title ?? '',
      content: defaultValues
        ? (JSON.parse(defaultValues.content as string) as JSONContent)
        : {},
    },
  });

  const createArticle = api.article.create.useMutation({
    onSuccess: ({ title: newArticleTitle, id }) => {
      void utils.article.getStartingLetters.invalidate();
      void utils.article.getByLetter.invalidate({
        startsWith: newArticleTitle[0]?.toUpperCase(),
      });
      onComplete?.();
      form.reset();
      router.push('/articles/' + id);
    },
  });

  const updateArticle = api.article.update.useMutation({
    onSuccess: ({ title: newArticleTitle, id }) => {
      void utils.article.getSingle.invalidate({
        id,
      });
      void utils.article.getByLetter.invalidate({
        startsWith: newArticleTitle[0]?.toUpperCase(),
      });
      void utils.article.getStartingLetters.invalidate();

      onComplete?.();
    },
  });

  const onSubmit = ({ content, title }: z.infer<typeof articleSchema>) => {
    const strippedContent = (content as unknown as JSONContent).content?.filter(
      (item) => Object.hasOwn(item, 'content'),
    );
    if (strippedContent?.length === 0) {
      return toast({
        title: 'Error',
        description: 'Content cannot be empty!',
        variant: 'destructive',
      });
    }

    if (defaultValues) {
      return updateArticle.mutate({
        id: Number(params.slug),
        title: title,
        content: JSON.stringify({ ...content, content: strippedContent }),
      });
    }

    createArticle.mutate({
      title: title,
      content: JSON.stringify({ ...content, content: strippedContent }),
    });
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
