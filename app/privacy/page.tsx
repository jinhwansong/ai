import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function PrivacyPage() {
  return (
    <main className="flex-1 px-4 py-12 md:px-8">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="space-y-2 border-b border-(--border) pb-6">
          <h1 className="text-3xl font-black text-(--text-title)">
            개인정보처리방침
          </h1>
          <p className="text-sm text-(--text-muted)">
            최종 업데이트: 2026년 1월 9일
          </p>
        </div>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-(--text-title)">
            1. 개인정보 수집 항목
          </h2>
          <p className="text-sm leading-relaxed text-(--text-body)">
            &apos;오늘의 시그널&apos; 서비스는 기본적인 서비스 제공 및 품질
            개선을 위해 다음과 같은 정보를 수집할 수 있습니다.
            <br />- 기기 정보 (OS 버전, 기기 식별자), 접속 로그, 쿠키, 서비스
            이용 기록
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-(--text-title)">
            2. 개인정보의 수집 및 이용 목적
          </h2>
          <p className="text-sm leading-relaxed text-(--text-body)">
            수집된 정보는 다음의 목적으로만 활용됩니다.
            <br />
            - 서비스 제공 및 콘텐츠 최적화
            <br />
            - 서비스 이용 통계 분석 및 품질 향상
            <br />- 부정 이용 방지 및 보안 유지
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-(--text-title)">
            3. 개인정보의 보유 및 이용 기간
          </h2>
          <p className="text-sm leading-relaxed text-(--text-body)">
            원칙적으로 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를
            지체 없이 파기합니다. 단, 관계 법령의 규정에 의하여 보존할 필요가
            있는 경우 해당 기간 동안 보관합니다.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-(--text-title)">
            4. 제3자 제공 및 위탁
          </h2>
          <p className="text-sm leading-relaxed text-(--text-body)">
            서비스는 이용자의 동의 없이 개인정보를 외부에 제공하지 않습니다.
            다만, 서비스 분석 도구(예: Microsoft Clarity)를 통해 익명화된 활동
            데이터를 분석에 활용할 수 있습니다.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-(--text-title)">
            5. 이용자의 권리
          </h2>
          <p className="text-sm leading-relaxed text-(--text-body)">
            이용자는 언제든지 자신의 개인정보를 조회하거나 삭제를 요청할 수
            있습니다. 관련 문의는 서비스 내 고객 센터 또는 개발자 연락처를 통해
            가능합니다.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-(--text-title)">
            6. 개인정보 보호 책임자
          </h2>
          <p className="text-sm leading-relaxed text-(--text-body)">
            서비스 개발 및 운영자: 송진환
            <br />
            문의처: 깃허브 레포지토리 또는 공식 블로그
          </p>
        </section>
      </div>
    </main>
  );
}
