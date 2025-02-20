import ArticleForm from '~/components/ArticleForm';
import { auth } from '~/server/auth';
import { HydrateClient, api } from '~/trpc/server';

export default async function NewArticlePage() {
  const session = await auth();

  if (session?.user) {
    void api.article.getStartingLetters.prefetch();
  }

  return (
    <HydrateClient>
      <h2 className="text-4xl font-bold">New Article</h2>
      <ArticleForm />
    </HydrateClient>
  );
}
