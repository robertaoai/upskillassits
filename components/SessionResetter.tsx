'use client';

import { useSession } from '@/contexts/SessionContext';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function SessionResetter() {
  const { clearSession } = useSession();
  const router = useRouter();

  const handleReset = () => {
    clearSession();
    toast.success('Session cleared. Ready for new assessment!');
    router.push('/start-flow');
  };

  return (
    <Button
      onClick={handleReset}
      variant="outline"
      className="neon-border-pink text-[#FF0080] hover:bg-[#FF0080]/10 hover:text-[#FF0080] font-['Orbitron'] font-bold tracking-wider transition-all duration-300"
    >
      <RotateCcw className="mr-2 h-5 w-5" />
      NEW ASSESSMENT
    </Button>
  );
}
