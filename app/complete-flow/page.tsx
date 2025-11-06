'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SessionGate } from '@/components/SessionGate';
import { SessionResetter } from '@/components/SessionResetter';
import { useSession } from '@/contexts/SessionContext';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Download, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function CompleteFlowPage() {
  const { sessionId } = useSession();
  const [isDownloading, setIsDownloading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!sessionId) {
      router.push('/start-flow');
    }
  }, [sessionId, router]);

  const handleDownload = async () => {
    if (!sessionId) return;

    setIsDownloading(true);
    try {
      const response = await fetch('https://robertcoach.app.n8n.cloud/webhook/session/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId }),
      });

      if (!response.ok) throw new Error('Failed to generate report');

      const data = await response.json();
      
      if (data.pdf_url) {
        window.open(data.pdf_url, '_blank');
      }
      
      toast.success('Report downloaded!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download report. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] relative overflow-hidden">
      <div className="absolute inset-0 circuit-pattern opacity-20"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF0080] via-[#00FFFF] to-[#8AFF00]"></div>
      
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#8AFF00]/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00FFFF]/10 rounded-full blur-3xl animate-pulse"></div>
      
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <SessionGate requireSession={true} fallback={
          <div className="flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-[#00FFFF] animate-spin" />
          </div>
        }>
          <div className="max-w-3xl w-full space-y-12 text-center">
            <div className="flex justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#00FFFF] to-[#8AFF00] rounded-full blur-3xl opacity-50 animate-pulse"></div>
              <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-[#00FFFF] to-[#8AFF00] flex items-center justify-center neon-glow-cyan border-4 border-[#00FFFF]">
                <CheckCircle2 className="h-16 w-16 text-[#0F0F0F]" />
              </div>
            </div>

            <div className="space-y-6">
              <div className="inline-block">
                <h1 className="text-6xl font-black neon-text-cyan font-['Orbitron'] tracking-wider mb-2">
                  ASSESSMENT
                </h1>
                <h2 className="text-5xl font-black neon-text-green font-['Orbitron'] tracking-wider">
                  COMPLETE
                </h2>
              </div>
              
              <div className="flex items-center justify-center gap-3">
                <Sparkles className="w-6 h-6 text-[#FCEE09] animate-pulse" />
                <p className="text-[#E0E0E0] text-xl font-['Exo_2'] font-light">
                  Your AI skills report is ready for download
                </p>
                <Sparkles className="w-6 h-6 text-[#FCEE09] animate-pulse" />
              </div>
            </div>

            <div className="space-y-6">
              <Button
                onClick={handleDownload}
                disabled={isDownloading}
                size="lg"
                className="bg-gradient-to-r from-[#00FFFF] to-[#8AFF00] hover:from-[#00FFFF]/80 hover:to-[#8AFF00]/80 text-[#0F0F0F] font-bold px-12 py-8 text-xl neon-glow-cyan border-2 border-[#00FFFF] font-['Orbitron'] tracking-wider"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="mr-3 h-7 w-7 animate-spin" />
                    GENERATING...
                  </>
                ) : (
                  <>
                    <Download className="mr-3 h-7 w-7" />
                    DOWNLOAD REPORT
                  </>
                )}
              </Button>

              <div className="pt-6">
                <SessionResetter />
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-8 text-xs text-[#00FFFF]/50 font-['Orbitron'] tracking-widest pt-8">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#8AFF00] rounded-full animate-pulse"></div>
                <span>ANALYSIS COMPLETE</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#00FFFF] rounded-full animate-pulse"></div>
                <span>DATA SECURED</span>
              </div>
            </div>
          </div>
        </SessionGate>
      </div>
    </div>
  );
}
