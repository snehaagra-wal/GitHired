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

  useEffect(() => {
    if (!isOpen) return;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
        return;
      } catch (e) {}
    }

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
    { label: '📅 Intro call', text: `Hi ${profile.name}, we are very impressed by your work on GitHub. Would you be open to a 20-minute intro call this week?` },
    { label: '💼 Senior opening', text: `We have an opening for a ${profile.seniority_level} aligned with your experience in ${techStack[0]?.name}. Would love to share the JD!` },
    { label: '🤝 Open-source', text: `Loved your repository architecture. We're building tooling around the same space and would like to collaborate.` }
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

    setTimeout(() => {
      let reply = `That sounds very interesting! I'd be glad to discuss further. You can check my repositories or send calendar details through my GitHub email (${profile.email || `${profile.login}@users.noreply.github.com`}).`;
      
      if (textToSend.toLowerCase().includes('interview') || textToSend.toLowerCase().includes('call')) {
        reply = `I would be happy to take a 20-minute intro call. Feel free to send an invite to my linked GitHub email!`;
      } else if (textToSend.toLowerCase().includes('compensation') || textToSend.toLowerCase().includes('salary')) {
        reply = `I evaluate opportunities based on architectural challenge, team autonomy, and competitive market compensation for ${profile.seniority_level} roles.`;
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          className="w-full max-w-2xl rounded-2xl sm:rounded-3xl bg-[#0b0e17] border border-white/[0.08] shadow-2xl flex flex-col h-[85vh] max-h-[620px] overflow-hidden"
        >
          {/* Header */}
          <div className="p-3.5 sm:p-4 border-b border-white/[0.08] bg-black/40 flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative flex-shrink-0">
                <img
                  src={profile.avatar_url}
                  alt={profile.name}
                  className="w-10 h-10 rounded-xl object-cover border border-indigo-500/30 bg-slate-900"
                />
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 border-2 border-[#0b0e17] absolute -bottom-0.5 -right-0.5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs sm:text-sm font-bold text-white truncate">
                  Direct Channel • {profile.name}
                </h3>
                <p className="text-[10px] sm:text-xs text-cyan-400 font-mono flex items-center gap-1 truncate">
                  <ShieldCheck className="w-3 h-3 flex-shrink-0" />
                  <span>@{profile.login} • Active Candidate</span>
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-3 sm:px-4 py-2 bg-slate-950/60 border-b border-white/[0.05] flex items-center gap-2 overflow-x-auto touch-scroll">
            <span className="text-[10px] font-mono text-slate-400 uppercase flex-shrink-0">
              Quick:
            </span>
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(qp.text)}
                className="text-[10px] sm:text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-indigo-950/60 text-slate-300 hover:text-cyan-300 border border-white/[0.08] hover:border-cyan-500/30 whitespace-nowrap transition-all flex-shrink-0"
              >
                {qp.label}
              </button>
            ))}
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3.5 touch-scroll">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${
                  m.sender === 'recruiter' ? 'items-end' : 'items-start'
                }`}
              >
                <div className="flex items-center gap-2 mb-1 px-1 text-[10px] font-mono text-slate-400">
                  <span>{m.senderName}</span>
                  <span>•</span>
                  <span>{m.timestamp}</span>
                </div>

                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    m.sender === 'recruiter'
                      ? 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 text-white rounded-br-none shadow-md'
                      : 'bg-slate-900/90 text-slate-200 border border-white/[0.08] rounded-bl-none shadow-sm'
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
              <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/80 p-2.5 rounded-xl w-fit border border-white/[0.05]">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>@{profile.login} is typing a response...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Message Input Form */}
          <div className="p-3 border-t border-white/[0.08] bg-black/40">
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
                placeholder={`Message @${profile.login}...`}
                disabled={isCandidateTyping}
                className="flex-1 min-w-0 bg-slate-900/90 border border-white/[0.1] focus:border-indigo-500/60 rounded-xl px-3.5 py-2 sm:py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none font-sans"
              />
              <button
                type="submit"
                disabled={!inputVal.trim() || isCandidateTyping}
                className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:opacity-95 active:scale-95 text-white font-bold transition-all disabled:opacity-40 flex-shrink-0"
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

export default DirectChatModal;
