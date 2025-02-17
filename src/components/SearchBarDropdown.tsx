'use client';

import type { Article } from '@prisma/client';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useRef } from 'react';
import { useOnClickOutside } from 'usehooks-ts';

const mockResults: Partial<Article>[] = [
  {
    id: 1,
    title: 'Archer',
    content:
      'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iusto eum aliquid ipsam quis voluptatem nostrum distinctio excepturi exercitationem a. Molestias autem corrupti modi eius sequi!',
  },
  {
    id: 12,
    title: 'Archer',
    content:
      'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iusto eum aliquid ipsam quis voluptatem nostrum distinctio excepturi exercitationem a. Molestias autem corrupti modi eius sequi!',
  },
  {
    id: 13,
    title: 'Archer',
    content:
      'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iusto eum aliquid ipsam quis voluptatem nostrum distinctio excepturi exercitationem a. Molestias autem corrupti modi eius sequi!',
  },
  {
    id: 14,
    title: 'Archer',
    content:
      'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iusto eum aliquid ipsam quis voluptatem nostrum distinctio excepturi exercitationem a. Molestias autem corrupti modi eius sequi!',
  },
  {
    id: 15,
    title: 'Archer',
    content:
      'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iusto eum aliquid ipsam quis voluptatem nostrum distinctio excepturi exercitationem a. Molestias autem corrupti modi eius sequi!',
  },
  {
    id: 16,
    title: 'Archer',
    content:
      'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iusto eum aliquid ipsam quis voluptatem nostrum distinctio excepturi exercitationem a. Molestias autem corrupti modi eius sequi!',
  },
];

type Props = { onClickOutside: () => void };
export default function SearchBarDropdown({ onClickOutside }: Props) {
  const popoverRef = useRef(null);

  useOnClickOutside(popoverRef, onClickOutside);
  return (
    <motion.div
      animate={{
        opacity: 1,
      }}
      initial={{ opacity: 0 }}
      exit={{ opacity: 0 }}
      className="scrollbar-thin absolute inset-x-0 -bottom-2 h-72 w-full translate-y-full overflow-y-scroll rounded-xl border bg-card text-card-foreground shadow"
      ref={popoverRef}
    >
      <ul className="flex flex-col">
        {mockResults.map(({ title, content, id }) => (
          <li key={id}>
            <Link
              href={'/articles/' + id}
              className="flex flex-col border-b border-border px-4 py-2 peer-last:border-b-0"
            >
              <p className="font-semibold">{title}</p>
              <p className="truncate text-muted-foreground">
                {JSON.stringify(content)}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
