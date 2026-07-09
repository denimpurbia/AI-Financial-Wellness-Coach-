# Obsidian AI - Quick Start Guide

## 🚀 Getting Started

### Component Files
```
src/app/components/
├── HolographicRobotFace.tsx    # 3D Canvas robot face component
├── ChatbotInterface.tsx         # Full AI chatbot interface
├── ObsidianAI.css              # Styles and animations
└── ObsidianAIDemo.tsx          # Demo/testing component
```

---

## 📦 Basic Usage

### 1. Import the Robot Face

```tsx
import { HolographicRobotFace } from './components/HolographicRobotFace';

function MyComponent() {
  return (
    <HolographicRobotFace
      state="idle"    // 'idle' | 'thinking' | 'speaking' | 'listening'
      size="md"       // 'sm' | 'md' | 'lg'
    />
  );
}
```

### 2. Import Full Chatbot Interface

```tsx
import { ChatbotInterface } from './components/ChatbotInterface';

function MyApp() {
  return (
    <div>
      {/* Floating chatbot (minimizable) */}
      <ChatbotInterface isFullScreen={false} />

      {/* Full-screen chat page */}
      <ChatbotInterface isFullScreen={true} />
    </div>
  );
}
```

---

## 🎨 Component Props

### HolographicRobotFace

| Prop    | Type                                          | Default | Description                        |
|---------|-----------------------------------------------|---------|------------------------------------|
| `state` | `'idle' \| 'thinking' \| 'speaking' \| 'listening'` | `'idle'` | Current AI state                   |
| `size`  | `'sm' \| 'md' \| 'lg'`                        | `'md'`  | Robot face size                    |

**State Descriptions:**
- **`idle`**: Calm breathing, soft blue glow
- **`thinking`**: Pulsing purple, forehead crystal active
- **`speaking`**: Mouth animates, bright cyan glow
- **`listening`**: Wide eyes, red mic indicator, ear glow

**Size Mapping:**
- **`sm`**: 72px (mobile floating button)
- **`md`**: 200px (tablet/popup)
- **`lg`**: 320px (desktop cinematic)

### ChatbotInterface

| Prop          | Type      | Default | Description                    |
|---------------|-----------|---------|--------------------------------|
| `isFullScreen` | `boolean` | `false` | Enable full-screen chat mode   |

---

## 💬 AI Response Customization

### Adding New Hinglish Responses

Edit `ChatbotInterface.tsx` → `getAIResponse()` function:

```tsx
function getAIResponse(input: string): AIReply {
  const q = input.toLowerCase();

  // Add your custom response
  if (q.includes('loan') || q.includes('karza')) {
    return {
      text: '💳 Student loans ke baare mein batau? Education loan best hai agar scholarship nahi mili. Interest rate check karna zaroori hai!',
      xp: 15
    };
  }

  // ... existing responses
}
```

### Response Structure

```tsx
interface AIReply {
  text: string;  // Hinglish response text
  xp: number;    // XP points awarded (5-30)
}
```

---

## 🎤 Voice Features

### Enable/Disable Voice

```tsx
// User can toggle voice with the speaker icon in the UI
// Or programmatically:
const [voiceEnabled, setVoiceEnabled] = useState(true);
```

### Supported Keywords

| Hindi/Hinglish | English | Trigger |
|----------------|---------|---------|
| `budget`, `kharcha`, `खर्च` | spending | Budget analysis |
| `bachana`, `save` | saving | Savings tips |
| `khana`, `खाना` | food | Food expense alert |
| `haan`, `yes`, `theek` | confirm | Confirm action |
| `namaste`, `नमस्ते` | hello | Greeting |
| `madad`, `help` | assistance | Help menu |

---

## 🎯 Integration Examples

### Example 1: Dashboard Widget

```tsx
import { HolographicRobotFace } from './components/HolographicRobotFace';

export function Dashboard() {
  const [aiState, setAiState] = useState<'idle' | 'thinking'>('idle');

  const analyzeExpenses = async () => {
    setAiState('thinking');
    await fetch('/api/analyze');
    setAiState('idle');
  };

  return (
    <div className="dashboard">
      <div className="ai-widget">
        <HolographicRobotFace state={aiState} size="md" />
        <button onClick={analyzeExpenses}>Analyze</button>
      </div>
    </div>
  );
}
```

### Example 2: Voice Command Handler

```tsx
import { useState, useCallback } from 'react';
import { ChatbotInterface } from './components/ChatbotInterface';

export function VoiceAssistant() {
  const handleVoiceCommand = useCallback((command: string) => {
    console.log('Voice command:', command);
    // Process command
  }, []);

  return <ChatbotInterface isFullScreen={false} />;
}
```

### Example 3: Custom State Controller

