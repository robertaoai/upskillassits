'use client';

import React from 'react';
import { User } from 'lucide-react';

interface AnswerBubbleProps {
  answer: string;
  index: number;
}

export function AnswerBubble({ answer, index }: AnswerBubbleProps) {
  return (
    <div className="flex items-start gap-4 justify-end animate-fade-in">
      <div className="flex-1 bg-[#1B1B1B] neon-border-green rounded-2xl rounded-tr-none p-6 max-w-3xl">
        <div className="text-[#8AFF00] text-xs font-['Orbitron'] tracking-widest mb-2">
          YOUR ANSWER #{index + 1}
        </div>
        <p className="text-[#E0E0E0] font-['Exo_2'] text-lg leading-relaxed">
          {answer}
        </p>
      </div>
      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-[#8AFF00] to-[#FCEE09] flex items-center justify-center neon-glow-green">
        <User className="w-6 h-6 text-[#0F0F0F]" />
      </div>
    </div>
  );
}
