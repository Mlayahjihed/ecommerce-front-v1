// components/BackButtonWrapper.jsx
'use client';

import { useSearchParams } from 'next/navigation';
import BackButton from './BackButton';

export default function BackButtonWrapper() {
  const searchParams = useSearchParams();
  const from = searchParams.get('from');
  const backUrl = from ? decodeURIComponent(from) : null;

  return <BackButton backUrl={backUrl} />;
}
