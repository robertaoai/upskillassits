'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface SessionGateProps {
  children: React.ReactNode;
  requireSession?: boolean;
  redirectTo?: string;
  timeout?: number;
}

export function SessionGate({ 
  children, 
  requireSession = false, 
  redirectTo = '/start-flow',
  timeout = 3200 // Increased from 150ms to 3200ms
}: SessionGateProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(requireSession);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    if (!requireSession) {
      setLoading(false);
      return;
    }

    const sessionId = localStorage.getItem('sessionId');
    
    const timeoutId = setTimeout(() => {
      if (!sessionId) {
        console.warn(`No session found after ${timeout}ms, redirecting to ${redirectTo}`);
        router.push(redirectTo);
      } else {
        setHasSession(true);
        setLoading(false);
      }
    }, timeout);

    return () => clearTimeout(timeoutId);
  }, [requireSession, redirectTo, timeout, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-[#00FFFF] animate-spin mx-auto" />
          <p className="text-[#00FFFF] font-['Orbitron'] tracking-wider">
            WAITING FOR SESSION...
          </p>
        </div>
      </div>
    );
  }

  if (requireSession && !hasSession) {
    return null;
  }

  return <>{children}</>;
}
