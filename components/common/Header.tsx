'use client';

import Link from 'next/link';

export default function Header() {
  const menuItems = [
    { label: '오늘의 시그널', href: '#signals' },
    { label: '시장 현황', href: '#snapshot' },
    { label: '맞춤 시그널', href: '#personalized' },
    { label: '검색', href: '#search' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-(--background)/80 backdrop-blur-sm border-b border-(--border)">
      <div className="page-wrapper">
        <div className="flex items-center justify-between h-14 px-5">
          <Link href="/" className="text-xl font-semibold text-(--text-title)">
            오늘의 시그널
          </Link>

          <nav className="hidden md:flex space-x-6">
            {menuItems.map((item) => (
              <button
                key={item.href}
                onClick={() => scrollToSection(item.href)}
                className="text-sm text-(--text-body) hover:text-(--primary) transition-colors"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* 모바일 메뉴 버튼 (추후 구현 가능) */}
          <button className="md:hidden text-(--text-body)">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
