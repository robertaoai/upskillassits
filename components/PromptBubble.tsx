'use client';

import { Sparkles } from 'lucide-react';

interface PromptBubbleProps {
  prompt: string;
}

export function PromptBubble({ prompt }: PromptBubbleProps) {
  return (
    <div className="relative bg-gradient-to-br from-[#1B1B1B] to-[#0F0F0F] neon-border-cyan rounded-2xl p-8 shadow-2xl backdrop-blur-sm circuit-pattern scan-line">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00FFFF] to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FF0080] to-transparent"></div>
      
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-br from-[#00FFFF] to-[#FF0080] flex items-center justify-center neon-glow-cyan relative">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#00FFFF] to-[#FF0080] animate-pulse opacity-50"></div>
          <Sparkles className="h-7 w-7 text-white relative z-10" />
        </div>
        <div className="flex-1">
          <div className="text-[#00FFFF] text-xs font-['Orbitron'] font-bold mb-2 tracking-wider">AI COACH</div>
          <p className="text-[#E0E0E0] text-lg leading-relaxed font-['Exo_2']">{prompt}</p>
        </div>
      </div>
      
      <div className="absolute -right-2 -bottom-2 w-4 h-4 border-r-2 border-b-2 border-[#00FFFF]"></div>
      <div className="absolute -left-2 -top-2 w-4 h-4 border-l-2 border-t-2 border-[#FF0080]"></div>
    </div>
  );
}
