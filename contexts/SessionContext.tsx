'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface SessionContextType {
  sessionId: string | null;
  setSessionId: (id: string | null) => void;
  currentPrompt: string | null;
  setCurrentPrompt: (prompt: string | null) => void;
  clearSession: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [sessionId, setSessionIdState] = useState<string | null>(null);
  const [currentPrompt, setCurrentPromptState] = useState<string | null>(null);

  useEffect(() => {
    const storedSessionId = localStorage.getItem('sessionId');
    const storedPrompt = localStorage.getItem('currentPrompt');
    if (storedSessionId) setSessionIdState(storedSessionId);
    if (storedPrompt) setCurrentPromptState(storedPrompt);
  }, []);

  const setSessionId = (id: string | null) => {
    setSessionIdState(id);
    if (id) {
      localStorage.setItem('sessionId', id);
    } else {
      localStorage.removeItem('sessionId');
    }
  };

  const setCurrentPrompt = (prompt: string | null) => {
    setCurrentPromptState(prompt);
    if (prompt) {
      localStorage.setItem('currentPrompt', prompt);
    } else {
      localStorage.removeItem('currentPrompt');
    }
  };

  const clearSession = () => {
    setSessionIdState(null);
    setCurrentPromptState(null);
    localStorage.removeItem('sessionId');
    localStorage.removeItem('currentPrompt');
  };

  return (
    <SessionContext.Provider
      value={{ sessionId, setSessionId, currentPrompt, setCurrentPrompt, clearSession }}
    >
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
