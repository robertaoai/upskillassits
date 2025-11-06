'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SessionResetter } from '@/components/SessionResetter';
import { PromptBubble } from '@/components/PromptBubble';
import { AnswerBubble } from '@/components/AnswerBubble';
import { useSession } from '@/contexts/SessionContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Send, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Answer {
  text: string;
  timestamp: number;
}

export default function AnswerFlowPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setCurrentPrompt } = useSession();
  
  // Event-driven rendering - check multiple sources
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [firstPrompt, setFirstPrompt] = useState<string | null>(null);
  
  const [answer, setAnswer] = useState('');
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [optInEmail, setOptInEmail] = useState(false);

  // Debug mode tracking
  const [debugMode, setDebugMode] = useState(false);
  const [loadStartTime] = useState(Date.now());

  // Event-driven session detection with conditional timeout
  useEffect(() => {
    const timeoutDisabled = localStorage.getItem('DISABLE_PROMPT_TIMEOUT') === 'true';
    setDebugMode(timeoutDisabled);

    // Priority 1: Check router state (immediate propagation)
    const stateSessionId = (router as any).state?.sessionId;
    const stateFirstPrompt = (router as any).state?.firstPrompt;
    
    // Priority 2: Check localStorage (persistent storage)
    const storedSessionId = localStorage.getItem('sessionId');
    const storedPrompt = localStorage.getItem('currentPrompt');
    
    // Priority 3: Check URL params (fallback)
    const urlSessionId = searchParams.get('sessionId');
    const urlPrompt = searchParams.get('firstPrompt');
    
    const resolvedSessionId = stateSessionId || storedSessionId || urlSessionId;
    const resolvedPrompt = stateFirstPrompt || storedPrompt || urlPrompt;

    // Debug logging
    if (timeoutDisabled) {
      const elapsed = Date.now() - loadStartTime;
      console.log('🔍 [DEBUG MODE] Session Detection:', {
        elapsed: `${elapsed}ms`,
        sources: {
          routerState: { sessionId: stateSessionId, prompt: stateFirstPrompt },
          localStorage: { sessionId: storedSessionId, prompt: storedPrompt },
          urlParams: { sessionId: urlSessionId, prompt: urlPrompt }
        },
        resolved: { sessionId: resolvedSessionId, prompt: resolvedPrompt }
      });
    }
    
    if (resolvedSessionId) {
      // Session found - render immediately
      setSessionId(resolvedSessionId);
      setFirstPrompt(resolvedPrompt);
      setLoading(false);

      if (timeoutDisabled) {
        const elapsed = Date.now() - loadStartTime;
        console.log(`✅ [DEBUG MODE] Session loaded in ${elapsed}ms`);
      }
    } else if (!timeoutDisabled) {
      // Normal mode: wait 4000ms then redirect
      const timeout = setTimeout(() => {
        console.warn('No session found after 4000ms, redirecting to start');
        router.push('/start-flow');
      }, 4000);
      
      return () => clearTimeout(timeout);
    } else {
      // Debug mode: show loading indefinitely, no redirect
      console.log('🔍 [DEBUG MODE] No session found, waiting indefinitely...');
      console.log('💡 To re-enable timeout: localStorage.removeItem("DISABLE_PROMPT_TIMEOUT")');
    }
  }, [router, searchParams, loadStartTime]);

  const answerCount = answers.length;
  const isComplete = answerCount >= 3;
  const buttonLabel = isComplete ? 'COMPLETE ASSESSMENT' : 'REPLY MESSAGE';
  const ButtonIcon = isComplete ? CheckCircle2 : Send;

  const handleSubmit = async () => {
    if (!answer.trim() || !sessionId) return;

    setIsSubmitting(true);
    try {
      if (isComplete) {
        // Final submission to complete endpoint
        const response = await fetch(
          'https://robertcoach.app.n8n.cloud/webhook/session/complete',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              session_id: sessionId,
              opt_in_email: optInEmail,
            }),
          }
        );

        if (!response.ok) throw new Error('Failed to complete assessment');

        toast.success('Assessment completed successfully!');
        router.push('/complete-flow');
      } else {
        // Regular answer submission
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

        // Add current answer to the list
        setAnswers(prev => [...prev, { text: answer, timestamp: Date.now() }]);
        setAnswer('');

        // Update prompt if available
        if (data.next_prompt) {
          setCurrentPrompt(data.next_prompt);
          localStorage.setItem('currentPrompt', data.next_prompt);
          setFirstPrompt(data.next_prompt);
        }

        toast.success('Answer submitted!');
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loader while checking session (event-driven)
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-[#00FFFF] animate-spin mx-auto" />
          <p className="text-[#00FFFF] font-['Orbitron'] tracking-wider">
            {debugMode ? 'DEBUG MODE: WAITING FOR SESSION...' : 'LOADING SESSION...'}
          </p>
          {debugMode && (
            <div className="text-xs text-[#8AFF00] font-mono space-y-1 max-w-md">
              <p>⏱️ Elapsed: {Math.round((Date.now() - loadStartTime) / 1000)}s</p>
              <p>🔍 Timeout disabled - waiting indefinitely</p>
              <p>💡 Check console for session detection logs</p>
              <p className="pt-2 text-[#666666]">
                To re-enable timeout:<br/>
                localStorage.removeItem('DISABLE_PROMPT_TIMEOUT')
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

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
              <span className="text-[#8AFF00] text-sm font-['Orbitron'] tracking-widest">
                {answerCount}/3 ANSWERS
              </span>
              {debugMode && (
                <span className="text-[#FF0080] text-xs font-['Orbitron'] tracking-widest ml-2">
                  🔍 DEBUG MODE
                </span>
              )}
            </div>
          </div>
          <SessionResetter />
        </div>

        <div className="space-y-6">
          {/* First Prompt - Event-driven rendering */}
          {firstPrompt && <PromptBubble prompt={firstPrompt} />}

          {/* Answer Bubbles */}
          {answers.map((ans, index) => (
            <AnswerBubble key={ans.timestamp} answer={ans.text} index={index} />
          ))}

          {/* Input Area */}
          <div className="space-y-6">
            <div className="relative">
              <div className="absolute -top-3 left-4 bg-[#0F0F0F] px-2">
                <span className="text-[#00FFFF] text-xs font-['Orbitron'] tracking-wider">
                  YOUR RESPONSE
                </span>
              </div>
              <Textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder={isComplete ? "Enter your final thoughts..." : "Enter your answer here..."}
                className="min-h-[200px] bg-[#1B1B1B] neon-border-cyan text-[#E0E0E0] placeholder:text-[#666666] focus:border-[#00FFFF] font-['Exo_2'] text-lg resize-none"
                disabled={isSubmitting}
              />
              <div className="absolute bottom-4 right-4 text-xs text-[#666666] font-['Orbitron']">
                {answer.length} CHARS
              </div>
            </div>

            {/* Opt-in Email Checkbox (visible after 3 answers) */}
            {isComplete && (
              <div className="flex items-center space-x-3 p-4 bg-[#1B1B1B] neon-border-green rounded-lg">
                <Checkbox
                  id="opt-in-email"
                  checked={optInEmail}
                  onCheckedChange={(checked) => setOptInEmail(checked as boolean)}
                  className="border-[#8AFF00] data-[state=checked]:bg-[#8AFF00] data-[state=checked]:text-[#0F0F0F]"
                />
                <label
                  htmlFor="opt-in-email"
                  className="text-[#E0E0E0] text-sm font-['Exo_2'] cursor-pointer leading-relaxed"
                >
                  Send me my personalized AI skills report via email
                </label>
              </div>
            )}
            
            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !answer.trim()}
              size="lg"
              className={`w-full ${
                isComplete
                  ? 'bg-gradient-to-r from-[#8AFF00] to-[#FCEE09] hover:from-[#8AFF00]/80 hover:to-[#FCEE09]/80 neon-glow-green border-[#8AFF00]'
                  : 'bg-gradient-to-r from-[#00FFFF] to-[#8AFF00] hover:from-[#00FFFF]/80 hover:to-[#8AFF00]/80 neon-glow-cyan border-[#00FFFF]'
              } text-[#0F0F0F] font-bold py-8 text-xl border-2 font-['Orbitron'] tracking-wider disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                  PROCESSING...
                </>
              ) : (
                <>
                  <ButtonIcon className="mr-3 h-6 w-6" />
                  {buttonLabel}
                </>
              )}
            </Button>
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-2 text-xs text-[#00FFFF]/50 font-['Orbitron'] tracking-widest pt-8">
          <div className="w-16 h-px bg-gradient-to-r from-transparent to-[#00FFFF]"></div>
          <span>NEURAL LINK ACTIVE</span>
          <div className="w-16 h-px bg-gradient-to-l from-transparent to-[#00FFFF]"></div>
        </div>
      </div>
    </div>
  );
}
