'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/contexts/SessionContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Mail, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

export default function StartFlowPage() {
  const [email, setEmail] = useState('');
  const [personaHint, setPersonaHint] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const { setSessionId, setCurrentPrompt } = useSession();
  const router = useRouter();

  useEffect(() => {
    const mode = localStorage.getItem('DISABLE_PROMPT_TIMEOUT') === 'true';
    setDebugMode(mode);
  }, []);

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const canSubmit = email.trim() && personaHint.trim() && isValidEmail(email);

  const handleStart = async () => {
    if (!canSubmit) return;

    setIsLoading(true);
    const startTime = Date.now();
    
    // FIXED: Add metadata field with source: "web"
    const payload = {
      email: email.trim(),
      personaHint: personaHint.trim(),
      metadata: {
        source: "web"
      }
    };

    if (debugMode) {
      console.log('🚀 [DEBUG] Starting webhook request...');
      console.log('📤 [DEBUG] Payload:', payload);
    }

    try {
      const response = await fetch(
        'https://robertcoach.app.n8n.cloud/webhook/session/start',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      const elapsed = Date.now() - startTime;
      
      if (debugMode) {
        console.log(`⏱️ [DEBUG] Webhook completed in ${elapsed}ms`);
        console.log('📊 [DEBUG] Response status:', response.status, response.statusText);
      }

      if (!response.ok) throw new Error('Failed to start session');

      const data = await response.json();
      
      // CRITICAL: Log raw response structure
      if (debugMode) {
        console.log('📦 [DEBUG] RAW WEBHOOK RESPONSE:');
        console.log(JSON.stringify(data, null, 2));
        console.log('🔍 [DEBUG] Response type:', Array.isArray(data) ? 'Array' : 'Object');
        console.log('🔍 [DEBUG] Response length:', Array.isArray(data) ? data.length : 'N/A');
      }

      // Try to extract session ID from different possible structures
      let sessionId: string | undefined;
      let firstPrompt: string | undefined;

      // Check if response is array format (as documented)
      if (Array.isArray(data) && data.length > 0) {
        if (debugMode) {
          console.log('✅ [DEBUG] Response is array, extracting data[0]...');
          console.log('🔍 [DEBUG] data[0] structure:', JSON.stringify(data[0], null, 2));
        }
        
        sessionId = data[0]?.session?.id;
        firstPrompt = data[0]?.first_prompt;
        
        if (debugMode) {
          console.log('🔍 [DEBUG] Extracted from array:');
          console.log('  - sessionId:', sessionId);
          console.log('  - firstPrompt:', firstPrompt);
        }
      } 
      // Check if response is object format (alternative structure)
      else if (typeof data === 'object' && data !== null) {
        if (debugMode) {
          console.log('⚠️ [DEBUG] Response is object, trying alternative extraction...');
        }
        
        // Try different possible field names
        sessionId = data.session_id || data.id || data.session?.id;
        firstPrompt = data.initial_prompt || data.first_prompt || data.prompt;
        
        if (debugMode) {
          console.log('🔍 [DEBUG] Extracted from object:');
          console.log('  - sessionId:', sessionId);
          console.log('  - firstPrompt:', firstPrompt);
          console.log('🔍 [DEBUG] Tried fields:');
          console.log('  - data.session_id:', data.session_id);
          console.log('  - data.id:', data.id);
          console.log('  - data.session?.id:', data.session?.id);
          console.log('  - data.initial_prompt:', data.initial_prompt);
          console.log('  - data.first_prompt:', data.first_prompt);
        }
      }

      // Validate extracted data
      if (!sessionId || !firstPrompt) {
        console.error('❌ [ERROR] Failed to extract session data:');
        console.error('  - sessionId:', sessionId);
        console.error('  - firstPrompt:', firstPrompt);
        console.error('  - Raw response:', data);
        throw new Error('Invalid response structure from webhook');
      }

      if (debugMode) {
        console.log('✅ [DEBUG] Session data validated successfully');
        console.log('💾 [DEBUG] Updating SessionContext...');
      }

      // Update context (this should write to localStorage)
      setSessionId(sessionId);
      setCurrentPrompt(firstPrompt);

      // Verify localStorage write
      if (debugMode) {
        setTimeout(() => {
          const storedSessionId = localStorage.getItem('sessionId');
          const storedPrompt = localStorage.getItem('currentPrompt');
          console.log('🔍 [DEBUG] localStorage verification (after 100ms):');
          console.log('  - sessionId:', storedSessionId);
          console.log('  - currentPrompt:', storedPrompt);
          console.log('  - Match:', storedSessionId === sessionId);
        }, 100);
      }

      toast.success('Session started successfully!');
      
      if (debugMode) {
        console.log('🧭 [DEBUG] Navigating to /answer-flow...');
        console.log('📍 [DEBUG] Using URL params for data transfer');
      }

      // Navigate with URL params (router state doesn't work in static export)
      router.push(`/answer-flow?sessionId=${sessionId}&firstPrompt=${encodeURIComponent(firstPrompt)}`);
      
    } catch (error) {
      console.error('❌ [ERROR] Start session error:', error);
      if (debugMode) {
        console.error('🔍 [DEBUG] Error details:', {
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined
        });
      }
      toast.error('Failed to start session. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] relative overflow-hidden">
      <div className="absolute inset-0 circuit-pattern opacity-20"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF0080] via-[#00FFFF] to-[#8AFF00]"></div>
      
      <div className="absolute top-20 right-10 w-64 h-64 bg-[#FF0080]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#00FFFF]/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto py-20 px-4">
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-[#00FFFF] to-[#8AFF00] neon-glow-cyan mb-6">
            <Sparkles className="w-12 h-12 text-[#0F0F0F]" />
          </div>
          
          <h1 className="text-6xl font-black neon-text-cyan font-['Orbitron'] tracking-wider mb-4">
            AI SKILLS COACH
          </h1>
          
          <p className="text-xl text-[#E0E0E0] font-['Exo_2'] max-w-2xl mx-auto leading-relaxed">
            Unlock your potential with personalized AI-driven coaching. 
            <span className="text-[#00FFFF]"> Begin your journey now.</span>
          </p>

          {debugMode && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF0080]/20 border border-[#FF0080] rounded-lg">
              <div className="w-2 h-2 bg-[#FF0080] rounded-full animate-pulse"></div>
              <span className="text-[#FF0080] text-xs font-['Orbitron'] tracking-wider">
                DEBUG MODE ACTIVE
              </span>
            </div>
          )}
        </div>

        <div className="bg-[#1B1B1B] neon-border-cyan rounded-2xl p-8 space-y-8">
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute -top-3 left-4 bg-[#1B1B1B] px-2">
                <span className="text-[#00FFFF] text-xs font-['Orbitron'] tracking-wider">
                  EMAIL ADDRESS
                </span>
              </div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#00FFFF]" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="pl-12 bg-[#0F0F0F] neon-border-cyan text-[#E0E0E0] placeholder:text-[#666666] focus:border-[#00FFFF] font-['Exo_2'] text-lg h-14"
                />
              </div>
            </div>

            <div className="relative">
              <div className="absolute -top-3 left-4 bg-[#1B1B1B] px-2 z-10">
                <span className="text-[#00FFFF] text-xs font-['Orbitron'] tracking-wider">
                  TELL US ABOUT YOURSELF
                </span>
              </div>
              <div className="relative">
                <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-[#00FFFF]" />
                <Textarea
                  value={personaHint}
                  onChange={(e) => setPersonaHint(e.target.value)}
                  placeholder="Describe your role, experience, and what you'd like to achieve..."
                  className="pl-12 pt-4 min-h-[150px] bg-[#0F0F0F] neon-border-cyan text-[#E0E0E0] placeholder:text-[#666666] focus:border-[#00FFFF] font-['Exo_2'] text-lg resize-none"
                />
              </div>
            </div>
          </div>

          <Button
            onClick={handleStart}
            disabled={!canSubmit || isLoading}
            size="lg"
            className="w-full bg-gradient-to-r from-[#00FFFF] to-[#8AFF00] hover:from-[#00FFFF]/80 hover:to-[#8AFF00]/80 text-[#0F0F0F] font-bold py-8 text-xl neon-glow-cyan border-2 border-[#00FFFF] font-['Orbitron'] tracking-wider disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            {isLoading ? (
              <>
                <div className="w-6 h-6 border-3 border-[#0F0F0F] border-t-transparent rounded-full animate-spin mr-3"></div>
                INITIALIZING...
              </>
            ) : (
              <>
                <Sparkles className="mr-3 h-6 w-6" />
                START ASSESSMENT
              </>
            )}
          </Button>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-[#00FFFF]/50 font-['Orbitron'] tracking-widest mt-12">
          <div className="w-16 h-px bg-gradient-to-r from-transparent to-[#00FFFF]"></div>
          <span>SECURE CONNECTION</span>
          <div className="w-16 h-px bg-gradient-to-l from-transparent to-[#00FFFF]"></div>
        </div>
      </div>
    </div>
  );
}
