'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SessionResetter } from '@/components/SessionResetter';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Download, Loader2 } from 'lucide-react';

export default function CompleteFlowPage() {
  const router = useRouter();
  
  // Hydration Guard - direct localStorage access
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Hydration Guard with 3200ms timeout (increased from 150ms)
  useEffect(() => {
    const storedSessionId = localStorage.getItem('sessionId');
    
    const timeout = setTimeout(() => {
      if (!storedSessionId) {
        console.warn('No session found after 3200ms, redirecting to start');
        router.push('/start-flow');
      } else {
        setSessionId(storedSessionId);
        setLoading(false);
      }
    }, 3200); // Increased from 150ms to 3200ms

    return () => clearTimeout(timeout);
  }, [router]);

  const handleDownloadPDF = () => {
    // TODO: Implement PDF download
    console.log('Download PDF for session:', sessionId);
  };

  const handleStartNew = () => {
    localStorage.removeItem('sessionId');
    localStorage.removeItem('currentPrompt');
    router.push('/start-flow');
  };

  // Show loader while checking session
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-[#00FFFF] animate-spin mx-auto" />
          <p className="text-[#00FFFF] font-['Orbitron'] tracking-wider">
            INITIALIZING...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] relative overflow-hidden">
      <div className="absolute inset-0 circuit-pattern opacity-20"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF0080] via-[#00FFFF] to-[#8AFF00]"></div>
      
      <div className="absolute top-20 right-10 w-64 h-64 bg-[#8AFF00]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#00FFFF]/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 max-w-5xl mx-auto py-12 px-4 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-5xl font-black neon-text-green font-['Orbitron'] tracking-wider mb-2">
              COMPLETE
            </h1>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#8AFF00]" />
              <span className="text-[#8AFF00] text-sm font-['Orbitron'] tracking-widest">
                ASSESSMENT FINISHED
              </span>
            </div>
          </div>
          <SessionResetter />
        </div>

        <div className="bg-[#1B1B1B] neon-border-green rounded-2xl p-8 space-y-6">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#8AFF00] to-[#FCEE09] flex items-center justify-center neon-glow-green">
              <CheckCircle2 className="w-10 h-10 text-[#0F0F0F]" />
            </div>
            
            <h2 className="text-3xl font-bold text-[#8AFF00] font-['Orbitron'] tracking-wider">
              ASSESSMENT COMPLETE!
            </h2>
            
            <p className="text-[#E0E0E0] font-['Exo_2'] text-lg max-w-2xl mx-auto">
              Thank you for completing the AI Skills Assessment. Your personalized report has been generated and is ready for download.
            </p>
          </div>

          <div className="border-t border-[#8AFF00]/20 pt-6 space-y-4">
            <Button
              onClick={handleDownloadPDF}
              size="lg"
              className="w-full bg-gradient-to-r from-[#8AFF00] to-[#FCEE09] hover:from-[#8AFF00]/80 hover:to-[#FCEE09]/80 text-[#0F0F0F] font-bold py-8 text-xl border-2 border-[#8AFF00] neon-glow-green font-['Orbitron'] tracking-wider transition-all duration-300"
            >
              <Download className="mr-3 h-6 w-6" />
              DOWNLOAD YOUR REPORT
            </Button>

            <Button
              onClick={handleStartNew}
              size="lg"
              variant="outline"
              className="w-full bg-transparent border-2 border-[#00FFFF] text-[#00FFFF] hover:bg-[#00FFFF]/10 font-bold py-8 text-xl font-['Orbitron'] tracking-wider transition-all duration-300"
            >
              START NEW ASSESSMENT
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-[#8AFF00]/50 font-['Orbitron'] tracking-widest pt-8">
          <div className="w-16 h-px bg-gradient-to-r from-transparent to-[#8AFF00]"></div>
          <span>MISSION ACCOMPLISHED</span>
          <div className="w-16 h-px bg-gradient-to-l from-transparent to-[#8AFF00]"></div>
        </div>
      </div>
    </div>
  );
}
