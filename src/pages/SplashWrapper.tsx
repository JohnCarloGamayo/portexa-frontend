import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import LandingPage from './LandingPage';
import brandIcon from '../assets/icons-branding/portexa-icon-removebg.png';

const SplashWrapper = () => {
  const [showLanding, setShowLanding] = useState(false);

  useEffect(() => {
    // Shorter, centered splash: 2200ms
    const t = setTimeout(() => setShowLanding(true), 2200);
    return () => clearTimeout(t);
  }, []);

  if (showLanding) return <LandingPage />;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#fbfaff] to-white">
      <motion.div className="flex flex-col items-center gap-6">
        <motion.img
          src={brandIcon}
          alt="Portexa logo"
          className="w-48 h-48 md:w-56 md:h-56 object-contain drop-shadow-2xl"
          initial={{ scale: 0.86, opacity: 0 }}
          animate={{ scale: [0.86, 1.06, 1], opacity: [0, 1, 1] }}
          transition={{ duration: 1.2, times: [0, 0.6, 1], ease: [0.2, 0.9, 0.2, 1] }}
        />

        <motion.div
          className="text-5xl md:text-6xl font-extrabold text-[#9b83f2]"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          Portexa
        </motion.div>

        <motion.div
          className="text-sm text-slate-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.9, 0] }}
          transition={{ delay: 1.2, duration: 1 }}
        >
          AI Portfolio Assistant
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SplashWrapper;
