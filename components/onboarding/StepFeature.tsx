import Image from 'next/image';

export default function StepFeature() {
  return (
    <div className="flex flex-col items-center justify-center h-full px-8 text-center">
      <Image
        src="/onboarding2.png"
        width={210}
        height={210}
        alt="온보딩"
        className="mb-5"
      />

      <h1 className="text-3xl font-bold mb-4">
        하루의 흐름을 한눈에 정리합니다
      </h1>

      <p className="text-(--text-body) text-lg leading-relaxed">
        시장 움직임, 주요 지표, 글로벌 이슈까지
        <br />
        AI가 간결하게 요약해 드립니다.
      </p>
    </div>
  );
}
