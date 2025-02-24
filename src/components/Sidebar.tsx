'use client';

import { cn } from '~/lib/utils';
import { useBreadcrumbsContext } from '~/providers/breadcrumbs-provider';
import { api } from '~/trpc/react';

import InfiniteArticles from './InfiniteArticles';
import SidebarSkeleton from './skeletons/SidebarSkeleton';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';

export default function Sidebar({ className }: { className?: string }) {
  const { activeLetter, selectActiveLetter } = useBreadcrumbsContext();
  const { data: startingLetters, isLoading: isLettersQueryLoading } =
    api.article.getStartingLetters.useQuery();

  return isLettersQueryLoading ? (
    <SidebarSkeleton />
  ) : (
    <aside className={cn(className)}>
      <ScrollArea className="h-full pr-2 sm:px-4">
        <ul className="flex h-full flex-col sm:pb-12">
          {startingLetters?.map(({ letter }) => (
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

      <InfiniteArticles />
    </aside>
  );
}
