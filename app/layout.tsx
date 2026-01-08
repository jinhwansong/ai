import type { Metadata } from 'next';
import '@/style/globals.css';
import Providers from './providers';
import GlobalToast from '@/components/common/GlobalToast';

export const metadata: Metadata = {
  title: '오늘의 시그널',
  description: 'AI가 분석하는 실시간 글로벌 경제 뉴스 기반 시장 브리핑 리포트',
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
    <html lang="en">
      <body className="bg-(--background) text-(--foreground)">
        <Providers>
          {children}
          <GlobalToast />
        </Providers>
      </body>
    </html>
  );
}
