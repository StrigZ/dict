'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import type { Playground } from '@prisma/client';
import type { JSONContent } from 'novel';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { api } from '~/trpc/react';

import { useToast } from './use-toast';

export default function usePlaygroundForm({
  onComplete,
  defaultValues,
}: {
  defaultValues: {
    content: Playground['content'];
  };
  onComplete?: () => void;
}) {
  const { toast } = useToast();

  const utils = api.useUtils();

  const playgroundSchema = z.object({
    content: z
      .record(z.unknown())
      .refine(
        (schema) => Object.keys(schema).length > 0,
        'Content cannot be empty',
      ),
  });

  const form = useForm<z.infer<typeof playgroundSchema>>({
    resolver: zodResolver(playgroundSchema),
    defaultValues: {
      content: JSON.parse(defaultValues?.content as string) as JSONContent,
    },
  });

  const updatePlayground = api.playground.update.useMutation({
    onSuccess: async () => {
      await utils.playground.get.invalidate();
      onComplete?.();
    },
    onError: ({ message }) => {
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    },
  });

  const onSubmit = ({ content }: z.infer<typeof playgroundSchema>) => {
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

    return updatePlayground.mutate({
      content: JSON.stringify({ ...content, content: strippedContent }),
    });
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isDisabled: updatePlayground.isPending || updatePlayground.isSuccess,
  };
}
