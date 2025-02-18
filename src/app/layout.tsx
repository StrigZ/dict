import { GeistSans } from 'geist/font/sans';
import { type Metadata } from 'next';

import Layout from '~/components/Layout';
import Providers from '~/providers/providers';
import '~/styles/globals.css';
import { TRPCReactProvider } from '~/trpc/react';

export const metadata: Metadata = {
  title: 'Dict',
  description: 'When notes are not enough',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable}`}
      suppressHydrationWarning
    >
      <body>
        <TRPCReactProvider>
          <Providers>
            <Layout>{children}</Layout>
          </Providers>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
