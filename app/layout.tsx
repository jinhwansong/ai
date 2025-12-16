import type { Metadata } from 'next';
import '@/style/globals.css';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'AI 경제 리포트',
  description: '실시간 글로벌 경제 뉴스 기반 AI 분석 리포트',
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
          <main className="page-wrapper">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
