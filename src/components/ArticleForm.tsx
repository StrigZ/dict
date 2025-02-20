'use client';

import { Article } from '@prisma/client';
import type { JSONContent } from 'novel';

import useArticleForm from '~/hooks/use-article-form';
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
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';

type Props = {
  className?: string;
  onClose?: () => void;
  defaultValues?: {
    title: Article['title'];
    content: Article['content'];
  };
};
export default function ArticleForm({
  className,
  onClose,
  defaultValues,
}: Props) {
  const { form, onSubmit } = useArticleForm({ onClose, defaultValues });

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
                <Input {...field} className="px-4" />
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
                {defaultValues ? (
                  <Editor
                    className="is-editing min-h-72"
                    initialContent={field.value as JSONContent}
                    onContentChange={field.onChange}
                  />
                ) : (
                  <ScrollArea className="w-full rounded border border-border [&>div>div]:w-full [&>div>div]:table-fixed">
                    <Editor
                      className="is-editing max-h-72 min-h-36 w-full break-words border-none"
                      initialContent={field.value as JSONContent}
                      onContentChange={field.onChange}
                    />
                  </ScrollArea>
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className={cn({ 'sticky bottom-8 left-8 shadow': defaultValues })}
        >
          {defaultValues ? 'Save' : 'Create'}
        </Button>
      </form>
    </Form>
  );
}
