import React, { useState, useEffect } from 'react';
import { useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";
import { BrowserProvider, formatEther } from "ethers";
import Balance from './Balance';

function TotalValue({ parsedData = [], darkMode = false }) {
  const [totalValue, setTotalValue] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);
  const [remainingBalance, setRemainingBalance] = useState(0);
  const [error, setError] = useState('');
  const { address, isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider("eip155");

  // Fetch wallet balance
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        if (!isConnected) {
          return;
        }

        const ethersProvider = new BrowserProvider(walletProvider);
        const balance = await ethersProvider.getBalance(address);
        const ethBalance = parseFloat(formatEther(balance));
        setWalletBalance(ethBalance);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchBalance();
  }, [isConnected, walletProvider, address]);

  // Calculate total value from parsedData
  useEffect(() => {
    let total = 0;
    
    parsedData.forEach(item => {
      const amount = parseFloat(item.value);
      if (!isNaN(amount)) {
        total += amount;
      }
    });
    
    setTotalValue(total);
  }, [parsedData]);

  // Calculate remaining balance whenever wallet balance or total value changes
  useEffect(() => {
    setRemainingBalance(walletBalance - totalValue);
  }, [walletBalance, totalValue]);

  return (
    <div className={`p-4 border rounded-lg shadow-sm ${
      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <h2 className={`text-xl font-bold mb-4 ${
        darkMode ? 'text-white' : 'text-gray-800'
      }`}>Value Summary</h2>
      
      {error && <div className="text-red-500 mb-4">{error}</div>}
      
      <div className="grid grid-cols-1 gap-4">
        <div className={`p-3 rounded ${
          darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800'
        }`}>
          <span className="font-medium">Total Value: </span>
          <span className={darkMode ? 'text-purple-400' : 'text-purple-600'}>
            {totalValue.toFixed(4)} MON
          </span>
        </div>
        
        <div className={`p-3 rounded ${
          darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800'
        }`}>
          <span className="font-medium">Wallet Balance: </span>
          <Balance />
        </div>
        
        <div className={`p-3 rounded ${
          darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800'
        }`}>
          <span className="font-medium">Remaining Balance: </span>
          <span className={darkMode ? 'text-purple-400' : 'text-purple-600'}>
            {remainingBalance.toFixed(4)} MON
          </span>
        </div>
      </div>
    </div>
  );
}

export default TotalValue; 