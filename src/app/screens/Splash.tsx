import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Shield } from 'lucide-react';

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
      if (hasSeenOnboarding) {
        navigate('/app');
      } else {
        navigate('/onboarding');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-primary-blue-dark to-primary-blue flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Animated background circles */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1.5, opacity: 0.06 }}
        transition={{ duration: 2, ease: 'easeOut' }}
        className="absolute w-80 h-80 rounded-full border border-white top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2"
      />
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 2, opacity: 0.04 }}
        transition={{ duration: 2.5, ease: 'easeOut', delay: 0.3 }}
        className="absolute w-80 h-80 rounded-full border border-white top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2"
      />

      {/* Dot grid */}
      <div className="absolute inset-0 opacity-[0.04]">
        <svg width="100%" height="100%">
          <pattern id="splashDots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="white" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#splashDots)" />
        </svg>
      </div>

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 200 }}
        className="bg-white rounded-3xl p-5 shadow-2xl shadow-black/20 mb-8"
      >
        <Shield className="w-14 h-14 text-primary-blue" strokeWidth={2} />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-3xl text-white mb-2 tracking-tight"
      >
        G Tech Auditor
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-blue-200/70 text-center text-sm"
      >
        Fast, reliable vehicle inspections
      </motion.p>

      {/* Loading indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="mt-12 flex gap-1.5"
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-white/40 rounded-full"
            animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </motion.div>
    </div>
  );
}
