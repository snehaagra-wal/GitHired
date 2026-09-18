import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Send, CheckCheck, ShieldCheck 
} from 'lucide-react';
import { CandidateDossier, DirectChatMessage } from '../types';

interface DirectChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  dossier: CandidateDossier;
}

export const DirectChatModal: React.FC<DirectChatModalProps> = ({
  isOpen,
  onClose,
  dossier
}) => {
  const { profile, techStack, verifiedSkills } = dossier;
  const storageKey = `githired_chat_${profile.login}`;
  const [messages, setMessages] = useState<DirectChatMessage[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [isCandidateTyping, setIsCandidateTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load chat history from localStorage or set initial message
  useEffect(() => {
    if (!isOpen) return;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
        return;
      } catch (e) {}
    }

    // Default opening greeting
    const initialGreeting: DirectChatMessage = {
      id: `msg-greet-${Date.now()}`,
      sender: 'candidate',
      senderName: profile.name,
      text: `Hi there! Thanks for reaching out via GitHired. I'm currently open to discussing impactful engineering challenges involving ${techStack[0]?.name || 'modern systems'} and ${verifiedSkills[0]?.name || 'architecture'}. How can I help?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: true
    };
    setMessages([initialGreeting]);
  }, [isOpen, profile.login]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isCandidateTyping]);

  const quickPrompts = [
    { label: '📅 Schedule screening call', text: `Hi ${profile.name}, we are very impressed by your work on GitHub. Would you be open to a 20-minute intro call this week?` },
    { label: '💼 Senior / Lead opening', text: `We have an opening for a ${profile.seniority_level} aligned with your experience in ${techStack[0]?.name}. Would love to share the JD!` },
    { label: '🤝 Open-source collaboration', text: `Loved your repository architecture. We're building tooling around the same space and would like to collaborate.` }
  ];

  const handleSend = (overrideText?: string) => {
    const textToSend = overrideText || inputVal;
    if (!textToSend.trim()) return;

    const userMsg: DirectChatMessage = {
      id: `rec-${Date.now()}`,
      sender: 'recruiter',
      senderName: 'You (Talent Partner)',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: true
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    localStorage.setItem(storageKey, JSON.stringify(nextMessages));
    setInputVal('');
    setIsCandidateTyping(true);

    // Simulate realistic candidate reply
    setTimeout(() => {
      let reply = `That sounds very interesting! I'd be glad to discuss further. You can check my repositories or send calendar details through my GitHub email (${profile.email || `${profile.login}@users.noreply.github.com`}).`;
      
      const lower = textToSend.toLowerCase();
      if (lower.includes('call') || lower.includes('schedule') || lower.includes('meet')) {
        reply = `I would love to connect. I generally have availability Tuesday and Thursday afternoons. Feel free to send a calendar invite to ${profile.email || `${profile.login}@users.noreply.github.com`}.`;
      } else if (lower.includes('opening') || lower.includes('role') || lower.includes('jd')) {
        reply = `The role aligns well with what I'm looking for! With my experience across ${profile.public_repos} public repos and focus on ${techStack[0]?.name}, I'm looking for high-ownership technical leadership. Please share the details!`;
      } else if (lower.includes('rate') || lower.includes('salary') || lower.includes('compensation')) {
        reply = `For ${profile.seniority_level} engagements, my baseline aligns with top-tier market compensation with significant equity upside for high-impact missions.`;
      }

      const candidateReply: DirectChatMessage = {
        id: `cand-${Date.now()}`,
        sender: 'candidate',
        senderName: profile.name,
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: true
      };

      const finalMessages = [...nextMessages, candidateReply];
      setMessages(finalMessages);
      localStorage.setItem(storageKey, JSON.stringify(finalMessages));
      setIsCandidateTyping(false);
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-2xl rounded-3xl bg-[#0b0e17] border border-white/10 shadow-2xl flex flex-col h-[600px] overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-white/10 bg-black/40 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <img
                  src={profile.avatar_url}
                  alt={profile.name}
                  className="w-11 h-11 rounded-xl object-cover border border-indigo-500/40 bg-slate-900"
                />
                <span className="w-3 h-3 rounded-full bg-cyan-400 border-2 border-[#0b0e17] absolute -bottom-0.5 -right-0.5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  Direct Recruiter Connection • {profile.name}
                </h3>
                <p className="text-xs text-cyan-400 font-mono flex items-center gap-1.5">
                  <ShieldCheck className="w-3 h-3" />
                  Verified @{profile.login} • Active Candidate Channel
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-4 py-2 bg-slate-950/60 border-b border-white/5 flex items-center gap-2 overflow-x-auto">
            <span className="text-[10px] font-mono text-slate-500 uppercase flex-shrink-0">
              Quick Inquiries:
            </span>
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(qp.text)}
                className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-indigo-950/60 text-slate-300 hover:text-indigo-200 border border-white/10 hover:border-indigo-500/30 whitespace-nowrap transition-all"
              >
                {qp.label}
              </button>
            ))}
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${
                  m.sender === 'recruiter' ? 'items-end' : 'items-start'
                }`}
              >
                <div className="flex items-center gap-2 mb-1 px-1 text-[11px] font-mono text-slate-400">
                  <span>{m.senderName}</span>
                  <span>•</span>
                  <span>{m.timestamp}</span>
                </div>

                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    m.sender === 'recruiter'
                      ? 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 text-white rounded-br-none shadow-md shadow-indigo-600/20'
                      : 'bg-slate-900/90 text-slate-200 border border-white/10 rounded-bl-none shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>
                </div>

                {m.sender === 'recruiter' && (
                  <span className="text-[10px] text-cyan-400 flex items-center gap-1 mt-1 px-1 font-mono">
                    <CheckCheck className="w-3 h-3" /> Delivered
                  </span>
                )}
              </div>
            ))}

            {isCandidateTyping && (
              <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/80 p-3 rounded-2xl w-fit border border-white/5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>@{profile.login} is typing a response...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Message Input Form */}
          <div className="p-4 border-t border-white/10 bg-black/40">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder={`Message @${profile.login} directly regarding roles...`}
                disabled={isCandidateTyping}
                className="flex-1 bg-slate-900/90 border border-white/10 focus:border-indigo-500/60 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none font-sans"
              />
              <button
                type="submit"
                disabled={!inputVal.trim() || isCandidateTyping}
                className="p-3 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 hover:opacity-95 active:scale-95 text-white font-bold transition-all disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
