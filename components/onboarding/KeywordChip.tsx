import clsx from 'clsx';

interface KeywordProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  active: boolean;
}

export default function KeywordChip({ label, active, ...props }: KeywordProps) {
  const chipClass = clsx(
    'px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 ',

    active && [
      'bg-(--keyword-active)',
      'text-(--primary)',
      'border-(--primary)',
    ],

    !active && [
      'bg-(--keyword-bg)',
      'text-(--foreground)',
      'border-(--border)',
      'hover:bg-(--hover-surface)',
    ]
  );
  return (
    <button {...props} className={chipClass}>
      {label}
    </button>
  );
}
