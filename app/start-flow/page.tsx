'use client';

import { useState } from 'react';
import { SessionGate } from '@/components/SessionGate';
import { SessionStarter } from '@/components/SessionStarter';
import { PromptBubble } from '@/components/PromptBubble';
import { useSession } from '@/contexts/SessionContext';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { ArrowRight, Zap } from 'lucide-react';

export default function StartFlowPage() {
  const { currentPrompt } = useSession();
  const [showContinue, setShowContinue] = useState(false);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0F0F0F] relative overflow-hidden">
      <div className="absolute inset-0 circuit-pattern opacity-20"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF0080] via-[#00FFFF] to-[#8AFF00]"></div>
      
      <div className="absolute top-20 left-10 w-64 h-64 bg-[#00FFFF]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#FF0080]/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="max-w-4xl w-full space-y-12">
          <div className="text-center space-y-6">
            <div className="inline-block">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Zap className="w-12 h-12 text-[#FCEE09] animate-pulse" />
                <h1 className="text-5xl md:text-7xl font-black neon-text-cyan font-['Orbitron'] tracking-wider glitch">
                  AI SKILLS
                </h1>
              </div>
              <h2 className="text-4xl md:text-6xl font-black neon-text-pink font-['Orbitron'] tracking-wider">
                COACH
              </h2>
            </div>
            
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-[#00FFFF] to-[#FF0080] blur-xl opacity-50"></div>
              <p className="relative text-[#8AFF00] text-xl md:text-2xl font-['Exo_2'] font-light tracking-wide">
                ASSESS // ENHANCE // DOMINATE
              </p>
            </div>
            
            <div className="flex items-center justify-center gap-4 text-[#00FFFF] text-xs md:text-sm font-['Orbitron'] tracking-widest">
              <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#00FFFF]"></div>
              <span>NEURAL INTERFACE READY</span>
              <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#00FFFF]"></div>
            </div>
          </div>

          <SessionGate requireSession={false}>
            <div className="flex justify-center px-4">
              <SessionStarter onSessionStarted={() => setShowContinue(true)} />
            </div>
          </SessionGate>

          <SessionGate requireSession={true}>
            <div className="space-y-8 px-4">
              {currentPrompt && <PromptBubble prompt={currentPrompt} />}
              {showContinue && (
                <div className="flex justify-center">
                  <Button
                    onClick={() => router.push('/answer-flow')}
                    size="lg"
                    className="bg-gradient-to-r from-[#8AFF00] to-[#FCEE09] hover:from-[#8AFF00]/80 hover:to-[#FCEE09]/80 text-[#0F0F0F] font-bold px-10 py-6 text-lg neon-glow-pink border-2 border-[#8AFF00] font-['Orbitron'] tracking-wider"
                  >
                    CONTINUE <ArrowRight className="ml-3 h-6 w-6" />
                  </Button>
                </div>
              )}
            </div>
          </SessionGate>
          
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-xs text-[#00FFFF]/50 font-['Orbitron'] tracking-widest px-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#00FFFF] rounded-full animate-pulse"></div>
              <span>SECURE</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#8AFF00] rounded-full animate-pulse"></div>
              <span>ENCRYPTED</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#FF0080] rounded-full animate-pulse"></div>
              <span>PRIVATE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
