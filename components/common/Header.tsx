import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-(--background)/85 backdrop-blur border-b border-(--border)">
      <div className="page-wrapper px-5">
        <div className="h-14 flex items-center justify-between">
          <Link href="/" className="font-semibold tracking-tight text-(--text-title)">
            AI 경제 리포트
          </Link>

          <nav className="flex items-center gap-2 text-sm">
            <Link
              href="/#today"
              className="px-3 py-2 rounded-lg text-(--text-body) hover:bg-(--hover-surface)"
            >
              오늘 브리핑
            </Link>
            <Link
              href="/#keywords"
              className="px-3 py-2 rounded-lg text-(--text-body) hover:bg-(--hover-surface)"
            >
              키워드 브리핑
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

