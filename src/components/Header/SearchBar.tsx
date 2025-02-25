'use client';

import { skipToken } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import {
  type ChangeEvent,
  type FormEvent,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useDebounceValue, useOnClickOutside } from 'usehooks-ts';

import { api } from '~/trpc/react';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import SearchBarDropdown from './SearchBarDropdown';

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useDebounceValue(
    searchQuery,
    500,
  );
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  useOnClickOutside(formRef, () => setIsOpen(false));

  const {
    data: searchData,
    isLoading,
    refetch,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = api.article.getInfiniteArticlesSearch.useInfiniteQuery(
    {
      contains: debouncedQuery ?? skipToken,
      limit: 10,
    },
    {
      enabled: debouncedQuery.length > 0,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const handleInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!isOpen) {
      setIsOpen(true);
    }
    setSearchQuery(e.target.value);
    setDebouncedQuery(e.target.value);
  };

  const handleInputFocus = async () => {
    if (searchQuery.length > 0) {
      setIsOpen(true);
      await refetch();
    }
  };

  const handleResultClick = () => {
    setIsOpen(false);
    setSearchQuery('');
    setDebouncedQuery('');
  };

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchData) {
      const firstResult = searchData.pages[0]?.items[0];
      router.push('/articles/' + firstResult?.id);
      setSearchQuery('');
      setIsOpen(false);
    }
  };

  const searchResults = useMemo(() => {
    return searchData?.pages.map((page) => page.items).flat();
  }, [searchData?.pages]);

  return (
    <form
      className="flex w-full items-center space-x-2"
      onSubmit={handleSearchSubmit}
      ref={formRef}
    >
      <label className="relative flex flex-1 items-center gap-2 rounded-lg border border-input px-2 py-1 focus-within:ring-1 focus-within:ring-ring">
        <Search />
        <Input
          type="text"
          placeholder="Search..."
          className="border-none shadow-none outline-none focus-visible:ring-0"
          onChange={handleInputChange}
          value={searchQuery}
          onFocus={handleInputFocus}
        />
        <AnimatePresence>
          {isOpen && (
            <SearchBarDropdown
              searchResults={searchResults ?? []}
              hasNextPage={hasNextPage}
              isLoading={isLoading}
              query={debouncedQuery}
              isFetchingNextPage={isFetchingNextPage}
              onResultClick={handleResultClick}
              onFetchMore={() => fetchNextPage()}
            />
          )}
        </AnimatePresence>
      </label>
      <Button type="submit" className="hidden sm:block">
        Search
      </Button>
    </form>
  );
}
