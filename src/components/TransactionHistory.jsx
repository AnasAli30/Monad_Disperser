import React from 'react';
import { X, ExternalLink, Clock, Hash, Users, Coins } from 'lucide-react';
import { motion } from 'framer-motion';

const TransactionHistory = ({ isOpen, onClose, transactions, darkMode }) => {
  if (!isOpen) return null;

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={`w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        <div className={`flex justify-between items-center p-4 border-b ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <h2 className={`text-xl font-bold ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}>Transaction History</h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${
              darkMode 
                ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="max-h-[70vh] overflow-y-auto p-4">
          {transactions.length === 0 ? (
            <div className={`text-center py-8 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              No transactions yet
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((tx, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`rounded-lg p-4 transition-all duration-200 ${
                    darkMode 
                      ? 'bg-gray-700 hover:bg-gray-600' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Hash size={16} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                        <span className={`text-sm font-medium ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>Transaction Hash</span>
                      </div>
                      <a 
                        href={`https://testnet.monadexplorer.com/tx/${tx.transactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center space-x-1 text-sm font-mono break-all ${
                          darkMode 
                            ? 'text-purple-400 hover:text-purple-300' 
                            : 'text-purple-600 hover:text-purple-700'
                        }`}
                      >
                        <span className="truncate">{tx.transactionHash}</span>
                        <ExternalLink size={14} />
                      </a>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Clock size={16} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                        <span className={`text-sm font-medium ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>Date & Time</span>
                      </div>
                      <span className={`text-sm ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {formatDate(tx.timestamp)}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Users size={16} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                        <span className={`text-sm font-medium ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>Recipients</span>
                      </div>
                      <span className={`text-sm ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {tx.recipients.length} addresses
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Coins size={16} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                        <span className={`text-sm font-medium ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>Total Value</span>
                      </div>
                      <span className={`text-sm font-semibold ${
                        darkMode ? 'text-purple-400' : 'text-purple-600'
                      }`}>
                        {tx.totalValue} MON
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default TransactionHistory; 