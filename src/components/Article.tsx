'use client';

import { generateHTML } from '@tiptap/html';
import { useParams } from 'next/navigation';
import type { JSONContent } from 'novel';
import { useState } from 'react';

import { api } from '~/trpc/react';

import Editor, { extensions } from './Editor/Editor';

type Props = {};
export default function Article({}: Props) {
  const params = useParams();
  const [data] = api.article.getSingle.useSuspenseQuery({
    id: Number(params.slug),
  });
  const [isEditing, setIsEditing] = useState(false);

  if (!data) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-8 px-8 text-center text-xl">
        Article doesn't exist.
      </div>
    );
  }

  return (
    <article className="flex flex-1 flex-col gap-8 px-8">
      <button onClick={() => setIsEditing((p) => !p)}>EDIT</button>
      <h1 className="pl-6 text-4xl">{data.title}</h1>
      {isEditing ? (
        <Editor
          initialContent={data.content}
          onContentChange={() => {
            //
          }}
        />
      ) : (
        <div
          dangerouslySetInnerHTML={{
            __html: generateHTML(
              JSON.parse(data.content as string) as JSONContent,
              extensions,
            ),
          }}
          className="prose-headings:font-title font-default ProseMirror prose prose-lg max-w-full dark:prose-invert focus:outline-none"
        />
      )}
    </article>
  );
}
