'use client';

import { skipToken } from '@tanstack/react-query';
import Link from 'next/link';
import { useState } from 'react';

import { cn } from '~/lib/utils';
import { api } from '~/trpc/react';

import { Button, buttonVariants } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';

type Props = {};
export default function Sidebar({}: Props) {
  const [activeLetter, setActiveLetter] = useState<string | null>(null);

  const [startingLetters] = api.article.getStartingLetters.useSuspenseQuery();
  const { data: articles } = api.article.getByLetter.useQuery(
    activeLetter ? { startsWith: activeLetter } : skipToken,
  );

  return (
    <aside className="mb-2 flex w-[400px] gap-4 overflow-hidden border-r border-border">
      <ScrollArea className="h-full border-r">
        <ul className="flex h-full flex-col px-4">
          {startingLetters.map(({ letter }) => (
            <li key={letter}>
              <Button
                variant="link"
                size="icon"
                className={cn('p-2 text-2xl', {
                  'bg-primary text-primary-foreground': letter === activeLetter,
                })}
                onClick={() => setActiveLetter(letter)}
              >
                {letter}
              </Button>
            </li>
          ))}
        </ul>
      </ScrollArea>

      <ScrollArea className="h-full flex-1">
        <ul className="h-full">
          {articles
            ? articles.map(({ title, id }) => (
                <li key={id}>
                  <Link
                    href={'/articles/' + id}
                    className={cn(
                      'w-full',
                      buttonVariants({ variant: 'ghost' }),
                    )}
                  >
                    {title}
                  </Link>
                  <Separator className="my-2" />
                </li>
              ))
            : null}
        </ul>
      </ScrollArea>
    </aside>
  );
}
