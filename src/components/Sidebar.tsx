'use client';

import Link from 'next/link';
import { useState } from 'react';

import { cn } from '~/lib/utils';

import { Button, buttonVariants } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';

const alphabetMock = 'abcdefghijklmnopqrstuvwxyz'.split('');

const wordsMock = [
  'Apple',
  'Amber',
  'Arrow',
  'Anchor',
  'Animal',
  'Artist',
  'Avenue',
  'Aerial',
  'Astute',
  'Ample',
  'Apple',
  'Amber',
  'Arrow',
  'Anchor',
  'Animal',
  'Artist',
  'Avenue',
  'Aerial',
  'Astute',
  'Ample',
  'Apple',
  'Amber',
  'Arrow',
  'Anchor',
  'Animal',
  'Artist',
  'Avenue',
  'Aerial',
];

type Props = {};
export default function Sidebar({}: Props) {
  const [activeLetter, setActiveLetter] = useState('a');

  return (
    <aside className="mb-2 flex w-[400px] gap-4 overflow-hidden border-r border-border">
      <ScrollArea className="h-full">
        <div className="flex h-full flex-col px-4">
          {alphabetMock.map((l) => (
            <>
              <Button
                variant="link"
                size="icon"
                className={cn('p-2 text-2xl', {
                  'bg-primary text-primary-foreground': l === activeLetter,
                })}
                onClick={() => setActiveLetter(l)}
              >
                {l.toUpperCase()}
              </Button>
            </>
          ))}
        </div>
      </ScrollArea>

      <ScrollArea className="h-full flex-1">
        <div className="h-full">
          {wordsMock.map((word) => (
            <>
              <Link
                key={word}
                href={'/articles/' + word}
                className={cn('w-full', buttonVariants({ variant: 'ghost' }))}
              >
                {word}
              </Link>
              <Separator className="my-2" />
            </>
          ))}
        </div>
      </ScrollArea>
    </aside>
  );
}
