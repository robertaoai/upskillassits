'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/contexts/SessionContext';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

export function SessionResetter() {
  const { clearSession } = useSession();
  const router = useRouter();

  const handleReset = () => {
    clearSession();
    toast.success('Session reset successfully');
    router.push('/start-flow');
  };

  return (
    <Button
      onClick={handleReset}
      variant="outline"
      size="sm"
      className="bg-[#1B1B1B] border-[#FF0080] text-[#FF0080] hover:bg-[#FF0080]/10 font-['Orbitron'] tracking-wider"
    >
      <RotateCcw className="mr-2 h-4 w-4" />
      RESET
    </Button>
  );
}
