'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* 아이콘 영역 (빈칸으로 유지) */}
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-(--secondary-bg)">
          <Search size={40} className="text-(--text-muted)" />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-black text-(--text-title) md:text-5xl">
            페이지를 찾을 수 없습니다
          </h1>
          <p className="text-lg font-medium text-(--text-muted)">
            요청하신 페이지가 삭제되었거나 주소가 올바르지 않습니다.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
          <button
            onClick={() => window.history.back()}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-(--border) px-6 py-3 text-sm font-bold text-(--text-title) hover:bg-(--secondary-bg) transition-colors sm:w-auto"
          >
            <ArrowLeft size={18} />
            이전 페이지로
          </button>
          <Link
            href="/"
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-(--primary-strong) px-6 py-3 text-sm font-bold text-white hover:opacity-90 transition-opacity sm:w-auto"
          >
            <Home size={18} />
            홈으로 돌아가기
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
