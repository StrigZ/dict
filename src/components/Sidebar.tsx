'use client';

import { skipToken } from '@tanstack/react-query';
import Link from 'next/link';

import { cn } from '~/lib/utils';
import { useBreadcrumbsContext } from '~/providers/breadcrumbs-provider';
import { api } from '~/trpc/react';

import { Button, buttonVariants } from './ui/button';
import { ScrollArea } from './ui/scroll-area';

type Props = {};
export default function Sidebar({}: Props) {
  const { activeArticle, activeLetter, selectActiveLetter } =
    useBreadcrumbsContext();

  const [startingLetters] = api.article.getStartingLetters.useSuspenseQuery();
  const { data: articles } = api.article.getByLetter.useQuery(
    activeLetter ? { startsWith: activeLetter } : skipToken,
  );

  return (
    <aside className="flex w-[400px] gap-4 overflow-hidden border-border pb-2 pr-4">
      <ScrollArea className="h-full pl-4">
        <ul className="flex h-full flex-col">
          {startingLetters.map(({ letter }) => (
            <li key={letter}>
              <Button
                variant="link"
                size="icon"
                className={cn('p-2 text-2xl', {
                  'bg-primary text-primary-foreground': letter === activeLetter,
                })}
                onClick={() => selectActiveLetter(letter)}
              >
                {letter}
              </Button>
            </li>
          ))}
        </ul>
      </ScrollArea>

      <ScrollArea className="h-full flex-1 border-x">
        <ul className="h-full">
          {articles
            ? articles.map((article) => (
                <li key={article.id}>
                  <Link
                    href={'/articles/' + article.id}
                    className={cn(
                      buttonVariants({
                        variant:
                          article.id === activeArticle?.id
                            ? 'default'
                            : 'ghost',
                        className: 'w-full rounded-none py-6',
                      }),
                    )}
                  >
                    {article.title}
                  </Link>
                </li>
              ))
            : null}
        </ul>
      </ScrollArea>
    </aside>
  );
}
