import { redirect } from 'next/navigation';

import { auth } from '~/server/auth';
import { api } from '~/trpc/server';

import Header from './Header/Header';
import { NewArticleButton } from './NewArticleButton';
import PlaygroundButton from './PlaygroundButton';
import Sidebar from './Sidebar';
import { AppSidebar } from './app-sidebar';
import { ScrollArea } from './ui/scroll-area';
import { Toaster } from './ui/toaster';

type Props = { children: React.ReactNode };
export default async function Layout({ children }: Props) {
  const session = await auth();

  void api.article.infiniteArticles.prefetchInfinite({
    startsWith: '',
    limit: 20,
  });
  void api.article.getStartingLetters.prefetch();

  if (!session?.user) {
    redirect('/api/auth/signin');
  }

  return (
    <>
      <AppSidebar />
      <main className="relative mx-auto flex h-screen flex-col overflow-y-hidden">
        <Header />
        <div className="container relative mx-auto flex flex-1 overflow-y-hidden">
          <Sidebar className="hidden w-[400px] overflow-hidden border-border sm:flex" />
          <ScrollArea className="flex h-full flex-1 [&>div>div]:h-full [&>div>div]:w-full [&>div>div]:table-fixed">
            <article className="relative flex h-full flex-col gap-8 px-4 pt-0 sm:px-12">
              {children}
            </article>
          </ScrollArea>
          <div className="absolute bottom-8 right-8 flex items-center gap-2">
            <PlaygroundButton />
            <NewArticleButton />
          </div>
        </div>
        <Toaster />
      </main>
    </>
  );
}
