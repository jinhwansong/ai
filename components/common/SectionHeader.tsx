import { ReactNode } from 'react';
import Tooltip from './Tooltip';

type SectionHeaderProps = {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
  tooltip?: string;
};

export default function SectionHeader({
  icon,
  title,
  subtitle,
  action,
  className,
  tooltip,
}: SectionHeaderProps) {
  return (
    <div
      className={`flex items-center justify-between px-2 ${className ?? ''}`}
    >
      <div className="flex items-center gap-2">
        <div className="flex gap-3 items-center flex-wrap">
          <h3 className="text-lg font-bold text-(--text-title) flex items-center gap-2">
            <span>{icon}</span>
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs font-medium text-(--text-muted) sm:block">
              {subtitle}
            </p>
          )}
        </div>
        {tooltip ? <Tooltip content={tooltip} /> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

