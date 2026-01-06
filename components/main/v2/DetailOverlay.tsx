'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface DetailOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  tag?: string;
  children: React.ReactNode;
}

export const DetailOverlay: React.FC<DetailOverlayProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  tag, 
  children 
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />
          
          {/* Content */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-x-0 bottom-0 top-10 md:inset-x-auto md:right-0 md:top-0 md:w-full md:max-w-2xl bg-white z-[70] rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none shadow-2xl overflow-hidden flex flex-col"
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
              <div>
                {tag && (
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase mb-1 inline-block">
                    {tag}
                  </span>
                )}
                <h2 className="text-xl font-bold text-gray-900">{title}</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} className="text-gray-400" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-20">
              {children}
              
              {/* Common Disclaimer in Detail View */}
              <div className="pt-10 border-t border-gray-100">
                <p className="text-xs text-gray-400 italic leading-relaxed">
                  * 본 상세 분석은 AI가 공개된 시장 데이터를 종합하여 작성한 것이며, 실제 시장의 모든 변수를 반영하지 못할 수 있습니다. 
                  모든 투자의 최종 결정은 전문가와 상의하거나 직접 사실 관계를 확인하신 후 본인의 책임 하에 진행하시기 바랍니다.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

