import React from 'react';
import { Github, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = ({ darkMode }) => {
  return (
    <motion.footer 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`w-full py-3 px-4 sm:px-6 border-t ${
        darkMode 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      } shadow-lg transition-colors duration-300 mt-auto`}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
        <motion.div 
          className="flex items-center space-x-2 px-2 sm:px-4"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className={`text-sm ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Made with
          </span>
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <Heart className="w-4 h-4 text-red-500 fill-current" />
          </motion.div>
          <span className={`text-sm ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            by Anas
          </span>
        </motion.div>
        
        <motion.div 
          className="flex items-center space-x-4 px-2 sm:px-4"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <a
            href="https://github.com/yourusername/monad-disperser"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center space-x-2 text-sm transition-colors duration-300 ${
              darkMode 
                ? 'text-gray-300 hover:text-white' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Github size={18} />
            <span>View on GitHub</span>
          </a>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer; 