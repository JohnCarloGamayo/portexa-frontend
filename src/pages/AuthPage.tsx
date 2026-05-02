import { Link, useNavigate } from 'react-router-dom';
import { Eye, Star, X, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

declare global {
  interface Window {
    google: any;
  }
}

const AuthPage = ({ type }: { type: 'login' | 'signup' }) => {
  const isLogin = type === 'login';
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Notification State
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  
  // Google Sign-In ref
  const googleButtonRef = useRef<HTMLDivElement>(null);

  // Auto-hide notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Initialize Google Sign-In
  useEffect(() => {
    if (window.google && googleButtonRef.current) {
      try {
        window.google.accounts.id.initialize({
          client_id: '408337215026-nt58vces6paf5q85rg2q77frt0b0vmun.apps.googleusercontent.com',
          callback: handleGoogleSuccess,
        });
        
        window.google.accounts.id.renderButton(googleButtonRef.current, {
          type: 'standard',
          size: 'large',
          text: isLogin ? 'signin' : 'signup',
          theme: 'outline',
        });
      } catch (error) {
        console.log('Google Sign-In not fully configured yet');
      }
    }
  }, [isLogin]);

  const handleGoogleSuccess = async (response: any) => {
    setIsLoading(true);
    setNotification(null);

    try {
      // Send token to backend for verification
      const backendResponse = await fetch('http://127.0.0.1:8000/api/v1/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: response.credential }),
      });

      const data = await backendResponse.json();

      if (!backendResponse.ok) {
        throw new Error(data.detail || 'Google authentication failed');
      }

      // Save token and redirect
      localStorage.setItem('token', data.access_token);
      localStorage.removeItem('portexa_rag_index');
      setNotification({ message: 'Google Sign-In successful! Redirecting...', type: 'success' });
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err: any) {
      setNotification({ message: err.message, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setNotification(null);

    const endpoint = isLogin ? '/api/v1/auth/login' : '/api/v1/auth/signup';
    const payload = isLogin ? { email, password } : { email, password, full_name: fullName };

    try {
      const response = await fetch(`http://127.0.0.1:8000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Something went wrong');
      }

      if (isLogin) {
        localStorage.setItem('token', data.access_token);
        localStorage.removeItem('portexa_rag_index');
        setNotification({ message: 'Login successful! Redirecting...', type: 'success' });
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        setNotification({ message: 'Account created successfully! Please sign in.', type: 'success' });
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err: any) {
      setNotification({ message: err.message, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex p-4 md:p-6 font-sans relative overflow-hidden">
      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed bottom-8 right-8 z-50 flex items-center gap-3 bg-white p-4 rounded-2xl shadow-2xl border border-slate-100 min-w-[320px] max-w-md"
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              notification.type === 'success' ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'
            }`}>
              {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-slate-900">
                {notification.type === 'success' ? 'Success' : 'Authentication Error'}
              </h4>
              <p className="text-xs font-medium text-slate-500">{notification.message}</p>
            </div>
            <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-slate-600 transition">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 w-full max-w-7xl mx-auto bg-white rounded-[2rem] shadow-xl overflow-hidden flex flex-col lg:flex-row shadow-brand-900/5 border border-slate-100">

        {/* Left Panel - Branding */}
        <div className="hidden lg:flex flex-col justify-between w-1/2 bg-brand-700 text-white p-12 lg:p-20 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">     
             <h1 className="text-[12rem] font-bold leading-none tracking-tighter text-center" style={{ writingMode: 'vertical-rl' }}>
               PORTEXA
             </h1>
          </div>

          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-2 mb-16 hover:opacity-80 transition">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 12h14M12 5l7 7-7 7"/></svg>
              </div>
              <span className="text-xl font-bold tracking-tight">Portexa</span>
            </Link>

            <h2 className="text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-8">
              {isLogin ? (
                <>Crafting digital<br/>order from creative<br/>chaos.</>
              ) : (
                <>Build your<br/>interactive<br/>legacy.</>
              )}
            </h2>

            <p className="text-lg lg:text-xl text-brand-100 font-medium leading-relaxed max-w-md">
              {isLogin ? "The ultimate intelligent workspace for modern curators, designers, and thinkers to organize their world." : "Join the next generation of digital portfolios with an AI that knows your career inside and out."}
            </p>
          </div>

          <div className="relative z-10 mt-24 bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/10">
            {isLogin ? (
              <>
                <p className="text-lg font-medium leading-relaxed italic mb-6">
                  "Portexa has completely transformed how I present my work. It's the editorial bridge between a static resume and a live interview."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/20"></div>
                  <div>
                    <div className="font-semibold text-base">Nova Grace Palmes</div>
                    <div className="text-brand-200 text-sm">Lead Product Designer</div>
                  </div>
                </div>
              </>
            ) : (
               <>
                 <div className="flex gap-1 mb-6">
                   <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                   <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                   <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                   <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                   <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                 </div>
                 <p className="text-2xl font-bold leading-tight mb-6">
                   "Portexa didn't just organize our assets; it transformed how we perceive our entire digital library."
                 </p>
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-full bg-white/20"></div>
                   <div>
                     <div className="font-semibold text-base">Nova Grace Palmes</div>
                     <div className="text-brand-200 text-sm">Creative Director</div>
                   </div>
                 </div>
               </>
            )}
          </div>

          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-50 -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-900 rounded-full mix-blend-multiply filter blur-[128px] opacity-50 translate-y-1/4 -translate-x-1/4"></div>
        </div>

        {/* Right Panel - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 bg-white relative">        
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">
              {isLogin ? 'Welcome back' : 'Create your account'}
            </h2>
            <p className="text-sm font-medium text-slate-500 mb-10">
              {isLogin ? 'Sign in to your intelligent workspace.' : 'Join the next generation of digital asset management.'}
            </p>

            <div className="space-y-4 mb-8">
              <div ref={googleButtonRef} className="flex justify-center"></div>

              <button type="button" className="w-full flex items-center justify-center gap-3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium py-3.5 rounded-xl border border-slate-100 transition">
                <svg className="w-5 h-5 text-slate-700" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/></svg>     
                {isLogin ? 'Sign in with GitHub' : 'Continue with GitHub'}
              </button>
            </div>

            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
              <div className="relative flex justify-center text-xs font-semibold uppercase tracking-wider">     
                <span className="bg-white px-4 text-slate-400">OR CONTINUE WITH {isLogin ? '' : 'EMAIL'}</span> 
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Alex Rivera"
                    className="w-full bg-slate-50 border border-slate-50 focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10 rounded-xl py-3.5 px-4 text-sm font-medium outline-none transition placeholder:text-slate-400"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  {isLogin ? 'Email Address' : 'Email address'}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-slate-50 border border-slate-50 focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10 rounded-xl py-3.5 px-4 text-sm font-medium outline-none transition placeholder:text-slate-400"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-slate-700">Password</label>
                  {isLogin && <a href="#" className="text-xs font-semibold text-brand-600 hover:text-brand-700">Forgot password?</a>}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-50 focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10 rounded-xl py-3.5 px-4 pr-12 text-sm font-medium outline-none transition placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
                {!isLogin && <p className="text-[10px] text-slate-400 mt-2 font-medium">Minimum 8 characters with at least one symbol.</p>}
              </div>

              {!isLogin && (
                <div className="flex items-center gap-3 pt-2">
                  <input type="checkbox" required id="terms" className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300" />
                  <label htmlFor="terms" className="text-sm font-medium text-slate-600">
                    I agree to the <a href="#" className="text-brand-600 font-semibold hover:underline">Terms of Service</a> and <a href="#" className="text-brand-600 font-semibold hover:underline">Privacy Policy</a>.       
                  </label>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-4 rounded-xl shadow-[0_4px_14px_0_rgba(99,102,241,0.39)] transition mt-4 text-sm flex items-center justify-center gap-2"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <div className="mt-8 text-center text-sm font-medium text-slate-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <Link to={isLogin ? '/signup' : '/login'} className="text-brand-600 font-bold hover:underline">   
                {isLogin ? 'Sign up' : 'Sign in'}
              </Link>
            </div>

            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-6 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              <a href="#" className="hover:text-slate-600 transition">Privacy Policy</a>
              <span>•</span>
              <a href="#" className="hover:text-slate-600 transition">Terms of Service</a>
              <span>•</span>
              <a href="#" className="hover:text-slate-600 transition">Status</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default AuthPage;

