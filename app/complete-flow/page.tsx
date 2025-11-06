'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SessionGate } from '@/components/SessionGate';
import { useSession } from '@/contexts/SessionContext';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Download, Home } from 'lucide-react';

export default function CompleteFlowPage() {
  const { sessionId, clearSession } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!sessionId) {
      router.push('/start-flow');
    }
  }, [sessionId, router]);

  const handleDownloadReport = () => {
    // TODO: Implement PDF download
    console.log('Download report for session:', sessionId);
  };

  const handleStartNew = () => {
    clearSession();
    router.push('/start-flow');
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] relative overflow-hidden">
      <div className="absolute inset-0 circuit-pattern opacity-20"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF0080] via-[#00FFFF] to-[#8AFF00]"></div>
      
      <div className="absolute top-20 right-10 w-64 h-64 bg-[#8AFF00]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#00FFFF]/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto py-20 px-4">
        <SessionGate requireSession={true}>
          <div className="text-center space-y-12">
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-[#8AFF00] to-[#FCEE09] neon-glow-green mb-8">
              <CheckCircle2 className="w-16 h-16 text-[#0F0F0F]" />
            </div>
            
            <div className="space-y-4">
              <h1 className="text-6xl font-black neon-text-green font-['Orbitron'] tracking-wider">
                ASSESSMENT COMPLETE
              </h1>
              <p className="text-xl text-[#E0E0E0] font-['Exo_2'] max-w-2xl mx-auto leading-relaxed">
                Your personalized AI skills report has been generated.
                <span className="text-[#8AFF00]"> Check your email for detailed insights.</span>
              </p>
            </div>

            <div className="bg-[#1B1B1B] neon-border-green rounded-2xl p-8 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-3 h-3 bg-[#8AFF00] rounded-full animate-pulse"></div>
                  <span className="text-[#8AFF00] font-['Orbitron'] tracking-widest">
                    REPORT READY
                  </span>
                </div>
                
                <p className="text-[#E0E0E0] font-['Exo_2'] text-lg">
                  Your comprehensive skills analysis is being sent to your email.
                  You can also download it directly below.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  onClick={handleDownloadReport}
                  size="lg"
                  className="flex-1 bg-gradient-to-r from-[#8AFF00] to-[#FCEE09] hover:from-[#8AFF00]/80 hover:to-[#FCEE09]/80 text-[#0F0F0F] font-bold py-6 text-lg neon-glow-green border-2 border-[#8AFF00] font-['Orbitron'] tracking-wider"
                >
                  <Download className="mr-3 h-5 w-5" />
                  DOWNLOAD REPORT
                </Button>
                
                <Button
                  onClick={handleStartNew}
                  size="lg"
                  variant="outline"
                  className="flex-1 bg-[#1B1B1B] border-[#00FFFF] text-[#00FFFF] hover:bg-[#00FFFF]/10 font-bold py-6 text-lg border-2 font-['Orbitron'] tracking-wider"
                >
                  <Home className="mr-3 h-5 w-5" />
                  START NEW ASSESSMENT
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-[#8AFF00]/50 font-['Orbitron'] tracking-widest">
              <div className="w-16 h-px bg-gradient-to-r from-transparent to-[#8AFF00]"></div>
              <span>MISSION ACCOMPLISHED</span>
              <div className="w-16 h-px bg-gradient-to-l from-transparent to-[#8AFF00]"></div>
            </div>
          </div>
        </SessionGate>
      </div>
    </div>
  );
}
