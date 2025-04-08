import { motion } from 'framer-motion';
import ParticleBackground from './ParticleBackground';

const LoadingScreen = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-900/30 via-gray-900/30 to-black/30 backdrop-blur-[2px]"
    >
      <ParticleBackground />
      
      <div className="text-center relative z-10">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.5,
            ease: "easeOut"
          }}
          className="mb-8"
        >
          <img 
            src="/monad.png" 
            alt="Monad Logo" 
            className="w-24 h-24 mx-auto"
          />
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            delay: 0.2,
            duration: 0.5,
            ease: "easeOut"
          }}
          className="text-2xl font-bold text-white mb-4"
        >
          Monad Disperser
        </motion.div>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{
            duration: 1.5,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="h-1 bg-indigo-500 rounded-full w-48 mx-auto"
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: 0.5,
            duration: 0.5
          }}
          className="mt-4 text-gray-400"
        >
          Loading...
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LoadingScreen; 