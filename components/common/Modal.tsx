'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
};

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
};

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'md',
}: ModalProps) {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      // 모바일에서는 풀스크린 모달을 띄우므로, 열릴 때 최상단으로 이동
      if (typeof window !== 'undefined') {
        const isCoarse = window.matchMedia?.('(pointer: coarse)')?.matches ?? false;
        if (isCoarse) window.scrollTo({ top: 0, left: 0 });
      }
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-9999 flex items-end justify-center p-0 md:items-center md:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.5, bounce: 0.3 }}
            role="dialog"
            aria-modal="true"
            className={[
              'relative w-full overflow-hidden bg-(--background) shadow-2xl border border-(--border) flex flex-col',
              // mobile: full screen
              'h-dvh rounded-none',
              // desktop: centered modal
              `md:h-auto md:rounded-2xl ${maxWidthClasses[maxWidth]}`,
              // safe-area for iOS
              'pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]',
            ].join(' ')}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-(--border) p-4 px-6">
              <h3 className="text-lg font-bold text-(--text-title)">
                {title || '상세 정보'}
              </h3>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full text-(--text-muted) hover:bg-(--hover-surface) transition-colors"
                aria-label="닫기"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide md:max-h-[80vh]">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
