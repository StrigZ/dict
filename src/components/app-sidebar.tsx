import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
} from '~/components/ui/sidebar';

import LoginButton from './LoginButton';
import SidebarData from './Sidebar';
import { ThemeButton } from './ThemeButton';

export function AppSidebar() {
  return (
    <Sidebar className="h-full">
      <SidebarContent className="h-full">
        <SidebarGroup className="h-full pr-0">
          <SidebarGroupContent className="h-full">
            <SidebarData className="flex h-full" />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="flex flex-row">
        <ThemeButton className="flex-1 px-2" />
        <LoginButton className="flex-1 px-2" />
      </SidebarFooter>
    </Sidebar>
  );
}
