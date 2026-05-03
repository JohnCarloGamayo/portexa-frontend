import { type CSSProperties, useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { Check, Copy, Moon, Palette, PlayCircle, Send, Sun, X } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';

type BubbleStyle = 'modern' | 'compact' | 'editorial';
type ThemeMode = 'light' | 'dark';

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

type ResumeLibraryItem = {
  id: string;
  name: string;
  file_name: string;
  summary: string;
};

type ResumeLibraryResponse = {
  active_id: string | null;
  items: ResumeLibraryItem[];
};

type PlaygroundResponse = {
  response?: string;
  detail?: string;
};

type CustomizationConfig = {
  theme: ThemeMode;
  accent: string;
  bubbleStyle: BubbleStyle;
  enableMobile: boolean;
  showWelcomeMessage: boolean;
};

const API_BASE = 'http://127.0.0.1:8000/api/v1';

const defaultConfig: CustomizationConfig = {
  theme: 'light',
  accent: '#4f46e5',
  bubbleStyle: 'modern',
  enableMobile: true,
  showWelcomeMessage: true,
};

const SettingsPage = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [theme, setTheme] = useState<ThemeMode>(defaultConfig.theme);
  const [accent, setAccent] = useState(defaultConfig.accent);
  const [bubbleStyle, setBubbleStyle] = useState<BubbleStyle>(defaultConfig.bubbleStyle);
  const [enableMobile, setEnableMobile] = useState(defaultConfig.enableMobile);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(defaultConfig.showWelcomeMessage);
  const [statusMessage, setStatusMessage] = useState('');
  const [isPlaygroundOpen, setIsPlaygroundOpen] = useState(false);
  const [playgroundInput, setPlaygroundInput] = useState('');
  const [isSendingPrompt, setIsSendingPrompt] = useState(false);
  const [playgroundMessages, setPlaygroundMessages] = useState<ChatMessage[]>([]);
  const [activeResumeName, setActiveResumeName] = useState('No active RAG source yet');
  const [activeResumeSummary, setActiveResumeSummary] = useState('Upload and confirm a portfolio source first from the Portfolios page.');
  const colorInputRef = useRef<HTMLInputElement>(null);
  const playgroundMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    const loadUserAndCustomization = async () => {
      try {
        // Get current user ID
        const userRes = await fetch(`${API_BASE}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (userRes.ok) {
          const user = await userRes.json();
          setUserId(String(user.id));
        }

        // Load customization from backend
        const customRes = await fetch(`${API_BASE}/resumes/customization`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (customRes.ok) {
          const config = (await customRes.json()) as Partial<CustomizationConfig>;
          setTheme(config.theme === 'dark' ? 'dark' : 'light');
          setAccent(typeof config.accent === 'string' ? config.accent : defaultConfig.accent);
          setBubbleStyle(
            config.bubbleStyle === 'compact' || config.bubbleStyle === 'editorial' ? config.bubbleStyle : 'modern',
          );
          setEnableMobile(typeof config.enableMobile === 'boolean' ? config.enableMobile : defaultConfig.enableMobile);
          setShowWelcomeMessage(
            typeof config.showWelcomeMessage === 'boolean' ? config.showWelcomeMessage : defaultConfig.showWelcomeMessage,
          );
        }
      } catch {
        // Fall back to defaults
      }
    };

    const loadActiveResume = async () => {
      try {
        const response = await fetch(`${API_BASE}/resumes`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as ResumeLibraryResponse;
        const active = data.items.find((item) => item.id === data.active_id) || data.items[0];

        if (active) {
          setActiveResumeName(active.name || active.file_name || 'Active source');
          setActiveResumeSummary(active.summary || 'Active source loaded from your private library.');
        }
      } catch {
        // Keep defaults when source metadata is unavailable.
      }
    };

    void loadUserAndCustomization();
    void loadActiveResume();
  }, []);

  useEffect(() => {
    if (!playgroundMessagesRef.current) {
      return;
    }
    playgroundMessagesRef.current.scrollTop = playgroundMessagesRef.current.scrollHeight;
  }, [playgroundMessages, isPlaygroundOpen]);

  const widgetSnippet = useMemo(
    () => `<iframe\n  src="${window.location.origin}/embed/chat/${userId || 'your-user-id'}"\n  width="100%"\n  height="600"\n  style="border: none; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);"\n  allow="clipboard-write"\n></iframe>`,
    [userId],
  );

  const handleSaveCustomization = () => {
    const payload: CustomizationConfig = {
      theme,
      accent,
      bubbleStyle,
      enableMobile,
      showWelcomeMessage,
    };

    const token = localStorage.getItem('token');
    if (!token) {
      setStatusMessage('Session expired. Please login again.');
      window.setTimeout(() => setStatusMessage(''), 2500);
      return;
    }

    const saveToBackend = async () => {
      try {
        const res = await fetch(`${API_BASE}/resumes/customization`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          throw new Error('Failed to save customization');
        }

        setStatusMessage('Customization saved. You can now validate behavior in Playground.');
        window.setTimeout(() => setStatusMessage(''), 2500);
      } catch {
        setStatusMessage('Failed to save customization. Please try again.');
        window.setTimeout(() => setStatusMessage(''), 2500);
      }
    };

    void saveToBackend();
  };

  const handleCopySnippet = async () => {
    try {
      await navigator.clipboard.writeText(widgetSnippet);
      setStatusMessage('Widget snippet copied.');
      window.setTimeout(() => setStatusMessage(''), 2500);
    } catch {
      setStatusMessage('Clipboard is blocked. Copy manually from the code box.');
      window.setTimeout(() => setStatusMessage(''), 2500);
    }
  };

  const sendPlaygroundPrompt = async () => {
    const question = playgroundInput.trim();
    if (!question) {
      return;
    }

    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: question,
    };
    setPlaygroundMessages((previous) => [...previous, userMessage]);
    setPlaygroundInput('');
    setIsSendingPrompt(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Your session expired. Please login again.');
      }

      const response = await fetch(`${API_BASE}/ai/rag-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt: question }),
      });

      const data = (await response.json()) as PlaygroundResponse;
      if (!response.ok) {
        throw new Error(data.detail || 'Unable to generate a playground response.');
      }

      setPlaygroundMessages((previous) => [
        ...previous,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          content: data.response || 'No response generated.',
        },
      ]);
    } catch (error) {
      setPlaygroundMessages((previous) => [
        ...previous,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          content: error instanceof Error ? error.message : 'Playground failed. Please try again.',
        },
      ]);
    } finally {
      setIsSendingPrompt(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Chatbot Customization</h1>
          <p className="text-sm font-medium text-slate-500">Configure your widget, save it, and test behavior using your active RAG source.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsPlaygroundOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            <PlayCircle className="w-4 h-4" />
            Open Playground
          </button>
          <button
            type="button"
            onClick={handleSaveCustomization}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-700"
          >
            <Check className="w-4 h-4" />
            Save Customization
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {statusMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_500px] gap-8 text-sans">
        <div className="space-y-6">
          <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm flex flex-col h-full">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Visual Identity</h2>
            <p className="text-slate-500 font-medium mb-8 text-sm">Customize how the curator appears to your visitors.</p>

            <div className="space-y-8 flex-1">
              <div>
                <h3 className="text-sm font-bold text-slate-700 mb-4">Primary Accent</h3>
                <div className="flex gap-4 items-center">
                  {[
                    { color: '#4f46e5', ring: 'ring-brand-500' },
                    { color: '#818cf8', ring: 'ring-brand-400' },
                    { color: '#0f172a', ring: 'ring-slate-900' },
                    { color: '#e11d48', ring: 'ring-rose-600' },
                    { color: '#10b981', ring: 'ring-emerald-500' },
                  ].map((a) => (
                    <button
                      key={a.color}
                      type="button"
                      onClick={() => setAccent(a.color)}
                      className={clsx(
                        'w-10 h-10 rounded-full transition-transform hover:scale-110',
                        accent === a.color && `ring-2 ${a.ring} ring-offset-2 scale-110`,
                      )}
                      style={{ backgroundColor: a.color }}
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() => colorInputRef.current?.click()}
                    className="w-10 h-10 rounded-full border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:border-slate-300 cursor-pointer transition-colors"
                  >
                    <Palette className="w-4 h-4" />
                  </button>
                  <input
                    ref={colorInputRef}
                    type="color"
                    value={accent}
                    onChange={(event) => setAccent(event.target.value)}
                    className="sr-only"
                    aria-label="Choose custom accent color"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-700 mb-4">Interface Mode</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setTheme('light')}
                    className={clsx(
                      'flex items-center gap-3 px-6 py-4 rounded-xl border text-sm font-bold transition-colors w-full',
                      theme === 'light'
                        ? 'border-brand-600 text-brand-600 bg-brand-50'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50',
                    )}
                  >
                    <Sun className="w-5 h-5" />
                    Light
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme('dark')}
                    className={clsx(
                      'flex items-center gap-3 px-6 py-4 rounded-xl border text-sm font-bold transition-colors w-full',
                      theme === 'dark'
                        ? 'border-brand-600 text-brand-600 bg-brand-50'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50',
                    )}
                  >
                    <Moon className="w-5 h-5" />
                    Dark
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-700 mb-4">Bubble Style</h3>
                <div className="space-y-3">
                  {[
                    { id: 'modern', label: 'Modern Floating' },
                    { id: 'compact', label: 'Compact Circular' },
                    { id: 'editorial', label: 'Editorial Pill' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setBubbleStyle(item.id as BubbleStyle)}
                      className={clsx(
                        'flex items-center justify-between w-full px-6 py-4 rounded-xl border text-sm font-bold transition-colors',
                        bubbleStyle === item.id
                          ? 'bg-slate-50 border-brand-500 shadow-sm text-slate-900'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50',
                      )}
                    >
                      <span>{item.label}</span>
                      {bubbleStyle === item.id && (
                        <div className="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-700">Enable on Mobile</span>
                  <input
                    type="checkbox"
                    checked={enableMobile}
                    onChange={(event) => setEnableMobile(event.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-brand-600"
                  />
                </label>
                <label className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-700">Show Welcome Message</span>
                  <input
                    type="checkbox"
                    checked={showWelcomeMessage}
                    onChange={(event) => setShowWelcomeMessage(event.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-brand-600"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-2">Active RAG Source</h3>
            <p className="text-sm font-semibold text-slate-700">{activeResumeName}</p>
            <p className="text-xs font-medium text-slate-500 mt-2 leading-relaxed">{activeResumeSummary}</p>
          </div>

          <div className="bg-white rounded-[2rem] p-4 border border-slate-100 shadow-sm h-full flex flex-col pt-0 sticky top-24 overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-100 rounded-t-[1.5rem] p-4 flex items-center gap-4 -mx-4 -mt-px relative z-10 shrink-0">
              <div className="flex gap-1.5 ml-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-400"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
              </div>
              <div className="flex-1 text-center text-[10px] font-bold tracking-widest text-slate-400 uppercase mr-12">Live Preview</div>
              <div className="absolute right-4 flex gap-2">
                <div className="w-3 h-3 rounded-sm bg-slate-200"></div>
                <div className="w-2 h-3 rounded-sm bg-slate-200"></div>
              </div>
            </div>

            <div className="flex-1 bg-white relative mt-4 mx-4 mb-4 rounded-xl border border-slate-50 overflow-hidden shadow-inner">
              <div className="p-8 space-y-6 opacity-30 pointer-events-none">
                <div className="w-1/2 h-8 bg-slate-200 rounded-lg"></div>
                <div className="w-3/4 h-4 bg-slate-100 rounded"></div>
                <div className="w-5/6 h-4 bg-slate-100 rounded"></div>
                <div className="w-2/3 h-4 bg-slate-100 rounded"></div>
                <div className="w-1/3 h-6 bg-slate-200 rounded-lg mt-12"></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-32 bg-slate-100 rounded-xl"></div>
                  <div className="h-32 bg-slate-100 rounded-xl"></div>
                </div>
              </div>

              <div className="absolute inset-0 p-3 sm:p-4 flex flex-col items-end justify-start">
                <div
                  className={clsx(
                    'bg-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1),0_0_20px_0_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col mb-2 overflow-hidden outline outline-1 outline-transparent transition-all',
                    theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-100 placeholder:text-slate-400' : '',
                    bubbleStyle === 'modern' ? 'rounded-2xl w-72 h-72' : bubbleStyle === 'compact' ? 'rounded-3xl w-64 h-64' : 'rounded-[2rem] w-72 h-[330px] border-2',
                  )}
                >
                  <div
                    className="px-5 py-4 flex items-center justify-between text-white shrink-0 shadow-sm"
                    style={{ backgroundColor: accent }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-sm overflow-hidden border border-white/20">
                        <img src="https://images.unsplash.com/photo-1550525811-e5869dd03032?auto=format&fit=crop&w=800&q=80" alt="" className="w-full h-full object-cover mix-blend-luminosity opacity-80" />
                      </div>
                      <div>
                        <div className="font-bold text-sm leading-none mb-1">Portexa AI</div>
                        <div className="text-[10px] font-medium text-white/80 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                          Typically replies instantly
                        </div>
                      </div>
                    </div>
                    <button type="button" className="text-white/80 hover:text-white transition-colors" disabled>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>

                  <div className={clsx('flex-1 p-5 overflow-y-auto space-y-4', theme === 'dark' ? 'bg-slate-900' : 'bg-slate-50')}>
                    {showWelcomeMessage && (
                      <div className="flex items-end gap-2">
                        <div className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center shrink-0">
                          <div className="w-3 h-3 bg-brand-500 rounded-full mix-blend-multiply opacity-50"></div>
                        </div>
                        <div
                          className={clsx(
                            'p-3 rounded-2xl rounded-bl-sm text-[13px] font-medium leading-relaxed max-w-[85%]',
                            theme === 'dark' ? 'bg-slate-800 text-slate-200' : 'bg-white text-slate-600 shadow-sm shadow-slate-200/50 border border-slate-100',
                          )}
                        >
                          Hello! I'm your Intelligent Curator. How can I assist with your portfolio today?
                        </div>
                      </div>
                    )}

                    <div className="flex items-end justify-end gap-2">
                      <div
                        className="p-3 rounded-2xl rounded-br-sm text-[13px] font-medium leading-relaxed max-w-[85%] text-white shadow-sm"
                        style={{ backgroundColor: accent }}
                      >
                        I want to see my latest gallery analytics.
                      </div>
                    </div>
                  </div>

                  <div className={clsx('p-3 border-t shrink-0 bg-white', theme === 'dark' ? 'border-slate-800 bg-slate-900' : 'border-slate-100')}>
                    <div
                      className={clsx(
                        'flex items-center px-4 py-2.5 rounded-full border focus-within:ring-2 focus-within:ring-opacity-20 transition-all',
                        theme === 'dark' ? 'bg-slate-800 border-slate-700 focus-within:border-slate-600' : 'bg-slate-50 border-slate-200 focus-within:border-brand-500',
                      )}
                      style={theme === 'light' ? ({ '--tw-ring-color': accent } as CSSProperties) : {}}
                    >
                      <input
                        type="text"
                        placeholder="Ask anything..."
                        className="w-full bg-transparent outline-none text-sm font-medium placeholder:text-slate-400"
                        disabled
                      />
                      <button type="button" style={{ color: accent }} className="ml-2 w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors" disabled>
                        <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
                      </button>
                    </div>
                  </div>
                </div>

                <div
                  className={clsx(
                    'w-14 h-14 rounded-full shadow-[0_10px_20px_-5px_rgba(0,0,0,0.2)] flex items-center justify-center text-white cursor-pointer hover:scale-105 transition-transform',
                    bubbleStyle === 'editorial' ? 'rounded-none rounded-br-[2rem] rounded-tl-[2rem]' : '',
                  )}
                  style={{ backgroundColor: accent }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-slate-900 rounded-[2rem] p-8 md:p-10 border border-slate-800 shadow-xl overflow-hidden relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 relative z-10">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight mb-2">Deploy Portexa</h2>
                <p className="text-slate-400 text-sm font-medium">Copy this snippet into your website head tag.</p>
              </div>
            </div>
            <div className="relative group z-10">
              <pre className="bg-[#0f172a] rounded-[1.5rem] p-8 text-sm font-mono overflow-x-auto border border-slate-800/80 shadow-inner">
                <code className="text-slate-300 block leading-relaxed whitespace-pre">{widgetSnippet}</code>
              </pre>
              <button
                type="button"
                onClick={() => void handleCopySnippet()}
                className="absolute top-4 right-4 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-widest px-4 py-2 rounded-lg transition opacity-0 group-hover:opacity-100 flex items-center gap-2 border border-slate-700"
              >
                <Copy className="w-4 h-4" /> Copy Snippet
              </button>
            </div>
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>
          </div>
        </div>
      </div>

      {isPlaygroundOpen && (
        <div className="fixed inset-0 z-[120] bg-black/50 flex items-center justify-center p-4" onClick={() => setIsPlaygroundOpen(false)}>
          <div className="w-full max-w-xl max-h-[90vh] rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Playground</h3>
                <p className="text-xs text-slate-500 font-medium">Test your chatbot using active source + saved customization.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsPlaygroundOpen(false)}
                className="h-9 w-9 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto max-h-[calc(90vh-74px)]">
              <div className="flex justify-center">
                <div className={clsx('rounded-2xl border overflow-hidden w-full h-[500px] flex flex-col', theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-slate-100 bg-white')}>
                <div
                  className="px-5 py-4 flex items-center justify-between text-white shrink-0"
                  style={{ backgroundColor: accent }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-sm overflow-hidden border border-white/20">
                      <img src="https://images.unsplash.com/photo-1550525811-e5869dd03032?auto=format&fit=crop&w=800&q=80" alt="" className="w-full h-full object-cover mix-blend-luminosity opacity-80" />
                    </div>
                    <div>
                      <div className="font-bold text-sm leading-none mb-1">Portexa AI</div>
                      <div className="text-[10px] font-medium text-white/80">Playground mode</div>
                    </div>
                  </div>
                  <div className="text-xs font-semibold text-white/80">{bubbleStyle} preview</div>
                </div>

                <div className={clsx('p-4 flex-1 min-h-0 overflow-y-auto space-y-3 overscroll-contain', theme === 'dark' ? 'bg-slate-900' : 'bg-slate-50')} ref={playgroundMessagesRef}>
                  {showWelcomeMessage && playgroundMessages.length === 0 && (
                    <div className="flex items-end gap-2">
                      <div className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center shrink-0">
                        <div className="w-3 h-3 bg-brand-500 rounded-full mix-blend-multiply opacity-50"></div>
                      </div>
                      <div className={clsx('max-w-[85%] rounded-2xl rounded-bl-sm px-3 py-2 text-sm font-medium leading-relaxed', theme === 'dark' ? 'bg-slate-800 text-slate-200' : 'bg-white border border-slate-200 text-slate-700')}>
                        Hello! I am your Intelligent Curator. Ask me anything about your saved portfolio data.
                      </div>
                    </div>
                  )}

                  {playgroundMessages.length === 0 ? (
                    <p className={clsx('text-sm font-medium', theme === 'dark' ? 'text-slate-300' : 'text-slate-500')}>
                      Try asking: "What are my top strengths based on my saved resume?"
                    </p>
                  ) : (
                    playgroundMessages.map((message) => (
                      <div key={message.id} className={clsx('max-w-[85%] rounded-2xl px-3 py-2 text-sm font-medium leading-relaxed', message.role === 'user' ? 'ml-auto text-white rounded-br-sm' : 'rounded-bl-sm', message.role === 'user' ? '' : (theme === 'dark' ? 'bg-slate-800 text-slate-200' : 'bg-white border border-slate-200 text-slate-700'))} style={message.role === 'user' ? { backgroundColor: accent } : undefined}>
                        {message.content}
                      </div>
                    ))
                  )}
                </div>

                <div className={clsx('p-3 border-t', theme === 'dark' ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-white')}>
                  <div className={clsx('flex items-center gap-2 rounded-full border px-3 py-2.5', theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200')}>
                    <input
                      value={playgroundInput}
                      onChange={(event) => setPlaygroundInput(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          event.preventDefault();
                          void sendPlaygroundPrompt();
                        }
                      }}
                      placeholder="Ask your chatbot..."
                      className={clsx('flex-1 bg-transparent outline-none text-sm font-medium', theme === 'dark' ? 'text-slate-100 placeholder:text-slate-400' : 'text-slate-700 placeholder:text-slate-400')}
                    />
                    <button
                      type="button"
                      onClick={() => void sendPlaygroundPrompt()}
                      disabled={isSendingPrompt}
                      className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-bold text-white disabled:opacity-60"
                      style={{ backgroundColor: accent }}
                    >
                      <Send className="w-4 h-4" />
                      {isSendingPrompt ? 'Sending...' : 'Send'}
                    </button>
                  </div>
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default SettingsPage;
