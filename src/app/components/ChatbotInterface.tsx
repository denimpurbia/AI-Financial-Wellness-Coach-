import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Mic, MicOff, Volume2, VolumeX, Zap, X, Globe } from 'lucide-react';
import jarvisHudBg from '../../assets/93f12e07bf5bcaf52e2cbc054ccd9c44a1b10adb.png';
import { RoboticAI3DFace } from './RoboticAI3DFace';

interface ChatbotInterfaceProps {
  isFullScreen?: boolean;
}

/* ─── Language Type ─────────────────────────────────────────────────── */
type Language = 'hinglish' | 'hindi' | 'english' | 'mewadi';

const LANGUAGE_META: Record<Language, { label: string; code: string; voiceLang: string; flag: string }> = {
  hinglish: { label: 'Hinglish', code: 'HE',  voiceLang: 'hi-IN', flag: '🌐' },
  hindi:    { label: 'हिंदी',    code: 'हि',  voiceLang: 'hi-IN', flag: '🇮🇳' },
  english:  { label: 'English',  code: 'EN',  voiceLang: 'en-US', flag: '🇬🇧' },
  mewadi:   { label: 'Mewadi',   code: 'MW',  voiceLang: 'hi-IN', flag: '🏛️' },
};

/* ─── Multilingual Response Bank ────────────────────────────────────── */
interface AIReply { text: string; xp: number }

