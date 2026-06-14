import type { Metadata } from 'next';
import { Manrope, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});
const plexMono = IBM_Plex_Mono({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-plex-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Vouch | On-chain AI reputation attestation',
  description:
    'Open a profile and let peers vouch for you with evidence. An injection-resistant AI assessor rules TRUSTED, MIXED, or UNVERIFIED with a credibility score under GenLayer validator consensus.',
  openGraph: {
    title: 'Vouch | On-chain AI reputation attestation',
    description:
      'Peer attestations weighed by an AI assessor under GenLayer validator consensus. Evidence in, credibility on-chain.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${plexMono.variable}`}>
      <body className="bg-base text-ink font-body antialiased">{children}</body>
    </html>
  );
}
