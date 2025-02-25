import Link from 'next/link';
import { type CSSProperties, useMemo } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';

import { cn } from '~/lib/utils';
import { useBreadcrumbsContext } from '~/providers/breadcrumbs-provider';
import { api } from '~/trpc/react';

import LoadingSpinner from './ui/LoadingSpinner';
import { buttonVariants } from './ui/button';
import { useSidebar } from './ui/sidebar';

export default function InfiniteArticles() {
  const { setOpenMobile } = useSidebar();
  const { activeArticle, activeLetter } = useBreadcrumbsContext();
  const {
    data: articlesQueryData,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isLoading,
  } = api.article.getInfiniteArticlesByLetter.useInfiniteQuery(
    { startsWith: activeLetter ?? '', limit: 20 },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );
  const articles = useMemo(() => {
    return articlesQueryData?.pages.map((page) => page.items).flat() ?? [];
  }, [articlesQueryData?.pages]);

  const itemCount = hasNextPage ? articles.length + 1 : articles.length;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const loadMoreItems = isFetchingNextPage ? () => {} : () => fetchNextPage();

  const isItemLoaded = (index: number) =>
    !hasNextPage || index < articles.length;

  const Article = ({
    index,
    style,
  }: {
    index: number;
    style: CSSProperties;
  }) => {
    const article = articles[index];

    let content;
    if (!isItemLoaded(index)) {
      content = (
        <div className="flex items-center justify-center" style={style}>
          <LoadingSpinner />
        </div>
      );
    } else {
      content = (
        <Link
          key={article?.id}
          href={'/articles/' + article?.id}
          style={style}
          className={cn(
            buttonVariants({
              variant: article?.id === activeArticle?.id ? 'default' : 'ghost',
              className:
                'w-full justify-start truncate rounded-none sm:justify-center sm:py-6',
            }),
          )}
          onClick={() => setOpenMobile(false)}
        >
          {article?.title.split(' ')[0]}
        </Link>
      );
    }

    return content;
  };

  return (
    <div className="relative flex-1 border-x border-l sm:border-x">
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <AutoSizer className="[&>div]:!overflow-hidden [&>div]:hover:!overflow-y-scroll">
          {({ height, width }) => {
            return (
              <InfiniteLoader
                isItemLoaded={isItemLoaded}
                itemCount={itemCount}
                loadMoreItems={loadMoreItems}
              >
                {({ onItemsRendered, ref }) => (
                  <FixedSizeList
                    itemCount={itemCount}
                    onItemsRendered={onItemsRendered}
                    ref={ref}
                    itemSize={48}
                    height={height}
                    width={width}
                    className="scrollbar-thumb-rounded-full scrollbar-gutter scrollbar-hover scrollbar-thin scrollbar-track-transparent sm:pb-12"
                  >
                    {Article}
                  </FixedSizeList>
                )}
              </InfiniteLoader>
            );
          }}
        </AutoSizer>
      )}
    </div>
  );
}
