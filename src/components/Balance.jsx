import React, { useState, useEffect } from 'react';
import { useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";
import { BrowserProvider, formatEther } from "ethers";

function Balance() {
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState('');
  const { address, isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider("eip155");
  console.log(walletProvider);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        console.log(isConnected);
        if (!isConnected) {
        //   setError("Please connect your wallet");
          return;
        }

        const ethersProvider = new BrowserProvider(walletProvider);
        const signer = await ethersProvider.getSigner();
        const balance = await ethersProvider.getBalance(address);
        const ethBalance = formatEther(balance);
        setBalance(ethBalance);
      } catch (err) {
        // setError(err.message);
      }
    };

    fetchBalance();
  }, [isConnected,walletProvider]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

//   if (!isConnected) {
//     return <div>Please connect your wallet to view balance</div>;
//   }

  return (
    <div className="text-sm">
      Balance: {balance ? `${parseFloat(balance).toFixed(4)} MON` : 'Loading...'}
    </div>
  );
}

export default Balance; 