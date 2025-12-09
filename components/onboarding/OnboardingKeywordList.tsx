import { useOnboardingStore } from '@/stores/useOnboardingStore';
import KeywordChip from './KeywordChip';

const recommended = [
  '반도체',
  'AI',
  '금리',
  '환율',
  '유가',
  '중국경제',
  '미국증시',
  '기술주',
  '소비',
  '부동산',
];

export default function OnboardingKeywordList() {
  const { keywords, addKeyword, removeKeyword } = useOnboardingStore();

  const toggle = (k: string) =>
    keywords.includes(k) ? removeKeyword(k) : addKeyword(k);

  return (
    <div className="fade-up">
      <div className="flex flex-wrap justify-center gap-3">
        {recommended.map((k) => (
          <KeywordChip
            key={k}
            label={k}
            active={keywords.includes(k)}
            onClick={() => toggle(k)}
          />
        ))}
      </div>
    </div>
  );
}
