import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 px-4 py-12 md:px-8">
        <div className="mx-auto max-w-3xl space-y-8">
          <div className="space-y-2 border-b border-(--border) pb-6">
            <h1 className="text-3xl font-black text-(--text-title)">
              이용약관
            </h1>
            <p className="text-sm text-(--text-muted)">
              최종 업데이트: 2026년 1월 9일
            </p>
          </div>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-(--text-title)">
              제 1 조 (목적)
            </h2>
            <p className="text-sm leading-relaxed text-(--text-body)">
              본 약관은 &apos;오늘의 시그널&apos;(이하 &ldquo;서비스&ldquo;)이
              제공하는 AI 기반 시장 분석 및 관련 제반 서비스의 이용과 관련하여
              서비스와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로
              합니다.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-(--text-title)">
              제 2 조 (서비스의 내용 및 특징)
            </h2>
            <p className="text-sm leading-relaxed text-(--text-body)">
              1. 서비스는 실시간 시장 데이터와 뉴스 데이터를 AI 모델을 통해
              분석하여 요약 및 시각화된 리포트를 제공합니다.
              <br />
              2. 본 서비스에서 제공하는 모든 정보는 AI에 의해 자동 생성된
              것이며, 특정 종목에 대한 투자 권유나 추천이 아닙니다.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-(--text-title)">
              제 3 조 (책임 및 면책사항)
            </h2>
            <p className="text-sm leading-relaxed text-(--text-body)">
              1. 서비스는 제공하는 정보의 정확성, 완전성, 신뢰성을 보장하지
              않습니다. AI 모델의 특성상 오류나 지연이 발생할 수 있습니다.
              <br />
              2. 이용자는 서비스의 정보를 참고용으로만 활용해야 하며, 모든 투자
              결정에 대한 책임은 이용자 본인에게 있습니다.
              <br />
              3. 서비스 이용으로 발생한 직접적, 간접적 손실에 대해 서비스
              제공자는 법적 책임을 지지 않습니다.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-(--text-title)">
              제 4 조 (이용자의 의무)
            </h2>
            <p className="text-sm leading-relaxed text-(--text-body)">
              1. 이용자는 서비스를 정상적인 용도로만 이용해야 하며, 서비스의
              운영을 방해하거나 무단으로 데이터를 크롤링하는 행위를 해서는 안
              됩니다.
              <br />
              2. 서비스의 분석 결과물을 상업적 목적으로 재배포하거나 가공하여
              판매하는 행위는 금지됩니다.
            </p>
          </section>

          <section className="space-y-4 italic text-(--text-muted)">
            <p className="text-xs leading-relaxed">
              본 약관은 서비스의 필요에 따라 사전 고지 없이 변경될 수 있으며,
              변경된 약관은 서비스 내 게시를 통해 효력이 발생합니다.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
