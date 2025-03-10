import { Popover, PopoverTrigger } from '@radix-ui/react-popover';
import { Check, Trash } from 'lucide-react';
import { useEditor } from 'novel';
import { useEffect, useRef } from 'react';

import { Button } from '~/components/ui/button';
import { PopoverContent } from '~/components/ui/popover';
import { cn } from '~/lib/utils';

export function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
export function getUrlFromString(str: string) {
  if (isValidUrl(str)) return str;
  try {
    if (str.includes('.') && !str.includes(' ')) {
      return new URL(`https://${str}`).toString();
    }
  } catch {
    return null;
  }
}
interface LinkSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LinkSelector = ({ open, onOpenChange }: LinkSelectorProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { editor } = useEditor();

  // Autofocus on input by default
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current?.focus();
    }
  });
  if (!editor) return null;

  const handleAddLink = () => {
    if (inputRef.current) {
      const url = getUrlFromString(inputRef.current.value);
      if (url) {
        editor.chain().focus().setLink({ href: url }).run();
      }
    }
  };

  const handleRemoveLink = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    editor.chain().focus().unsetLink().run();
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="gap-2 rounded-none border-none"
          type="button"
        >
          <p className="text-base">↗</p>
          <p
            className={cn('underline decoration-stone-400 underline-offset-4', {
              'text-blue-500': editor.isActive('link'),
            })}
          >
            Link
          </p>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="flex w-60 p-1" sideOffset={10}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Paste a link"
          className="flex-1 bg-background p-1 text-sm outline-none"
          defaultValue={(editor.getAttributes('link').href as string) || ''}
        />
        {editor.getAttributes('link').href ? (
          <Button
            size="icon"
            variant="outline"
            className="flex h-8 items-center rounded-sm p-1 text-red-600 transition-all hover:bg-red-100 dark:hover:bg-red-800"
            onClick={handleRemoveLink}
          >
            <Trash className="h-4 w-4" />
          </Button>
        ) : (
          <Button size="icon" className="h-8" onClick={handleAddLink}>
            <Check className="h-4 w-4" />
          </Button>
        )}
      </PopoverContent>
    </Popover>
  );
};