const RESPONSES: Record<Language, Record<string, AIReply>> = {
  hinglish: {
    greeting:   { text: '⬡ Hello! 👋 Main Obsidian AI hoon. Main aapke finance ko smart way mein manage karne mein help karta hoon. Aapka health score: 78/100 — aap top 25% mein ho! Is hafte ₹500 food par zyada spend hua. Quick report chahiye ya koi new mission?', xp: 5 },
    budget:     { text: '📊 Main aapka budget analyze kar liya! Aap weekly ₹850 kharcha kar rahe ho, lekin optimal ₹700 hai. Teen jagah leak ho rahi hai: café visits (₹200), transport (₹150), aur impulse buying (₹100). Agar ye fix karein toh monthly ₹1,350 bach sakta hai. Kya main smart budget plan set karoon?', xp: 15 },
    saving:     { text: '💰 Aapke liye teen smart saving tips ready hain! ① Hafte mein 3 baar ghar ka khana → ₹300 bachega, ② College bus use karein cabs ki jagah → ₹200 bachega, ③ Extra subscriptions cancel karein → ₹149 bachega. Total ₹649 per month save ho sakta hai! Kya ye try karein?', xp: 20 },
    food:       { text: '🍛 Ek important alert hai! Is mahine aapka food expense ₹500 zyada hai — 25% jyada normal se. Agar aap Sunday ko meal-prep kar lein, toh ₹400 monthly save ho sakta hai. Plus, main 7-Day Cooking Challenge launch kar sakta hoon jisme +50 XP milega 🔥 Ready?', xp: 10 },
    challenge:  { text: '🏆 Ye rahi aapki missions! ① No-Spend Weekend (+30 XP), ② 5 Din Ghar Ka Khana (+50 XP), ③ Ek Hafte No Cab (+25 XP), ④ No Online Shopping (+40 XP). Aapka current streak: 14 days! Kaun sa mission lena chahte ho?', xp: 5 },
    alert:      { text: '🔮 Main ek prediction dekh raha hoon. Entertainment par mahine ke end tak overspending ka 87% chance hai (₹150 extra). Lekin tension mat lo! Main aapke paas 3 campus discount spots locate kar chuka hoon. Kya automatic alerts on karoon?', xp: 10 },
    invest:     { text: '📈 Investment ki baat karein! Students ke liye best strategy: ① Pehle 3 months ka emergency fund banao, ② PPF mein invest karo (zero risk + tax saving), ③ ₹500/month se Nifty 50 index SIP start karo. Kya main detailed wealth plan banau?', xp: 25 },
    confirm:    { text: '⚡ Perfect! Protocol activate ho gaya! Main daily reminders bhejunga aur aapke financial database ko sync kar dunga. Monthly target: ₹2,000 saving. Current streak: Day 14 — aap elite level par ho! Next unlock: Gold Badge ₹5,000 par 🥇', xp: 30 },
    score:      { text: '📊 Aapka financial health scan complete! Score: 78/100 ✅ Savings Rate: A+, Budget Follow: B+, Expense Tracking: A, Goal Progress: B. Aap campus ke top 25% mein ho! Agar 7 aur din track karein toh score 82 ho jayega!', xp: 10 },
    about:      { text: '⬡ Main Obsidian AI hoon — ek intelligent financial assistant jo specially students ke liye bana hai. Main real-time expense tracking, budget planning, smart predictions, aur gamified challenges provide karta hoon. Har rupee ka hisaab, har goal achievable! 🚀', xp: 5 },
    help:       { text: '⬡ Main ye sab kar sakta hoon: 📊 Expense Track karna, 💰 Budget Plan banana, 🎯 Goals set karna, 📈 Future Predict karna, 🏆 Challenges dena, 🔮 Overspend Alert bhejnaa, 📚 Financial Knowledge share karna. Kaunsi help chahiye?', xp: 5 },
    default:    { text: '⬡ Hmmm, main samajha! Main aapke finances ko deep scan kar raha hoon... Mujhe ₹600+ per month recoverable dikh raha hai. Aap budget, saving tips, investments, ya financial health ke baare mein puch sakte ho. Ready?', xp: 5 },
  },
  hindi: {
    greeting:   { text: '⬡ नमस्ते! 👋 मैं Obsidian AI हूं। मैं आपके वित्त को स्मार्ट तरीके से प्रबंधित करने में मदद करता हूं। आपका स्वास्थ्य स्कोर: 78/100 — आप शीर्ष 25% में हैं! इस सप्ताह ₹500 भोजन पर अधिक खर्च हुआ। त्वरित रिपोर्ट चाहिए?', xp: 5 },
    budget:     { text: '📊 मैंने आपका बजट विश्लेषण कर लिया है! आप साप्ताहिक ₹850 खर्च कर रहे हैं, लेकिन इष्टतम ₹700 है। तीन जगह रिसाव हो रहा है: कैफे (₹200), परिवहन (₹150), और आवेगी खरीदारी (₹100)। इन्हें ठीक करें तो मासिक ₹1,350 बच सकता है। क्या मैं स्मार्ट बजट योजना बनाऊं?', xp: 15 },
    saving:     { text: '💰 आपके लिए तीन स्मार्ट बचत सुझाव तैयार हैं! ① सप्ताह में 3 बार घर का खाना → ₹300 बचेगा, ② कॉलेज बस का उपयोग करें → ₹200 बचेगा, ③ अतिरिक्त सदस्यता रद्द करें → ₹149 बचेगा। कुल ₹649 प्रतिमाह बच सकता है! क्या इसे आजमाएं?', xp: 20 },
    food:       { text: '🍛 एक महत्वपूर्ण सूचना है! इस महीने आपका भोजन व्यय ₹500 अधिक है — सामान्य से 25% ज्यादा। रविवार को भोजन तैयार करें तो ₹400 मासिक बच सकता है। साथ ही, 7-दिन खाना पकाने की चुनौती में +50 XP मिलेगा 🔥', xp: 10 },
    challenge:  { text: '🏆 ये रहीं आपकी मिशन! ① बिना खर्च का सप्ताहांत (+30 XP), ② 5 दिन घर का खाना (+50 XP), ③ एक सप्ताह बिना कैब (+25 XP), ④ बिना ऑनलाइन शॉपिंग (+40 XP)। आपकी वर्तमान श्रृंखला: 14 दिन! कौन सा मिशन लेना चाहते हैं?', xp: 5 },
    alert:      { text: '🔮 मुझे एक भविष्यवाणी दिख रही है। मनोरंजन पर महीने के अंत तक अत्यधिक खर्च का 87% संभावना है (₹150 अतिरिक्त)। चिंता न करें! मैंने 3 कैंपस छूट स्थान खोज लिए हैं। क्या स्वचालित अलर्ट चालू करूं?', xp: 10 },
    invest:     { text: '📈 निवेश की बात करें! छात्रों के लिए सर्वोत्तम रणनीति: ① पहले 3 महीने का आपातकालीन कोष बनाएं, ② PPF में निवेश करें (शून्य जोखिम + कर बचत), ③ ₹500/माह से Nifty 50 SIP शुरू करें। क्या विस्तृत धन योजना बनाऊं?', xp: 25 },
    confirm:    { text: '⚡ बिल्कुल सही! प्रोटोकॉल सक्रिय हो गया! मैं दैनिक अनुस्मारक भेजूंगा और आपके वित्तीय डेटाबेस को सिंक करूंगा। मासिक लक्ष्य: ₹2,000 बचत। वर्तमान श्रृंखला: दिन 14 — आप शीर्ष स्तर पर हैं! 🥇', xp: 30 },
    score:      { text: '📊 आपका वित्तीय स्वास्थ्य स्कैन पूरा! स्कोर: 78/100 ✅ बचत दर: A+, बजट पालन: B+, व्यय ट्रैकिंग: A, लक्ष्य प्रगति: B। आप कैंपस के शीर्ष 25% में हैं! 7 और दिन ट्रैक करें तो स्कोर 82 हो जाएगा!', xp: 10 },
    about:      { text: '⬡ मैं Obsidian AI हूं — एक बुद्धिमान वित्तीय सहायक जो विशेष रूप से छात्रों के लिए बना है। मैं वास्तविक समय व्यय ट्रैकिंग, बजट योजना, स्मार्ट भविष्यवाणियां, और गेमिफाइड चुनौतियां प्रदान करता हूं। 🚀', xp: 5 },
    help:       { text: '⬡ मैं यह सब कर सकता हूं: 📊 व्यय ट्रैक करना, 💰 बजट योजना बनाना, 🎯 लक्ष्य निर्धारित करना, 📈 भविष्य की भविष्यवाणी, 🏆 चुनौतियां देना, 🔮 अत्यधिक खर्च अलर्ट, 📚 वित्तीय ज्ञान साझा करना। कौन सी सहायता चाहिए?', xp: 5 },
    default:    { text: '⬡ हम्म, मैं समझा! मैं आपके वित्त का गहन स्कैन कर रहा हूं... मुझे ₹600+ प्रतिमाह की पुनर्प्राप्ति योग्य राशि दिख रही है। आप बजट, बचत सुझाव, निवेश, या वित्तीय स्वास्थ्य के बारे में पूछ सकते हैं।', xp: 5 },
  },
  english: {
    greeting:   { text: '⬡ Hello! 👋 I am Obsidian AI, your intelligent financial assistant. I help students manage their finances smartly. Your health score: 78/100 — you\'re in the top 25%! This week ₹500 was overspent on food. Want a quick report or a new mission?', xp: 5 },
    budget:     { text: '📊 I\'ve analyzed your budget! You\'re spending ₹850 weekly, but ₹700 is optimal. Three areas are leaking: café visits (₹200), transport (₹150), and impulse buying (₹100). Fix these and save ₹1,350 monthly! Shall I set up a smart budget plan?', xp: 15 },
    saving:     { text: '💰 Three smart saving tips for you! ① Cook at home 3x/week → save ₹300, ② Use college bus instead of cabs → save ₹200, ③ Cancel unused subscriptions → save ₹149. Total ₹649 per month! Shall we try this?', xp: 20 },
    food:       { text: '🍛 Important alert! Your food expense this month is ₹500 over — 25% above normal. Sunday meal-prep can save ₹400 monthly. I can also launch a 7-Day Cooking Challenge with +50 XP reward 🔥 Ready?', xp: 10 },
    challenge:  { text: '🏆 Here are your missions! ① No-Spend Weekend (+30 XP), ② 5 Days Home Cooking (+50 XP), ③ One Week No Cab (+25 XP), ④ No Online Shopping (+40 XP). Your current streak: 14 days! Which mission do you want?', xp: 5 },
    alert:      { text: '🔮 I see a prediction: 87% chance of overspending on entertainment by month-end (₹150 extra). Don\'t worry! I\'ve located 3 campus discount spots nearby. Shall I enable automatic alerts?', xp: 10 },
    invest:     { text: '📈 Let\'s talk investments! Best strategy for students: ① Build a 3-month emergency fund first, ② Invest in PPF (zero risk + tax savings), ③ Start a Nifty 50 SIP at ₹500/month. Want a detailed wealth plan?', xp: 25 },
    confirm:    { text: '⚡ Perfect! Protocol activated! I\'ll send daily reminders and sync your financial database. Monthly target: ₹2,000 in savings. Current streak: Day 14 — you\'re at elite level! Next unlock: Gold Badge at ₹5,000 🥇', xp: 30 },
    score:      { text: '📊 Financial health scan complete! Score: 78/100 ✅ Savings Rate: A+, Budget Follow: B+, Expense Tracking: A, Goal Progress: B. You\'re in the top 25% on campus! Track 7 more days and your score will reach 82!', xp: 10 },
    about:      { text: '⬡ I\'m Obsidian AI — an intelligent financial assistant built specifically for students. I provide real-time expense tracking, budget planning, smart predictions, and gamified financial challenges. Every rupee counts, every goal is achievable! 🚀', xp: 5 },
    help:       { text: '⬡ Here\'s what I can do: 📊 Track expenses, 💰 Create budget plans, 🎯 Set financial goals, 📈 Predict future spending, 🏆 Give challenges, 🔮 Send overspend alerts, 📚 Share financial knowledge. How can I assist you?', xp: 5 },
    default:    { text: '⬡ Interesting! I\'m doing a deep scan of your finances... I can see ₹600+ recoverable per month. You can ask me about budgets, saving tips, investments, or your overall financial health. Ready to start?', xp: 5 },
  },
  mewadi: {
    greeting:   { text: '⬡ Khamma Ghani Sa! 👋 Mharo naam Obsidian AI sa. Main aapko paisa sambhalne mein madad karunga. Aapko score 78/100 milo sa — aap top 25% mein ho! Is hafte ₹500 khaane par zyada kharcho bhayo. Kya hukum sa?', xp: 5 },
    budget:     { text: '📊 Tharo budget dekh liyo sa! Aap saptaah mein ₹850 kharcho kar riya ho, par ₹700 thak hi theek sa. Teen jagah paisa dab ryo sa: dhabe pe (₹200), sawari mein (₹150), aur bina socha khareedi (₹100). Ye theek karya to mahine mein ₹1,350 bach jai. Kya main smart budget plan banao?', xp: 15 },
    saving:     { text: '💰 Thari liye teen kamaal ki bachat ke upay hai sa! ① Hafte mein 3 baar gharo khana → ₹300 bachega, ② College ri bus lo cabs ki jagah → ₹200 bachega, ③ Faltu subscriptions band karo → ₹149 bachega. Kul ₹649 mahine mein bach sakta sa! Kya tharo mann sa?', xp: 20 },
    food:       { text: '🍛 Ek jaruri baat sa! Is mahine thari khaane ri kharcho ₹500 zyada ho gayi — 25% zyada saamanya se. Itar Sunday ko khaana tayaar karo to ₹400 bachega. Saath mein, 7-Din Khana Pakane ri chunauti mein +50 XP milega 🔥 Tayaar ho?', xp: 10 },
    challenge:  { text: '🏆 Ye rahi thari missions sa! ① Bina kharcho ka weekend (+30 XP), ② 5 Din Gharo Khana (+50 XP), ③ Ek Hafte Bina Cab (+25 XP), ④ Online Shopping Nahi (+40 XP). Thari abhi ki haar: 14 din! Kaun si mission lyo tharo?', xp: 5 },
    alert:      { text: '🔮 Mhane ek baat dikh ri sa. Mahine ke ant tak manoranjan pe zyada kharcho ri 87% sambhavna sa (₹150 jyada). Par chinta mat karo! Main 3 campus discount ki jagah dhundh liyo sa. Kya automatic alerts chalu karoo?', xp: 10 },
    invest:     { text: '📈 Nivesh ri baat karyo! Vidyarthiyon liye sabse badiya tarika: ① Pehle 3 mahine ri aapat rashi ikhattha karo, ② PPF mein lagao (shunya jokhim + kar bachat), ③ ₹500/mahine se Nifty 50 SIP shuru karo. Kya vistar se dhan yojana banao?', xp: 25 },
    confirm:    { text: '⚡ Bahut khoob sa! Protocol chalu ho gayo! Main roz yaad dilaonga aur thari arthik database sync kar dunga. Mahine ri lakshya: ₹2,000 ri bachat. Abhi ki haar: 14 din — aap maaharatam star pe ho! 🥇', xp: 30 },
    score:      { text: '📊 Thari aarthik swasthya jaanch poori! Ank: 78/100 ✅ Bachat Dar: A+, Budget Palana: B+, Kharcho Jaanch: A, Lakshya Pragati: B. Aap campus ke top 25% mein ho! 7 aur din track karo to ank 82 ho jai!', xp: 10 },
    about:      { text: '⬡ Main Obsidian AI hoon sa — ek hoshiyaar aarthik sahayak jo khaas vidyarthiyon ke liye bano sa. Main tatkalik kharcho ki jaanch, budget yojana, hoshiyaar bhavisyavaani, aur khel jaisi chunautiyon ki suvidha deta sa. 🚀', xp: 5 },
    help:       { text: '⬡ Mhare se ye sab hoga sa: 📊 Kharcho Track karna, 💰 Budget Plan banana, 🎯 Lakshya tay karna, 📈 Bhavisya Bhavishyavani, 🏆 Chunauti dena, 🔮 Zyada Kharcho Alert, 📚 Aarthik Gyaan. Kya seva chahiye sa?', xp: 5 },
    default:    { text: '⬡ Hm, mhane samajh ayo! Main aapri aarthik gehri jaanch kar ryo sa... Mhane ₹600+ pratimaah waapas milna wala dikh ryo sa. Aap budget, bachat, nivesh, ya aarthik swasthya ke baare mein puch sakta sa.', xp: 5 },
  },
};

