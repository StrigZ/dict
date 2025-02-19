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
        className={cn('grid items-start gap-4', className)}
        onSubmit={onSubmit}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                {defaultValues ? (
                  <Editor
                    className="min-h-72"
                    initialContent={field.value as JSONContent}
                    onContentChange={field.onChange}
                  />
                ) : (
                  <ScrollArea>
                    <Editor
                      className="max-h-72 min-h-36"
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

        <Button type="submit" className={cn({ 'mr-auto': defaultValues })}>
          {defaultValues ? 'Edit' : 'Create'}
        </Button>
      </form>
    </Form>
  );
}
