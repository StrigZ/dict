import Link from 'next/link';

import { auth } from '~/server/auth';

import SearchBar from './SearchBar';
import { ThemeButton } from './ThemeButton';
import { buttonVariants } from './ui/button';

type Props = {};
export default async function Header({}: Props) {
  const session = await auth();

  return (
    <header className="flex items-center justify-center gap-4 p-4">
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
