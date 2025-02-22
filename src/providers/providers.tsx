import React from 'react';

import { SidebarProvider } from '~/components/ui/sidebar';

import BreadcrumbsContextProvider from './breadcrumbs-provider';
import { ThemeProvider } from './theme-provider';

type Props = { children: React.ReactNode };
export default function Providers({ children }: Props) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <BreadcrumbsContextProvider>
        <SidebarProvider defaultOpen={false}>{children}</SidebarProvider>
      </BreadcrumbsContextProvider>
    </ThemeProvider>
  );
}
