'use client';

import { generateHTML } from '@tiptap/html';
import { CircleX, SquarePen, Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import type { JSONContent } from 'novel';
import { useEffect, useState } from 'react';

import { useBreadcrumbsContext } from '~/providers/breadcrumbs-provider';
import { api } from '~/trpc/react';

import ArticleForm from './ArticleForm';
import { extensions } from './Editor/Editor';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';

type Props = {};
export default function Article({}: Props) {
  const params = useParams();
  const router = useRouter();
  const [data] = api.article.getSingle.useSuspenseQuery({
    id: Number(params.slug),
  });
  const utils = api.useUtils();
  const deleteArticle = api.article.delete.useMutation({
    onSuccess: () => {
      void utils.article.getByLetter.invalidate();
      void utils.article.getStartingLetters.invalidate();
      router.push('/');
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const { selectActiveArticle, selectActiveLetter } = useBreadcrumbsContext();

  useEffect(() => {
    if (data?.title) {
      const firstLetter = data?.title[0];
      if (firstLetter) {
        selectActiveLetter(firstLetter.toUpperCase());
        selectActiveArticle(data);
      }
    }
  }, [data, selectActiveArticle, selectActiveLetter]);

  if (!data) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-8 px-8 text-center text-xl">
        Article doesn't exist.
      </div>
    );
  }
  const handleDeleteArticle = () => deleteArticle.mutate({ id: data.id });

  return (
    <ScrollArea className="flex h-full flex-1 [&>div>div]:h-full [&>div>div]:w-full [&>div>div]:table-fixed">
      <article className="relative flex h-full flex-col gap-8 border-r px-12 pt-0">
        <header className="sticky right-4 top-4 z-10 ml-auto flex gap-2">
          <Button
            onClick={() => setIsEditing((p) => !p)}
            variant={isEditing ? 'default' : 'secondary'}
            size="icon"
            className="shadow"
          >
            {isEditing ? <CircleX /> : <SquarePen />}
          </Button>
          <Button
            onClick={handleDeleteArticle}
            variant="destructive"
            size="icon"
            disabled={deleteArticle.isPending || deleteArticle.isSuccess}
            className="shadow"
          >
            <Trash />
          </Button>
        </header>
        {isEditing ? (
          <ArticleForm
            defaultValues={{ title: data.title, content: data.content }}
            onClose={() => setIsEditing(false)}
          />
        ) : (
          <div className="flex flex-col gap-8 pb-12">
            <h2 className="text-4xl font-bold">{data.title}</h2>
            <Separator />
            <div
              dangerouslySetInnerHTML={{
                __html: generateHTML(
                  JSON.parse(data.content as string) as JSONContent,
                  extensions,
                ),
              }}
              className="prose-headings:font-title font-default ProseMirror prose prose-lg max-w-full break-words dark:prose-invert focus:outline-none"
            />
          </div>
        )}
      </article>
    </ScrollArea>
  );
}
