'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SearchBar() {
  const router = useRouter();
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    router.push(`/search?q=${value}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        placeholder="찾고 싶은 경제 뉴스를 검색하세요"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="
          w-full px-5 py-3 rounded-full border border-(--border)
          bg-(--card-bg) text-(--text-body)
          focus:outline-none focus:ring-(--primary)
        "
      />

      {/* 추천 키워드 (optional) */}
      <div className="flex gap-2 flex-wrap mt-1">
        {['반도체', '금리', '환율'].map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => router.push(`/search?q=${k}`)}
            className="px-3 py-1 rounded-full text-sm bg-(--keyword-bg) text-(--foreground)"
          >
            {k}
          </button>
        ))}
      </div>
    </form>
  );
}
