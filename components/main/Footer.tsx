export default function Footer() {
  return (
    <>
      <section className="">
        <h2 className="text-xl font-semibold text-(--text-title)">
          이렇게 활용해 보세요
        </h2>
        <div className="mt-4 grid gap-3">
          <div className="p-5 rounded-xl border border-(--border) bg-(--card-bg)">
            <p className="text-(--text-body)">
              - 오늘의 브리핑으로 <b>시장 주요 이슈</b>를 빠르게 훑고,
              <br />- 관심 키워드로 <b>내 포트폴리오 관련 이슈</b>만 추적하세요.
            </p>
          </div>
          <div className="p-5 rounded-xl border border-(--border) bg-(--card-bg)">
            <p className="text-(--text-body)">
              검색 결과는 기사 목록과 함께, AI가 정리한 <b>핵심 인사이트</b>를
              제공합니다.
            </p>
          </div>
        </div>
      </section>
      <footer className="py-10 border-t border-(--border)">
        <div className="text-sm text-(--text-muted) space-y-1">
          <p>AI 경제 리포트</p>
          <p>
            데이터/요약은 참고용이며 투자 판단의 책임은 사용자에게 있습니다.
          </p>
        </div>
      </footer>
    </>
  );
}
