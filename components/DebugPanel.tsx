'use client';

import React, { useState, useEffect } from 'react';
import { X, Copy, Check } from 'lucide-react';

export function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const copyDebugInfo = () => {
    const debugInfo = {
      timestamp: new Date().toISOString(),
      debugMode: debugMode,
      localStorage: {
        sessionId: localStorage.getItem('sessionId'),
        currentPrompt: localStorage.getItem('currentPrompt'),
        debugFlag: localStorage.getItem('DISABLE_PROMPT_TIMEOUT')
      },
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    navigator.clipboard.writeText(JSON.stringify(debugInfo, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
    <div className="fixed bottom-4 right-4 w-96 bg-[#1B1B1B] neon-border-pink rounded-lg p-4 z-50 shadow-2xl max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[#FF0080] font-['Orbitron'] font-bold tracking-wider">
          DEBUG PANEL
        </h3>
        <div className="flex gap-2">
          <button
            onClick={copyDebugInfo}
            className="text-[#666666] hover:text-[#8AFF00] transition-colors"
            title="Copy debug info"
          >
            {copied ? (
              <Check className="w-5 h-5 text-[#8AFF00]" />
            ) : (
              <Copy className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="text-[#666666] hover:text-[#FF0080] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Debug Mode Toggle */}
        <div className="p-3 bg-[#0F0F0F] rounded border border-[#333333]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#E0E0E0] text-sm font-['Exo_2']">
              Enhanced Logging
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
              ? '✅ Enabled - Detailed console logs'
              : '⚠️ Disabled - Minimal logging'}
          </p>
        </div>

        {/* Session Data */}
        <div className="p-3 bg-[#0F0F0F] rounded border border-[#333333]">
          <h4 className="text-[#00FFFF] text-xs font-['Orbitron'] mb-2">
            SESSION DATA
          </h4>
          <div className="space-y-1 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-[#666666]">sessionId:</span>
              <span className="text-[#8AFF00] truncate ml-2 max-w-[200px]">
                {localStorage.getItem('sessionId') || 'null'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#666666]">prompt:</span>
              <span className="text-[#8AFF00]">
                {localStorage.getItem('currentPrompt') ? '✓' : '✗'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#666666]">debugFlag:</span>
              <span className="text-[#8AFF00]">
                {localStorage.getItem('DISABLE_PROMPT_TIMEOUT') || 'null'}
              </span>
            </div>
          </div>
        </div>

        {/* Logging Guide */}
        <div className="p-3 bg-[#0F0F0F] rounded border border-[#333333]">
          <h4 className="text-[#00FFFF] text-xs font-['Orbitron'] mb-2">
            CONSOLE LOGS
          </h4>
          <div className="text-xs text-[#666666] font-['Exo_2'] space-y-1">
            <p>🚀 Webhook request start</p>
            <p>📦 Raw response structure</p>
            <p>🔍 Field extraction attempts</p>
            <p>💾 localStorage verification</p>
            <p>🧭 Navigation tracking</p>
          </div>
        </div>

        {/* Instructions */}
        <div className="text-xs text-[#666666] font-['Exo_2'] leading-relaxed">
          <p className="mb-2">💡 <strong>How to use:</strong></p>
          <ol className="list-decimal list-inside space-y-1 ml-2">
            <li>Enable Enhanced Logging</li>
            <li>Open browser console (F12)</li>
            <li>Start a new assessment</li>
            <li>Review detailed logs</li>
            <li>Copy debug info if needed</li>
          </ol>
        </div>

        {/* Warning */}
        {debugMode && (
          <div className="p-3 bg-[#FF0080]/10 border border-[#FF0080] rounded">
            <p className="text-[#FF0080] text-xs font-['Exo_2']">
              ⚠️ Debug mode active - check console for detailed logs
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
