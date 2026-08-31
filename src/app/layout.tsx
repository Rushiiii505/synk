import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { WorkspaceProvider } from '@/context/WorkspaceContext';
import { ToastContainer } from '@/components/ui/ToastContainer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
});

export const metadata: Metadata = {
  title: 'synk — Collaborative Trello, Team Notepad & Treasury Cashflow Platform',
  description:
    'Real-time collaborative Trello board, shared multi-color sticky notes, and Money IN / Money OUT treasury cashflow management in Indian Rupees (₹) for startup collectives.',
  keywords: [
    'synk',
    'collaborative trello',
    'team notepad',
    'sticky notes',
    'cashflow ledger in and out',
    'rupees fintech',
    'startup treasury',
    'split cost calculator',
  ],
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable}`}>
      <body className="min-h-screen bg-[#F8F9FD] text-slate-900 antialiased font-sans flex flex-col">
        <AuthProvider>
          <WorkspaceProvider>
            {children}
            <ToastContainer />
          </WorkspaceProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
