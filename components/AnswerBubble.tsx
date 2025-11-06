
'use client';

import { User } from 'lucide-react';

interface AnswerBubbleProps {
  answer: string;
  index: number;
}

export function AnswerBubble({ answer, index }: AnswerBubbleProps) {
  return (
    <div className="relative bg-gradient-to-br from-[#1B1B1B] to-[#0F0F0F] neon-border-pink rounded-2xl p-6 shadow-2xl backdrop-blur-sm ml-auto max-w-[85%] scan-line">
      <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-transparent via-[#FF0080] to-transparent"></div>
      <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-l from-transparent via-[#8AFF00] to-transparent"></div>
      
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <div className="text-[#FF0080] text-xs font-['Orbitron'] font-bold mb-2