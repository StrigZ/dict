import { LogIn, LogOut } from 'lucide-react';
import Link from 'next/link';

import { cn } from '~/lib/utils';
import { auth } from '~/server/auth';

import { buttonVariants } from './ui/button';

type Props = { className?: string };
export default async function LoginButton({ className }: Props) {
  const session = await auth();

  return (
    <Link
      href={session ? '/api/auth/signout' : '/api/auth/signin'}
      className={buttonVariants({
        variant: !session ? 'default' : 'outline',
        className: cn(className),
      })}
    >
      {session ? <LogOut /> : <LogIn />}
    </Link>
  );
}
