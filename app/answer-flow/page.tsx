'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SessionGate } from '@/components/SessionGate';
import { PromptBubble } from '@/components/PromptBubble';
import { SessionResetter } from '@/components/SessionResetter';
import { useSession } from '@/contexts/SessionContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AnswerFlowPage() {
  const { sessionId, currentPrompt, setCurrentPrompt } = useSession();
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!sessionId) {
      router.push('/start-flow');
    }
  }, [sessionId, router]);

  const handleSubmit = async () => {
    if (!answer.trim() || !sessionId) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `https://robertcoach.app.n8n.cloud/webhook/6a535534-b0e8-48b5-9bbe-c5b72c35b895/session/${sessionId}/answer`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answer }),
        }
      );

      if (!response.ok) throw new Error('Failed to submit answer');

      const data = await response.json();

      if (data.completed) {
        toast.success('Assessment complete!');
        router.push('/complete-flow');
      } else if (data.next_prompt) {
        setCurrentPrompt(data.next_prompt);
        setAnswer('');
        toast.success('Answer submitted!');
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Failed to submit answer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] relative overflow-hidden">
      <div className="absolute inset-0 circuit-pattern opacity-20"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF0080] via-[#00FFFF] to-[#8AFF00]"></div>
      
      <div className="absolute top-20 right-10 w-64 h-64 bg-[#FF0080]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#00FFFF]/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 max-w-5xl mx-auto py-12 px-4 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-5xl font-black neon-text-cyan font-['Orbitron'] tracking-wider mb-2">
              ASSESSMENT
            </h1>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-[#8AFF00] rounded-full animate-pulse"></div>
              <span className="text-[#8AFF00] text-sm font-['Orbitron'] tracking-widest">IN PROGRESS</span>
            </div>
          </div>
          <SessionResetter />
        </div>

        <SessionGate requireSession={true} fallback={
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-12 h-12 text-[#00FFFF] animate-spin" />
          </div>
        }>
          {currentPrompt && <PromptBubble prompt={currentPrompt} />}

          <div className="space-y-6">
            <div className="relative">
              <div className="absolute -top-3 left-4 bg-[#0F0F0F] px-2">
                <span className="text-[#00FFFF] text-xs font-['Orbitron'] tracking-wider">YOUR RESPONSE</span>
              </div>
              <Textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Enter your answer here..."
                className="min-h-[200px] bg-[#1B1B1B] neon-border-cyan text-[#E0E0E0] placeholder:text-[#666666] focus:border-[#00FFFF] font-['Exo_2'] text-lg resize-none"
              />
              <div className="absolute bottom-4 right-4 text-xs text-[#666666] font-['Orbitron']">
                {answer.length} CHARS
              </div>
            </div>
            
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !answer.trim()}
              size="lg"
              className="w-full bg-gradient-to-r from-[#00FFFF] to-[#8AFF00] hover:from-[#00FFFF]/80 hover:to-[#8AFF00]/80 text-[#0F0F0F] font-bold py-8 text-xl neon-glow-cyan border-2 border-[#00FFFF] font-['Orbitron'] tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                  PROCESSING...
                </>
              ) : (
                <>
                  <Send className="mr-3 h-6 w-6" />
                  SUBMIT ANSWER
                </>
              )}
            </Button>
          </div>
        </SessionGate>
        
        <div className="flex items-center justify-center gap-2 text-xs text-[#00FFFF]/50 font-['Orbitron'] tracking-widest pt-8">
          <div className="w-16 h-px bg-gradient-to-r from-transparent to-[#00FFFF]"></div>
          <span>NEURAL LINK ACTIVE</span>
          <div className="w-16 h-px bg-gradient-to-l from-transparent to-[#00FFFF]"></div>
        </div>
      </div>
    </div>
  );
}
