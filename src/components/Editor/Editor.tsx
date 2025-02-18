'use client';

import type { Article } from '@prisma/client';
import {
  EditorBubble,
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
  EditorContent,
  type EditorInstance,
  EditorRoot,
  type JSONContent,
  handleCommandNavigation,
} from 'novel';
import { useState } from 'react';
import { useDebounceCallback, useLocalStorage } from 'usehooks-ts';

import { ColorSelector } from './bubble-menu/color-selector';
import { LinkSelector } from './bubble-menu/link-selector';
import { NodeSelector } from './bubble-menu/node-selector';
import { TextButtons } from './bubble-menu/text-buttons';
import { defaultExtensions } from './extensions';
import { slashCommand, suggestionItems } from './slash-commands';

export const extensions = [...defaultExtensions, slashCommand];

type Props = {
  id: Article['id'];
  content: Article['content'];
};
export default function Editor({ content: initialContent, id }: Props) {
  const [value, setValue, removeValue] = useLocalStorage(
    `edited_${id}`,
    initialContent,
  );

  const [content, setContent] = useState<JSONContent | null>(
    value as JSONContent,
  );
  const [openNode, setOpenNode] = useState(false);
  const [openLink, setOpenLink] = useState(false);
  const [openColor, setOpenColor] = useState(false);

  const debouncedUpdates = useDebounceCallback(
    async (editor: EditorInstance) => {
      const json = editor.getJSON();
      setContent(json);
      setValue(json);
    },
    500,
  );

  const handleSaveContent = () => {
    // update value in db
    // ...

    // remove edited json from localStorage
    removeValue();

    // redirect user or change state
    // ...
  };

  return (
    <EditorRoot>
      <EditorContent
        initialContent={content ?? undefined}
        onUpdate={({ editor }) => debouncedUpdates(editor)}
        editorProps={{
          handleDOMEvents: {
            keydown: (_view, event) => handleCommandNavigation(event),
          },
          attributes: {
            class: `prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full`,
          },
        }}
        extensions={extensions}
      >
        <EditorCommand className="z-50 h-auto max-h-[330px] w-72 overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
          <EditorCommandEmpty className="px-2 text-muted-foreground">
            No results
          </EditorCommandEmpty>
          <EditorCommandList>
            {suggestionItems.map((item) => (
              <EditorCommandItem
                value={item.title}
                onCommand={(val) => item.command?.(val)}
                className={`flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent`}
                key={item.title}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                  {item.icon}
                </div>
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </EditorCommandItem>
            ))}
          </EditorCommandList>
        </EditorCommand>
        <EditorBubble
          tippyOptions={{
            placement: 'top',
          }}
          className="flex w-fit max-w-[90vw] overflow-hidden rounded border border-muted bg-background shadow-xl"
        >
          <NodeSelector open={openNode} onOpenChange={setOpenNode} />
          <LinkSelector open={openLink} onOpenChange={setOpenLink} />
          <TextButtons />
          <ColorSelector open={openColor} onOpenChange={setOpenColor} />
        </EditorBubble>
      </EditorContent>
    </EditorRoot>
  );
}
