import LoginButton from '../LoginButton';
import { ThemeButton } from '../ThemeButton';
import { SidebarTrigger } from '../ui/sidebar';
import SearchBar from './SearchBar';

export default async function Header() {
  return (
    <header className="container mx-auto flex items-center justify-center gap-4 p-4">
      <SidebarTrigger className="h-10 w-10 sm:hidden" />
      <ThemeButton className="hidden sm:flex" />
      <SearchBar />
      <LoginButton className="hidden sm:flex" />
    </header>
  );
}
