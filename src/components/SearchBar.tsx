'use client';

import { Search } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { useState } from 'react';

import SearchBarDropdown from './SearchBarDropdown';
import { Button } from './ui/button';
import { Input } from './ui/input';

type Props = {};
export default function SearchBar({}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex w-full items-center space-x-2">
      <label className="relative flex flex-1 items-center gap-2 rounded-lg border border-input px-2 py-1 focus-within:ring-1 focus-within:ring-ring">
        <Search />
        <Input
          type="text"
          placeholder="Search..."
          className="border-none shadow-none outline-none focus-visible:ring-0"
          onChange={() => setIsOpen(true)}
        />
        <AnimatePresence>
          {isOpen && (
            <SearchBarDropdown onClickOutside={() => setIsOpen(false)} />
          )}
        </AnimatePresence>
      </label>
      <Button type="submit">Search</Button>
    </div>
  );
}
