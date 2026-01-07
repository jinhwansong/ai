import { ReactNode, Suspense } from 'react';
import Spinner from './Spinner';

type SectionSuspenseProps = {
  fallback?: ReactNode;
  children: ReactNode;
};

export default function SectionSuspense({ fallback, children }: SectionSuspenseProps) {
  return <Suspense fallback={fallback ?? <Spinner />}>{children}</Suspense>;
}
