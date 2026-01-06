import React from 'react';
import clsx from 'clsx';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'onBoarding' | 'dark' | 'link';

type ButtonSize = 'sm' | 'md' | 'lg' | 'xl' | 'xs';

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
    'inline-flex items-center justify-center transition-all duration-200 font-bold active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed';

  const sizes = {
    xs: 'text-xs',
    sm: 'px-3 py-2 text-sm rounded-lg',
    md: 'px-4 py-3 text-sm rounded-xl',
    lg: 'px-5 py-4 text-lg rounded-xl',
    xl: 'px-6 py-5 text-xl rounded-2xl',
  };

  const variants = {
    primary:
      'bg-(--primary) text-white hover:bg-(--primary-strong) shadow-lg shadow-indigo-500/20',
    secondary:
      'bg-white text-(--text-body) border border-(--border) hover:bg-(--hover-surface)',
    ghost: 'bg-transparent text-(--text-body) hover:bg-(--hover-surface)',
    dark: 'bg-(--foreground) text-(--btn-text) hover:bg-(--btn-bg-hover) ',
    link: 'font-bold text-(--primary-strong) hover:underline',
    onBoarding:
      'bg-(--primary) text-white shadow-xl shadow-indigo-500/30 hover:bg-(--primary-strong) disabled:bg-(--border) disabled:text-(--text-muted) disabled:shadow-none',
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
