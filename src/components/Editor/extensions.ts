import { Extension } from '@tiptap/core';
import { cx } from 'class-variance-authority';
import {
  Color,
  HighlightExtension,
  HorizontalRule,
  Placeholder,
  StarterKit,
  TaskItem,
  TaskList,
  TextStyle,
  TiptapImage,
  TiptapLink,
  TiptapUnderline,
  UpdatedImage,
} from 'novel';
import { Plugin, PluginKey, TextSelection } from 'prosemirror-state';
import AutoJoiner from 'tiptap-extension-auto-joiner';
import GlobalDragHandle from 'tiptap-extension-global-drag-handle';

const placeholder = Placeholder;
const tiptapLink = TiptapLink.configure({
  HTMLAttributes: {
    class: cx(
      'text-muted-foreground underline underline-offset-[3px] hover:text-primary transition-colors cursor-pointer',
    ),
  },
});

const taskList = TaskList.configure({
  HTMLAttributes: {
    class: cx('not-prose pl-2'),
  },
});
const taskItem = TaskItem.configure({
  HTMLAttributes: {
    class: cx('flex items-start my-4'),
  },
  nested: true,
});

const horizontalRule = HorizontalRule.configure({
  HTMLAttributes: {
    class: cx('mt-4 mb-6 border-t border-muted-foreground'),
  },
});

const starterKit = StarterKit.configure({
  bulletList: {
    HTMLAttributes: {
      class: cx('list-disc list-outside leading-3 -mt-2'),
    },
  },
  orderedList: {
    HTMLAttributes: {
      class: cx('list-decimal list-outside leading-3 -mt-2'),
    },
  },
  listItem: {
    HTMLAttributes: {
      class: cx('leading-normal -mb-2'),
    },
  },
  blockquote: {
    HTMLAttributes: {
      class: cx('border-l-4 border-primary'),
    },
  },
  codeBlock: {
    HTMLAttributes: {
      class: cx('rounded-sm bg-muted border p-5 font-mono font-medium'),
    },
  },
  code: {
    HTMLAttributes: {
      class: cx('rounded-md bg-muted  px-1.5 py-1 font-mono font-medium'),
      spellcheck: 'false',
    },
  },
  horizontalRule: false,
  dropcursor: {
    color: '#DBEAFE',
    width: 4,
  },
  gapcursor: false,
});

const globalDragHandle = GlobalDragHandle.configure({
  dragHandleWidth: 20, // default

  // The scrollThreshold specifies how close the user must drag an element to the edge of the lower/upper screen for automatic
  // scrolling to take place. For example, scrollThreshold = 100 means that scrolling starts automatically when the user drags an
  // element to a position that is max. 99px away from the edge of the screen
  // You can set this to 0 to prevent auto scrolling caused by this extension
  scrollTreshold: 100, // default
});

const autoJoiner = AutoJoiner.configure({
  elementsToJoin: ['bulletList', 'orderedList'], // default
});

const highlight = HighlightExtension.configure({ multicolor: true });

const AutoEnDash = Extension.create({
  name: 'autoEnDash',

  addProseMirrorPlugins() {
    const pluginKey = new PluginKey('autoEnDash');

    return [
      new Plugin({
        key: pluginKey,
        // Track if we've detected a potential en dash pattern
        state: {
          init() {
            return {
              potentialEnDash: false,
              startPos: null,
              patternPos: null,
            };
          },
          apply(_, prev) {
            return prev; // State persists across transactions
          },
        },
        appendTransaction: (transactions, _, newState) => {
          // Only proceed if content has changed
          const docChanged = transactions.some((tr) => tr.docChanged);
          if (!docChanged) return null;

          // Get the current selection position
          const { selection } = newState;

          if (!(selection instanceof TextSelection && selection.$cursor)) {
            return null;
          }

          const { $cursor } = selection;

          // Check if we have a cursor and it's in a valid text node
          if (!$cursor?.parent.type.isTextblock) return null;

          // Get the text before the cursor
          const textBefore = $cursor.parent.textContent.slice(
            0,
            $cursor.parentOffset,
          );

          // Pattern: text + space + hyphen + space + text + space
          // This regex looks for: a word (\S+) followed by space, hyphen, space (\s+-\s+),
          // followed by another word (\S+), with a space at the end (\s+$)
          const completedPattern =
            /([\w\u0400-\u04FF]+)(\s+-\s+)([\w\u0400-\u04FF]+)\s+$/;
          const match = completedPattern.exec(textBefore);

          if (!match) {
            return null;
          }

          // Create a transaction to replace the hyphen with an en dash
          const tr = newState.tr;

          // Calculate positions for the replacement
          // Start position is where the space before hyphen begins
          const matchStart = $cursor.pos - match[0].length;
          // The specific part we want to replace is just the " - " section
          if (!match[1] || !match[2]) {
            return null;
          }

          const hyphenStart = matchStart + match[1].length;
          const hyphenEnd = hyphenStart + match[2].length;

          // Replace " - " with " – " (en dash)
          tr.replaceWith(hyphenStart, hyphenEnd, newState.schema.text(' – '));

          return tr;
        },
      }),
    ];
  },
});

export const defaultExtensions = [
  tiptapLink,
  starterKit,
  placeholder,
  TiptapLink,
  TiptapImage,
  UpdatedImage,
  taskList,
  taskItem,
  horizontalRule,
  globalDragHandle,
  autoJoiner,
  highlight,
  TiptapUnderline,
  Color,
  TextStyle,
  AutoEnDash,
];
