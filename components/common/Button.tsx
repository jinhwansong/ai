import React from 'react';
import clsx from 'clsx';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'onBoarding';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  full?: boolean;
}

export default function Button({
  variant = 'primary',
  full,
  className,
  children,
  ...props
}: ButtonProps) {
  const ButtonColor = clsx(
    full && 'w-full',
    className,
    'px-4 py-2 rounded-lg font-medium text-sm',
    'transition-all duration-200',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    variant === 'primary' && 'bg-(--primary) text-white',
    variant === 'secondary' &&
      'bg-(--keyword-bg) text-(--foreground) border border-(--border) hover:bg-(--hover-strong)',
    variant === 'ghost' &&
      'bg-transparent text-(--foreground) hover:bg-(--hover-surface)',
    variant === 'onBoarding' &&
      'w-full max-w-sm py-3 rounded-xl bg-(--primary) text-(--text-white)  font-semibold'
  );

  return (
    <button {...props} className={ButtonColor}>
      {children}
    </button>
  );
}
