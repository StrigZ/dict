'use client';

import type { Playground } from '@prisma/client';
import type { JSONContent } from 'novel';
import { useState } from 'react';

import usePlaygroundForm from '~/hooks/use-playground-form';
import { cn } from '~/lib/utils';

import Editor from './Editor/Editor';
import { Button } from './ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';

type Props = {
  className?: string;
  onComplete?: () => void;
  defaultValues: {
    content: Playground['content'];
  };
};
export default function PlaygroundForm({
  className,
  onComplete,
  defaultValues,
}: Props) {
  const { form, onSubmit, isDisabled } = usePlaygroundForm({
    onComplete,
    defaultValues,
  });
  const [isEditorSaved, setIsEditorSaved] = useState(true); // State to track if the editor is saved

  return (
    <Form {...form}>
      <form
        className={cn('flex w-full flex-col items-start gap-4', className)}
        onSubmit={onSubmit}
      >
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Editor
                  className="is-editing min-h-72"
                  initialContent={field.value as JSONContent}
                  onContentChange={(content) => {
                    field.onChange(content);
                    setIsEditorSaved(true);
                  }}
                  onKeyDown={() => {
                    if (isEditorSaved) {
                      setIsEditorSaved(false);
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className={cn({ 'sticky bottom-8 left-8 shadow': defaultValues })}
          disabled={isDisabled || !isEditorSaved}
        >
          {defaultValues ? 'Save' : 'Create'}
        </Button>
      </form>
    </Form>
  );
}
