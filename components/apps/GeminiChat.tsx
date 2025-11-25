
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2, StopCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { streamGeminiResponse } from '../../services/geminiService';
import { GenerateContentResponse } from '@google/genai';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export const GeminiChat: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'model', text: 'Hello! I am **Nebula**, your system AI assistant. How can I help you today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Auto scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Create a placeholder message for the stream immediately
      const responseId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { id: responseId, role: 'model', text: '' }]);

      // Prepare history for API
      // Crucial: Filter out empty messages and error messages to prevent API "InvalidArgument" errors
      const history = messages
        .filter(m => !m.isError && m.text.trim().length > 0)
        .map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        }));

      const streamResult = await streamGeminiResponse(userMsg.text, history);
      
      let fullText = '';
      for await (const chunk of streamResult) {
        const c = chunk as GenerateContentResponse;
        const textChunk = c.text || '';
        fullText += textChunk;
        
        setMessages(prev => prev.map(msg => 
            msg.id === responseId ? { ...msg, text: fullText } : msg
        ));
      }
    } catch (error) {
      console.error("Gemini Chat Error:", error);
      // Remove the empty loading message if it exists (the last one)
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last.role === 'model' && last.text === '') {
            return prev.slice(0, -1);
        }
        return prev;
      });

      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: 'model', 
        text: 'Sorry, I encountered an error connecting to the Nebula Network. Please check your network connection and ensure `API_KEY` is set correctly in your environment.', 
        isError: true 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950/50 text-white">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar" ref={scrollRef}>
        {messages.map((msg) => (
          // Hide empty messages (while loading/thinking) unless they are the active stream
          (msg.text || isLoading) && (
            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'model' && (
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0 mt-1">
                    <Bot size={16} className="text-indigo-400" />
                </div>
                )}
                
                {msg.text && (
                    <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                    msg.role === 'user' 
                        ? 'bg-blue-600 text-white rounded-tr-none' 
                        : 'bg-slate-800/80 text-gray-200 rounded-tl-none border border-white/5'
                    } ${msg.isError ? 'bg-red-900/50 border-red-500/30 text-red-200' : ''}`}>
                    <ReactMarkdown 
                        className="prose prose-invert prose-sm max-w-none"
                        components={{
                            code({node, className, children, ...props}) {
                                return (
                                    <code className={`${className} bg-black/30 rounded px-1 py-0.5 text-xs font-mono text-yellow-300`} {...props}>
                                        {children}
                                    </code>
                                )
                            }
                        }}
                    >
                        {msg.text}
                    </ReactMarkdown>
                    </div>
                )}

                {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center shrink-0 mt-1">
                    <User size={16} className="text-gray-300" />
                </div>
                )}
            </div>
          )
        ))}
        {isLoading && messages[messages.length - 1]?.text === '' && (
            <div className="flex gap-3 justify-start animate-pulse">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                    <Bot size={16} className="text-indigo-400" />
                </div>
                <div className="bg-slate-800/80 rounded-2xl rounded-tl-none px-4 py-2 border border-white/5 flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin text-indigo-400" />
                    <span className="text-xs text-gray-400 italic">Thinking...</span>
                </div>
            </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-900/80 border-t border-white/10">
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Nebula AI..."
            className="w-full bg-black/20 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all placeholder-gray-500"
            autoFocus
          />
          <button 
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? <StopCircle size={16} /> : <Send size={16} />}
          </button>
        </form>
        <div className="mt-2 flex items-center justify-center gap-2 text-[10px] text-gray-500">
            <Sparkles size={10} />
            <span>Powered by Gemini 2.5 Flash</span>
        </div>
      </div>
    </div>
  );
};
