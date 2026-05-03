import { useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { Send } from 'lucide-react';
import { motion } from 'framer-motion';

interface CustomizationConfig {
  theme?: string;
  accent?: string;
  bubbleStyle?: string;
  showWelcomeMessage?: boolean;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const EmbedChat = () => {
  const { portfolioId } = useParams<{ portfolioId: string }>();
  const [customization, setCustomization] = useState<CustomizationConfig>({});
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch portfolio customization on mount
  useEffect(() => {
    if (!portfolioId) return;
    const fetchCustomization = async () => {
      try {
        const res = await fetch(`/api/v1/embed/customization/${portfolioId}`);
        if (res.ok) {
          const data = await res.json();
          setCustomization(data);
        }
      } catch (err) {
        console.error('Failed to fetch customization:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCustomization();
  }, [portfolioId]);

  // Auto-scroll to newest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !portfolioId) return;
    setIsSending(true);

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    try {
      const res = await fetch('/api/v1/embed/rag-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, portfolio_id: portfolioId })
      });

      if (res.ok) {
        const data = await res.json();
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[#FAFAFD]">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  const bgColor = customization.theme === 'dark' ? '#1e1e28' : '#FAFAFD';
  const accentColor = customization.accent || '#6366f1';

  return (
    <div
      className="w-full h-screen flex flex-col bg-[#FAFAFD]"
      style={{ backgroundColor: bgColor }}
    >
      {/* Header */}
      <div
        className="px-6 py-5 border-b"
        style={{
          borderBottomColor: customization.theme === 'dark' ? '#2e2e3a' : '#e2e8f0'
        }}
      >
        <h2
          className="text-xl font-bold"
          style={{ color: accentColor }}
        >
          Portexa AI Assistant
        </h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && customization.showWelcomeMessage !== false && (
          <div className="text-center py-12 text-slate-500">
            <p className="text-lg font-semibold mb-2">Welcome to Portexa AI</p>
            <p className="text-sm">Ask me anything about this portfolio.</p>
          </div>
        )}

        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs md:max-w-sm px-4 py-3 rounded-2xl ${
                msg.role === 'user'
                  ? 'text-white rounded-tr-sm'
                  : 'bg-white border border-slate-100 rounded-tl-sm'
              }`}
              style={
                msg.role === 'user'
                  ? { backgroundColor: accentColor }
                  : {
                      backgroundColor: customization.theme === 'dark' ? '#2e2e3a' : '#ffffff',
                      borderColor: customization.theme === 'dark' ? '#3a3a48' : '#e2e8f0',
                      color: customization.theme === 'dark' ? '#e0e0e0' : '#1e293b'
                    }
              }
            >
              <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-6 border-t" style={{ borderTopColor: customization.theme === 'dark' ? '#2e2e3a' : '#e2e8f0' }}>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Ask a question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            disabled={isSending}
            className="flex-1 px-4 py-3 rounded-lg border outline-none text-sm font-medium transition"
            style={{
              backgroundColor: customization.theme === 'dark' ? '#1e1e28' : '#f1f5f9',
              borderColor: accentColor,
              color: customization.theme === 'dark' ? '#e0e0e0' : '#1e293b'
            }}
          />
          <button
            onClick={sendMessage}
            disabled={isSending || !input.trim()}
            className="px-4 py-3 rounded-lg text-white font-semibold transition disabled:opacity-50"
            style={{ backgroundColor: accentColor }}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmbedChat;
