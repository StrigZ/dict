'use client';

import { skipToken } from '@tanstack/react-query';
import Link from 'next/link';

import { cn } from '~/lib/utils';
import { useBreadcrumbsContext } from '~/providers/breadcrumbs-provider';
import { api } from '~/trpc/react';

import SidebarSkeleton from './skeletons/SidebarSkeleton';
import LoadingSpinner from './ui/LoadingSpinner';
import { Button, buttonVariants } from './ui/button';
import { ScrollArea } from './ui/scroll-area';

export default function Sidebar() {
  const { activeArticle, activeLetter, selectActiveLetter } =
    useBreadcrumbsContext();

  const { data: startingLetters, isLoading: isLettersQueryLoading } =
    api.article.getStartingLetters.useQuery();
  const { data: articles, isLoading: isArticleQueryLoading } =
    api.article.getByLetter.useQuery(
      activeLetter ? { startsWith: activeLetter } : skipToken,
    );

  return isLettersQueryLoading ? (
    <SidebarSkeleton />
  ) : (
    <aside className="flex w-[400px] overflow-hidden border-border">
      <ScrollArea className="h-full px-4 pb-12">
        <ul className="flex h-full flex-col">
          {startingLetters?.map(({ letter }) => (
            <li key={letter}>
              <Button
                variant="link"
                size="icon"
                className={cn('p-2 text-2xl', {
                  'bg-primary text-primary-foreground': letter === activeLetter,
                })}
                onClick={() => selectActiveLetter(letter)}
                disabled={isArticleQueryLoading}
              >
                {letter}
              </Button>
            </li>
          ))}
        </ul>
      </ScrollArea>

      <ScrollArea className="relative h-full flex-1 border-x pb-12">
        <ul className="h-full">
          {isArticleQueryLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <LoadingSpinner />
            </div>
          )}
          {articles?.map((article) => (
            <li key={article.id}>
              <Link
                href={'/articles/' + article.id}
                className={cn(
                  buttonVariants({
                    variant:
                      article.id === activeArticle?.id ? 'default' : 'ghost',
                    className: 'w-full rounded-none py-6',
                  }),
                )}
              >
                {article.title}
              </Link>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </aside>
  );
}
