'use client';

import { generateHTML } from '@tiptap/html';
import { useParams } from 'next/navigation';
import { useState } from 'react';

import Editor, { extensions } from './Editor/Editor';

const jsonMock = {
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: {
        level: 1,
      },
      content: [
        {
          type: 'text',
          text: 'Welcome to Tiptap',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'This is a simple example of a document in Tiptap.',
        },
      ],
    },
    {
      type: 'bulletList',
      content: [
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'First item',
                },
              ],
            },
          ],
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Second item',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

type Props = {};
export default function Article({}: Props) {
  const params = useParams();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <article className="flex flex-1 flex-col gap-8 px-8">
      <button onClick={() => setIsEditing((p) => !p)}>EDIT</button>
      <h1 className="text-4xl">{params.slug}</h1>
      {isEditing ? (
        <Editor content={jsonMock} id={params.slug} />
      ) : (
        <div
          dangerouslySetInnerHTML={{
            // TODO: GENERATE HTML ON THE SERVER AND PASS AS A PROP
            __html: generateHTML(jsonMock, extensions),
          }}
          className="prose-headings:font-title font-default ProseMirror prose prose-lg max-w-full dark:prose-invert focus:outline-none"
        />
      )}
    </article>
  );
}
