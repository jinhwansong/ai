import Image from 'next/image';

export default function StepIntro() {
  return (
    <div className="flex flex-col items-center justify-center h-full px-8 text-center">
      <Image
        src="/onboarding1.png"
        width={210}
        height={210}
        alt="온보딩"
        className="mb-5"
      />

      <h1 className="text-3xl font-bold mb-4">당신의 하루를 읽는 AI 브리핑</h1>

      <p className="text-(--text-body) text-lg leading-relaxed">
        넘쳐나는 경제 뉴스 속에서
        <br />
        지금 중요한 것만 선별해 전달합니다.
      </p>
    </div>
  );
}
