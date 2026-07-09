import { useState } from 'react';
import { RoboticAI3DFace } from './RoboticAI3DFace';
import { MessageSquare, Sparkles } from 'lucide-react';

/**
 * Example usage component demonstrating Obsidian AI Robot Face
 * Shows all four states: idle, thinking, speaking, listening
 */
export function ObsidianAIDemo() {
  const [state, setState] = useState<'idle' | 'thinking' | 'speaking' | 'listening'>('idle');
  const [size, setSize] = useState<'sm' | 'md' | 'lg'>('lg');

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-8"
      style={{
        background: 'linear-gradient(135deg, #060B18 0%, #0D0A2E 50%, #060B18 100%)',
      }}
    >
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #7C83FD 0%, #00D9FF 100%)',
              boxShadow: '0 0 30px rgba(0,217,255,0.6)',
            }}
          >
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1
            className="text-4xl font-black tracking-tight"
            style={{
              background: 'linear-gradient(135deg, #7C83FD 0%, #00D9FF 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Obsidian AI Demo
          </h1>
        </div>
        <p className="text-[#A5B4FC] text-lg">
          Futuristic AI Robot Face • Canvas 2D Rendering • Hinglish Voice Assistant
        </p>
      </div>

      {/* Robot Face Display */}
      <div
        className="relative p-12 rounded-3xl mb-8"
        style={{
          background: 'linear-gradient(135deg, rgba(13,10,46,0.82) 0%, rgba(6,11,24,0.9) 100%)',
          border: '1px solid rgba(0,217,255,0.2)',
          backdropFilter: 'blur(28px)',
          boxShadow: '0 0 60px rgba(0,217,255,0.15)',
        }}
      >
        <div className="absolute inset-0 pointer-events-none rounded-3xl">
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at 50% 30%, rgba(0,217,255,0.08) 0%, transparent 70%)',
            }}
          />
        </div>

        <RoboticAI3DFace state={state} size={size} />

        {/* State Indicator */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{
                background:
                  state === 'listening' ? '#00D9FF' :
                  state === 'speaking' ? '#00FFEF' :
                  state === 'thinking' ? '#7C83FD' :
                  '#8AAE6D',
                boxShadow: `0 0 8px ${
                  state === 'listening' ? '#00D9FF' :
                  state === 'speaking' ? '#00FFEF' :
                  state === 'thinking' ? '#7C83FD' :
                  '#8AAE6D'
                }`,
              }}
            />
            <span
              className="text-sm font-mono tracking-[0.2em] uppercase"
              style={{
                color:
                  state === 'listening' ? '#00D9FF' :
                  state === 'speaking' ? '#00FFEF' :
                  state === 'thinking' ? '#7C83FD' :
                  '#8AAE6D',
              }}
            >
              {state === 'listening' ? 'Voice Capture' :
               state === 'speaking' ? 'Transmitting' :
               state === 'thinking' ? 'Processing' :
               'Neural Ready'}
            </span>
          </div>
          <p className="text-[#A5B4FC] text-xs">
            {state === 'idle' && 'Hello 👋 Main Obsidian AI hoon. Aapki financial assistant.'}
            {state === 'thinking' && 'Hmmm... Main soch raha hoon, ek second...'}
            {state === 'speaking' && 'Aapka budget analyze kar raha hoon. Ek smart plan ready hai!'}
            {state === 'listening' && '🎙 Main sun raha hoon... Aap kuch boliye!'}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="w-full max-w-2xl space-y-6">
        {/* State Controls */}
        <div
          className="p-6 rounded-2xl"
          style={{
            background: 'rgba(0,6,20,0.7)',
            border: '1px solid rgba(0,217,255,0.15)',
            backdropFilter: 'blur(16px)',
          }}
        >
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#00D9FF]" />
            AI State
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { key: 'idle', label: '😌 Idle', color: '#8AAE6D' },
              { key: 'thinking', label: '🤔 Thinking', color: '#7C83FD' },
              { key: 'speaking', label: '💬 Speaking', color: '#00FFEF' },
              { key: 'listening', label: '🎙 Listening', color: '#00D9FF' },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setState(item.key as any)}
                className="px-4 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105"
                style={{
                  background:
                    state === item.key
                      ? `linear-gradient(135deg, ${item.color}25 0%, ${item.color}15 100%)`
                      : 'rgba(0,217,255,0.03)',
                  border: `1px solid ${state === item.key ? item.color + '70' : 'rgba(0,217,255,0.1)'}`,
                  color: state === item.key ? item.color : '#A5B4FC',
                  boxShadow: state === item.key ? `0 0 20px ${item.color}30` : 'none',
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Size Controls */}
        <div
          className="p-6 rounded-2xl"
          style={{
            background: 'rgba(0,6,20,0.7)',
            border: '1px solid rgba(0,217,255,0.15)',
            backdropFilter: 'blur(16px)',
          }}
        >
          <h3 className="text-white font-bold mb-4">Robot Size</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { key: 'sm', label: 'Small (72px)', desc: 'Mobile' },
              { key: 'md', label: 'Medium (200px)', desc: 'Tablet' },
              { key: 'lg', label: 'Large (320px)', desc: 'Desktop' },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setSize(item.key as any)}
                className="px-4 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105 text-left"
                style={{
                  background:
                    size === item.key
                      ? 'linear-gradient(135deg, rgba(124,131,253,0.18) 0%, rgba(0,217,255,0.1) 100%)'
                      : 'rgba(0,217,255,0.03)',
                  border: `1px solid ${size === item.key ? 'rgba(124,131,253,0.35)' : 'rgba(0,217,255,0.1)'}`,
                  color: size === item.key ? '#fff' : '#A5B4FC',
                }}
              >
                <div className="text-xs opacity-60 mb-1">{item.desc}</div>
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Features List */}
        <div
          className="p-6 rounded-2xl"
          style={{
            background: 'rgba(0,6,20,0.7)',
            border: '1px solid rgba(0,217,255,0.15)',
            backdropFilter: 'blur(16px)',
          }}
        >
          <h3 className="text-white font-bold mb-4">✨ Features</h3>
          <div className="grid md:grid-cols-2 gap-3 text-sm">
            {[
              '3D Metallic Face with Glass Texture',
              'Neon Cyan Glowing Eyes',
              'State-Responsive Animations',
              'Circuit Pattern Etchings',
              'Pulsing Forehead Crystal',
              'Floating Neural Particles',
              'Rotating HUD Rings',
              '3D Movement Simulation',
              'Blinking Eye Animation',
              'Speaking Mouth Movements',
              'Voice Recognition (Hindi)',
              'Hinglish AI Responses',
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-2 text-[#A5B4FC]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00D9FF]" />
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center">
        <p className="text-[#A5B4FC] text-sm">
          Made for <span className="text-white font-bold">Budget</span>{' '}
          <span className="text-blue-300 font-bold">Sathi</span> • Financial Wellness Coach for Students
        </p>
      </div>
    </div>
  );
}