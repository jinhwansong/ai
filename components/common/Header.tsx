'use client';

import { Search, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const navItems: { name: string; target: string }[] = [
  { name: '시그널', target: 'section-signal' },
  { name: '글로벌 시장', target: 'section-macro' },
  { name: '뉴스 & 섹터', target: 'section-news' },
  { name: '리포트', target: 'section-observation' },
];

export default function Header() {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  return (
    <header className="glass-header sticky top-0 z-50 w-full px-4 py-3 md:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex shrink-0 items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-(--primary) text-(--text-white) shadow-lg shadow-indigo-500/30">
            <span className="text-sm font-bold italic">S</span>
          </div>
          <span className="hidden text-lg font-bold tracking-tight text-(--text-title) sm:block">
            오늘의 시그널
          </span>
        </div>

        {/* Desktop Navigation & Search */}
        <div className="flex flex-1 items-center justify-center gap-4">
          <AnimatePresence mode="wait">
            {!isSearchExpanded ? (
              <motion.nav
                key="nav"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="hidden items-center gap-1 md:flex"
              >
                {navItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      const el = document.getElementById(item.target);
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                    className="rounded-full px-5 py-2 text-sm font-semibold transition-all text-(--text-muted) hover:bg-(--hover-surface) hover:text-(--text-body)"
                  >
                    {item.name}
                  </button>
                ))}
              </motion.nav>
            ) : (
              <motion.div
                key="search"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex w-full max-w-md items-center gap-2 rounded-full bg-(--hover-surface) px-4 py-2 border border-(--border)"
              >
                <Search size={18} className="text-(--text-muted)" />
                <input
                  autoFocus
                  type="text"
                  placeholder="관심 키워드나 섹터를 검색하세요"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-(--text-muted) text-(--text-body)"
                />
                <button 
                  onClick={() => setIsSearchExpanded(false)}
                  className="text-(--text-muted) hover:text-(--text-body)"
                >
                  <X size={18} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {!isSearchExpanded && (
            <button 
              onClick={() => setIsSearchExpanded(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-(--text-muted) transition-colors hover:bg-(--hover-surface) hover:text-(--text-body)"
            >
              <Search size={20} />
            </button>
          )}
          <button className="flex h-10 w-10 items-center justify-center rounded-full text-(--text-muted) md:hidden">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </header>
  );
}
