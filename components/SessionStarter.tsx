'use client';

import { useState } from 'react';
import { useSession } from '@/contexts/SessionContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, Mail, User } from 'lucide-react';
import { toast } from 'sonner';

interface SessionStarterProps {
  onSessionStarted?: () => void;
}

export function SessionStarter({ onSessionStarted }: SessionStarterProps) {
  const [email, setEmail] = useState('');
  const [personaHint, setPersonaHint] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setSessionId, setCurrentPrompt } = useSession();

  const isValidEmail = (email: string) => {
    return email.trim().length > 0 && email.includes('@');
  };

  const isFormValid = isValidEmail(email) && personaHint.trim().length > 0;

  const startSession = async () => {
    if (!isFormValid) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('https://robertcoach.app.n8n.cloud/webhook/session/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          personaHint: personaHint.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to start session');
      }

      const data = await response.json();
      
      if (!data.session?.id) {
        throw new Error('No session ID received from server');
      }

      setSessionId(data.session.id);
      
      if (data.first_prompt) {
        setCurrentPrompt(data.first_prompt);
      }
      
      toast.success('Assessment started successfully!');
      onSessionStarted?.();
    } catch (error) {
      console.error('Session start error:', error);
      toast.error('Failed to start assessment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl space-y-8">
      <div className="space-y-6">
        <div className="relative">
          <div className="absolute -top-3 left-4 bg-[#0F0F0F] px-2 z-10">
            <span className="text-[#00FFFF] text-xs font-['Orbitron'] tracking-wider">EMAIL ADDRESS</span>
          </div>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#00FFFF]" />
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="pl-12 h-14 bg-[#1B1B1B] neon-border-cyan text-[#E0E0E0] placeholder:text-[#666666] focus:border-[#00FFFF] font-['Exo_2'] text-lg"
              disabled={isLoading}
            />
          </div>
          {email && !isValidEmail(email) && (
            <p className="text-[#FF0080] text-xs mt-2 font-['Orbitron'] tracking-wider">
              INVALID EMAIL FORMAT
            </p>
          )}
        </div>

        <div className="relative">
          <div className="absolute -top-3 left-4 bg-[#0F0F0F] px-2 z-10">
            <span className="text-[#00FFFF] text-xs font-['Orbitron'] tracking-wider">ROLE / PERSONA</span>
          </div>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#00FFFF]" />
            <Input
              type="text"
              value={personaHint}
              onChange={(e) => setPersonaHint(e.target.value)}
              placeholder="e.g., Software Manager, Data Scientist, Product Designer"
              className="pl-12 h-14 bg-[#1B1B1B] neon-border-cyan text-[#E0E0E0] placeholder:text-[#666666] focus:border-[#00FFFF] font-['Exo_2'] text-lg"
              disabled={isLoading}
            />
          </div>
          {personaHint && personaHint.trim().length < 3 && (
            <p className="text-[#FF0080] text-xs mt-2 font-['Orbitron'] tracking-wider">
              MINIMUM 3 CHARACTERS REQUIRED
            </p>
          )}
        </div>
      </div>

      <Button
        onClick={startSession}
        disabled={isLoading || !isFormValid}
        size="lg"
        className="w-full relative bg-gradient-to-r from-[#FF0080] to-[#00FFFF] hover:from-[#FF0080]/80 hover:to-[#00FFFF]/80 text-white font-bold px-12 py-8 text-xl shadow-lg neon-glow-cyan transition-all duration-300 border-2 border-[#00FFFF] overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></span>
        <Sparkles className="mr-3 h-7 w-7 animate-pulse" />
        <span className="relative z-10 font-['Orbitron']">
          {isLoading ? 'INITIALIZING...' : 'START ASSESSMENT'}
        </span>
      </Button>

      {!isFormValid && (email || personaHint) && (
        <div className="text-center">
          <p className="text-[#FCEE09] text-sm font-['Orbitron'] tracking-wider animate-pulse">
            ⚠ COMPLETE ALL FIELDS TO PROCEED
          </p>
        </div>
      )}
    </div>
  );
}
