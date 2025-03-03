'use client';

import type { Article } from '@prisma/client';
import type { JSONContent } from 'novel';
import { useEffect, useState } from 'react';

import useArticleForm from '~/hooks/use-article-form';
import { cn } from '~/lib/utils';
import { useBreadcrumbsContext } from '~/providers/breadcrumbs-provider';

import Editor from '../Editor/Editor';
import { Button } from '../ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';

type Props = {
  className?: string;
  onComplete?: () => void;
  defaultValues?: {
    title: Article['title'];
    content: Article['content'];
  };
};
export default function ArticleForm({
  className,
  onComplete,
  defaultValues,
}: Props) {
  const { form, onSubmit, isDisabled } = useArticleForm({
    onComplete,
    defaultValues,
  });
  const { resetSelection } = useBreadcrumbsContext();
  const [isEditorSaved, setIsEditorSaved] = useState(true); // State to track if the editor is saved
  useEffect(() => {
    if (!defaultValues) {
      resetSelection();
    }
  }, [defaultValues, resetSelection]);

  return (
    <Form {...form}>
      <form
        className={cn('flex w-full flex-col items-start gap-4', className)}
        onSubmit={onSubmit}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={({ target }) => {
                    const title = target.value;
                    const completedPattern =
                      /([\w\u0400-\u04FF]+)(\s+-\s+)([\w\u0400-\u04FF]+)\s+$/;
                    const match = completedPattern.exec(title);
                    if (match) {
                      const dashPos = title.lastIndexOf('-');
                      const editedTitle =
                        title.substring(0, dashPos) +
                        '–' +
                        title.substring(dashPos + 1);
                      return field.onChange(editedTitle);
                    }
                    field.onChange(title);
                  }}
                  className="px-4"
                  autoFocus
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
          className="sticky bottom-8 left-8 shadow"
          disabled={isDisabled || !isEditorSaved}
        >
          {defaultValues ? 'Save' : 'Create'}
        </Button>
      </form>
    </Form>
  );
}
