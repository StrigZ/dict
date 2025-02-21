'use client';

import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { useOnClickOutside } from 'usehooks-ts';

import LoadingSpinner from './ui/LoadingSpinner';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';

type Props = {
  data?: { title: string; id: number }[];
  isLoading: boolean;
  isQueryEmpty: boolean;
  onClickOutside: () => void;
  onResultClick: () => void;
};
export default function SearchBarDropdown({
  onClickOutside,
  isLoading,
  onResultClick,
  data,
  isQueryEmpty,
}: Props) {
  const popoverRef = useRef(null);
  useOnClickOutside(popoverRef, onClickOutside);
  const router = useRouter();

  const handleResultClick = (id: number) => {
    router.push('/articles/' + id);
    onResultClick();
  };

  return (
    <motion.div
      animate={{
        opacity: 1,
      }}
      initial={{ opacity: 0 }}
      exit={{ opacity: 0 }}
      className="absolute inset-x-0 -bottom-2 z-50 h-72 w-full translate-y-full overflow-hidden rounded-xl border bg-card text-card-foreground shadow"
      ref={popoverRef}
    >
      <ScrollArea className="relative h-full">
        {(isLoading || data?.length === 0 || isQueryEmpty) && (
          <div className="absolute flex h-full w-full items-center justify-center">
            {isLoading && <LoadingSpinner />}
            {data?.length === 0 && ' Nothing found...'}
            {isQueryEmpty && 'Start typing!'}
          </div>
        )}
        <div className="flex flex-col">
          {data?.map(({ title, id }) => (
            <div key={id}>
              <Button
                className="flex w-full flex-col items-start justify-center rounded-none border-b border-border px-4 py-4 peer-last:border-b-0"
                onClick={() => handleResultClick(id)}
                variant="ghost"
              >
                <p className="font-semibold">{title}</p>
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </motion.div>
  );
}
