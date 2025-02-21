'use client';

import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { type RefObject, useEffect } from 'react';

import LoadingSpinner from './ui/LoadingSpinner';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';

type Props = {
  data?: { title: string; id: number }[];
  isLoading: boolean;
  isQueryEmpty: boolean;
  isFetchingNextPage: boolean;
  dropdownRef: RefObject<HTMLDivElement>;
  onResultClick: () => void;
  fetchMore: () => void;
};
export default function SearchBarDropdown({
  isLoading,
  onResultClick,
  data,
  isQueryEmpty,
  isFetchingNextPage,
  fetchMore,
  dropdownRef,
}: Props) {
  const router = useRouter();

  useEffect(() => {
    if (!dropdownRef.current) {
      return;
    }
    const element = dropdownRef.current;

    const handleDropdownScroll = () => {
      const { scrollHeight, scrollTop, clientHeight } = element;

      if (scrollHeight - scrollTop === clientHeight) {
        fetchMore();
      }
    };

    element.addEventListener('scroll', handleDropdownScroll);

    return () => {
      element.removeEventListener('scroll', handleDropdownScroll);
    };
  }, [dropdownRef, fetchMore]);

  const handleResultClick = (id: number) => {
    router.push('/articles/' + id);
    onResultClick();
  };

  const hideResults = isLoading || data?.length === 0 || isQueryEmpty;

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
          {isLoading && <LoadingSpinner />}
          {data?.length === 0 && 'Nothing found...'}
          {isQueryEmpty && 'Query cannot be empty.'}
        </div>
      ) : (
        <ScrollArea className="relative h-full" viewportRef={dropdownRef}>
          <div className="flex flex-col">
            {data?.map(({ title, id }) => (
              <div key={id}>
                <Button
                  className="flex w-full flex-col items-start justify-center rounded-none border-b border-border px-4 py-4 peer-last:border-b-0"
                  onClick={() => handleResultClick(id)}
                  variant="ghost"
                  type="button"
                >
                  <p className="font-semibold">{title}</p>
                </Button>
              </div>
            ))}
          </div>
          {isFetchingNextPage && (
            <div className="flex w-full items-center justify-center p-2">
              <LoadingSpinner />
            </div>
          )}
        </ScrollArea>
      )}
    </motion.div>
  );
}