function getAIResponse(input: string, language: Language): AIReply {
  // This is a synchronous fallback if the API call fails
  const q = input.toLowerCase();
  const r = RESPONSES[language];

  if (q.includes('budget') || q.includes('spending') || q.includes('kharcha') || q.includes('kharcho') || q.includes('खर्च') || q.includes('bजट'))
    return r.budget;
  if (q.includes('save') || q.includes('saving') || q.includes('bachana') || q.includes('bacha') || q.includes('bachat'))
    return r.saving;
  if (q.includes('food') || q.includes('eat') || q.includes('khana') || q.includes('khaana') || q.includes('खाना'))
    return r.food;
  if (q.includes('challenge') || q.includes('xp') || q.includes('badge') || q.includes('mission') || q.includes('chunauti'))
    return r.challenge;
  if (q.includes('alert') || q.includes('overspend') || q.includes('predict') || q.includes('warning'))
    return r.alert;
  if (q.includes('invest') || q.includes('stock') || q.includes('mutual') || q.includes('nivesh'))
    return r.invest;
  if (q.includes('yes') || q.includes('haan') || q.includes('ok') || q.includes('sure') || q.includes('confirm') || q.includes('activate') || q.includes('theek') || q.includes('ha '))
    return r.confirm;
  if (q.includes('score') || q.includes('health') || q.includes('how am i') || q.includes('mera') || q.includes('mharo') || q.includes('tharo'))
    return r.score;
  if (q.includes('hi') || q.includes('hello') || q.includes('hey') || q.includes('namaste') || q.includes('नमस्ते') || q.includes('khamma'))
    return r.greeting;
  if (q.includes('obsidian') || q.includes('who are you') || q.includes('kaun') || q.includes('what are you'))
    return r.about;
  if (q.includes('help') || q.includes('?') || q.includes('what can') || q.includes('kya kar') || q.includes('madad') || q.includes('seva'))
    return r.help;

  return r.default;
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace(/\/$/, '');
const CHAT_MESSAGE_URL = `${API_BASE_URL}/chat/message`;

function getAuthToken(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  return localStorage.getItem('authToken') || sessionStorage.getItem('authToken') || '';
}

async function fetchBackendAIResponse(input: string, language: Language): Promise<string | null> {
  try {
    const token = getAuthToken();
    const response = await fetch(CHAT_MESSAGE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ message: input, language })
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      if (response.status === 401 && token) {
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('authToken');
      }

      throw new Error(data.error || data.details || `Chat request failed (${response.status})`);
    }

    return data.response || null;
  } catch (error) {
    console.error("Error fetching chatbot response:", error);
    return null;
  }
}

