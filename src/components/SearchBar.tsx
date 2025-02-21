'use client';

import { skipToken } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import { type ChangeEvent, type FormEvent, useState } from 'react';
import { useDebounceValue } from 'usehooks-ts';

import { api } from '~/trpc/react';

import SearchBarDropdown from './SearchBarDropdown';
import { Button } from './ui/button';
import { Input } from './ui/input';

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useDebounceValue(
    searchQuery,
    500,
  );
  const router = useRouter();

  const {
    data: searchData,
    isLoading,
    refetch,
  } = api.article.getByLetter.useQuery(
    {
      startsWith: debouncedQuery ?? skipToken,
    },
    {
      enabled: debouncedQuery.length > 0,
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

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchData) {
      const firstResult = searchData[0];
      router.push('/articles/' + firstResult?.id);
      setSearchQuery('');
      setIsOpen(false);
    }
  };

  return (
    <form
      className="flex w-full items-center space-x-2"
      onSubmit={handleSearchSubmit}
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
              data={searchData}
              isLoading={isLoading}
              isQueryEmpty={searchQuery.length === 0}
              onClickOutside={() => setIsOpen(false)}
              onResultClick={() => {
                setIsOpen(false);
                setSearchQuery('');
              }}
            />
          )}
        </AnimatePresence>
      </label>
      <Button type="submit">Search</Button>
    </form>
  );
}
