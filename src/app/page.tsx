import Article from '~/components/Article';
import Header from '~/components/Header';
import SearchBar from '~/components/SearchBar';
import Sidebar from '~/components/Sidebar';
import { ThemeButton } from '~/components/ThemeButton';
import { auth } from '~/server/auth';
import { HydrateClient, api } from '~/trpc/server';

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    void api.article.getAll.prefetch();
  }

  return (
    <HydrateClient>
      <main className="h-screen overflow-hidden">
        <Header />
        <div className="grid grid-cols-[400px,1fr]">
          <Sidebar />
          <Article />
        </div>
      </main>
    </HydrateClient>
  );
}
