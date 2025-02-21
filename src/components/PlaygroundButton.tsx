import { Newspaper } from 'lucide-react';
import Link from 'next/link';

import { buttonVariants } from './ui/button';

export default function PlaygroundButton() {
  return (
    <Link
      href="/playground"
      className={buttonVariants({
        variant: 'outline',
        className: 'shadow',
      })}
    >
      Playground <Newspaper />
    </Link>
  );
}
