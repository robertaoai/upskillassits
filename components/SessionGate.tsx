'use client';

import React from 'react';
import { useSession } from '@/contexts/SessionContext';

interface SessionGateProps {
  children: React.ReactNode;
  requireSession?: boolean;
  fallback?: React.ReactNode;
}

export function SessionGate({ children, requireSession = false, fallback = null }: SessionGateProps) {
  const { sessionId } = useSession();

  if (requireSession && !sessionId) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
