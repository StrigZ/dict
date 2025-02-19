import { auth } from '~/server/auth';
import { HydrateClient, api } from '~/trpc/server';

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    void api.article.getStartingLetters.prefetch();
  }

  return (
    <HydrateClient>
      <div className="flex flex-1 items-center justify-center text-xl">
        Pick an article from the left!
      </div>
    </HydrateClient>
  );
}
