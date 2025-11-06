'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useSessionStorage } from '@/hooks/useSessionStorage';

interface SessionContextType {
  sessionId: string | null;
  setSessionId: (id: string | null) => void;
  currentPrompt: string | null;
  setCurrentPrompt: (prompt: string | null) => void;
  clearSession: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [sessionId, setSessionId] = useSessionStorage<string | null>('sessionId', null);
  const [currentPrompt, setCurrentPrompt] = useSessionStorage<string | null>('currentPrompt', null);

  const clearSession = () => {
    setSessionId(null);
    setCurrentPrompt(null);
  };

  return (
    <SessionContext.Provider value={{ sessionId, setSessionId, currentPrompt, setCurrentPrompt, clearSession }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
