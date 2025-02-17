import SearchBar from './SearchBar';
import { ThemeButton } from './ThemeButton';

type Props = {};
export default function Header({}: Props) {
  return (
    <header className="flex items-center justify-center gap-4 p-4">
      <ThemeButton />
      <SearchBar />
    </header>
  );
}