const UI_TEXT: Record<Language, {
  placeholder: string;
  listeningPlaceholder: string;
  quickCommands: { label: string; cmd: string }[];
  initialMessage: string;
  langSwitcherLabel: string;
}> = {
  hinglish: {
    placeholder: '⬡ Obsidian AI se kuch poochhiye...',
    listeningPlaceholder: '🎙 Bol rahe hain aap...',
    quickCommands: [
      { label: '⬡ Budget dekho',    cmd: 'budget'    },
      { label: '⬡ Save kaise karein', cmd: 'save tips' },
      { label: '⬡ Challenges',       cmd: 'challenge' },
      { label: '⬡ Mera score',       cmd: 'score'     },
    ],
    initialMessage: '⬡ Hello 👋 Main Obsidian AI hoon. Main aapke finance ko smart way mein manage karne mein help karta hoon. Is hafte ₹500 food spend zyada hua hai. Kya main ek saving plan suggest karoon?',
    langSwitcherLabel: 'Bhasha',
  },
  hindi: {
    placeholder: '⬡ Obsidian AI से कुछ पूछिए...',
    listeningPlaceholder: '🎙 बोल रहे हैं आप...',
    quickCommands: [
      { label: '⬡ बजट देखें',     cmd: 'budget'    },
      { label: '⬡ बचत कैसे करें', cmd: 'save tips' },
      { label: '⬡ चुनौतियां',      cmd: 'challenge' },
      { label: '⬡ मेरा स्कोर',     cmd: 'score'     },
    ],
    initialMessage: '⬡ नमस्ते 👋 मैं Obsidian AI हूं। मैं आपके वित्त को स्मार्ट तरीके से प्रबंधित करने में मदद करता हूं। इस सप्ताह ₹500 खाने पर अधिक खर्च हुआ। क्या मैं एक बचत योजना सुझाऊं?',
    langSwitcherLabel: 'भाषा',
  },
  english: {
    placeholder: '⬡ Ask Obsidian AI anything...',
    listeningPlaceholder: '🎙 Listening...',
    quickCommands: [
      { label: '⬡ View Budget',   cmd: 'budget'    },
      { label: '⬡ Saving Tips',   cmd: 'save tips' },
      { label: '⬡ Challenges',    cmd: 'challenge' },
      { label: '⬡ My Score',      cmd: 'score'     },
    ],
    initialMessage: '⬡ Hello! 👋 I am Obsidian AI, your futuristic financial assistant. This week ₹500 was overspent on food. Shall I suggest a smart saving plan?',
    langSwitcherLabel: 'Language',
  },
  mewadi: {
    placeholder: '⬡ Obsidian AI se kuch puchho sa...',
    listeningPlaceholder: '🎙 Sun ryo hoon sa...',
    quickCommands: [
      { label: '⬡ Budget Dekho',   cmd: 'budget'    },
      { label: '⬡ Bachayo Kaise',  cmd: 'save tips' },
      { label: '⬡ Chunautiyan',    cmd: 'challenge' },
      { label: '⬡ Mharo Ank',      cmd: 'score'     },
    ],
    initialMessage: '⬡ Khamma Ghani Sa! 👋 Main Obsidian AI sa. Mharo kaam hai aapka paisa sambhalna. Is saptaah ₹500 khaane par zyada kharcho bhayo. Kya main ek bachat yojana batao?',
    langSwitcherLabel: 'Bhasha Sa',
  },
};

/* ─── Obsidian Orb ───────────────────────────────────────────────────── */
function ObsidianOrb({
  isSpeaking, isListening, size = 'md',
}: { isSpeaking: boolean; isListening: boolean; size?: 'sm' | 'md' | 'lg' }) {
  const dim = size === 'lg' ? 72 : size === 'sm' ? 46 : 58;
  const c   = isListening ? '#FF5252' : isSpeaking ? '#00D9FF' : '#7C83FD';
  return (
    <div className="relative flex items-center justify-center flex-shrink-0" style={{ width: dim, height: dim }}>
      <div className="absolute inset-0 rounded-full animate-ping"
        style={{ background: c, opacity: 0.09, animationDuration: '2.2s' }} />
      <div className="absolute rounded-full animate-pulse"
        style={{ inset: '8%', background: `radial-gradient(circle, ${c}35 0%, transparent 70%)`, animationDuration: '1.6s' }} />
      <div className="absolute rounded-full"
        style={{
          inset: '14%', border: `1px dashed ${c}50`,
          animation: 'spin 6s linear infinite',
        }} />
      <div className="relative rounded-full flex items-center justify-center"
        style={{
          width: dim * 0.52, height: dim * 0.52,
          background: `radial-gradient(circle at 33% 33%, ${c}ee 0%, ${c}66 45%, ${c}22 100%)`,
          boxShadow: `0 0 ${dim * 0.45}px ${c}99, 0 0 ${dim * 0.2}px ${c}55, inset 0 1px 0 rgba(255,255,255,0.2)`,
          border: `1px solid ${c}70`,
          animation: 'orb-glow 2.5s ease-in-out infinite',
        }}>
        <div className="rounded-full bg-white/90" style={{ width: dim * 0.13, height: dim * 0.13 }} />
      </div>
    </div>
  );
}

/* ─── HUD Ring ───────────────────────────────────────────────────────── */
function HudRing({ size, color, speed }: { size: number; color: string; speed: string }) {
  return (
    <div className="absolute rounded-full pointer-events-none"
      style={{
        width: size, height: size,
        border: `1px solid ${color}`,
        animation: `spin ${speed} linear infinite`,
        left: '50%', top: '50%',
        transform: 'translate(-50%,-50%)',
      }}>
      <div className="absolute w-2 h-2 rounded-full"
        style={{ background: color, top: 0, left: '50%', transform: 'translate(-50%,-50%)', boxShadow: `0 0 8px ${color}` }} />
    </div>
  );
}

/* ─── Waveform ───────────────────────────────────────────────────────── */
function Waveform({ isActive, bars = 12 }: { isActive: boolean; bars?: number }) {
  return (
    <div className="flex items-end gap-[2px]" style={{ height: 22, width: bars * 6 }}>
      {Array.from({ length: bars }).map((_, i) => (
        <div key={i} className="flex-1 rounded-full"
          style={{
            background: 'linear-gradient(to top, #7C83FD, #00D9FF)',
            height: '100%', transformOrigin: 'bottom',
            transform: isActive ? undefined : 'scaleY(0.1)',
            animationName: isActive ? 'waveform-bar' : 'none',
            animationDuration: `${0.35 + (i % 5) * 0.1}s`,
            animationDelay: `${i * 0.04}s`,
            animationIterationCount: 'infinite',
            animationDirection: 'alternate',
            animationTimingFunction: 'ease-in-out',
            transition: isActive ? 'none' : 'transform 0.4s ease',
          }} />
      ))}
    </div>
  );
}

/* ─── Typing dots ────────────────────────────────────────────────────── */
function TypingDots() {
  return (
    <div className="flex gap-1.5 items-center px-4 py-3">
      {[0, 160, 320].map(d => (
        <div key={d} className="w-2 h-2 rounded-full animate-bounce"
          style={{ background: '#00D9FF', animationDelay: `${d}ms`, boxShadow: '0 0 7px rgba(0,217,255,0.7)' }} />
      ))}
    </div>
  );
}

