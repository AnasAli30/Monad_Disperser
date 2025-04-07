import React, { useState, useCallback } from 'react';
import { Send, Loader2, AlertCircle, CheckCircle2, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Transition } from '@headlessui/react';
import { useAppKitAccount } from "@reown/appkit/react";
// import {  useConnect, useDisconnect } from '@reown/appkit/react';

function ConnectButton() {
  return <appkit-button />;
}

function App() {
  const [input, setInput] = useState('');
  const [parsedData, setParsedData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  const { address, isConnected } = useAppKitAccount();
//   const { connect } = useConnect();
//   const { disconnect } = useDisconnect();

  const parseAddressValues = useCallback((text) => {
    setError('');
    const lines = text.split('\n').filter(line => line.trim());
    const parsed = [];

    for (const line of lines) {
      let address, value;

      if (line.includes(',')) {
        [address, value] = line.split(',');
      } else if (line.includes(':')) {
        [address, value] = line.split(':');
      } else if (line.includes(' ')) {
        [address, value] = line.split(/\s+/);
      } else {
        setError('Invalid format. Please use address,value or address:value or address value');
        continue;
      }

      if (!address?.trim() || !value?.trim()) {
        setError('Each line must contain both address and value');
        continue;
      }

      // Basic Ethereum address validation
      if (!/^0x[a-fA-F0-9]{40}$/.test(address.trim())) {
        setError('Invalid Ethereum address format detected');
        continue;
      }

      parsed.push({
        address: address.trim(),
        value: value.trim()
      });
    }

    setParsedData(parsed);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccess(false);

    try {
      // Simulate contract interaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Sending to contract:', parsedData);
      setSuccess(true);
    } catch (err) {
      setError('Failed to send transaction');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-purple-50 to-blue-50'
      }`}
    >
      {/* Navigation Bar */}
      <motion.nav 
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className={`${
          darkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-lg transition-colors duration-300`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center"
            >
              <span className={`text-2xl font-bold ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}>
                Monad
              </span>
            </motion.div>
            <div className="flex items-center space-x-4">
              <Menu as="div" className="relative">
                <Menu.Button
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    darkMode 
                      ? 'hover:bg-gray-700 text-gray-300' 
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  <ConnectButton />
                </Menu.Button>
              </Menu>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  darkMode 
                    ? 'hover:bg-gray-700 text-gray-300' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                {darkMode ? <Sun size={24} /> : <Moon size={24} />}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-2xl mx-auto p-6"
      >
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className={`rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:shadow-2xl ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <h1 className={`text-3xl font-bold mb-2 ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}>
            Monad Token Disperser
          </h1>
          <p className={`mb-6 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Enter addresses and values in any of these formats:
            <br />
            <code className={`${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
              address value
              <br />
              address,value
              <br />
              address:value
            </code>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <textarea
                className={`w-full h-64 p-4 rounded-lg font-mono text-sm transition-all duration-200 ${
                  darkMode 
                    ? 'bg-gray-700 text-gray-100 border-gray-600 focus:border-purple-500' 
                    : 'bg-white text-gray-800 border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                } border`}
                placeholder="0x1234...5678 100&#13;&#10;0x8765...4321,50&#13;&#10;0xabcd...efgh:75"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  parseAddressValues(e.target.value);
                }}
              />
            </div>

            {error && (
              <div className={`flex items-center space-x-2 p-3 rounded-lg animate-fade-in ${
                darkMode ? 'bg-red-900/50 text-red-300' : 'bg-red-50 text-red-500'
              }`}>
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className={`flex items-center space-x-2 p-3 rounded-lg animate-fade-in ${
                darkMode ? 'bg-green-900/50 text-green-300' : 'bg-green-50 text-green-500'
              }`}>
                <CheckCircle2 size={20} />
                <span>Transaction sent successfully!</span>
              </div>
            )}

            <div className="flex justify-between items-center">
              <div className={`text-sm ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {parsedData.length} valid entries found
              </div>
              <button
                type="submit"
                disabled={isLoading || parsedData.length === 0}
                className={`
                  flex items-center space-x-2 px-6 py-3 rounded-lg
                  ${isLoading || parsedData.length === 0
                    ? 'bg-gray-200 dark:bg-gray-700 cursor-not-allowed'
                    : 'bg-purple-600 hover:bg-purple-700 transform hover:scale-105'
                  }
                  text-white font-medium transition-all duration-200
                `}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <Send size={20} />
                )}
                <span>{isLoading ? 'Processing...' : 'Send Tokens'}</span>
              </button>
            </div>
          </form>

          {parsedData.length > 0 && (
            <div className="mt-8 space-y-2">
              <h2 className={`text-xl font-semibold mb-4 ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}>Parsed Data</h2>
              <div className="max-h-64 overflow-y-auto">
                {parsedData.map((item, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg flex justify-between items-center animate-fade-in ${
                      darkMode ? 'bg-gray-700' : 'bg-gray-50'
                    }`}
                  >
                    <div className={`font-mono text-sm truncate ${
                      darkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {item.address}
                    </div>
                    <div className={`font-mono text-sm ${
                      darkMode ? 'text-purple-400' : 'text-purple-600'
                    }`}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default App; 