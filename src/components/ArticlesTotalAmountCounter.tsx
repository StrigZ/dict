'use client';

import { api } from '~/trpc/react';

export default function ArticlesTotalAmountCounter() {
  const [total] = api.article.getArticlesTotalAmount.useSuspenseQuery();
  return (
    <div className="inline-flex h-9 items-center justify-center gap-1 rounded-md border border-input bg-background p-2 text-sm font-medium shadow-sm">
      Total: <span className="font-bold text-accent-foreground">{total}</span>
    </div>
  );
}
