import { Send, Code, Palette, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import headerLogo from '../assets/icons-branding/Portexa-lightbg.png';
import footerLogo from '../assets/icons-branding/Portexa-darkbg.png';
import { motion, type Variants } from 'framer-motion';

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#FAFAFD] font-sans overflow-x-hidden text-slate-900 selection:bg-brand-100 selection:text-brand-900 scroll-smooth">
      {/* Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 inset-x-0 bg-white/80 backdrop-blur-md z-50 py-4 px-6 md:px-12 border-b border-slate-100 flex items-center justify-between"
      >
        <div className="flex items-center gap-12">
          <Link to="/" className="flex flex-col gap-0.5 hover:opacity-80 transition cursor-pointer">
            <div className="flex items-center gap-2">
               <img src={headerLogo} alt="Portexa" className="w-36 h-auto object-contain" />
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-500">
            <a href="#features" className="text-brand-600 border-b-2 border-brand-600 pb-1 -mb-[3px]">Features</a>
            <a href="#showcase" className="hover:text-slate-900 transition-colors">Showcase</a>
            <a href="#pricing" className="hover:text-slate-900 transition-colors">Pricing</a>
            <a href="#docs" className="hover:text-slate-900 transition-colors">Docs</a>
          </nav>
        </div>
        <div className="flex items-center gap-4 text-sm font-bold">
          <Link to="/login" className="text-brand-600 hover:text-brand-700 transition">Sign In</Link>
          <Link to="/signup" className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-full transition shadow-[0_4px_14px_0_rgba(99,102,241,0.39)]">Get Started</Link>
        </div>
      </motion.header>

      <main className="pt-32 pb-24">
        {/* Hero Section */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
          className="px-6 md:px-12 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16"
        >
          <div className="flex-1 space-y-8">
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-600 text-xs font-bold tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-brand-500"></span>
              POWERED BY RAG TECHNOLOGY
            </motion.div>
            
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.1] text-slate-900">
              Turn Your Portfolio <br /> into an <span className="text-brand-600">AI-Powered</span> <br /> Experience
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-slate-500 font-medium max-w-xl leading-relaxed">
              Don't just show your work. Let your visitors interview your professional experience through a Retrieval-Augmented Generation chatbot that knows every detail of your career.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
              <Link to="/signup" className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-4 rounded-xl font-bold transition shadow-[0_4px_14px_0_rgba(99,102,241,0.39)]">
                Get Started Free
              </Link>
              <button className="bg-white hover:bg-slate-50 text-slate-700 px-8 py-4 rounded-xl font-bold border border-slate-200 transition flex items-center gap-2 shadow-sm">
                <PlayCircle className="w-5 h-5 text-slate-400" />
                Live Demo
              </button>
            </motion.div>
          </div>
          
          <motion.div variants={fadeInUp} className="flex-1 w-full max-w-lg relative group">
            {/* Decorative blob behind hero card */}
            <div className="absolute -inset-4 bg-brand-400/20 rounded-[3rem] blur-3xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
            
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-brand-900/5 border border-slate-100 p-6 flex flex-col h-[500px] relative z-10">
              <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-brand-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                  JD
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">John Doe's Assistant</h3>
                  <p className="text-xs text-emerald-500 font-semibold flex items-center gap-1.5 mt-0.5 tracking-wide uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Online
                  </p>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto py-6 space-y-4 pr-2 scrollbar-hide">
                <div className="bg-[#FAFAFD] border border-slate-100 rounded-2xl rounded-tl-sm p-4 text-[13px] font-medium text-slate-700 max-w-[85%] leading-relaxed shadow-sm">
                  Hi! I'm John's AI assistant. Ask me anything about his experience with React, FinTech, or product design.
                </div>
                
                <div className="bg-brand-600 border border-brand-500 shadow-md text-white rounded-2xl rounded-tr-sm p-4 text-[13px] font-medium ml-auto max-w-[85%] leading-relaxed">
                  What projects has John led in the crypto space?
                </div>
                
                <div className="bg-[#FAFAFD] border border-slate-100 rounded-2xl rounded-tl-sm p-4 text-[13px] font-medium text-slate-700 max-w-[85%] leading-relaxed shadow-sm">
                  John led the "DeFi Flow" project (2022), where he increased user retention by 45% using a custom RAG architecture for analytics...
                </div>
                
                <div className="bg-brand-50 text-brand-600 font-semibold rounded-xl p-3 text-xs w-fit flex items-center gap-2 border border-brand-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-600 animate-pulse"></span>
                  Generating response...
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-100 relative">
                <input 
                  type="text" 
                  placeholder="Ask about expertise..." 
                  className="w-full bg-[#FAFAFD] border border-slate-100 rounded-xl py-3.5 pl-4 pr-12 text-sm font-medium outline-none focus:border-brand-300 focus:ring-4 focus:ring-brand-500/10 transition placeholder:text-slate-400"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-brand-600 rounded-lg flex items-center justify-center text-white hover:bg-brand-700 transition shadow-md">
                  <Send className="w-4 h-4 ml-[-2px] mt-[2px]" />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* Features Section */}
        <motion.section 
          id="features" 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
          className="px-6 md:px-12 max-w-7xl mx-auto mt-40"
        >
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Intelligence at Every Step</h2>
            <p className="text-slate-500 font-medium max-w-2xl mx-auto">Seamlessly integrate AI into your personal brand with tools designed for developers and creatives.</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Big Card */}
            <motion.div variants={fadeInUp} className="md:col-span-2 bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[360px] group">
              <div className="relative z-10 max-w-md">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner ring-1 ring-emerald-100 group-hover:scale-110 transition-transform duration-500">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">Resume to AI Brain</h3>
                <p className="text-slate-500 font-medium leading-relaxed">Upload your PDF or LinkedIn profile. Our RAG engine indexes your career accomplishments in seconds, ready for interaction.</p>
              </div>
              <div className="absolute -bottom-6 right-0 w-3/4 h-1/2 bg-gradient-to-t from-slate-100/50 to-transparent rounded-tl-[3rem] overflow-hidden group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-700">
                 <div className="w-full h-full bg-slate-800 shadow-2xl rounded-tl-[2rem] transform translate-x-8 translate-y-8 flex p-6 border border-slate-700">
                   <div className="w-full bg-white rounded-xl opacity-90 shadow-[0_-10px_40px_rgba(99,102,241,0.15)] flex flex-col gap-2 p-3">
                      <div className="w-1/2 h-2 bg-slate-200 rounded-full"></div>
                      <div className="w-3/4 h-2 bg-slate-100 rounded-full mb-2"></div>
                      <div className="w-full h-20 bg-brand-50 rounded-lg flex flex-col gap-1 p-2">
                        <div className="w-full h-1.5 bg-brand-200 rounded-full"></div>
                        <div className="w-4/5 h-1.5 bg-brand-200 rounded-full"></div>
                        <div className="w-3/4 h-1.5 bg-brand-200 rounded-full"></div>
                      </div>
                   </div>
                 </div>
              </div>
            </motion.div>
            
            {/* Right Card */}
            <motion.div variants={fadeInUp} className="bg-brand-600 rounded-[2.5rem] p-10 text-white relative overflow-hidden min-h-[360px] flex flex-col items-center justify-center text-center group">
              <div className="w-12 h-12 bg-white/10 text-white rounded-2xl flex items-center justify-center mb-6 shadow-inner ring-1 ring-white/20 group-hover:rotate-12 transition-transform duration-500">
                <Code className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-3 tracking-tight">Easy Embed</h3>
              <p className="text-white/80 font-medium mb-8 leading-relaxed text-sm">Copy one line of code to add your AI assistant to any portfolio site or personal blog.</p>
              <div className="bg-[#1e1e28] rounded-xl px-4 py-3 font-mono text-[11px] text-emerald-400 border border-white/10 shadow-xl group-hover:scale-105 transition-transform duration-500 w-full overflow-x-auto text-left shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
                <span className="text-rose-400">&lt;</span><span className="text-blue-400">script</span> <span className="text-amber-300">src</span><span className="text-white">=</span><span className="text-green-300">"https://portexa.ai/bot.js"</span> <span className="text-rose-400">/&gt;</span>
              </div>
            </motion.div>
            
            {/* Bottom Left Card */}
            <motion.div variants={fadeInUp} className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm group">
              <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mb-6 shadow-inner ring-1 ring-amber-100 group-hover:scale-110 transition-transform duration-500">
                <Palette className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 tracking-tight text-slate-900">UI Customization</h3>
              <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8">Match your bot to your brand. Tweak colors, fonts, and avatars in our live editor.</p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-600 ring-4 ring-brand-100 shadow-sm transition hover:scale-110 cursor-pointer"></div>
                <div className="w-8 h-8 rounded-full bg-emerald-500 hover:scale-110 cursor-pointer transition"></div>
                <div className="w-8 h-8 rounded-full bg-rose-500 hover:scale-110 cursor-pointer transition"></div>
                <div className="w-8 h-8 rounded-full bg-slate-800 hover:scale-110 cursor-pointer transition"></div>
              </div>
            </motion.div>
            
            {/* Bottom Right Card */}
            <motion.div variants={fadeInUp} className="md:col-span-2 bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between gap-8 group">
              <div className="max-w-xs">
                <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-6 shadow-inner ring-1 ring-blue-100 group-hover:scale-110 transition-transform duration-500">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
                </div>
                <h3 className="text-xl font-bold mb-3 tracking-tight text-slate-900">Developer API</h3>
                <p className="text-slate-500 font-medium text-sm leading-relaxed">Want to build something custom? Use our robust REST API to integrate your AI-brain into your own interfaces.</p>
              </div>
              
              <div className="bg-[#1e1e28] rounded-2xl p-6 border border-[#2e2e3a] shadow-inner font-mono text-[13px] flex-1 flex flex-col group-hover:shadow-[0_8px_30px_rgba(99,102,241,0.15)] transition-shadow duration-500">
                <div className="flex gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                </div>
                <div className="text-slate-400 leading-loose">
                  <div><span className="text-rose-400 font-bold">POST</span> <span className="text-blue-300">/v1/chat</span></div>
                  <div><span className="text-amber-300">Authorization</span>: <span className="text-green-300">Bearer sk_live_...</span></div>
                  <div className="mt-2 text-slate-300">{'{'}</div>
                  <div className="pl-4"><span className="text-blue-300">"message"</span>: <span className="text-green-300">"What are your core skills?"</span></div>
                  <div className="text-slate-300">{'}'}</div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Demo Section */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
          className="px-6 md:px-12 max-w-7xl mx-auto mt-40"
        >
           <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden flex flex-col md:flex-row group">
             <div className="flex-1 p-12 md:p-16 flex flex-col justify-center">
                 <h2 className="text-4xl font-bold text-slate-900 tracking-tight mb-4 group-hover:text-brand-600 transition-colors duration-500">See it in Action</h2>
                 <p className="text-slate-500 font-medium mb-10 text-lg">Interaction is the new resume. Try asking John's bot some questions about his technical background or leadership philosophy.</p>
                 
                 <div className="space-y-4">
                   <button className="w-full text-left bg-[#FAFAFD] hover:bg-brand-50 hover:text-brand-700 transition-all px-6 py-4 rounded-xl text-slate-700 font-bold text-sm border border-slate-100 hover:border-brand-200 hover:shadow-sm">
                     What are your top 3 projects?
                   </button>
                   <button className="w-full text-left bg-[#FAFAFD] hover:bg-brand-50 hover:text-brand-700 transition-all px-6 py-4 rounded-xl text-slate-700 font-bold text-sm border border-slate-100 hover:border-brand-200 hover:shadow-sm">
                     How do you handle difficult deadlines?
                   </button>
                   <button className="w-full text-left bg-[#FAFAFD] hover:bg-brand-50 hover:text-brand-700 transition-all px-6 py-4 rounded-xl text-slate-700 font-bold text-sm border border-slate-100 hover:border-brand-200 hover:shadow-sm">
                     Can you explain your management style?
                   </button>
                 </div>
             </div>
             
             {/* Visual Demo Side */}
             <div className="w-full md:w-[500px] bg-brand-600 p-8 md:p-12 border-l border-brand-500 relative flex items-center justify-center overflow-hidden">
                {/* Dotted overlay */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1.5px,transparent_1.5px)] [background-size:24px_24px]"></div>
                
                {/* Floating decor */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-5 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white opacity-5 rounded-full blur-2xl"></div>

                <div className="bg-white rounded-[2rem] shadow-2xl w-full h-full min-h-[500px] relative z-10 flex flex-col overflow-hidden border border-white/20 group-hover:scale-[1.02] transition-transform duration-700">
                   <div className="bg-slate-900 text-white p-5 flex justify-between items-center px-6">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-sm font-bold shadow-inner">JD</div>
                         <div>
                           <div className="font-bold text-[15px] leading-tight">JD Assistant</div>
                           <div className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase">Available</div>
                         </div>
                      </div>
                      <div className="flex gap-1.5 text-white/50">
                         <div className="w-1.5 h-1.5 bg-current rounded-full"></div>
                         <div className="w-1.5 h-1.5 bg-current rounded-full"></div>
                         <div className="w-1.5 h-1.5 bg-current rounded-full"></div>
                      </div>
                   </div>
                   
                   <div className="flex-1 bg-[#FAFAFD] p-6 space-y-5 overflow-y-auto scrollbar-hide">
                     <div className="bg-white border border-slate-100 shadow-sm rounded-2xl rounded-tl-sm p-4 text-[13px] font-medium text-slate-700 leading-relaxed">
                       Hi! I'm here to help you get to know John's career. What would you like to know?
                     </div>
                     <div className="bg-slate-900 shadow-md text-white rounded-2xl rounded-tr-sm p-4 text-[13px] font-medium ml-auto w-fit max-w-[85%] leading-relaxed">
                       What's John's management style?
                     </div>
                     <div className="bg-white border border-slate-100 shadow-sm rounded-2xl rounded-tl-sm p-4 text-[13px] font-medium text-slate-700 leading-relaxed">
                       John practices a servant-leadership model, focusing on empowering developers through autonomy and psychological safety.
                     </div>
                   </div>
                   
                   <div className="p-5 border-t border-slate-100 bg-white">
                     <div className="bg-slate-50 rounded-xl flex items-center px-4 py-3 text-sm border border-slate-200">
                       <span className="text-slate-400 font-medium flex-1">Ask a question...</span>
                       <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-md">
                         <Send className="w-3.5 h-3.5 ml-[-2px]" />
                       </div>
                     </div>
                   </div>
                </div>
             </div>
           </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-16 px-6 md:px-12 mt-20">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12">
            <div className="max-w-xs space-y-6">
              <div className="flex items-center gap-2">
                 <img src={footerLogo} alt="Portexa" className="w-20 h-auto object-contain" />
              </div>
              <p className="text-sm leading-relaxed font-medium">
                Transforming static professional profiles into dynamic, interactive AI experiences since 2024.
              </p>
              <div className="flex gap-3 pt-2">
                 <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center hover:bg-brand-600 hover:border-brand-500 hover:text-white transition-colors cursor-pointer text-slate-400 shadow-sm">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                 </div>
                 <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center hover:bg-brand-600 hover:border-brand-500 hover:text-white transition-colors cursor-pointer text-slate-400 shadow-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/></svg>
                 </div>
              </div>
            </div>
            
            <div className="flex gap-16 md:ml-auto md:mr-16">
              <div>
                <h4 className="text-white font-bold mb-6 tracking-widest text-[10px] uppercase">PRODUCT</h4>
                <ul className="space-y-4 text-sm font-medium">
                  <li><a href="#" className="hover:text-white transition">Features</a></li>
                  <li><a href="#" className="hover:text-white transition">Showcase</a></li>
                  <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                  <li><a href="#" className="hover:text-white transition">API Docs</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-6 tracking-widest text-[10px] uppercase">COMPANY</h4>
                <ul className="space-y-4 text-sm font-medium">
                  <li><a href="#" className="hover:text-white transition">About Us</a></li>
                  <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                  <li><a href="#" className="hover:text-white transition">Terms</a></li>
                  <li><a href="#" className="hover:text-white transition">Contact</a></li>
                </ul>
              </div>
            </div>
            
            <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/50 w-full md:max-w-[320px] shadow-sm">
               <h4 className="text-white font-bold mb-2">Stay Updated</h4>
               <p className="text-sm text-slate-400 mb-6 font-medium">Get the latest on AI branding and developer updates.</p>
               <div className="flex grid-cols-1 md:flex-row gap-2">
                 <input type="email" placeholder="Email address" className="flex-1 bg-slate-900 text-white rounded-xl px-4 py-3 text-sm font-medium outline-none border border-slate-700 focus:border-brand-500 transition placeholder:text-slate-500" />
                 <button className="bg-brand-600 hover:bg-brand-500 text-white px-5 py-3 rounded-xl text-sm font-bold transition shadow-md">Join</button>
               </div>
            </div>
         </div>
         <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-xs font-medium text-slate-500 gap-4">
           <p>© 2026 Portexa AI. All rights reserved.</p>
           <div className="flex gap-6">
             <a href="#" className="hover:text-slate-300 transition">Status</a>
             <a href="#" className="hover:text-slate-300 transition">Security</a>
             <a href="#" className="hover:text-slate-300 transition">Cookie Settings</a>
           </div>
         </div>
      </footer>
    </div>
  );
};

export default LandingPage;
