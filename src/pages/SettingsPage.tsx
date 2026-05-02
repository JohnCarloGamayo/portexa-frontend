import DashboardLayout from '../layouts/DashboardLayout';
import { Palette, Moon, Sun, Check, Copy } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

const SettingsPage = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [accent, setAccent] = useState('#4f46e5'); // brand-600
  const [bubbleStyle, setBubbleStyle] = useState('modern');

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Chatbot Customization</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_500px] gap-8 text-sans">
        
        {/* Left Column: Settings Form */}
        <div className="space-y-6">
          <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm flex flex-col h-full">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Visual Identity</h2>
            <p className="text-slate-500 font-medium mb-8 text-sm">Customize how the curator appears to your visitors.</p>

            <div className="space-y-8 flex-1">
              {/* Primary Accent */}
              <div>
                <h3 className="text-sm font-bold text-slate-700 mb-4">Primary Accent</h3>
                <div className="flex gap-4 items-center">
                   {[
                     { color: '#4f46e5', ring: 'ring-brand-500' },
                     { color: '#818cf8', ring: 'ring-brand-400' },
                     { color: '#0f172a', ring: 'ring-slate-900' },
                     { color: '#e11d48', ring: 'ring-rose-600' },
                     { color: '#10b981', ring: 'ring-emerald-500' }
                   ].map(a => (
                     <button
                       key={a.color}
                       onClick={() => setAccent(a.color)}
                       className={clsx(
                         "w-10 h-10 rounded-full transition-transform hover:scale-110",
                         accent === a.color && `ring-2 ${a.ring} ring-offset-2 scale-110`
                       )}
                       style={{ backgroundColor: a.color }}
                     />
                   ))}
                   <button className="w-10 h-10 rounded-full border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-colors ml-2">
                      <Palette className="w-4 h-4" />
                   </button>
                </div>
              </div>

              {/* Interface Mode */}
              <div>
                <h3 className="text-sm font-bold text-slate-700 mb-4">Interface Mode</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setTheme('light')}
                    className={clsx(
                      "flex items-center gap-3 px-6 py-4 rounded-xl border text-sm font-bold transition-colors w-full",
                      theme === 'light' 
                        ? "border-brand-600 text-brand-600 bg-brand-50" 
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    <Sun className="w-5 h-5" />
                    Light
                    <div className={clsx(
                      "ml-auto w-4 h-4 rounded-full border-2",
                      theme === 'light' ? "border-brand-600 bg-brand-600 shadow-[inset_0_0_0_2px_#e0e7ff]" : "border-slate-300 pointer-events-none"
                    )}></div>
                  </button>
                  <button 
                    onClick={() => setTheme('dark')}
                    className={clsx(
                      "flex items-center gap-3 px-6 py-4 rounded-xl border text-sm font-bold transition-colors w-full",
                      theme === 'dark' 
                        ? "border-brand-600 text-brand-600 bg-brand-50" 
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    <Moon className="w-5 h-5" />
                    Dark
                    <div className={clsx(
                      "ml-auto w-4 h-4 rounded-full border-2",
                      theme === 'dark' ? "border-brand-600 bg-brand-600 shadow-[inset_0_0_0_2px_#e0e7ff]" : "border-slate-300 pointer-events-none"
                    )}></div>
                  </button>
                </div>
              </div>

              {/* Bubble Style */}
              <div>
                <h3 className="text-sm font-bold text-slate-700 mb-4">Bubble Style</h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => setBubbleStyle('modern')}
                    className={clsx(
                      "flex items-center justify-between w-full px-6 py-4 rounded-xl border text-sm font-bold transition-colors",
                      bubbleStyle === 'modern' ? "bg-slate-50 border-brand-500 shadow-sm" : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={clsx("w-8 h-8 rounded-lg flex items-center justify-center", bubbleStyle === 'modern' ? "bg-brand-100 text-brand-600" : "bg-slate-100 text-slate-400")}>
                        <div className="w-4 h-3 bg-current rounded shadow-sm relative after:absolute after:bottom-0 after:-left-1 after:w-2 after:h-2 after:bg-current after:rounded-full"></div>
                      </div>
                      <span className={bubbleStyle === 'modern' ? "text-slate-900" : "text-slate-600"}>Modern Floating</span>
                    </div>
                    {bubbleStyle === 'modern' && <div className="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center"><Check className="w-3.5 h-3.5" /></div>}
                  </button>

                  <button 
                    onClick={() => setBubbleStyle('compact')}
                    className={clsx(
                      "flex items-center justify-between w-full px-6 py-4 rounded-xl border text-sm font-bold transition-colors",
                      bubbleStyle === 'compact' ? "bg-slate-50 border-brand-500 shadow-sm" : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={clsx("w-8 h-8 rounded-full flex items-center justify-center", bubbleStyle === 'compact' ? "bg-brand-100 text-brand-600" : "bg-slate-100 text-slate-400")}>
                        <div className="w-4 h-4 bg-current rounded-full relative"></div>
                      </div>
                      <span className={bubbleStyle === 'compact' ? "text-slate-900" : "text-slate-600"}>Compact Circular</span>
                    </div>
                    {bubbleStyle === 'compact' && <div className="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center"><Check className="w-3.5 h-3.5" /></div>}
                  </button>

                  <button 
                    onClick={() => setBubbleStyle('editorial')}
                    className={clsx(
                      "flex items-center justify-between w-full px-6 py-4 rounded-xl border text-sm font-bold transition-colors",
                      bubbleStyle === 'editorial' ? "bg-slate-50 border-brand-500 shadow-sm" : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={clsx("w-8 h-8 rounded-full border-2 flex items-center justify-center", bubbleStyle === 'editorial' ? "border-brand-600 text-brand-600" : "border-slate-300 text-slate-400")}>
                        <div className="w-3 h-2 bg-current rounded-full relative"></div>
                      </div>
                      <span className={bubbleStyle === 'editorial' ? "text-slate-900" : "text-slate-600"}>Editorial Pill</span>
                    </div>
                    {bubbleStyle === 'editorial' && <div className="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center"><Check className="w-3.5 h-3.5" /></div>}
                  </button>
                </div>
              </div>
            </div>
            
          </div>
        </div>

        {/* Right Column: Live Preview */}
        <div className="space-y-6">
          <div className="bg-white rounded-[2rem] p-4 border border-slate-100 shadow-sm h-full flex flex-col pt-0 sticky top-24 overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-100 rounded-t-[1.5rem] p-4 flex items-center gap-4 -mx-4 -mt-px relative z-10 shrink-0">
               <div className="flex gap-1.5 ml-2">
                 <div className="w-2.5 h-2.5 rounded-full bg-rose-400"></div>
                 <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                 <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
               </div>
               <div className="flex-1 text-center text-[10px] font-bold tracking-widest text-slate-400 uppercase mr-12">
                 Live Preview
               </div>
               {/* Browser mock controls */}
               <div className="absolute right-4 flex gap-2">
                 <div className="w-3 h-3 rounded-sm bg-slate-200"></div>
                 <div className="w-2 h-3 rounded-sm bg-slate-200"></div>
               </div>
            </div>

            {/* Simulated website background */}
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

               {/* Floating Chatbot Preview */}
               <div className={clsx(
                 "absolute transition-all duration-500",
                 bubbleStyle === 'modern' ? "bottom-6 right-6" : "bottom-8 right-8"
               )}>
                 {/* Chat content box */}
                 <div className={clsx(
                    "bg-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1),0_0_20px_0_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col mb-4 overflow-hidden outline outline-1 outline-transparent transition-all",
                    theme === 'dark' ? "bg-slate-900 border-slate-800 text-slate-100 placeholder:text-slate-400" : "",
                    bubbleStyle === 'modern' ? "rounded-2xl w-80 h-96" : bubbleStyle === 'compact' ? "rounded-3xl w-72 h-[340px]" : "rounded-[2rem] w-80 h-[400px] border-2"
                 )}>
                   {/* Chat Header */}
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
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Typically replies instantly
                          </div>
                        </div>
                      </div>
                      <button className="text-white/80 hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                      </button>
                   </div>

                   {/* Chat Messages */}
                   <div className={clsx(
                     "flex-1 p-5 overflow-y-auto space-y-4",
                     theme === 'dark' ? "bg-slate-900" : "bg-slate-50"
                   )}>
                      <div className="flex items-end gap-2">
                        <div className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center shrink-0">
                          <div className="w-3 h-3 bg-brand-500 rounded-full mix-blend-multiply opacity-50"></div>
                        </div>
                        <div className={clsx(
                          "p-3 rounded-2xl rounded-bl-sm text-[13px] font-medium leading-relaxed max-w-[85%]",
                          theme === 'dark' ? "bg-slate-800 text-slate-200" : "bg-white text-slate-600 shadow-sm shadow-slate-200/50 border border-slate-100"
                        )}>
                          Hello! I'm your Intelligent Curator. How can I assist with your portfolio today?
                        </div>
                      </div>

                      <div className="flex items-end justify-end gap-2">
                        <div 
                          className="p-3 rounded-2xl rounded-br-sm text-[13px] font-medium leading-relaxed max-w-[85%] text-white shadow-sm"
                          style={{ backgroundColor: accent }}
                        >
                          I want to see my latest gallery analytics.
                        </div>
                      </div>
                   </div>

                   {/* Chat Input */}
                   <div className={clsx(
                     "p-3 border-t shrink-0 bg-white",
                     theme === 'dark' ? "border-slate-800 bg-slate-900" : "border-slate-100"
                   )}>
                      <div className={clsx(
                        "flex items-center px-4 py-2.5 rounded-full border focus-within:ring-2 focus-within:ring-opacity-20 transition-all",
                        theme === 'dark' ? "bg-slate-800 border-slate-700 focus-within:border-slate-600" : "bg-slate-50 border-slate-200 focus-within:border-brand-500"
                      )} style={theme === 'light' ? { '--tw-ring-color': accent } as import('react').CSSProperties : {}}>
                         <input 
                           type="text" 
                           placeholder="Ask anything..." 
                           className="w-full bg-transparent outline-none text-sm font-medium placeholder:text-slate-400"
                           disabled
                         />
                         <button style={{ color: accent }} className="ml-2 w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors">
                           <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                         </button>
                      </div>
                   </div>
                 </div>

                 {/* Floating Bubble Trigger */}
                 <div className="flex justify-end">
                   <div 
                     className={clsx(
                       "w-14 h-14 rounded-full shadow-[0_10px_20px_-5px_rgba(0,0,0,0.2)] flex items-center justify-center text-white cursor-pointer hover:scale-105 transition-transform",
                       bubbleStyle === 'editorial' ? "rounded-none rounded-br-[2rem] rounded-tl-[2rem]" : ""
                     )}
                     style={{ backgroundColor: accent }}
                   >
                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                   </div>
                 </div>
               </div>
            </div>
            
          </div>
        </div>

        {/* Deploy Script Section (Full Width Bottom) */}
        <div className="lg:col-span-2">
          <div className="bg-slate-900 rounded-[2rem] p-8 md:p-10 border border-slate-800 shadow-xl overflow-hidden relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 relative z-10">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight mb-2">Deploy Portexa</h2>
                <p className="text-slate-400 text-sm font-medium">Copy and paste this snippet into your website's <code className="text-rose-400 bg-slate-800 px-1 rounded mx-1">&lt;head&gt;</code> tag.</p>
              </div>
              <div className="flex items-center bg-slate-800 p-1.5 rounded-xl border border-slate-700/50 relative z-10">
                <button className="px-4 py-2 rounded-lg text-sm font-bold transition-all bg-brand-600 text-white shadow-sm">Bottom Right</button>
                <button className="px-4 py-2 rounded-lg text-sm font-bold text-slate-400 hover:text-white transition-all">Bottom Left</button>
              </div>
            </div>

            <div className="relative group z-10">
              <pre className="bg-[#0f172a] rounded-[1.5rem] p-8 text-sm font-mono overflow-x-auto border border-slate-800/80 shadow-inner">
                <code className="text-slate-300 block leading-relaxed">
<span className="text-slate-500 italic">&lt;!-- Portexa AI Widget --&gt;</span>
<span className="text-emerald-400">&lt;script src="https://cdn.portexa.ai/widget.v1.js"&gt;&lt;/script&gt;</span>
<span className="text-rose-400">&lt;script&gt;</span>
  Portexa.<span className="text-emerald-300">init</span>({'{'}
    id: <span className="text-amber-300">"ca_771x_9920"</span>,
    theme: <span className="text-amber-300">"{theme}"</span>,
    primaryColor: <span className="text-amber-300">"{accent}"</span>,
    position: <span className="text-amber-300">"bottom-right"</span>
  {'}'});
<span className="text-rose-400">&lt;/script&gt;</span>
                </code>
              </pre>
              <button className="absolute top-4 right-4 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-widest px-4 py-2 rounded-lg transition opacity-0 group-hover:opacity-100 flex items-center gap-2 border border-slate-700">
                <Copy className="w-4 h-4" /> Copy Snippet
              </button>
            </div>

            <div className="mt-8 flex items-center gap-8 relative z-10 px-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-10 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600 transition-colors"></div>
                </div>
                <span className="text-sm font-bold text-white group-hover:text-slate-200 transition-colors">Enable on Mobile</span>
              </label>

              <label className="flex items-center gap-3 cursor-not-allowed opacity-50">
                <div className="relative">
                  <input type="checkbox" className="sr-only peer" disabled />
                  <div className="w-10 h-6 bg-slate-800 rounded-full peer after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-500 after:rounded-full after:h-5 after:w-5"></div>
                </div>
                <span className="text-sm font-bold text-slate-400">Show Welcome Message</span>
              </label>
            </div>
            
            {/* Background glowing effects for the dark pre block */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
