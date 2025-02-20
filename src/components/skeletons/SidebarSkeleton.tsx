import { Skeleton } from '../ui/skeleton';

export default function SidebarSkeleton() {
  return (
    <aside className="flex w-[400px] overflow-hidden border-border">
      <ul className="flex h-full flex-col gap-1 px-4 pb-12">
        {Array(25)
          .fill(null)
          .map((_, i) => (
            <li key={i}>
              <Skeleton className="h-9 w-9 p-2" />
            </li>
          ))}
      </ul>
      <ul className="flex h-full flex-1 flex-col gap-1 border-x pb-12">
        {Array(25)
          .fill(null)
          .map((_, i) => (
            <li key={i} className="">
              <Skeleton className="h-12 rounded-none p-2 text-2xl" />
            </li>
          ))}
      </ul>
    </aside>
  );
}