```tsx
import { useEffect, useState } from 'react';
import { HolographicRobotFace } from './components/HolographicRobotFace';

export function SmartRobot() {
  const [state, setState] = useState<'idle' | 'thinking' | 'speaking'>('idle');

  useEffect(() => {
    // Auto-cycle states for demo
    const timer = setInterval(() => {
      setState(prev => {
        if (prev === 'idle') return 'thinking';
        if (prev === 'thinking') return 'speaking';
        return 'idle';
      });
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return <HolographicRobotFace state={state} size="lg" />;
}
```

---

## 🎨 Custom Styling

### Override Colors

```tsx
// In your component:
<div style={{
  '--obsidian-primary': '#00D9FF',
  '--obsidian-secondary': '#7C83FD',
  '--obsidian-glow': 'rgba(0,217,255,0.5)',
}}>
  <HolographicRobotFace state="idle" size="md" />
</div>
```

### Custom Container

```tsx
<div className="my-robot-container">
  <style>{`
    .my-robot-container {
      padding: 2rem;
      background: radial-gradient(circle, #0a0e1a 0%, #020408 100%);
      border-radius: 1.5rem;
    }
  `}</style>
  <HolographicRobotFace state="speaking" size="lg" />
</div>
```

---

## 🔧 Advanced Configuration

### Performance Optimization

```tsx
// Reduce particle count for lower-end devices
useEffect(() => {
  const isLowEnd = navigator.hardwareConcurrency <= 4;
  if (isLowEnd) {
    // Particles are automatically reduced in low-performance scenarios
  }
}, []);
```

### Responsive Sizing

```tsx
import { useMediaQuery } from '@hooks/useMediaQuery';

function ResponsiveRobot() {
  const isMobile = useMediaQuery('(max-width: 640px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');

  const size = isMobile ? 'sm' : isTablet ? 'md' : 'lg';

  return <HolographicRobotFace state="idle" size={size} />;
}
```

---

## 🐛 Troubleshooting

### Issue: Voice not working
**Solution**: Check browser support and permissions
```tsx
// Test Web Speech API availability
const hasSpeech = 'speechSynthesis' in window;
const hasRecognition = 'SpeechRecognition' in window ||
                       'webkitSpeechRecognition' in window;

console.log('TTS:', hasSpeech, 'STT:', hasRecognition);
```

### Issue: Robot face not rendering
**Solution**: Verify Canvas API support
```tsx
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
if (!ctx) {
  console.error('Canvas 2D not supported');
}
```

### Issue: Animations laggy
**Solution**: Enable hardware acceleration
```css
.robot-canvas {
  transform: translateZ(0);
  will-change: transform;
}
```

---

## 📱 Mobile Optimization

### Touch Interactions

```tsx
<div
  onTouchStart={() => setRobotState('listening')}
  onTouchEnd={() => setRobotState('idle')}
>
  <HolographicRobotFace state={robotState} size="sm" />
</div>
```

### Viewport Considerations

```tsx
// Automatically adjust for mobile viewport
useEffect(() => {
  const handleResize = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };

  handleResize();
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);
```

---

## 🌍 Multilingual Support

### Adding More Languages

```tsx
// In getAIResponse():
if (q.includes('budget') || q.includes('kharcha') || q.includes('बजट')) {
  // Hindi response
  return {
    text: 'आपका बजट analyze हो गया है...',
    xp: 15
  };
}
```

### Language Toggle

```tsx
const [language, setLanguage] = useState<'hi' | 'en' | 'hinglish'>('hinglish');

// Pass to speech recognition
rec.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
```

---

## 📊 Analytics Integration

### Track AI Interactions

```tsx
import { trackEvent } from '@analytics';

const sendMessage = (text: string) => {
  trackEvent('ai_message_sent', { message: text });
  // ... existing logic
};
```

---

## 🎁 Bonus: Quick Wins

### Floating Button

```tsx
<button
  className="fixed bottom-6 right-6 z-50"
  onClick={() => setShowChat(true)}
>
  <HolographicRobotFace state="idle" size="sm" />
</button>
```

### Loading State

```tsx
{isLoading && <HolographicRobotFace state="thinking" size="md" />}
```

### Success Animation

```tsx
{isSuccess && (
  <div className="success-animation">
    <HolographicRobotFace state="speaking" size="lg" />
    <p>Success! ₹500 saved this week!</p>
  </div>
)}
```

---

## 🎓 Best Practices

1. ✅ Use `thinking` state for API calls
2. ✅ Use `speaking` state when AI responds
3. ✅ Use `listening` state during voice input
4. ✅ Return to `idle` when inactive
5. ✅ Test voice on Chrome/Edge (best support)
6. ✅ Provide text fallback for voice
7. ✅ Keep Hinglish responses short and friendly
8. ✅ Award XP (5-30) based on interaction value

---

## 📚 Additional Resources

- [Canvas 2D API Docs](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [React Hooks Reference](https://react.dev/reference/react)

---

**Need help?** Check the full documentation in `OBSIDIAN_AI_README.md`

**Made with ⚡ for Indigo Ledger**
