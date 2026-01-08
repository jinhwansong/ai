import React from 'react';
import { Tag } from 'lucide-react';

interface TagProps {
  size?: number;
  tags: string[];
}

export default function Tags({ size, tags }: TagProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags?.map((tag) => (
        <span
          key={tag}
          className="flex items-center gap-1 text-[10px] font-bold text-(--primary) bg-(--primary-soft) px-2 py-0.5 rounded-md"
        >
          <Tag size={size} />
          {tag}
        </span>
      ))}
    </div>
  );
}
