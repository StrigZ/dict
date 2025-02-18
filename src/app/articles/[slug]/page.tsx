import Article from '~/components/Article';
import { HydrateClient } from '~/trpc/server';

type Props = {};
export default function ArticlePage({}: Props) {
  return (
    <HydrateClient>
      <Article />
    </HydrateClient>
  );
}