/* ─── Language Switcher ──────────────────────────────────────────────── */
function LanguageSwitcher({
  language, onChange,
}: { language: Language; onChange: (lang: Language) => void }) {
  const [open, setOpen] = useState(false);
  const langs: Language[] = ['hinglish', 'hindi', 'english', 'mewadi'];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all hover:scale-105"
        style={{
          background: 'rgba(0,217,255,0.1)',
          border: '1px solid rgba(0,217,255,0.3)',
        }}
        title="Switch Language"
      >
        <Globe className="w-4 h-4 text-[#00D9FF]" />
        <span className="text-[#00D9FF] text-xs font-black tracking-wider uppercase">
          {LANGUAGE_META[language].label}
        </span>
      </button>

      {open && (
        <div
          className="absolute top-full left-0 mt-2 rounded-xl overflow-hidden z-[100]"
          style={{
            background: 'linear-gradient(135deg, rgba(5,8,24,0.97) 0%, rgba(10,6,30,0.97) 100%)',
            border: '1px solid rgba(0,217,255,0.3)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 0 40px rgba(0,217,255,0.2)',
            minWidth: 140,
          }}
        >
          {/* Header */}
          <div className="px-3 py-2 border-b" style={{ borderColor: 'rgba(0,217,255,0.12)' }}>
            <span className="text-[9px] font-mono text-[#00D9FF]/60 tracking-[0.2em] uppercase">Select Language</span>
          </div>
          {langs.map(lang => (
            <button
              key={lang}
              onClick={() => { onChange(lang); setOpen(false); }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 transition-all text-left group"
              style={{
                background: language === lang ? 'rgba(0,217,255,0.1)' : 'transparent',
                borderLeft: language === lang ? '2px solid #00D9FF' : '2px solid transparent',
              }}
            >
              <span className="text-base leading-none">{LANGUAGE_META[lang].flag}</span>
              <div>
                <div className="text-xs font-bold" style={{ color: language === lang ? '#00D9FF' : '#A5B4FC' }}>
                  {LANGUAGE_META[lang].label}
                </div>
                <div className="text-[9px] font-mono" style={{ color: 'rgba(124,131,253,0.5)' }}>
                  {LANGUAGE_META[lang].voiceLang}
                </div>
              </div>
              {language === lang && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#00D9FF]" style={{ boxShadow: '0 0 6px #00D9FF' }} />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Scan canvas overlay ────────────────────────────────────────────── */
function ScanCanvas({ active }: { active: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight;
    let frame = 0, animId = 0;
    const render = () => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      frame++;
      const sy = (frame * 0.8) % H;
      const grad = ctx.createLinearGradient(0, sy - 60, 0, sy + 60);
      grad.addColorStop(0, 'rgba(0,217,255,0)');
      grad.addColorStop(0.5, 'rgba(0,217,255,0.06)');
      grad.addColorStop(1, 'rgba(0,217,255,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, sy - 60, W, 120);
      const bLen = 18, bW = 2;
      [{ x:0, y:0 }, { x:W, y:0 }, { x:0, y:H }, { x:W, y:H }].forEach(({ x, y }) => {
        ctx.strokeStyle = 'rgba(0,217,255,0.45)';
        ctx.lineWidth = bW;
        const dx = x === 0 ? bLen : -bLen;
        const dy = y === 0 ? bLen : -bLen;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + dx, y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + dy); ctx.stroke();
      });
      animId = requestAnimationFrame(render);
    };
    if (active) render();
    return () => cancelAnimationFrame(animId);
  }, [active]);
  return <canvas ref={ref} className="absolute inset-0 pointer-events-none z-20" style={{ borderRadius: 20 }} />;
}

/* ─── Main Component ─────────────────────────────────────────────────── */
interface Message { id: number; sender: 'bot' | 'user'; text: string; xp?: number; ts?: string }

export function ChatbotInterface({ isFullScreen = false }: ChatbotInterfaceProps) {
  const [language, setLanguage] = useState<Language>('hinglish');
  const [messages, setMessages] = useState<Message[]>([{
    id: 1, sender: 'bot', ts: '09:41',
    text: UI_TEXT['hinglish'].initialMessage,
  }]);
  const [input, setInput]             = useState('');
  const [isMinimized, setIsMinimized] = useState(true);
  const [isTyping, setIsTyping]       = useState(false);
  const [isSpeaking, setIsSpeaking]   = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [xp, setXp]                   = useState(850);
  const messagesEndRef                 = useRef<HTMLDivElement>(null);
  const recognitionRef                 = useRef<any>(null);

  /* When language changes, add a language-switch greeting */
  const handleLanguageChange = useCallback((lang: Language) => {
    setLanguage(lang);
    const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    const greeting = RESPONSES[lang].greeting;
    const switchMsg: Message = { id: Date.now(), sender: 'bot', text: greeting.text, xp: greeting.xp, ts: now };
    setMessages(prev => [...prev, switchMsg]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const speak = useCallback((text: string) => {
    if (!voiceEnabled || typeof window === 'undefined') return;
    window.speechSynthesis?.cancel();
    const clean = text
      .replace(/[⬡⚡📊💰🍛🏆🔮📈👋🤖💡①②③✅]/g, '')
      .replace(/[\u{1F000}-\u{1FFFF}]/gu, '')
      .trim();

    const utt = new SpeechSynthesisUtterance(clean);
    
    // Optimize Indian accent pacing and clarity
    if (language === 'english') {
      utt.rate = 0.92;
      utt.pitch = 1.0;
      utt.lang = 'en-US';
    } else {
      // Slower rate for Hinglish, Hindi, and Mewadi to make pronunciation more precise
      utt.rate = 0.82;
      utt.pitch = 1.05;
      utt.lang = language === 'hindi' ? 'hi-IN' : 'en-IN';
    }
    utt.volume = 1.0;

    const voices = window.speechSynthesis?.getVoices() ?? [];
    let pick;
    if (language === 'english') {
      pick = voices.find(v => /en-us|en-gb|samantha|daniel|google us/i.test(v.name + v.lang));
    } else if (language === 'hindi') {
      // Strict Hindi voice
      pick = voices.find(v => /hi-in|hindi|google hindi/i.test(v.lang + v.name));
    } else {
      // For Hinglish & Mewadi: prefer Indian English accent, fallback to Hindi
      pick = voices.find(v => /en-in|indian|india/i.test(v.lang + v.name)) 
          || voices.find(v => /hi-in|hindi/i.test(v.lang + v.name));
    }
    if (pick) utt.voice = pick;

    utt.onstart = () => setIsSpeaking(true);
    utt.onend   = () => setIsSpeaking(false);
    utt.onerror = () => setIsSpeaking(false);
    window.speechSynthesis?.speak(utt);
  }, [voiceEnabled, language]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;
    const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    const userMsg: Message = { id: Date.now(), sender: 'user', text, ts: now };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      let finalReplyText: string;
      let finalXp = 5;

      // 1. Try to fetch generative AI response from OpenRouter
      const aiContent = await fetchBackendAIResponse(text, language);
      
      if (aiContent) {
        // Success! We use the AI string instead of the static string
        finalReplyText = aiContent;
        // Optionally map logic to award specific XP if keywords match, or just give +5
        const { xp: fallbackXp } = getAIResponse(text, language);
        // Use logic-based XP assignment 
        finalXp = fallbackXp;
      } else {
        // 2. Fallback to hardcoded response if API fails/key is missing
        const { text: fallback, xp: defaultXp } = getAIResponse(text, language);
        finalReplyText = fallback;
        finalXp = defaultXp;
      }

      const botMsg: Message = { id: Date.now() + 1, sender: 'bot', text: finalReplyText, xp: finalXp, ts: now };
      setIsTyping(false);
      setMessages(prev => [...prev, botMsg]);
      setXp(prev => prev + finalXp);
      speak(finalReplyText);

    } catch (e) {
      console.error(e);
      const fallback = getAIResponse(text, language);
      const botMsg: Message = { id: Date.now() + 1, sender: 'bot', text: fallback.text, xp: fallback.xp, ts: now };
      setMessages(prev => [...prev, botMsg]);
      setXp(prev => prev + fallback.xp);
      speak(fallback.text);
      setIsTyping(false);
    }
  }, [speak, language]);

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); sendMessage(input); };

  const toggleListening = async () => {
    if (isListening) { recognitionRef.current?.stop(); setIsListening(false); return; }
    
    try {
      // Explicitly request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Stop the stream tracks immediately so SpeechRecognition can use the mic
      stream.getTracks().forEach(track => track.stop());
    } catch (err) {
      console.error('Microphone access denied:', err);
      setInput('Microphone access denied. Please allow microphone permissions.');
      return;
    }

    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      setInput(language === 'english'
        ? 'Voice input unavailable — please use Chrome or Edge.'
        : 'Voice input abhi available nahi hai — Chrome ya Edge use karein.');
      return;
    }
    window.speechSynthesis?.cancel();
    const rec = new SR();
    rec.continuous = false; rec.interimResults = false;
    rec.lang = LANGUAGE_META[language].voiceLang;
    rec.onstart  = () => setIsListening(true);
    rec.onresult = (ev: any) => { setInput(ev.results[0][0].transcript); setIsListening(false); };
    rec.onerror  = (event: any) => { 
      console.error('Speech recognition error:', event.error);
      setIsListening(false); 
      if (event.error === 'not-allowed') {
        setInput('Microphone access denied. Please check your browser settings.');
      }
    };
    rec.onend    = () => setIsListening(false);
    rec.start();
    recognitionRef.current = rec;
  };

  const ui = UI_TEXT[language];

  /* ── Panel ── */
  const renderPanel = (full: boolean) => (
    <div className="flex flex-col h-full relative" style={{ borderRadius: 20 }}>

      <style>{`
        @keyframes spin { to { transform: translate(-50%,-50%) rotate(360deg); } }
        @keyframes spin-rev { to { transform: translate(-50%,-50%) rotate(-360deg); } }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        @keyframes face-glow {
          0%, 100% { box-shadow: 0 0 40px rgba(0,217,255,0.18), inset 0 0 60px rgba(0,217,255,0.04); }
          50% { box-shadow: 0 0 70px rgba(0,217,255,0.32), inset 0 0 80px rgba(124,131,253,0.07); }
        }
        .obsidian-msg { animation: float-in 0.3s ease-out; }
        @keyframes float-in { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }
        @keyframes waveform-bar {
          from { transform: scaleY(0.12); }
          to   { transform: scaleY(1); }
        }
        @keyframes orb-glow {
          0%,100% { box-shadow: 0 0 18px currentColor, 0 0 8px currentColor; }
          50%      { box-shadow: 0 0 32px currentColor, 0 0 14px currentColor; }
        }
        @keyframes lang-badge-in {
          from { opacity:0; transform: scale(0.8) translateY(4px); }
          to   { opacity:1; transform: scale(1) translateY(0); }
        }
        .lang-badge { animation: lang-badge-in 0.3s ease-out; }
      `}</style>

      {/* ── Jarvis background image ── */}
      <div className="absolute inset-0 z-0">
        <img
          src={jarvisHudBg}
          alt=""
          className="w-full h-full object-cover"
          style={{ opacity: 0.22, filter: 'saturate(1.6) hue-rotate(-8deg)' }}
        />
      </div>

      {/* ── Dark gradient overlay ── */}
      <div className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: 'linear-gradient(160deg, rgba(2,6,18,0.94) 0%, rgba(8,4,28,0.92) 40%, rgba(2,6,18,0.95) 100%)',
        }} />

      {/* ── Neon grid lines ── */}
      <div className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,217,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,217,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }} />

      {/* ── Floating HUD rings ── */}
      <div className="absolute z-[3] pointer-events-none" style={{ right: '8%', top: '18%', width: 120, height: 120 }}>
        <HudRing size={120} color="rgba(0,217,255,0.12)" speed="12s" />
        <HudRing size={85}  color="rgba(124,131,253,0.14)" speed="8s" />
        <HudRing size={50}  color="rgba(0,217,255,0.18)" speed="5s" />
      </div>
      <div className="absolute z-[3] pointer-events-none" style={{ left: '5%', bottom: '25%', width: 80, height: 80 }}>
        <HudRing size={80}  color="rgba(124,131,253,0.1)" speed="10s" />
        <HudRing size={50}  color="rgba(0,217,255,0.12)" speed="6s" />
      </div>

      {/* ── Scan overlay canvas ── */}
      <ScanCanvas active={true} />

      {/* ── Neon border glow ── */}
      <div className="absolute inset-0 z-[4] pointer-events-none rounded-[20px]"
        style={{
          border: '1px solid rgba(0,217,255,0.3)',
          boxShadow: 'inset 0 0 40px rgba(0,217,255,0.04), inset 0 0 80px rgba(124,131,253,0.03)',
          borderRadius: 20,
        }} />

      {/* ── Scan line top ── */}
      <div className="absolute top-0 left-0 right-0 h-px z-[5] pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, #00D9FF 40%, #7C83FD 60%, transparent 100%)',
          animation: 'scan-line 4s linear infinite',
        }} />

      {/* ════ HEADER / NAVIGATION ════════════════════════════════════ */}
      <div className="flex-shrink-0 relative z-20" style={{ background: 'linear-gradient(180deg, rgba(0,6,20,0.95) 0%, rgba(0,4,16,0.6) 100%)', borderBottom: '1px solid rgba(0,217,255,0.1)' }}>
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left: Language & Time */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher language={language} onChange={handleLanguageChange} />
            <span className="text-[10px] font-mono text-[#7C83FD]/50 tracking-widest hidden sm:inline-block">
              {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })} IST
            </span>
          </div>

          {/* Right: XP, Voice, Close */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                 style={{ background: 'rgba(124,131,253,0.1)', border: '1px solid rgba(124,131,253,0.25)', boxShadow: '0 0 10px rgba(124,131,253,0.1)' }}>
              <Zap className="w-3.5 h-3.5 text-[#7C83FD]" style={{ filter: 'drop-shadow(0 0 4px rgba(124,131,253,0.8))' }} />
              <span className="text-[#7C83FD] text-xs font-black">{xp}</span>
            </div>
            <button onClick={() => setVoiceEnabled(v => !v)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              title={voiceEnabled ? 'Mute' : 'Enable voice'}>
              {voiceEnabled
                ? <Volume2 className="w-4 h-4 text-[#00D9FF]" style={{ filter: 'drop-shadow(0 0 4px rgba(0,217,255,0.7))' }} />
                : <VolumeX className="w-4 h-4 text-[#A5B4FC]/60" />}
            </button>
            {!full && (
              <button onClick={() => setIsMinimized(true)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                <X className="w-4 h-4 text-[#A5B4FC]/80" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ════ HERO / 3D AVATAR ═══════════════════════════════════════ */}
      <div className="flex-shrink-0 relative z-10 flex flex-col items-center justify-center overflow-hidden"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, rgba(0,30,55,0.7) 0%, rgba(2,4,16,0.95) 100%)',
          borderBottom: '1px solid rgba(0,217,255,0.15)',
          paddingTop: full ? 16 : 10,
          paddingBottom: full ? 20 : 12,
        }}>

        {/* Background radial halo behind face */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: `radial-gradient(ellipse 60% 55% at 50% 45%, rgba(0,217,255,0.06) 0%, rgba(124,131,253,0.04) 50%, transparent 100%)`,
          animation: 'face-glow 3.5s ease-in-out infinite',
        }} />

        {/* Corner data readouts */}
        <div className="absolute top-4 left-5 flex flex-col gap-2 pointer-events-none">
          {[['SYS', '98%'], ['MEM', '2.4T'], ['NET', 'SYNC']].map(([k, v]) => (
            <div key={k} className="flex items-center gap-2">
              <span className="text-[9px] font-mono tracking-[0.2em]" style={{ color: 'rgba(0,217,255,0.4)' }}>{k}</span>
              <span className="text-[9px] font-mono tracking-widest" style={{ color: 'rgba(0,217,255,0.7)' }}>{v}</span>
            </div>
          ))}
        </div>
        <div className="absolute top-4 right-5 flex flex-col items-end gap-2 pointer-events-none">
          {[['LVL', '5'], ['SEC', 'ON']].map(([k, v]) => (
            <div key={k} className="flex items-center gap-2">
              <span className="text-[9px] font-mono tracking-widest" style={{ color: 'rgba(124,131,253,0.7)' }}>{v}</span>
              <span className="text-[9px] font-mono tracking-[0.2em]" style={{ color: 'rgba(124,131,253,0.4)' }}>{k}</span>
            </div>
          ))}
        </div>

        {/* The Face */}
        <div className="relative flex items-center justify-center mb-6">
          {/* State-based halo ring */}
          <div className="absolute rounded-full pointer-events-none" style={{
            inset: -12,
            border: `1px solid ${
              isListening ? 'rgba(0,217,255,0.6)' :
              isSpeaking  ? 'rgba(0,255,239,0.5)' :
              isTyping    ? 'rgba(124,131,253,0.5)' :
                            'rgba(0,217,255,0.2)'
            }`,
            boxShadow: `0 0 30px ${
              isListening ? 'rgba(0,217,255,0.4)' :
              isSpeaking  ? 'rgba(0,255,239,0.3)' :
              isTyping    ? 'rgba(124,131,253,0.3)' :
                            'rgba(0,217,255,0.1)'
            }`,
            borderRadius: '50%',
            animation: isListening || isSpeaking || isTyping ? 'pulse 2s ease-in-out infinite' : 'none',
          }} />

          <RoboticAI3DFace
            state={isListening ? 'listening' : isSpeaking ? 'speaking' : isTyping ? 'thinking' : 'idle'}
            size={full ? 'lg' : 'md'}
          />
        </div>

        {/* Unified Central Info Block */}
        <div className="flex flex-col items-center gap-3.5 relative z-10 w-full px-6 mt-2">
          {/* Title & Badge */}
          <div className="flex items-center justify-center gap-4">
            <h3 className="text-white font-semibold text-lg tracking-[0.35em] uppercase opacity-95" style={{ textShadow: '0 0 25px rgba(255,255,255,0.15)' }}>
              Obsidian AI
            </h3>
            <span className="text-[10px] px-2 py-1 rounded font-mono tracking-widest uppercase"
              style={{ background: 'rgba(0,217,255,0.06)', color: '#00D9FF', border: '1px solid rgba(0,217,255,0.25)' }}>
              v3.1
            </span>
          </div>

          {/* State Label */}
          <div className="flex items-center gap-2.5 mt-1.5">
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{
              background: isListening ? '#00D9FF' : isSpeaking ? '#00FFEF' : isTyping ? '#7C83FD' : '#8AAE6D',
              boxShadow: `0 0 10px ${isListening ? '#00D9FF' : isSpeaking ? '#00FFEF' : isTyping ? '#7C83FD' : '#8AAE6D'}`,
            }} />
            <span className="text-[11px] font-mono tracking-[0.3em] uppercase" style={{
              color: isListening ? '#00D9FF' : isSpeaking ? '#00FFEF' : isTyping ? '#7C83FD' : '#8AAE6D',
            }}>
              {isListening ? 'Voice Capture' : isSpeaking ? 'Transmitting' : isTyping ? 'Processing' : 'Neural Ready'}
            </span>
          </div>

          {/* Tags */}
          <div className="flex items-center justify-center gap-6 mt-3 opacity-90">
            {['NEURAL', 'FINANCE', 'VOICE'].map((label, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-[#A5B4FC]/70 tracking-[0.3em]">{label}</span>
              </div>
            ))}
          </div>
          
          {/* Active Voice Visualization */}
          <div className="h-4 flex items-center justify-center opacity-70 mt-2">
             <Waveform isActive={isSpeaking || isListening} bars={14} />
          </div>
        </div>
      </div>

      {/* ════ MESSAGES ═══════════════════════════════════════════════ */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 chat-scroll relative z-10" style={{ minHeight: '20vh' }}>

        {/* ── Jarvis HUD image ── */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src={jarvisHudBg}
            alt=""
            className="w-full h-full object-cover"
            style={{ opacity: 0.55, filter: 'saturate(1.8) brightness(0.9) hue-rotate(-5deg)', mixBlendMode: 'screen' }}
          />
          <div className="absolute inset-0" style={{
            background: 'radial-gradient(ellipse at center, rgba(0,5,18,0.55) 0%, rgba(0,3,12,0.82) 100%)',
          }} />
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(160deg, rgba(0,30,50,0.45) 0%, rgba(5,0,30,0.5) 100%)',
          }} />
        </div>

        {messages.map((msg) => (
          <div key={msg.id}
            className={`obsidian-msg flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.sender === 'bot' && (
              <div className="flex-shrink-0 mt-1 rounded-full flex items-center justify-center"
                style={{ width: 34, height: 34, minWidth: 34,
                  background: 'radial-gradient(circle, rgba(0,30,60,0.9) 0%, rgba(0,10,30,0.95) 100%)',
                  border: '1px solid rgba(0,217,255,0.30)',
                  boxShadow: '0 0 10px rgba(0,217,255,0.20), inset 0 0 8px rgba(0,100,200,0.12)' }}>
                <div style={{ position:'relative', width:18, height:18 }}>
                  {/* Stylized bot face icon */}
                  {[-1,1].map(s => (
                    <div key={s} style={{
                      position:'absolute', width:5, height:5, borderRadius:'50%',
                      top:4, left: s<0 ? 1 : 10,
                      background:'#00D9FF',
                      boxShadow:'0 0 5px #00D9FF, 0 0 10px rgba(0,217,255,0.6)',
                    }}/>
                  ))}
                  <div style={{
                    position:'absolute', bottom:2, left:'50%', transform:'translateX(-50%)',
                    width:8, height:1.5, borderRadius:2,
                    background:'rgba(0,217,255,0.55)',
                  }}/>
                </div>
              </div>
            )}
            <div className="max-w-[82%]">
              <div
                className={`px-4 py-3 text-sm leading-relaxed ${msg.sender === 'user' ? 'rounded-2xl rounded-tr-sm' : 'rounded-2xl rounded-tl-sm'}`}
                style={msg.sender === 'user' ? {
                  background: 'linear-gradient(135deg, rgba(124,131,253,0.18) 0%, rgba(0,217,255,0.1) 100%)',
                  border: '1px solid rgba(124,131,253,0.35)',
                  color: '#E8EEFF',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 4px 20px rgba(124,131,253,0.1)',
                } : {
                  background: 'linear-gradient(135deg, rgba(0,6,20,0.75) 0%, rgba(0,217,255,0.04) 100%)',
                  border: '1px solid rgba(0,217,255,0.2)',
                  color: '#C8E0F0',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 0 30px rgba(0,217,255,0.05)',
                }}>
                {msg.text}
              </div>
              <div className="flex items-center gap-3 mt-1">
                {msg.ts && <span className="text-[9px] font-mono text-[#A5B4FC]/30">{msg.ts}</span>}
                {msg.xp && msg.sender === 'bot' && (
                  <div className="flex items-center gap-1" style={{ animation: 'float-in 0.5s ease-out 0.25s both' }}>
                    <Zap className="w-2.5 h-2.5 text-[#7C83FD]" />
                    <span className="text-[10px] font-black text-[#7C83FD]">+{msg.xp} XP</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="obsidian-msg flex gap-2 justify-start">
            <div className="flex-shrink-0 mt-1 rounded-full flex items-center justify-center"
              style={{ width: 34, height: 34, minWidth: 34,
                background: 'radial-gradient(circle, rgba(20,10,60,0.9) 0%, rgba(0,10,30,0.95) 100%)',
                border: '1px solid rgba(124,131,253,0.35)',
                boxShadow: '0 0 10px rgba(124,131,253,0.22)' }}>
              <div style={{ position:'relative', width:18, height:18 }}>
                {[-1,1].map(s => (
                  <div key={s} style={{
                    position:'absolute', width:5, height:5, borderRadius:'50%',
                    top:4, left: s<0 ? 1 : 10,
                    background:'#7C83FD',
                    boxShadow:'0 0 5px #7C83FD',
                    animation:'pulse 1s ease-in-out infinite',
                  }}/>
                ))}
                <div style={{
                  position:'absolute', bottom:2, left:'50%', transform:'translateX(-50%)',
                  width:10, height:1.5, borderRadius:2,
                  background:'rgba(124,131,253,0.55)',
                }}/>
              </div>
            </div>
            <div className="rounded-2xl rounded-tl-sm"
              style={{ background: 'rgba(0,217,255,0.04)', border: '1px solid rgba(0,217,255,0.16)' }}>
              <TypingDots />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ════ INPUT ══════════════════════════════════════════════════ */}
      <form onSubmit={handleSubmit}
        className="flex-shrink-0 px-4 py-3 flex gap-2 relative z-10"
        style={{
          borderTop: '1px solid rgba(0,217,255,0.1)',
          background: 'linear-gradient(135deg, rgba(2,6,18,0.9) 0%, rgba(8,4,28,0.88) 100%)',
          backdropFilter: 'blur(20px)',
        }}>
        <div className="flex-1 relative">
          <input type="text" value={input} onChange={e => setInput(e.target.value)}
            placeholder={isListening ? ui.listeningPlaceholder : ui.placeholder}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
            style={{
              background: 'rgba(0,217,255,0.04)',
              border: `1px solid ${isListening ? 'rgba(255,82,82,0.4)' : 'rgba(0,217,255,0.18)'}`,
              color: '#E0E8FF',
              backdropFilter: 'blur(12px)',
              boxShadow: isListening ? '0 0 20px rgba(255,82,82,0.1)' : '0 0 16px rgba(0,217,255,0.05)',
            }} />
        </div>
        <button type="button" onClick={toggleListening}
          className="w-11 h-11 rounded-xl flex items-center justify-center transition-all hover:scale-105 flex-shrink-0"
          style={{
            background: isListening ? 'rgba(255,82,82,0.15)' : 'rgba(0,217,255,0.07)',
            border: `1px solid ${isListening ? 'rgba(255,82,82,0.45)' : 'rgba(0,217,255,0.25)'}`,
            boxShadow: isListening ? '0 0 20px rgba(255,82,82,0.25)' : '0 0 12px rgba(0,217,255,0.12)',
          }}>
          {isListening
            ? <MicOff className="w-4 h-4 text-[#FF5252]" />
            : <Mic className="w-4 h-4 text-[#00D9FF]" style={{ filter: 'drop-shadow(0 0 5px rgba(0,217,255,0.7))' }} />}
        </button>
        <button type="submit" disabled={!input.trim()}
          className="w-11 h-11 rounded-xl flex items-center justify-center transition-all hover:scale-105 flex-shrink-0 disabled:opacity-30"
          style={{
            background: 'linear-gradient(135deg, #7C83FD, #00D9FF)',
            boxShadow: '0 0 20px rgba(0,217,255,0.4)',
          }}>
          <Send className="w-4 h-4 text-white" />
        </button>
      </form>
    </div>
  );

  /* ── Full-screen ── */
  if (isFullScreen) {
    return (
      <div className="w-full" style={{ height: 'calc(100dvh - 9rem)', minHeight: '32rem' }}>
        {renderPanel(true)}
      </div>
    );
  }

  /* ── Minimized floating robot ── */
  if (isMinimized) {
    return (
      <button onClick={() => setIsMinimized(false)}
        className="fixed bottom-6 right-6 z-50 transition-all hover:scale-105 group"
        title="Open Obsidian AI">
        <div className="relative">
          <RoboticAI3DFace state="idle" size="sm" />
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full border-2 animate-pulse flex items-center justify-center"
            style={{ background: '#8AAE6D', borderColor: '#060B18', boxShadow: '0 0 10px rgba(138,174,109,0.7)' }}>
            <span style={{ fontSize: 7, color: '#fff', fontWeight: 900 }}>AI</span>
          </div>
        </div>
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-2 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: 'rgba(0,217,255,0.12)', border: '1px solid rgba(0,217,255,0.3)', color: '#00D9FF' }}>
          Obsidian AI
        </div>
      </button>
    );
  }

  /* ── Floating popup ── */
  return (
    <div
      className="fixed z-50 shadow-2xl transition-all duration-300"
      style={{
        right: 'clamp(0.75rem, 2vw, 1.5rem)',
        bottom: 'clamp(0.75rem, 2vw, 1.5rem)',
        width: 'min(440px, calc(100vw - 1.5rem))',
        height: 'min(85dvh, 860px)',
        minHeight: 'clamp(28rem, 60vh, 650px)',
        maxWidth: 'calc(100vw - 1.5rem)',
      }}
    >
      {renderPanel(false)}
    </div>
  );
}
