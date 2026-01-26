import type { Metadata, Viewport } from 'next';
import '@/style/globals.css';
import { pretendard } from '@/lib/fonts';
import Providers from './providers';
import GlobalToast from '@/components/common/GlobalToast';
import MicrosoftClarity from '@/components/common/MicrosoftClarity';
import { SentryWebVitals } from '@/components/common/SentryWebVitals';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import Head from 'next/head';

export const viewport: Viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
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
    images: [
      {
        url: '/og-main.png',
        width: 1200,
        height: 630,
        alt: '오늘의 시그널 메인 이미지',
      },
    ],
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
    <html lang="ko" suppressHydrationWarning className={pretendard.variable}>
      <Head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="google-site-verification" content="OvtOage0P7fVxwz_mXb0IuckkKDXvi4ZEDGXImXh_dw" />
      </Head>
      <body className={`${pretendard.className} bg-(--background) text-(--foreground)`}>
        <Providers>
          <MicrosoftClarity />
          <SentryWebVitals />
          <Header />
          {children}
          <GlobalToast />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
