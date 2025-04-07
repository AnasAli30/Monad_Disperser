import { useAppKitProvider, useAppKitAccount } from "@reown/appkit/react";
import { BrowserProvider, Contract, formatUnits, parseEther } from "ethers";
import abi from "../constant/abi.json";



/**
 * Function to disperse funds to multiple addresses
 * @param {string[]} addresses - Array of recipient addresses
 * @param {string[]} values - Array of values to send to each address
 * @returns {Promise<Object>} - Transaction result
 */
export async function dispere(contractAddress, addresses, values, walletProvider) {
  const ethersProvider = new BrowserProvider(walletProvider);
  const signer = await ethersProvider.getSigner();
  const contract = new Contract(contractAddress, abi, signer);

  try {
  
    const formattedValues = values.map(value => {

      return parseEther(String(value)) 
    });

    // Calculate the total value to send with the transaction
    const totalValue = formattedValues.reduce((sum, value) => sum + value, BigInt(0));
    
    console.log("Addresses:", addresses);
    console.log("Formatted Values:", formattedValues);
    console.log("Total Value:", totalValue.toString());
    
    // Call the contract's disperse function with the total value
    const tx = await contract.disperseMon(addresses, formattedValues, { value: totalValue });

    const receipt = await tx.wait();
    
    return {
      success: true,
      transactionHash: receipt.hash,
      receipt
    };
  } catch (error) {
    console.error("Error in dispere function:", error);
    
    // Handle user rejection errors
    if (error.code === 'ACTION_REJECTED' || 
        (error.message && error.message.includes('user rejected')) ||
        (error.message && error.message.includes('User denied transaction'))) {
      return {
        success: false,
        error: "Transaction was rejected by the user. Please try again if you want to proceed.",
        userRejected: true
      };
    }
    
    // Handle other errors
    return {
      success: false,
      error: error.message || "An unknown error occurred while processing the transaction."
    };
  }
}
