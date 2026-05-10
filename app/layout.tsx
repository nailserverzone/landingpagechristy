import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Digital Gift Box – Interactive Gift Experience',
  description: 'Send an unforgettable interactive gift experience. Photos, music, letters, and more inside a beautifully animated gift box.',
  openGraph: {
    title: 'You received a Digital Gift Box!',
    description: 'Open your interactive gift box – photos, music, a personal letter, and more await inside.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-[#F7D6D6] antialiased">{children}</body>
    </html>
  );
}
