'use client';

import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { type CSSProperties, useEffect, useRef } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';

import LoadingSpinner from '../ui/LoadingSpinner';
import { Button } from '../ui/button';

type Props = {
  searchResults: { title: string; id: number }[];
  isLoading: boolean;
  query: string;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  onResultClick: () => void;
  onFetchMore: () => void;
};
export default function SearchBarDropdown({
  isLoading,
  onResultClick,
  searchResults,
  query,
  isFetchingNextPage,
  onFetchMore,
  hasNextPage,
}: Props) {
  const router = useRouter();
  const infiniteLoaderRef = useRef<InfiniteLoader>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const hasMountedRef = useRef(false);

  useEffect(() => {
    infiniteLoaderRef?.current?.resetloadMoreItemsCache();
    scrollAreaRef?.current?.scrollTo({ top: 0 });

    hasMountedRef.current = true;
  }, [query]);

  const handleResultClick = (id: number) => {
    router.push('/articles/' + id);
    onResultClick();
  };
  const isQueryEmpty = query.length === 0;
  const hideResults = isLoading || searchResults?.length === 0 || isQueryEmpty;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const loadMoreItems = isFetchingNextPage ? () => {} : () => onFetchMore();

  const isItemLoaded = (index: number) =>
    !hasNextPage || index < searchResults.length;

  const itemCount = hasNextPage
    ? searchResults.length + 1
    : searchResults.length;

  const Result = ({
    index,
    style,
  }: {
    index: number;
    style: CSSProperties;
  }) => {
    const result = searchResults[index];
    if (!result) {
      return;
    }
    let content;
    if (!isItemLoaded(index)) {
      content = (
        <div className="flex items-center justify-center" style={style}>
          <LoadingSpinner />
        </div>
      );
    } else {
      content = (
        <div style={style}>
          <Button
            className="flex w-full flex-col items-start justify-center rounded-none border-b border-border px-4 py-4 peer-last:border-b-0"
            onClick={() => handleResultClick(result.id)}
            variant="ghost"
            type="button"
          >
            <p className="font-semibold">{result?.title.split(' ')[0]}</p>
          </Button>
        </div>
      );
    }

    return content;
  };

  const getPlaceholderText = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }
    if (isQueryEmpty) {
      return 'Query cannot be empty.';
    }
    if (searchResults?.length === 0) {
      return 'Nothing found...';
    }
  };

  return (
    <motion.div
      animate={{
        opacity: 1,
      }}
      initial={{ opacity: 0 }}
      exit={{ opacity: 0 }}
      className="absolute inset-x-0 -bottom-2 z-50 h-72 w-full translate-y-full overflow-hidden rounded-xl border bg-card text-card-foreground shadow"
    >
      {hideResults ? (
        <div className="absolute flex h-full w-full items-center justify-center">
          {getPlaceholderText()}
        </div>
      ) : (
        <div className="h-full flex-1">
          <AutoSizer className="[&>div]:!overflow-hidden [&>div]:hover:!overflow-y-scroll">
            {({ height, width }) => {
              return (
                <InfiniteLoader
                  isItemLoaded={isItemLoaded}
                  itemCount={itemCount}
                  loadMoreItems={loadMoreItems}
                  ref={infiniteLoaderRef}
                >
                  {({ onItemsRendered, ref }) => (
                    <FixedSizeList
                      itemCount={itemCount}
                      onItemsRendered={onItemsRendered}
                      ref={ref}
                      outerRef={scrollAreaRef}
                      itemSize={36}
                      height={height}
                      width={width}
                      className="scrollbar-thumb-rounded-full scrollbar-gutter scrollbar-hover scrollbar-thin scrollbar-track-transparent"
                    >
                      {Result}
                    </FixedSizeList>
                  )}
                </InfiniteLoader>
              );
            }}
          </AutoSizer>
        </div>
      )}
    </motion.div>
  );
}
