import { redirect } from 'next/navigation';

import { auth } from '~/server/auth';

import Header from './Header';
import { NewArticleDrawerDialog } from './NewArticleDrawerDialog';
import Sidebar from './Sidebar';
import { Toaster } from './ui/toaster';

type Props = { children: React.ReactNode };
export default async function Layout({ children }: Props) {
  const session = await auth();

  if (!session?.user) {
    redirect('/api/auth/signin');
  }

  return (
    <main className="container relative mx-auto flex h-screen flex-col overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        {children}
        <Toaster />
      </div>
      <NewArticleDrawerDialog />
    </main>
  );
}
