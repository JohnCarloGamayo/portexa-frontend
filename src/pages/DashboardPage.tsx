import DashboardLayout from '../layouts/DashboardLayout';
import { CheckCircle2, Zap, ArrowUpRight, UploadCloud, Settings2, MoreHorizontal, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Status Card */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
               <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-xs font-bold tracking-widest leading-none">
              ACTIVE
            </div>
          </div>
          <div>
            <h3 className="text-slate-500 font-semibold text-sm mb-2">Bot Status</h3>
            <p className="text-3xl font-bold text-slate-900 tracking-tight">Healthy</p>
            <p className="text-slate-400 text-xs mt-3 font-medium">Last ping: 2 mins ago</p>
          </div>
        </div>

        {/* Queries Card */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
               <Zap className="w-6 h-6" />
            </div>
            <div className="text-brand-600 bg-brand-50 px-3 py-1 rounded-full text-xs font-bold tracking-widest leading-none">
              +12%
            </div>
          </div>
          <div>
            <h3 className="text-slate-500 font-semibold text-sm mb-2">Total Queries</h3>
            <p className="text-3xl font-bold text-slate-900 tracking-tight">12,482</p>
            <p className="text-slate-400 text-xs mt-3 font-medium">Total user interactions this month</p>
          </div>
        </div>

        {/* Integration Card */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
            <div className="text-slate-500 bg-slate-100 px-3 py-1 rounded-full text-xs font-bold tracking-widest leading-none">
              4 NODES
            </div>
          </div>
          <div>
            <h3 className="text-slate-500 font-semibold text-sm mb-2">Integration Health</h3>
            <p className="text-3xl font-bold text-slate-900 tracking-tight">100%</p>
            <p className="text-slate-400 text-xs mt-3 font-medium">API, LinkedIn, GitHub, Notion</p>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Quick Actions */}
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 mb-6">Quick Actions</h2>
          <div className="space-y-6">
             {/* Upload Resume Card */}
             <div className="bg-brand-600 rounded-[2rem] p-10 text-white relative overflow-hidden shadow-xl shadow-brand-900/10">
               <div className="relative z-10 w-full h-full">
                 <div className="flex flex-col h-full">
                   <h3 className="text-2xl font-bold mb-4 tracking-tight">Upload Resume</h3>
                   <p className="text-brand-100 font-medium mb-8 leading-relaxed max-w-sm flex-1">
                     Update your bot's knowledge base with your latest achievements and projects.
                   </p>
                   <button
                     onClick={() => navigate('/portfolios')}
                     className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-6 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2 border border-white/10 w-fit"
                   >
                     Select File <ArrowUpRight className="w-4 h-4" />
                   </button>
                 </div>
               </div>
               <div className="absolute right-0 bottom-0 opacity-10 translate-x-1/4 translate-y-1/4 pointer-events-none">
                 <UploadCloud className="w-64 h-64" />
               </div>
             </div>
             
             {/* Customize Bot Card */}
             <div className="bg-white rounded-[2rem] p-10 border border-slate-100 shadow-sm flex flex-col justify-between items-start hover:border-brand-200 transition-colors">
               <div className="flex items-center gap-4 mb-6">
                 <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
                    <Settings2 className="w-6 h-6" />
                 </div>
                 <h3 className="text-xl font-bold tracking-tight text-slate-900">Customize Bot</h3>
               </div>
               <p className="text-slate-500 font-medium leading-relaxed mb-8 max-w-sm">
                 Adjust tone, persona, and response complexity for different visitors.
               </p>
               <button className="text-brand-600 font-bold hover:text-brand-700 transition-colors">
                 Open Designer
               </button>
             </div>
          </div>
        </div>

        {/* Right Column: Recent Activity */}
        <div>
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 h-full min-h-[500px]">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold tracking-tight text-slate-900">Recent Activity</h2>
              <button className="text-brand-600 text-sm font-bold hover:text-brand-700 transition">View All</button>
            </div>
            
            <div className="space-y-6">
              {/* Item 1 */}
              <div className="flex items-start gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm flex items-center justify-center font-bold text-slate-400">
                    <User className="w-6 h-6" />
                  </div>
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 absolute -bottom-0.5 -right-0.5 border-2 border-white"></div>
                </div>
                <div className="flex-1 border-b border-slate-100 pb-6">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-sm font-semibold text-slate-900">
                      Alex Rivera <span className="text-slate-400 font-medium ml-1">asked about React</span>
                    </p>
                    <span className="text-xs text-slate-400 font-medium">14m ago</span>
                  </div>
                  <p className="text-sm font-medium text-slate-500 italic">"What is your experience with Tailwind and..."</p>
                </div>
              </div>
              
              {/* Item 2 */}
              <div className="flex items-start gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm flex items-center justify-center font-bold text-slate-400">
                    <User className="w-6 h-6" />
                  </div>
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-300 absolute -bottom-0.5 -right-0.5 border-2 border-white"></div>
                </div>
                <div className="flex-1 border-b border-slate-100 pb-6">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-sm font-semibold text-slate-900">
                      Sarah Chen <span className="text-slate-400 font-medium ml-1">requested resume</span>
                    </p>
                    <span className="text-xs text-slate-400 font-medium">2h ago</span>
                  </div>
                  <p className="text-sm font-medium text-slate-500">Portexa AI successfully sent <span className="text-brand-600 font-semibold bg-brand-50 px-2 py-0.5 rounded">Resume_2024.pdf</span></p>
                </div>
              </div>
              
              {/* Item 3 */}
              <div className="flex items-start gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm flex items-center justify-center font-bold text-slate-400">
                    <User className="w-6 h-6" />
                  </div>
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 absolute -bottom-0.5 -right-0.5 border-2 border-white"></div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-sm font-semibold text-slate-900">
                      Marcus Thorne <span className="text-slate-400 font-medium ml-1">interview request</span>
                    </p>
                    <span className="text-xs text-slate-400 font-medium">5h ago</span>
                  </div>
                  <p className="text-sm font-medium text-slate-500">Scheduled screening call for next Tuesday at ...</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-center">
               <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition border border-transparent hover:border-slate-100">
                 <MoreHorizontal className="w-5 h-5" />
               </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
