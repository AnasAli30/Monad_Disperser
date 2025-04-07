import { BrowserProvider, ContractFactory } from "ethers";
import abi from "../constant/abi.json";
import {bytecode} from "../constant/bytecode";

/**
 * Deploys the disperse contract
 * @param {Object} walletProvider - The wallet provider from AppKit
 * @returns {Promise<Object>} - Object containing the deployed contract address and contract instance
 */
export async function deployContract(walletProvider) {
  try {
    // Create provider and signer
    const ethersProvider = new BrowserProvider(walletProvider);
    const signer = await ethersProvider.getSigner();
    
    // Get the factory bytecode from the ABI
   
    
    console.log("Deploying contract...");
    
    // Deploy the contract
    const factory = new ContractFactory(abi, bytecode, signer);
    const deployTx = await factory.deploy();
    
    // Wait for the deployment transaction to be mined
   const receipt =  await deployTx.waitForDeployment();

    const contractAddress = await deployTx.getAddress();
    
    console.log("Contract deployed successfully at:", contractAddress);
    
    
    
    return {
      success: true,
      contractAddress,
      receipt
    };
  } catch (error) {
    console.error("Error deploying contract:", error);
    
    // Handle user rejection errors
    if (error.code === 'ACTION_REJECTED' || 
        (error.message && error.message.includes('user rejected')) ||
        (error.message && error.message.includes('User denied transaction'))) {
      return {
        success: false,
        error: "Contract deployment was rejected by the user. Please try again if you want to proceed.",
        userRejected: true
      };
    }
    
    // Handle other errors
    return {
      success: false,
      error: error.message || "An unknown error occurred while deploying the contract."
    };
  }
}

