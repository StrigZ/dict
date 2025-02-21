'use client';

import { generateHTML } from '@tiptap/html';
import { CircleX, SquarePen } from 'lucide-react';
import type { JSONContent } from 'novel';
import { useState } from 'react';

import { api } from '~/trpc/react';

import { extensions } from '../Editor/Editor';
import { Button } from '../ui/button';
import PlaygroundForm from './PlaygroundForm';

export default function Playground() {
  const [data] = api.playground.get.useSuspenseQuery();

  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      <header className="sticky right-4 top-4 z-10 ml-auto flex gap-2">
        <Button
          onClick={() => setIsEditing((p) => !p)}
          variant={isEditing ? 'default' : 'secondary'}
          size="icon"
          className="shadow"
        >
          {isEditing ? <CircleX /> : <SquarePen />}
        </Button>
      </header>
      {isEditing ? (
        <PlaygroundForm
          defaultValues={{ content: data.content }}
          onComplete={() => setIsEditing(false)}
        />
      ) : (
        <div
          dangerouslySetInnerHTML={{
            __html: generateHTML(
              JSON.parse(data?.content as string) as JSONContent,
              extensions,
            ),
          }}
          className="prose-headings:font-title font-default ProseMirror prose prose-lg max-w-full break-words pb-12 dark:prose-invert focus:outline-none"
        />
      )}
    </>
  );
}
