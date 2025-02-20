import { Separator } from '../ui/separator';
import { Skeleton } from '../ui/skeleton';

export default function ArticleSkeleton() {
  return (
    <>
      <div className="ml-auto flex gap-2">
        <Skeleton className="h-9 w-9" />
        <Skeleton className="h-9 w-9" />
      </div>
      <div className="flex flex-col gap-8 pb-12">
        <Skeleton className="h-9 w-24" />
        <Separator />
        <Skeleton className="h-72 w-full" />
      </div>
    </>
  );
}
