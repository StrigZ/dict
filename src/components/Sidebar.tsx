'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useIntersectionObserver } from 'usehooks-ts';

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

  const {
    data: articlesQueryData,
    isLoading: isArticleQueryLoading,
    isFetchingNextPage,
    fetchNextPage,
  } = api.article.infiniteArticles.useInfiniteQuery(
    { startsWith: activeLetter ?? '', limit: 20 },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const { isIntersecting, ref: observerRef } = useIntersectionObserver({
    threshold: 0.5,
  });

  useEffect(() => {
    if (isIntersecting) {
      void fetchNextPage();
    }
  }, [fetchNextPage, isIntersecting]);

  const articles = articlesQueryData?.pages.map((page) => page.items).flat();

  return isLettersQueryLoading ? (
    <SidebarSkeleton />
  ) : (
    <aside className="hidden w-[400px] overflow-hidden border-border sm:flex">
      <ScrollArea className="h-full px-4">
        <ul className="flex h-full flex-col pb-12">
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

      <ScrollArea className="relative h-full flex-1 border-x">
        <ul className="h-full pb-12">
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
          {isFetchingNextPage ? (
            <div className="flex w-full items-center justify-center p-2">
              <LoadingSpinner />
            </div>
          ) : (
            <div ref={observerRef} />
          )}
        </ul>
      </ScrollArea>
    </aside>
  );
}
