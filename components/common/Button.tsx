import React from 'react';
import clsx from 'clsx';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  full?: boolean;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  full,
  className,
  children,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center rounded-xl transition-colors duration-150 font-semibold disabled:opacity-50 disabled:cursor-not-allowed';

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-sm',
    lg: 'px-5 py-4 text-base',
  };

  const variants = {
    primary: 'bg-(--primary) text-white hover:bg-(--primary-strong)',
    secondary:
      'bg-white text-(--text-body) border border-(--border) hover:bg-(--hover-surface)',
    ghost: 'bg-transparent text-(--text-body) hover:bg-(--hover-surface)',
  };

  return (
    <button
      {...props}
      className={clsx(
        base,
        sizes[size],
        variants[variant],
        full && 'w-full',
        className
      )}
    >
      {children}
    </button>
  );
}
