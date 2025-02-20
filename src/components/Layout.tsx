import { redirect } from 'next/navigation';

import { auth } from '~/server/auth';

import Header from './Header';
import { NewArticleButton } from './NewArticleButton';
import Sidebar from './Sidebar';
import { ScrollArea } from './ui/scroll-area';
import { Toaster } from './ui/toaster';

type Props = { children: React.ReactNode };
export default async function Layout({ children }: Props) {
  const session = await auth();

  if (!session?.user) {
    redirect('/api/auth/signin');
  }

  return (
    <main className="relative mx-auto flex h-screen flex-col overflow-y-hidden">
      <Header />
      <div className="container relative mx-auto flex flex-1 overflow-y-hidden">
        <Sidebar />
        <ScrollArea className="flex h-full flex-1 [&>div>div]:h-full [&>div>div]:w-full [&>div>div]:table-fixed">
          <article className="relative flex h-full flex-col gap-8 px-12 pt-0">
            {children}
          </article>
        </ScrollArea>
        <NewArticleButton />
      </div>
      <Toaster />
    </main>
  );
}
