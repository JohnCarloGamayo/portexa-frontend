import DashboardLayout from '../layouts/DashboardLayout';
import { Calendar, ChevronDown, TrendingUp, TrendingDown, CheckCircle2, Eye, Filter, Download } from 'lucide-react';

const AnalyticsPage = () => {
  return (
    <DashboardLayout>
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-1.5">Analytics</h1>
          <p className="text-slate-500 font-medium">Monitor your AI assistant's performance and engagement.</p>
        </div>
        <button className="flex items-center gap-2 bg-white rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors">
          <Calendar className="w-4 h-4 text-slate-400" />
          Last 30 Days
          <ChevronDown className="w-4 h-4 text-slate-400 ml-1" />
        </button>
      </div>

      {/* Top Value Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* TOTAL QUERIES */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between group hover:border-brand-100 transition-colors">
          <div>
            <h3 className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">TOTAL QUERIES</h3>
            <p className="text-2xl font-bold tracking-tight text-slate-900 mt-2 mb-6">128.4k</p>
          </div>
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-1.5 text-emerald-500 font-bold text-xs bg-emerald-50 px-2 py-1 rounded">
               <TrendingUp className="w-3.5 h-3.5" strokeWidth={3} />
               12%
             </div>
             <svg width="48" height="16" viewBox="0 0 48 16" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M2 14C6.5 14 8.5 6 15 6C21.5 6 22 13 28 13C34 13 36 2 46 2" stroke="#8b5cf6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-40 group-hover:opacity-100 transition-opacity" />
             </svg>
          </div>
        </div>

        {/* UNIQUE VISITORS */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between group hover:border-brand-100 transition-colors">
          <div>
            <h3 className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">UNIQUE VISITORS</h3>
            <p className="text-2xl font-bold tracking-tight text-slate-900 mt-2 mb-6">42,891</p>
          </div>
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-1.5 text-emerald-500 font-bold text-xs bg-emerald-50 px-2 py-1 rounded">
               <TrendingUp className="w-3.5 h-3.5" strokeWidth={3} />
               8.4%
             </div>
             <svg width="48" height="16" viewBox="0 0 48 16" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M2 12C6.5 12 10 14 16 14C22 14 26 4 32 4C38 4 41.5 12 46 12" stroke="#8b5cf6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-40 group-hover:opacity-100 transition-opacity" />
             </svg>
          </div>
        </div>

        {/* AVG. CONVERSATION */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between group hover:border-brand-100 transition-colors">
          <div>
            <h3 className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">AVG. CONVERSATION</h3>
            <p className="text-2xl font-bold tracking-tight text-slate-900 mt-2 mb-6">4m 12s</p>
          </div>
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-1.5 text-rose-500 font-bold text-xs bg-rose-50 px-2 py-1 rounded">
               <TrendingDown className="w-3.5 h-3.5" strokeWidth={3} />
               2.1%
             </div>
             <svg width="48" height="16" viewBox="0 0 48 16" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M2 4C6.5 4 8.5 6 15 6C21.5 6 22 13 28 13C34 13 41.5 8 46 8" stroke="#f43f5e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-40 group-hover:opacity-100 transition-opacity" />
             </svg>
          </div>
        </div>

        {/* RESOLUTION RATE */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between group hover:border-brand-100 transition-colors">
          <div>
            <h3 className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">RESOLUTION RATE</h3>
            <p className="text-2xl font-bold tracking-tight text-slate-900 mt-2 mb-6">94.2%</p>
          </div>
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-1.5 text-emerald-500 font-bold text-xs bg-emerald-50 px-2 py-1 rounded tracking-wide">
               <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={3} />
               Target Reached
             </div>
             <svg width="48" height="16" viewBox="0 0 48 16" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M2 14L10 10L14 12L22 6L28 8L36 2L46 6" stroke="#e2e8f0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
             </svg>
          </div>
        </div>
      </div>

      {/* Middle Section (Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        
        {/* Engagement Trends Chart Area */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm col-span-1 lg:col-span-2 flex flex-col">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
             <div>
               <h3 className="text-lg font-bold text-slate-900 mb-1">Engagement Trends</h3>
               <p className="text-sm font-medium text-slate-500">Daily query volume vs User retention</p>
             </div>
             <div className="flex gap-4">
               <div className="flex items-center gap-2 text-sm font-bold text-slate-700 tracking-tight">
                 <span className="w-3 h-3 rounded-full bg-brand-500"></span>
                 Queries
               </div>
               <div className="flex items-center gap-2 text-sm font-bold text-slate-700 tracking-tight">
                 <span className="w-3 h-3 rounded-full bg-slate-200"></span>
                 Retention
               </div>
             </div>
          </div>

          <div className="flex-1 w-full bg-slate-50/30 rounded-2xl relative overflow-hidden min-h-[220px]">
             {/* Mocked Wave SVG Chart */}
             <svg className="absolute bottom-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 600 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Retention Background Area */}
                <path d="M0 160 C100 140 200 160 300 160 C400 160 500 140 600 150 L600 200 L0 200 Z" fill="#f1f5f9" />
                <path d="M0 160 C100 140 200 160 300 160 C400 160 500 140 600 150" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 4" fill="none" />
                
                {/* Queries Background Area w/ Gradient */}
                <defs>
                   <linearGradient id="waveGradient" x1="300" y1="50" x2="300" y2="200" gradientUnits="userSpaceOnUse">
                     <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.1" />
                     <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
                   </linearGradient>
                </defs>
                <path d="M0 130 C100 100 200 90 300 100 C400 110 450 60 500 100 C530 120 570 120 600 70 L600 200 L0 200 Z" fill="url(#waveGradient)" />
                
                {/* Queries Line */}
                <path d="M0 130 C100 100 200 90 300 100 C400 110 450 60 500 100 C530 120 570 120 600 70" stroke="#4f46e5" strokeWidth="2.5" strokeLinecap="round" fill="none" />
             </svg>
          </div>
        </div>

        {/* Sentiment Analysis Donut */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm flex flex-col items-center col-span-1">
          <h3 className="text-lg font-bold text-slate-900 self-start w-full mb-4">Sentiment Analysis</h3>
          
          <div className="w-52 h-52 relative flex items-center justify-center my-6 flex-shrink-0 mx-auto">
             <svg className="w-full h-full transform -rotate-90">
                <circle cx="104" cy="104" r="88" stroke="currentColor" strokeWidth="20" fill="transparent" className="text-brand-50" />
                <circle cx="104" cy="104" r="88" stroke="currentColor" strokeWidth="20" fill="transparent" strokeDasharray="552.9" strokeDashoffset="99.5" className="text-brand-700 rounded transition-all duration-1000 ease-out" strokeLinecap="round" />
                <circle cx="104" cy="104" r="88" stroke="currentColor" strokeWidth="20" fill="transparent" strokeDasharray="552.9" strokeDashoffset="450" className="text-brand-300 rounded transition-all duration-1000 ease-out origin-center -rotate-45" strokeLinecap="round" />
             </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-slate-900 tracking-tighter">82%</span>
                <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mt-1">Positive</span>
             </div>
          </div>

          <div className="w-full flex justify-between px-6 mt-auto shrink-0 border-t border-slate-100/60 pt-6">
             <div className="text-center">
               <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1">GROWTH</p>
               <p className="text-lg font-bold text-emerald-500 tracking-tight">+4.2%</p>
             </div>
             <div className="text-center">
               <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1">NEUTRAL</p>
               <p className="text-lg font-bold text-slate-700 tracking-tight">12%</p>
             </div>
          </div>
        </div>

      </div>

      {/* Bottom Section (Lists/Tables) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Top Queries */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm col-span-1">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900">Top Queries</h3>
            <button className="text-sm font-bold text-brand-600 hover:text-brand-700 transition">View all</button>
          </div>
          
          <div className="space-y-4">
            
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAFAFD] border border-slate-100/50 hover:bg-slate-50 hover:border-slate-200 transition-colors">
              <span className="text-[13px] font-bold text-slate-800 line-clamp-1 pr-3 tracking-tight">"How do I rebalance my portfolio?"</span>
              <div className="bg-white px-2 py-1.5 rounded-lg shadow-sm border border-slate-100 flex flex-col items-center min-w-[3rem] shrink-0">
                 <span className="text-[11px] font-bold text-slate-900 leading-none">1,240</span>
                 <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase mt-1">ask</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAFAFD] border border-slate-100/50 hover:bg-slate-50 hover:border-slate-200 transition-colors">
              <span className="text-[13px] font-bold text-slate-800 line-clamp-1 pr-3 tracking-tight">"Compare AAPL vs NVDA"</span>
              <div className="bg-white px-2 py-1.5 rounded-lg shadow-sm border border-slate-100 flex flex-col items-center min-w-[3rem] shrink-0">
                 <span className="text-[11px] font-bold text-slate-900 leading-none">982</span>
                 <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase mt-1">ask</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAFAFD] border border-slate-100/50 hover:bg-slate-50 hover:border-slate-200 transition-colors">
              <span className="text-[13px] font-bold text-slate-800 line-clamp-1 pr-3 tracking-tight leading-snug">"Tax implications of crypto sales"</span>
              <div className="bg-white px-2 py-1.5 rounded-lg shadow-sm border border-slate-100 flex flex-col items-center min-w-[3rem] shrink-0">
                 <span className="text-[11px] font-bold text-slate-900 leading-none">745</span>
                 <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase mt-1">ask</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAFAFD] border border-slate-100/50 hover:bg-slate-50 hover:border-slate-200 transition-colors">
              <span className="text-[13px] font-bold text-slate-800 line-clamp-1 pr-3 tracking-tight leading-snug">"Set up automatic dividend reinvest"</span>
              <div className="bg-white px-2 py-1.5 rounded-lg shadow-sm border border-slate-100 flex flex-col items-center min-w-[3rem] shrink-0">
                 <span className="text-[11px] font-bold text-slate-900 leading-none">621</span>
                 <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase mt-1">ask</span>
              </div>
            </div>

          </div>
        </div>

        {/* Interaction Log */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm col-span-1 lg:col-span-2 overflow-hidden flex flex-col">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-slate-900">Interaction Log</h3>
             <div className="flex gap-2">
               <button className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition"><Filter className="w-4 h-4" /></button>
               <button className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition"><Download className="w-4 h-4" /></button>
             </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[500px]">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="pb-4 pt-1 font-bold text-[10px] tracking-widest text-slate-400 uppercase w-[20%]">SESSION ID</th>
                  <th className="pb-4 pt-1 font-bold text-[10px] tracking-widest text-slate-400 uppercase w-[35%]">SUBJECT</th>
                  <th className="pb-4 pt-1 font-bold text-[10px] tracking-widest text-slate-400 uppercase w-[20%]">STATUS</th>
                  <th className="pb-4 pt-1 font-bold text-[10px] tracking-widest text-slate-400 uppercase w-[15%]">DURATION</th>
                  <th className="pb-4 pt-1 font-bold text-[10px] tracking-widest text-slate-400 uppercase w-[10%] text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                
                 <tr className="group hover:bg-slate-50/50 transition-colors">
                   <td className="py-5 text-[13px] font-bold text-slate-900 pr-4">#SES-9281</td>
                   <td className="py-5 text-[13px] font-semibold text-slate-600 pr-4">Portfolio Optimization</td>
                   <td className="py-5 pr-4">
                     <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50/80 rounded-full">
                       <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Positive
                     </span>
                   </td>
                   <td className="py-5 text-[13px] font-bold text-slate-500 tracking-tight pr-4">12m 40s</td>
                   <td className="py-5 text-right">
                     <button className="text-slate-300 hover:text-slate-600 transition-colors tooltip relative p-1.5">
                        <Eye className="w-5 h-5 pointer-events-none" />
                     </button>
                   </td>
                 </tr>

                 <tr className="group hover:bg-slate-50/50 transition-colors">
                   <td className="py-5 text-[13px] font-bold text-slate-900 pr-4">#SES-9275</td>
                   <td className="py-5 text-[13px] font-semibold text-slate-600 pr-4">Market Comparison</td>
                   <td className="py-5 pr-4">
                     <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50/80 rounded-full">
                       <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> Needs Review
                     </span>
                   </td>
                   <td className="py-5 text-[13px] font-bold text-slate-500 tracking-tight pr-4">3m 15s</td>
                   <td className="py-5 text-right">
                     <button className="text-slate-300 hover:text-slate-600 transition-colors tooltip relative p-1.5">
                        <Eye className="w-5 h-5 pointer-events-none" />
                     </button>
                   </td>
                 </tr>

                 <tr className="group hover:bg-slate-50/50 transition-colors">
                   <td className="py-5 text-[13px] font-bold text-slate-900 pr-4">#SES-9270</td>
                   <td className="py-5 text-[13px] font-semibold text-slate-600 pr-4">Tax Strategy Q3</td>
                   <td className="py-5 pr-4">
                     <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50/80 rounded-full">
                       <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Positive
                     </span>
                   </td>
                   <td className="py-5 text-[13px] font-bold text-slate-500 tracking-tight pr-4">8m 22s</td>
                   <td className="py-5 text-right">
                     <button className="text-slate-300 hover:text-slate-600 transition-colors tooltip relative p-1.5">
                        <Eye className="w-5 h-5 pointer-events-none" />
                     </button>
                   </td>
                 </tr>

              </tbody>
            </table>
          </div>
        </div>

      </div>

    </DashboardLayout>
  );
};

export default AnalyticsPage;