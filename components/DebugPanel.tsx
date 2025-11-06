'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [debugMode, setDebugMode] = useState(false);

  useEffect(() => {
    const mode = localStorage.getItem('DISABLE_PROMPT_TIMEOUT') === 'true';
    setDebugMode(mode);
  }, []);

  const toggleDebugMode = () => {
    if (debugMode) {
      localStorage.removeItem('DISABLE_PROMPT_TIMEOUT');
      setDebugMode(false);
    } else {
      localStorage.setItem('DISABLE_PROMPT_TIMEOUT', 'true');
      setDebugMode(true);
    }
    window.location.reload();
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 w-12 h-12 bg-[#FF0080] rounded-full flex items-center justify-center neon-glow-pink z-50 hover:scale-110 transition-transform"
        title="Debug Panel"
      >
        <span className="text-white font-['Orbitron'] font-bold">🔍</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-[#1B1B1B] neon-border-pink rounded-lg p-4 z-50 shadow-2xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[#FF0080] font-['Orbitron'] font-bold tracking-wider">
          DEBUG PANEL
        </h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-[#666666] hover:text-[#FF0080] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        <div className="p-3 bg-[#0F0F0F] rounded border border-[#333333]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#E0E0E0] text-sm font-['Exo_2']">
              Prompt Timeout
            </span>
            <div
              className={`w-12 h-6 rounded-full cursor-pointer transition-colors ${
                debugMode ? 'bg-[#FF0080]' : 'bg-[#333333]'
              }`}
              onClick={toggleDebugMode}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full mt-0.5 transition-transform ${
                  debugMode ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </div>
          </div>
          <p className="text-xs text-[#666666] font-['Exo_2']">
            {debugMode
              ? '⚠️ Disabled - No auto-redirect'
              : '✅ Enabled - 4000ms timeout'}
          </p>
        </div>

        <div className="p-3 bg-[#0F0F0F] rounded border border-[#333333]">
          <h4 className="text-[#00FFFF] text-xs font-['Orbitron'] mb-2">
            SESSION DATA
          </h4>
          <div className="space-y-1 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-[#666666]">sessionId:</span>
              <span className="text-[#8AFF00] truncate ml-2 max-w-[150px]">
                {localStorage.getItem('sessionId') || 'null'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#666666]">prompt:</span>
              <span className="text-[#8AFF00]">
                {localStorage.getItem('currentPrompt') ? '✓' : '✗'}
              </span>
            </div>
          </div>
        </div>

        <div className="text-xs text-[#666666] font-['Exo_2'] leading-relaxed">
          <p className="mb-1">💡 <strong>Debug Mode:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Disables 4s redirect timeout</li>
            <li>Shows detailed console logs</li>
            <li>Waits indefinitely for data</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
