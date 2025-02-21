import { Suspense } from 'react';

import Playground from '~/components/Playground/Playground';
import PlaygroundSkeleton from '~/components/skeletons/PlaygroundSkeleton';
import { auth } from '~/server/auth';
import { HydrateClient, api } from '~/trpc/server';

export default async function PlaygroundPage() {
  const session = await auth();

  if (session?.user) {
    void api.playground.get.prefetch();
  }

  return (
    <HydrateClient>
      <Suspense fallback={<PlaygroundSkeleton />}>
        <Playground />
      </Suspense>
    </HydrateClient>
  );
}
