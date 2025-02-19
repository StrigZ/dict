import Header from './Header';
import { NewArticleDrawerDialog } from './NewArticleDrawerDialog';
import Sidebar from './Sidebar';
import { Toaster } from './ui/toaster';

type Props = { children: React.ReactNode };
export default function Layout({ children }: Props) {
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
