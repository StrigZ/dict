import Article from '~/components/Article';
import { auth } from '~/server/auth';
import { HydrateClient, api } from '~/trpc/server';

type Props = { params: Promise<{ slug: string }> };
export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const session = await auth();

  if (session?.user) {
    void api.article.getSingle.prefetch({ id: Number(slug) });
  }

  return (
    <HydrateClient>
      <Article />
    </HydrateClient>
  );
}
