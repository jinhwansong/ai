'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCcw, Home } from 'lucide-react';
import Link from 'next/link';
import { ApiError } from '@/lib/errors/apiError';

function getMessageFromError(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.isNetworkRelated) return '인터넷 연결을 확인한 뒤 다시 시도해주세요.';
    if (error.status === 404) return '요청한 내용을 찾을 수 없습니다.';
    if (error.status && error.status >= 500) return '서버에 일시적인 문제가 있습니다. 잠시 후 다시 시도해주세요.';
    if (error.status === 429) return '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.';
  }
  return '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
}

interface ErrorStateProps {
  title?: string;
  message?: string;
  error?: unknown;
  onReset?: () => void;
  showHome?: boolean;
}

export default function ErrorState({
  title = '오류가 발생했습니다',
  message,
  error,
  onReset,
  showHome = true,
}: ErrorStateProps) {
  const displayMessage =
    message ?? (error ? getMessageFromError(error) : undefined) ??
    '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md space-y-6"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 dark:bg-rose-900/10">
          <AlertCircle size={32} className="text-rose-500" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-(--text-title)">{title}</h2>
          <p className="text-sm font-medium text-(--text-muted)">{displayMessage}</p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row justify-center">
          {onReset && (
            <button
              onClick={onReset}
              className="flex items-center justify-center gap-2 rounded-xl bg-(--primary-strong) px-5 py-3 text-sm font-bold text-white hover:opacity-90 transition-opacity"
            >
              <RefreshCcw size={16} />
              다시 시도
            </button>
          )}
          {showHome && (
            <Link
              href="/"
              className="flex items-center justify-center gap-2 rounded-xl bg-(--secondary-bg) px-5 py-3 text-sm font-bold text-(--text-title) hover:opacity-80 transition-opacity"
            >
              <Home size={16} />
              홈으로
            </Link>
          )}
        </div>
      </motion.div>
    </div>
  );
}
