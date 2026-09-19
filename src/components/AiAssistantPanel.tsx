import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, Send, Sparkles, CheckCircle2, 
  X, MessageSquare, 
  Cpu, ArrowRight, Download
} from 'lucide-react';
import { CandidateDossier, AiMessage } from '../types';
import { askAiAssistant } from '../services/aiAssistantService';
import { exportCandidatePdf } from '../utils/pdfExport';

interface AiAssistantPanelProps {
  dossier: CandidateDossier;
  isOpen: boolean;
  onClose: () => void;
}

export const AiAssistantPanel: React.FC<AiAssistantPanelProps> = ({
  dossier,
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'audit'>('chat');
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial greeting
  useEffect(() => {
    if (dossier) {
      setMessages([
        {
          id: 'msg-init',
          sender: 'assistant',
          text: `👋 I have indexed **${dossier.profile.name}**'s (@${dossier.profile.login}) public GitHub repositories, commit telemetry, and code complexity scores. \n\nWhat would you like to evaluate about this candidate?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [dossier?.profile?.login]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Prompt action buttons
  const promptButtons = [
    { label: '🎯 Top 3 strengths', query: 'What are the top 3 strengths of this candidate?' },
    { label: '💼 Best role fit', query: 'What is the best role fit for this candidate?' },
    { label: '🚩 Technical risks', query: 'Are there any red flags or technical risks?' },
    { label: '📊 Executive Summary', query: 'Give me an executive hiring summary citing specific projects.' },
    { label: '💡 Interview Questions', query: 'What targeted interview questions should I ask?' }
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputVal;
    if (!query.trim()) return;

    const userMsg: AiMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    try {
      const response = await askAiAssistant(query, dossier, messages);
      const assistantMsg: AiMessage = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: response.citations
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (e) {
      setMessages(prev => [
        ...prev,
        {
          id: `asst-err-${Date.now()}`,
          sender: 'assistant',
          text: 'Encountered a momentary analysis error. Please try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          id="ai-assistant-drawer"
          initial={{ x: '100%', opacity: 0.5 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          className="fixed top-0 right-0 h-screen w-full sm:w-[460px] lg:w-[480px] z-50 bg-[#0a0d18]/95 backdrop-blur-2xl border-l border-white/[0.08] shadow-2xl flex flex-col font-sans"
        >
          {/* Top Panel Header */}
          <div className="p-3.5 sm:p-4 border-b border-white/[0.08] flex items-center justify-between bg-black/40 gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-500 to-cyan-400 p-[1.5px] flex items-center justify-center flex-shrink-0">
                <div className="w-full h-full bg-slate-950 rounded-[9px] flex items-center justify-center">
                  <Bot className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight truncate">
                    AI Talent Assistant
                  </h3>
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse flex-shrink-0" />
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-400 font-mono truncate">
                  @{dossier.profile.login}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                onClick={() => exportCandidatePdf(dossier)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/40 text-cyan-300 border border-cyan-500/30 text-xs font-semibold shadow-sm transition-all"
                title="Download 1-Click Executive PDF Dossier"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">PDF</span>
              </button>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Close panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Assistant Tabs: Chat vs Technical Audit */}
          <div className="px-3 sm:px-4 py-1.5 bg-slate-950/60 border-b border-white/[0.06] flex items-center gap-2">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'chat'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
              <span>Candidate Q&A</span>
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'audit'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-purple-400" />
              <span>Technical Audit</span>
            </button>
          </div>

          {/* TAB 1: AI CHAT INTERFACE */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col min-h-0">
              
              {/* Quick Prompt Action Buttons */}
              <div className="p-2 sm:p-2.5 border-b border-white/[0.05] bg-black/20 flex gap-1.5 overflow-x-auto touch-scroll">
                {promptButtons.map((btn, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(btn.query)}
                    className="text-[10px] sm:text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-indigo-950/80 text-slate-300 hover:text-cyan-300 border border-white/[0.08] hover:border-cyan-500/30 whitespace-nowrap transition-all flex items-center gap-1 flex-shrink-0"
                  >
                    <span>{btn.label}</span>
                  </button>
                ))}
              </div>

              {/* Chat Conversation Scroll Area */}
              <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3.5 touch-scroll">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.sender === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-[88%] p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white shadow-md rounded-br-none'
                          : 'bg-slate-900/90 text-slate-200 border border-white/[0.08] rounded-bl-none shadow-sm'
                      }`}
                    >
                      <div className="whitespace-pre-line">{msg.text}</div>

                      {/* Citations if present */}
                      {msg.citations && msg.citations.length > 0 && (
                        <div className="mt-2.5 pt-2 border-t border-white/[0.08] text-[10px] font-mono text-cyan-300 space-y-0.5">
                          <span className="text-slate-400 block font-bold">Verified Evidence:</span>
                          {msg.citations.map((c, i) => (
                            <div key={i} className="truncate">• <strong className="text-cyan-300">{c.repoName}:</strong> {c.reason}</div>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 mt-1 px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 bg-slate-900/60 border border-white/[0.06] px-3 py-2 rounded-xl w-fit">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                    <span>Analyzing GitHub telemetry & repository code...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Bar */}
              <div className="p-3 border-t border-white/[0.08] bg-black/40">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    id="input-ai-assistant-query"
                    type="text"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    placeholder={`Ask about @${dossier.profile.login}'s engineering...`}
                    disabled={isTyping}
                    className="flex-1 min-w-0 bg-slate-900/90 border border-white/[0.1] focus:border-indigo-500/60 rounded-xl px-3 sm:px-3.5 py-2 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!inputVal.trim() || isTyping}
                    className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:opacity-95 active:scale-95 disabled:opacity-40 text-white font-bold transition-all flex-shrink-0"
                    title="Send query"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>

            </div>
          )}

          {/* TAB 2: TECHNICAL ARCHITECTURE AUDIT */}
          {activeTab === 'audit' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4 touch-scroll">
              
              {/* Architecture Overview Card */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/[0.08] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                    Architecture Synthesis
                  </span>
                  <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-xs font-bold">
                    Grade {dossier.complexity.grade}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">
                  Deterministic Code Evaluation
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {dossier.complexity.summary}
                </p>
              </div>

              {/* Dimension Ratings */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                  Core Engineering Dimensions
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-black/30 border border-white/[0.05]">
                    <span className="text-slate-400 block text-[10px]">Architectural Depth</span>
                    <span className="text-sm font-bold text-cyan-400">{dossier.complexity.architectureDepth}%</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/30 border border-white/[0.05]">
                    <span className="text-slate-400 block text-[10px]">Code Hygiene</span>
                    <span className="text-sm font-bold text-indigo-300">{dossier.complexity.codeHygiene}%</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/30 border border-white/[0.05]">
                    <span className="text-slate-400 block text-[10px]">Maintainability</span>
                    <span className="text-sm font-bold text-purple-400">{dossier.complexity.maintainability}%</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/30 border border-white/[0.05]">
                    <span className="text-slate-400 block text-[10px]">Ecosystem Impact</span>
                    <span className="text-sm font-bold text-amber-300">{dossier.complexity.ecosystemImpact}%</span>
                  </div>
                </div>
              </div>

              {/* Verified Strengths from Repositories */}
              <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 space-y-2">
                <span className="text-xs font-mono font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  Primary Repository Strengths
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300 pt-1">
                  {dossier.verifiedSkills.slice(0, 3).map(skill => (
                    <li key={skill.id} className="flex items-start gap-2">
                      <span className="text-cyan-400 font-bold">•</span>
                      <span><strong>{skill.name}:</strong> {skill.proofText}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Audit Recommendation CTA */}
              <button
                onClick={() => {
                  setActiveTab('chat');
                  handleSendMessage(`Deep dive into @${dossier.profile.login}'s system design architecture.`);
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 hover:opacity-95 transition-opacity"
              >
                <span>Ask AI to Deep-Dive Architecture</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

            </div>
          )}

        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default AiAssistantPanel;
