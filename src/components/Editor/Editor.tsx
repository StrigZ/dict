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
import { useDebouncedCallback } from 'use-debounce';

import { cn } from '~/lib/utils';

import { ColorSelector } from './bubble-menu/color-selector';
import { LinkSelector } from './bubble-menu/link-selector';
import { NodeSelector } from './bubble-menu/node-selector';
import { TextButtons } from './bubble-menu/text-buttons';
import { defaultExtensions } from './extensions';
import { slashCommand, suggestionItems } from './slash-commands';

export const extensions = [...defaultExtensions, slashCommand];

type Props = {
  initialContent?: Article['content'];
  onContentChange: (value: Article['content']) => void;
  className?: string;
  onKeyDown?: () => void; //
  onSave?: () => void; //
};
export default function Editor({
  initialContent,
  className,
  onContentChange,
  onKeyDown,
  onSave,
}: Props) {
  const [openNode, setOpenNode] = useState(false);
  const [openLink, setOpenLink] = useState(false);
  const [openColor, setOpenColor] = useState(false);

  const debouncedUpdates = useDebouncedCallback((editor: EditorInstance) => {
    const json = editor.getJSON();
    onContentChange(json);
    onSave?.();
  }, 500);

  return (
    <EditorRoot>
      <EditorContent
        initialContent={initialContent as JSONContent}
        onUpdate={({ editor }) => {
          onKeyDown?.();
          debouncedUpdates(editor);
        }}
        editorProps={{
          handleDOMEvents: {
            keydown: (_view, event) => {
              handleCommandNavigation(event);
            },
          },
          attributes: {
            class: cn(
              `prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full rounded  border border-border`,
              className,
            ),
          },
        }}
        extensions={extensions}
        className={cn('w-full', className)}
      >
        <EditorCommand className="z-[9999] h-auto max-h-[330px] w-72 overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
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
          className="z-[9999] flex w-fit max-w-[90vw] overflow-hidden rounded border border-muted bg-background shadow-xl"
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
