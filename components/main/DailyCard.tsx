import { DailyIssue } from '@/types/report';

export default function DailyCard({ issue }: { issue: DailyIssue }) {
  return (
    <div
      className="
      p-5 rounded-xl border border-(--border) bg-(--card-bg)
      shadow-sm hover:shadow transition-all
    "
    >
      <h3 className="text-lg font-semibold text-(--text-title)">
        {issue.title}
      </h3>

      <p className="text-(--text-body) mt-2 leading-relaxed">{issue.summary}</p>

      <p className="text-(--primary) font-medium mt-3 text-sm">
        한국 시장 영향 → {issue.koreaImpact}
      </p>
    </div>
  );
}
