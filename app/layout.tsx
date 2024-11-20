import './globals.css';
import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/sonner";


export const metadata: Metadata = {
  title: 'Bingo Card Generator',
  description: 'Create and play custom bingo cards with beautiful animations',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body >
        {children}
        <Toaster />
      </body>
    </html>
  );
}