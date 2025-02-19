'use client';

import { generateHTML } from '@tiptap/html';
import { SquarePen, Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import type { JSONContent } from 'novel';
import { useEffect, useState } from 'react';

import { useBreadcrumbsContext } from '~/providers/breadcrumbs-provider';
import { api } from '~/trpc/react';

import ArticleForm from './ArticleForm';
import { extensions } from './Editor/Editor';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';

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
    <ScrollArea className="flex-1">
      <article className="flex flex-col gap-8 px-8 pb-8">
        <header className="flex items-center justify-end gap-2">
          <Button
            onClick={() => setIsEditing((p) => !p)}
            variant="secondary"
            size="icon"
          >
            <SquarePen />
          </Button>
          <Button
            onClick={handleDeleteArticle}
            variant="destructive"
            size="icon"
            disabled={deleteArticle.isPending || deleteArticle.isSuccess}
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
          <>
            <h2 className="pl-6 text-4xl font-bold underline">{data.title}</h2>
            <div
              dangerouslySetInnerHTML={{
                __html: generateHTML(
                  JSON.parse(data.content as string) as JSONContent,
                  extensions,
                ),
              }}
              className="prose-headings:font-title font-default ProseMirror prose prose-lg max-w-full dark:prose-invert focus:outline-none"
            />
          </>
        )}
      </article>
    </ScrollArea>
  );
}
