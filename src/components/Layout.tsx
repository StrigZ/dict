import Header from './Header';
import Sidebar from './Sidebar';

type Props = { children: React.ReactNode };
export default function Layout({ children }: Props) {
  return (
    <main className="container mx-auto flex h-screen flex-col overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        {children}
      </div>
    </main>
  );
}
