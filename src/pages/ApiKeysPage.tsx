import DashboardLayout from '../layouts/DashboardLayout';
import { KeyRound, Zap, FileText, ChevronRight, Copy, Terminal, History, MoreHorizontal } from 'lucide-react';

const ApiKeysPage = () => {
  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">API Credentials</h1>
          <p className="text-slate-500 font-medium">Manage your secure access tokens and monitor usage for the Portexa AI endpoints. Do not share your secret keys in public repositories.</p>
        </div>
        <button className="bg-brand-600 hover:bg-brand-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-[0_4px_14px_0_rgba(99,102,241,0.39)] transition flex items-center gap-2">
          <KeyRound className="w-5 h-5" /> Generate Secret Key
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
        
        {/* Left Column: API Keys list AND Quick Integration Guide */}
        <div className="space-y-8">
          
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-900">Active Keys</h2>
              <span className="bg-brand-50 text-brand-600 text-xs font-bold tracking-widest px-3 py-1 rounded-full uppercase flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse"></span> 3 Active Tokens
              </span>
            </div>

            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="py-4 px-8 text-xs font-bold tracking-widest text-slate-400 uppercase">Key Name</th>
                    <th className="py-4 px-8 text-xs font-bold tracking-widest text-slate-400 uppercase">Created</th>
                    <th className="py-4 px-8 text-xs font-bold tracking-widest text-slate-400 uppercase">Status</th>
                    <th className="py-4 px-8 text-xs font-bold tracking-widest text-slate-400 uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm">
                  <tr className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-5 px-8">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center">
                          <Zap className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">Production_Main</p>
                          <p className="text-slate-400 font-mono text-xs mt-1">sk_live_....a4f2</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-8 font-medium text-slate-500">Oct 12, 2023</td>
                    <td className="py-5 px-8">
                      <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold tracking-widest px-2.5 py-1 rounded uppercase">Active</span>
                    </td>
                    <td className="py-5 px-8 text-right">
                       <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-slate-400 hover:text-slate-600">
                         <MoreHorizontal className="w-5 h-5" />
                       </button>
                    </td>
                  </tr>
                  
                  <tr className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-5 px-8">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center">
                          <Terminal className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">Staging_Testing</p>
                          <p className="text-slate-400 font-mono text-xs mt-1">sk_test_....88c1</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-8 font-medium text-slate-500">Jan 04, 2024</td>
                    <td className="py-5 px-8">
                      <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold tracking-widest px-2.5 py-1 rounded uppercase">Active</span>
                    </td>
                    <td className="py-5 px-8 text-right">
                       <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-slate-400 hover:text-slate-600">
                         <MoreHorizontal className="w-5 h-5" />
                       </button>
                    </td>
                  </tr>
                  
                  <tr className="hover:bg-slate-50/50 transition-colors group bg-slate-50/30">
                    <td className="py-5 px-8">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                          <History className="w-5 h-5" />
                        </div>
                        <div className="opacity-50">
                          <p className="font-bold text-slate-500 line-through">Old_Integration</p>
                          <p className="text-slate-400 font-mono text-xs mt-1">sk_live_....f99j</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-8 font-medium text-slate-400">May 22, 2023</td>
                    <td className="py-5 px-8">
                      <span className="bg-slate-100 text-slate-400 text-[10px] font-bold tracking-widest px-2.5 py-1 rounded uppercase">Revoked</span>
                    </td>
                    <td className="py-5 px-8 text-right">
                       <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-slate-400 hover:text-slate-600">
                         <MoreHorizontal className="w-5 h-5" />
                       </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-4">
             <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
               <FileText className="w-4 h-4" />
             </div>
             <h2 className="text-xl font-bold text-slate-900 tracking-tight">Quick Integration Guide</h2>
             
             <div className="ml-auto bg-slate-100 border border-slate-200 rounded-lg p-1 flex font-semibold text-[11px] tracking-wide">
               <button className="px-4 py-1.5 rounded-md hover:bg-white hover:text-slate-900 hover:shadow-sm transition-all text-slate-500">cURL</button>
               <button className="px-4 py-1.5 rounded-md bg-white text-slate-900 shadow-sm transition-all">JavaScript</button>
               <button className="px-4 py-1.5 rounded-md hover:bg-white hover:text-slate-900 hover:shadow-sm transition-all text-slate-500">Python</button>
             </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
             {/* Text steps */}
             <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm flex flex-col h-full">
               <h3 className="text-lg font-bold text-slate-900 mb-6">Authentication</h3>
               <p className="text-sm text-slate-500 leading-relaxed font-medium mb-8">
                 To authenticate your requests, include your secret key in the <code className="text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded text-xs font-mono">Authorization</code> header. All API requests must be made over HTTPS. Calls made over plain HTTP will fail.
               </p>

               <div className="space-y-6 flex-1">
                 <div className="flex gap-4">
                   <div className="w-8 h-8 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-sm shrink-0 border border-brand-100">1</div>
                   <div>
                     <h4 className="font-bold text-slate-900 text-sm mb-1">Generate a Key</h4>
                     <p className="text-xs text-slate-500 leading-relaxed font-medium">Create a unique API key for your environment from the dashboard above.</p>
                   </div>
                 </div>
                 
                 <div className="flex gap-4">
                   <div className="w-8 h-8 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-sm shrink-0 border border-brand-100">2</div>
                   <div>
                     <h4 className="font-bold text-slate-900 text-sm mb-1">Set Headers</h4>
                     <p className="text-xs text-slate-500 leading-relaxed font-medium">Include <code className="bg-slate-100 px-1 rounded font-mono">x-api-key: [YOUR_KEY]</code> in your request headers.</p>
                   </div>
                 </div>

                 <div className="flex gap-4">
                   <div className="w-8 h-8 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-sm shrink-0 border border-brand-100">3</div>
                   <div>
                     <h4 className="font-bold text-slate-900 text-sm mb-1">Verify Connection</h4>
                     <p className="text-xs text-slate-500 leading-relaxed font-medium">Call the /health endpoint to verify your integration is successful.</p>
                   </div>
                 </div>
               </div>

               <button className="text-brand-600 font-bold text-sm hover:text-brand-700 transition flex items-center gap-1 mt-8 w-fit">
                 View Full API Reference <ChevronRight className="w-4 h-4 mt-0.5" />
               </button>
             </div>
             
             {/* Code block */}
             <div className="bg-[#1e1e28] rounded-[2rem] border border-[#2e2e3a] shadow-inner font-mono text-[13px] relative overflow-hidden group flex flex-col h-full ring-1 ring-white/5 mx-auto w-full">
               <div className="px-6 py-4 border-b border-[#2e2e3a] bg-[#1a1a24] flex justify-between items-center text-slate-400 text-xs shrink-0">
                 <div className="flex gap-2">
                   <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                   <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                   <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                 </div>
                 <div className="font-bold tracking-widest uppercase">FETCH_DATA.JS</div>
                 <button className="flex items-center gap-2 hover:text-white transition font-sans font-semibold border-l border-[#2e2e3a] pl-4">
                   <Copy className="w-3 h-3" /> Copy Code
                 </button>
               </div>
               
               <div className="p-6 flex-1 text-[#a6accd] leading-loose relative">
<pre><code><span className="text-[#89ddff]">const</span> <span className="text-[#82aaff]">portexa</span> <span className="text-[#89ddff]">=</span> <span className="text-[#82aaff]">require</span>(<span className="text-[#c3e88d]">'@portexa-ai/sdk'</span>);

<span className="text-[#89ddff]">const</span> client <span className="text-[#89ddff]">= new</span> <span className="text-[#82aaff]">portexa.Client</span>({'{'}
  apiKey: <span className="text-[#c3e88d]">'YOUR_SECRET_KEY'</span>,
  environment: <span className="text-[#c3e88d]">'production'</span>
{'}'});

<span className="text-[#676e95] italic">// Initialize intelligent crawl</span>
<span className="text-[#89ddff]">async function</span> <span className="text-[#82aaff]">startAnalysis</span>() {'{'}
  <span className="text-[#89ddff]">const</span> response <span className="text-[#89ddff]">= await</span> client.<span className="text-[#f07178]">portfolios</span>.<span className="text-[#82aaff]">create</span>({'{'}
    name: <span className="text-[#c3e88d]">'Design Trends 2026'</span>,
    source: <span className="text-[#c3e88d]">'https://example.com/gallery'</span>,
    deep_analysis: <span className="text-[#ff9cac]">true</span>
  {'}'});
  
  <span className="text-[#ffcb6b]">console</span>.<span className="text-[#82aaff]">log</span>(<span className="text-[#c3e88d]">'Analysis started:'</span>, response.id);
{'}'}

<span className="text-[#82aaff]">startAnalysis</span>();
</code></pre>
                 {/* Floating helper bubble */}
                 <div className="absolute right-4 top-1/2 w-10 h-10 rounded-full bg-brand-600 shadow-xl flex items-center justify-center text-white border-2 border-[#1e1e28] cursor-pointer hover:scale-110 transition border border-white/20">
                   <span className="font-bold text-lg font-sans">?</span>
                 </div>
               </div>
             </div>
          </div>
        </div>

        {/* Right Column: Mini Dashboard */}
        <div className="space-y-6">
          {/* Usage Card */}
          <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden group">
            <h3 className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-4">Usage this month</h3>
            <div className="flex items-end gap-3 mb-6 relative z-10">
              <span className="text-5xl font-bold tracking-tighter text-slate-900 leading-none">124.8k</span>
              <span className="text-xl font-bold text-slate-300 mb-1">/ 250k</span>
            </div>
            
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-4 relative z-10">
              <div className="h-full bg-brand-200 rounded-full w-[49.5%]"></div>
            </div>
            
            <p className="text-xs font-semibold text-slate-500 leading-relaxed relative z-10 max-w-[200px]">
              You have reached <span className="text-slate-700">49.5%</span> of your current plan limits.
            </p>
            
            {/* Background huge lightning icon */}
            <div className="absolute top-0 right-0 p-8 text-slate-50 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition duration-700">
               <Zap className="w-40 h-40 fill-slate-50" strokeWidth={1} />
            </div>
          </div>

          {/* Upgrade Card */}
          <div className="bg-slate-800 rounded-[2rem] p-8 border border-slate-700 shadow-xl text-white relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center mb-6 relative z-10 backdrop-blur-sm border border-white/10 group-hover:scale-110 transition-transform duration-500">
              <Zap className="w-6 h-6" />
            </div>
            
            <h3 className="text-xl font-bold mb-3 relative z-10">Upgrade to Pro</h3>
            <p className="text-slate-300 font-medium text-sm leading-relaxed max-w-xs mb-8 relative z-10">
              Unlock advanced analytics, dedicated support, and higher rate limits for scaling applications.
            </p>
            
            <button className="w-full bg-white hover:bg-slate-100 text-slate-900 font-bold py-3.5 rounded-xl transition relative z-10 text-sm">
              Compare Plans
            </button>
            
            {/* Abstract gradient bg */}
            <div className="absolute -bottom-[20%] -right-[20%] w-[150%] h-[150%] bg-gradient-to-t from-brand-600/30 to-transparent mix-blend-screen pointer-events-none transform -rotate-12"></div>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
};

export default ApiKeysPage;
