import Link from 'next/link';

import { auth } from '~/server/auth';

import { ThemeButton } from '../ThemeButton';
import { buttonVariants } from '../ui/button';
import SearchBar from './SearchBar';

export default async function Header() {
  const session = await auth();

  return (
    <header className="container mx-auto flex items-center justify-center gap-4 p-4">
      <ThemeButton />
      <SearchBar />
      <Link
        href={session ? '/api/auth/signout' : '/api/auth/signin'}
        className={buttonVariants({
          variant: !session ? 'default' : 'outline',
        })}
      >
        {session ? 'Sign out' : 'Sign in'}
      </Link>
    </header>
  );
}
