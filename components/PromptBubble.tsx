'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

interface PromptBubbleProps {
  prompt: string;
}

export function PromptBubble({ prompt }: PromptBubbleProps) {
  return (
    <div className="flex items-start gap-4 animate-fade-in">
      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-[#00FFFF] to-[#8AFF00] flex items-center justify-center neon-glow-cyan">
        <Sparkles className="w-6 h-6 text-[#0F0F0F]" />
      </div>
      <div className="flex-1 bg-[#1B1B1B] neon-border-cyan rounded-2xl rounded-tl-none p-6">
        <div className="text-[#00FFFF] text-xs font-['Orbitron'] tracking-widest mb-2">
          AI COACH
        </div>
        <p className="text-[#E0E0E0] font-['Exo_2'] text-lg leading-relaxed">
          {prompt}
        </p>
      </div>
    </div>
  );
}
