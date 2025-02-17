import { auth } from '~/server/auth';
import { HydrateClient, api } from '~/trpc/server';

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    void api.article.getAll.prefetch();
  }

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white"></main>
    </HydrateClient>
  );
}
