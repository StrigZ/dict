import { LoaderCircle } from 'lucide-react';

type Props = {};
export default function LoadingSpinner({}: Props) {
  return <LoaderCircle className="animate-spin" />;
}
