'use client';

import { Home, LineChart, Newspaper } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const mobileTabs = [
  { id: 'home', label: '홈', icon: Home, href: '/' },
  { id: 'analysis', label: 'AI분석', icon: LineChart, href: '/analysis' },
  { id: 'news', label: '뉴스', icon: Newspaper, href: '/news' },
];

const desktopTabs = [
  {
    title: 'Service',
    items: [
      { label: '실시간 시장 시그널', href: '/' },
      { label: 'AI 시황 리포트', href: '/analysis' },
      { label: '오늘의 관찰 대상', href: '/' },
      { label: '섹터 투자 전략', href: '/' },
    ],
  },
  {
    title: 'Support',
    items: [
      { label: '이용약관', href: '/terms' },
      { label: '개인정보처리방침', href: '/privacy' },
    ],
  },
  {
    title: 'Connect',
    items: [
      { label: '공식 블로그', href: 'https://song7022556.tistory.com/' },
      { label: '깃 허브', href: 'https://github.com/jinhwansong/ai' },
    ],
  },
];

export default function Footer() {
  const pathname = usePathname();

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-(--border) bg-(--glass-bg) px-2 pb-safe pt-2 backdrop-blur-xl md:hidden">
        {mobileTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={`flex flex-col items-center gap-1 px-3 py-1 transition-all ${
                isActive ? 'text-(--primary)' : 'text-(--text-muted)'
              }`}
            >
              <div className="relative">
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -inset-2 -z-10 rounded-xl bg-(--primary-soft)"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </div>
              <span className="text-[10px] font-bold">{tab.label}</span>
            </Link>
          );
        })}
      </nav>

      <div
        className="md:hidden"
        style={{
          height: 72,
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
        aria-hidden="true"
      />

      <footer className="mt-20 hidden border-t border-(--border) bg-(--light-bg) py-12 px-8 md:block">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="max-w-xs">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-(--primary) text-white shadow-sm">
                  <span className="text-xs font-bold italic">S</span>
                </div>
                <span className="text-sm font-bold tracking-tight text-(--text-title)">
                  오늘의 시그널
                </span>
              </div>
              <p className="text-xs text-(--text-muted) leading-relaxed">
                데이터와 AI가 찾아내는 가장 빠른 투자 기회. 실시간 시장 데이터와
                AI 분석을 통해 당신의 투자 의사결정을 지원합니다.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-x-12 gap-y-8 lg:gap-x-20">
              {desktopTabs.map((section) => (
                <div className="flex flex-col gap-4" key={section.title}>
                  <h4 className="text-xs font-black uppercase tracking-widest text-(--text-title)">
                    {section.title}
                  </h4>
                  <ul className="grid grid-cols-1 gap-y-2.5 text-xs text-(--text-muted)">
                    {section.items.map((item) => (
                      <li key={item.label}>
                        <Link
                          href={item.href}
                          className="hover:text-(--primary) transition-colors cursor-pointer"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 border-t border-(--border) pt-8">
            <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
              <div className="space-y-2">
                <p className="text-[10px] font-medium text-(--text-muted)">
                  © 2026 오늘의 시그널 Insights. All rights reserved.
                </p>
                <p className="max-w-2xl text-[9px] leading-relaxed text-slate-400 dark:text-slate-500">
                  면책고지: 오늘의 시그널에서 제공하는 모든 정보는 투자
                  참고용이며, 투자 결과에 대한 법적 책임은 투자자 본인에게
                  있습니다. 모든 데이터는 실시간 정보 제공사로부터 제공받으나,
                  통신 지연이나 오류가 발생할 수 있음을 알려드립니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
