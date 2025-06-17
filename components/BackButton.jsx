'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

const BackButton = ({ backUrl }) => {
  const router = useRouter();

  const handleBack = () => {
    if (backUrl) {
      router.push(backUrl);
    } else {
      router.back();
    }
  };

  return (
    <button
      onClick={handleBack}
      className="text-teal-500 hover:text-teal-600 p-4 rounded-full transition-colors"
      aria-label="Retour"
    >
      <ArrowLeft className="w-6 h-6" />
    </button>
  );
};

export default BackButton;