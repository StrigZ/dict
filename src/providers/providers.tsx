import React from "react";
import { ThemeProvider } from "./theme-provider";

type Props = { children: React.ReactNode };
export default function Providers({ children }: Props) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}
