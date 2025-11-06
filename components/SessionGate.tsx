'use client';

import { useSession } from '@/contexts/SessionContext';
import { ReactNode } from 'react';

interface SessionGateProps {
  children: ReactNode;
  fallback?: ReactNode;
  requireSession?: boolean;
}

export function SessionGate({ children, fallback = null, requireSession = true }: SessionGateProps) {
  const { sessionId } = useSession();

  if (requireSession && !sessionId) {
    return <>{fallback}</>;
  }

  if (!requireSession && sessionId) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
