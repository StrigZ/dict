'use client';

import type { JSONContent } from 'novel';

import useCreateArticleForm from '~/hooks/use-create-article-form';
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

type Props = { className?: string; onClose: () => void };
export default function NewArticleForm({ className, onClose }: Props) {
  const { form, onSubmit } = useCreateArticleForm({ onClose });

  return (
    <Form {...form}>
      <form
        className={cn('grid items-start gap-4 overflow-hidden', className)}
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
                <ScrollArea>
                  <Editor
                    className="max-h-72"
                    initialContent={field.value as JSONContent}
                    onContentChange={field.onChange}
                  />
                </ScrollArea>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Create</Button>
      </form>
    </Form>
  );
}
