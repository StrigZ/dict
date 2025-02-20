import { Plus } from 'lucide-react';
import Link from 'next/link';

import { buttonVariants } from '~/components/ui/button';

export function NewArticleButton() {
  return (
    <Link
      href="/articles/new"
      className={buttonVariants({
        variant: 'default',
        className: 'absolute bottom-8 right-8 shadow',
      })}
    >
      New <Plus />
    </Link>
  );
}
