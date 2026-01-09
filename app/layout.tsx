import type { Metadata, Viewport } from 'next';
import '@/style/globals.css';
import Providers from './providers';
import GlobalToast from '@/components/common/GlobalToast';
import MicrosoftClarity from '@/components/common/MicrosoftClarity';
import { SentryWebVitals } from '@/components/common/SentryWebVitals';

export const viewport: Viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: '오늘의 시그널',
  description: 'AI가 분석하는 실시간 글로벌 경제 뉴스 기반 시장 브리핑 리포트',
  manifest: '/manifest.json',
  icons: {
    icon: '/icons/favicon.ico',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '오늘의 시그널',
  },
  openGraph: {
    title: '오늘의 시그널',
    description:
      'AI가 분석하는 실시간 글로벌 경제 뉴스 기반 시장 브리핑 리포트',
    url: 'https://ai-red-mu.vercel.app',
    siteName: 'AI Market Briefing',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '오늘의 시그널',
    description:
      'AI가 분석하는 실시간 글로벌 경제 뉴스 기반 시장 브리핑 리포트',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-(--background) text-(--foreground)">
        <Providers>
          <MicrosoftClarity/>
          <SentryWebVitals />
          {children}
          <GlobalToast />
        </Providers>
      </body>
    </html>
  );
}
