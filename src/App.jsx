import React, { useState, useCallback, useEffect } from 'react';
import { Send, Loader2, AlertCircle, CheckCircle2, Moon, Sun, Grid as Bridge, Repeat, ExternalLink, Upload, History } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Transition } from '@headlessui/react';
import { useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";
import { BrowserProvider, formatEther } from "ethers";
import TotalValue from './components/TotalValue';
import { dispere } from './context/despere';
import { deployContract } from './context/deploy';
import TransactionHistory from './components/TransactionHistory';
import Footer from './components/Footer';
import ParticleBackground from './components/ParticleBackground';
import LoadingScreen from './components/LoadingScreen';
// import {  useConnect, useDisconnect } from '@reown/appkit/react';

function ConnectButton() {
  return <appkit-button />;
}

function App() {
  const [input, setInput] = useState('');
  const [parsedData, setParsedData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeploying, setIsDeploying] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [totalValue, setTotalValue] = useState(0);
  const [remainingBalance, setRemainingBalance] = useState(0);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [sameValueMode, setSameValueMode] = useState(false);
  const [sameValue, setSameValue] = useState('');
  const [transactionHash, setTransactionHash] = useState('');
  const [contractAddress, setContractAddress] = useState('');
  const [isContractDeployed, setIsContractDeployed] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : [];
  });
  
  const { address, isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider("eip155");
//   const { connect } = useConnect();
//   const { disconnect } = useDisconnect();

  // Check for saved contract on component mount
  useEffect(() => {
    const savedContract = localStorage.getItem('disperserContract');
    if (savedContract) {
      setContractAddress(savedContract);
      setIsContractDeployed(true);
    }
  }, []);

  // Fetch wallet balance
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        if (!isConnected || !walletProvider) {
          setCurrentBalance(0);
          return;
        }

        const ethersProvider = new BrowserProvider(walletProvider);
        const balance = await ethersProvider.getBalance(address);
        const monBalance = parseFloat(formatEther(balance));
        setCurrentBalance(monBalance);
      } catch (err) {
        console.error('Error fetching balance:', err);
        setError('Failed to fetch wallet balance');
        setCurrentBalance(0);
      }
    };

    fetchBalance();
  }, [isConnected, walletProvider, address]);

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const parseAddressValues = useCallback((text) => {
    setError('');
    const lines = text.split('\n').filter(line => line.trim());
    const parsed = [];
    let total = 0;

    if (sameValueMode) {
      // In same value mode, each line is just an address
      for (const line of lines) {
        const address = line.trim();
        
        if (!address) {
          continue;
        }

        // Basic Ethereum address validation
        if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
          setError('Invalid Ethereum address format detected');
          continue;
        }

        const numericValue = parseFloat(sameValue);
        if (isNaN(numericValue) || numericValue <= 0) {
          setError('Invalid numeric value. Value must be greater than 0');
          continue;
        }

        total += numericValue;
        parsed.push({
          address: address,
          value: sameValue
        });
      }
    } else {
      // Original parsing logic for different values
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

        const numericValue = parseFloat(value.trim());
        if (isNaN(numericValue) || numericValue <= 0) {
          setError('Invalid numeric value. Value must be greater than 0');
          continue;
        }

        total += numericValue;
        parsed.push({
          address: address.trim(),
          value: value.trim()
        });
      }
    }

    setTotalValue(total);
    const remaining = currentBalance - total;
    setRemainingBalance(remaining);
    
    if (remaining < 0) {
      setError(`Insufficient balance. You need ${Math.abs(remaining)} more MON to complete this transaction.`);
    }
    
    setParsedData(parsed);
  }, [currentBalance, sameValueMode, sameValue]);

  // Add a useEffect to watch for changes to sameValue
  useEffect(() => {
    if (sameValueMode && input.trim()) {
      parseAddressValues(input);
    }
  }, [sameValue, sameValueMode, input, parseAddressValues]);

  const handleDeployContract = async () => {
    setIsDeploying(true);
    setError('');
    setSuccess(false);
    setContractAddress('');
    setIsContractDeployed(false);

    try {
      if (!isConnected) {
        throw new Error("Please connect your wallet first");
      }

      // Deploy the contract
      const result = await deployContract(walletProvider);
      
      if (result.success) {
        setContractAddress(result.contractAddress);
        setIsContractDeployed(true);
        setSuccess(true);
        
        // Save contract address to local storage
        localStorage.setItem('disperserContract', result.contractAddress);
      } else {
        // Check if this was a user rejection
        if (result.userRejected) {
          setError(result.error);
          // Don't show this as a critical error, just inform the user
        } else {
          setError(result.error || 'Failed to deploy contract');
        }
      }
    } catch (err) {
      console.error('Error in handleDeployContract:', err);
      setError(err.message || 'Failed to deploy contract');
    } finally {
      setIsDeploying(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccess(false);
    setError('');
    setTransactionHash('');

    try {
      if (!isConnected) {
        throw new Error("Please connect your wallet first");
      }
console.log(isContractDeployed,contractAddress)
      if (!isContractDeployed || !contractAddress) {
        throw new Error("Please deploy the contract first");
      }

      // Extract addresses and values from parsedData
      const addresses = parsedData.map(item => item.address);
      const values = parsedData.map(item => item.value);

      // Call the dispere function with walletProvider and contractAddress
      const result = await dispere(contractAddress, addresses, values, walletProvider);
      
      if (result.success) {
        setSuccess(true);
        setTransactionHash(result.transactionHash);
        
        // Remove contract from local storage after successful disperse
        localStorage.removeItem('disperserContract');
        setContractAddress('');
        setIsContractDeployed(false);

        // After successful transaction, add to history
        const newTransaction = {
          contractAddress,
          transactionHash: result.transactionHash,
          totalValue,
          recipients: parsedData.map(item => ({
            address: item.address,
            value: item.value
          })),
          timestamp: new Date().toISOString()
        };
        
        setTransactions(prev => [newTransaction, ...prev]);
      } else {
        // Check if this was a user rejection
        if (result.userRejected) {
          setError(result.error);
          // Don't show this as a critical error, just inform the user
        } else {
          setError(result.error || 'Failed to send transaction');
        }
      }
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      setError(err.message || 'Failed to send transaction');
    } finally {
      setIsLoading(false);
    }
  };

  // Check for first visit and handle loading screen
  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedBefore');
    
    if (!hasVisited) {
      // First visit - show loading screen for 2 seconds
      const timer = setTimeout(() => {
        setIsLoading(false);
        localStorage.setItem('hasVisitedBefore', 'true');
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      // Not first visit - hide loading screen immediately
      setIsLoading(false);
    }
  }, []);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <LoadingScreen />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <ParticleBackground darkMode={darkMode} />
            
            {/* Navigation Bar */}
            <motion.nav 
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className={`${
                darkMode ? 'bg-gray-800/30' : 'bg-white/30'
              } shadow-lg transition-colors duration-300 relative z-10 backdrop-blur-[2px]`}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                  <div className="flex items-center">
                    <motion.h1 
                      className={`text-xl font-bold ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      } relative`}
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <span className="relative z-10">disperse</span>
                      {/* <motion.span 
                        className="absolute inset-0 blur-sm opacity-70"
                        animate={{ 
                          opacity: [0.5, 0.8, 0.5],
                          scale: [1, 1.05, 1]
                        }}
                        transition={{ 
                          duration: 3,
                          repeat: Infinity,
                          repeatType: "reverse"
                        }}
                      >
                        Monad Disperser
                      </motion.span> */}
                    </motion.h1>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setIsHistoryOpen(true)}
                      className={`p-2 rounded-full transition-colors ${
                        darkMode 
                          ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                      }`}
                      title="Transaction History"
                    >
                      <History size={20} />
                    </button>
                    <motion.button
                      onClick={() => setDarkMode(!darkMode)}
                      className={`p-2 rounded-full transition-colors ${
                        darkMode 
                          ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </motion.button>
                    <ConnectButton />
                  </div>
                </div>
              </div>
            </motion.nav>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8 relative z-0">
              <motion.div 
                whileHover={{ scale: 1 }}
                className={`rounded-2xl shadow-xl p-4 sm:p-8 transform transition-all duration-300 hover:shadow-2xl backdrop-blur-[2px] ${
                  darkMode 
                    ? 'bg-gray-800/30' 
                    : 'bg-white/30'
                }`}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2">
                  <h1 className={`text-2xl sm:text-3xl font-bold ${
                    darkMode ? 'text-white' : 'text-gray-800'
                  }`}>
                    Monad Disperser
                  </h1>
                  <button
                    onClick={() => setSameValueMode(!sameValueMode)}
                    className={`flex items-center space-x-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-all duration-200 text-sm sm:text-base ${
                      sameValueMode
                        ? 'bg-purple-600 text-white'
                        : darkMode
                          ? 'hover:bg-gray-700 text-gray-300'
                          : 'hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    <Repeat size={16} className="sm:hidden" />
                    <Repeat size={20} className="hidden sm:block" />
                    <span>Same Value Mode</span>
                  </button>
                </div>

                <p className={`mb-4 sm:mb-6 text-sm sm:text-base ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {sameValueMode ? (
                    <>
                      Enter addresses (one per line) and specify a single value to send to all addresses:
                      <br />
                      <code className={`${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                        0x1234...5678
                        <br />
                        0x8765...4321
                        <br />
                        0xabcd...efgh
                      </code>
                    </>
                  ) : (
                    <>
                      Enter addresses and values in any of these formats:
                      <br />
                      <code className={`${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                        address value
                        <br />
                        address,value
                        <br />
                        address:value
                      </code>
                    </>
                  )}
                </p>

                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                  {sameValueMode && (
                    <div className="mb-3 sm:mb-4">
                      <input
                        type="number"
                        value={sameValue}
                        onChange={(e) => setSameValue(e.target.value)}
                        placeholder="Enter value to send to all addresses"
                        className={`w-full p-3 sm:p-4 rounded-lg font-mono text-xs sm:text-sm transition-all duration-200 ${
                          darkMode 
                            ? 'bg-gray-700 text-gray-100 border-gray-600 focus:border-purple-500' 
                            : 'bg-white text-gray-800 border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                        } border`}
                      />
                    </div>
                  )}

                  <div className="relative">
                    <textarea
                      className={`w-full h-48 sm:h-64 p-3 sm:p-4 rounded-lg font-mono text-xs sm:text-sm transition-all duration-200 ${
                        darkMode 
                          ? 'bg-gray-700 text-gray-100 border-gray-600 focus:border-purple-500' 
                          : 'bg-white text-gray-800 border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                      } border`}
                      placeholder={sameValueMode 
                        ? "0x1234...5678\n0x8765...4321\n0xabcd...efgh"
                        : "0x1234...5678 100\n0x8765...4321,50\n0xabcd...efgh:75"
                      }
                      value={input}
                      onChange={(e) => {
                        const newInput = e.target.value;
                        setInput(newInput);
                        // Always parse when input changes
                        parseAddressValues(newInput);
                      }}
                    />
                  </div>

                  {error && (
                    <div className={`flex items-center space-x-2 p-2 sm:p-3 rounded-lg animate-fade-in text-xs sm:text-sm ${
                      darkMode ? 'bg-red-900/50 text-red-300' : 'bg-red-50 text-red-500'
                    }`}>
                      <AlertCircle size={16} className="sm:hidden" />
                      <AlertCircle size={20} className="hidden sm:block" />
                      <span>{error}</span>
                    </div>
                  )}

                  {success && (
                    <div className={`flex flex-col space-y-2 p-2 sm:p-3 rounded-lg animate-fade-in text-xs sm:text-sm ${
                      darkMode ? 'bg-green-900/50 text-green-300' : 'bg-green-50 text-green-500'
                    }`}>
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 size={16} className="sm:hidden" />
                        <CheckCircle2 size={20} className="hidden sm:block" />
                        <span>{isContractDeployed ? "Contract deployed successfully!" : "Transaction sent successfully!"}</span>
                      </div>
                      {contractAddress && (
                        <div className="flex items-center space-x-2">
                          <span>Contract Address:</span>
                          <a 
                            href={`https://testnet.monadexplorer.com/address/${contractAddress}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 underline hover:text-purple-400"
                          >
                            <span className="truncate max-w-[150px] sm:max-w-[200px]">{contractAddress}</span>
                            <ExternalLink size={12} className="sm:hidden" />
                            <ExternalLink size={14} className="hidden sm:block" />
                          </a>
                        </div>
                      )}
                      {transactionHash && (
                        <div className="flex items-center space-x-2">
                          <span>Transaction Hash:</span>
                          <a 
                            href={`https://testnet.monadexplorer.com/tx/${transactionHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 underline hover:text-purple-400"
                          >
                            <span className="truncate max-w-[150px] sm:max-w-[200px]">{transactionHash}</span>
                            <ExternalLink size={12} className="sm:hidden" />
                            <ExternalLink size={14} className="hidden sm:block" />
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <div className={`text-xs sm:text-sm ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {parsedData.length} valid entries found
                    </div>
                  </div>

                  {parsedData.length > 0 && (
                    <div className="mt-4 sm:mt-8 space-y-2">
                      <h2 className={`text-lg sm:text-xl font-semibold mb-2 sm:mb-4 ${
                        darkMode ? 'text-white' : 'text-gray-800'
                      }`}>Parsed Data</h2>
                      <div className="max-h-48 sm:max-h-64 overflow-y-auto">
                        {parsedData.map((item, index) => (
                          <div
                            key={index}
                            className={`p-2 sm:p-3 rounded-lg flex justify-between items-center animate-fade-in ${
                              darkMode ? 'bg-gray-700' : 'bg-gray-50'
                            }`}
                          >
                            <div className={`font-mono text-xs sm:text-sm truncate max-w-[40%] sm:max-w-[50%] ${
                              darkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                              {item.address}
                            </div>
                            <div className={`font-mono text-xs sm:text-sm ${
                              darkMode ? 'text-purple-400' : 'text-purple-600'
                            }`}>
                              {item.value}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Total Value Component */}
                  <div className="mt-4 sm:mt-8">
                   {isConnected && <TotalValue parsedData={parsedData} darkMode={darkMode} />}
                  </div>

                  {/* Deploy Contract Button */}
                  <div className="mt-4 sm:mt-8 flex justify-end">
                    <button
                      type="button"
                      onClick={handleDeployContract}
                      disabled={isDeploying || !isConnected || isContractDeployed}
                      className={`
                        flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base
                        ${isDeploying || !isConnected || isContractDeployed
                          ? 'bg-gray-200 dark:bg-gray-700 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700 transform hover:scale-105'
                        }
                        text-white font-medium transition-all duration-200
                      `}
                    >
                      {isDeploying ? (
                        <>
                          <Loader2 className="animate-spin sm:hidden" size={16} />
                          <Loader2 className="animate-spin hidden sm:block" size={20} />
                        </>
                      ) : (
                        <>
                          <Upload size={16} className="sm:hidden" />
                          <Upload size={20} className="hidden sm:block" />
                        </>
                      )}
                      <span>{isContractDeployed ? 'Contract Deployed' : 'Deploy Contract'}</span>
                    </button>
                  </div>

                  {/* Send Button moved to the end */}
                  <div className="mt-4 sm:mt-8 flex justify-end">
                    <button
                      type="submit"
                      disabled={isLoading || parsedData.length === 0 || remainingBalance < 0 || !isContractDeployed}
                      className={`
                        flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base
                        ${isLoading || parsedData.length === 0 || remainingBalance < 0 || !isContractDeployed
                          ? 'bg-gray-200 dark:bg-gray-700 cursor-not-allowed'
                          : 'bg-purple-600 hover:bg-purple-700 transform hover:scale-105'
                        }
                        text-white font-medium transition-all duration-200
                      `}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="animate-spin sm:hidden" size={16} />
                          <Loader2 className="animate-spin hidden sm:block" size={20} />
                        </>
                      ) : (
                        <>
                          <Send size={16} className="sm:hidden" />
                          <Send size={20} className="hidden sm:block" />
                        </>
                      )}
                      <span>Disperse</span>
                    </button>
                  </div>

                  {remainingBalance < 0 && (
                    <div className={`mt-2 sm:mt-4 flex items-center space-x-2 p-2 sm:p-3 rounded-lg animate-fade-in text-xs sm:text-sm ${
                      darkMode ? 'bg-red-900/50 text-red-300' : 'bg-red-50 text-red-500'
                    }`}>
                      <AlertCircle size={16} className="sm:hidden" />
                      <AlertCircle size={20} className="hidden sm:block" />
                      <span>Insufficient balance. You need {Math.abs(remainingBalance)} more MON to complete this transaction.</span>
                    </div>
                  )}
                </form>
              </motion.div>
            </main>

            <TransactionHistory
              isOpen={isHistoryOpen}
              onClose={() => setIsHistoryOpen(false)}
              transactions={transactions}
              darkMode={darkMode}
            />

            <Footer darkMode={darkMode} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;