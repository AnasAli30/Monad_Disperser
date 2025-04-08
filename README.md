# Monad Disperser

![image](https://github.com/user-attachments/assets/1285f6dc-a027-4dbf-af3f-94870e407d7d)

A powerful and user-friendly application for dispersing MON tokens to multiple addresses on the Monad blockchain.

## Features

### Core Functionality
- **Token Dispersion**: Send MON tokens to multiple addresses in a single transaction
- **Contract Management**: 
  - Deploy a smart contract for each dispersion operation
  - Contract state persists across page refreshes using local storage
  - Automatic contract cleanup after successful dispersion
  - One contract per dispersion operation for enhanced security
  - **Decentralized Architecture**: Creates child contracts for each recipient address, promoting network decentralization

### Input Modes
- **Multiple Value Mode**: Send different amounts to different addresses
  - Format: `address value` (space-separated)
  - Format: `address,value` (comma-separated)
  - Format: `address:value` (colon-separated)
- **Same Value Mode**: Send the same amount to multiple addresses
  - Enter a single value to be sent to all addresses
  - Enter one address per line

### User Interface
- **Dark/Light Mode**: Toggle between dark and light themes
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Validation**: 
  - Validates Ethereum addresses
  - Checks for sufficient balance
  - Shows total value to be dispersed
  - Displays remaining balance after transaction

### Wallet Integration
- **Wallet Connection**: Seamless integration with Monad wallets
- **Balance Tracking**: Real-time display of current wallet balance
- **Transaction History**: View transaction hashes and contract addresses

### Security Features
- **One-time Contract Usage**: Each contract can only be used for one dispersion operation
- **Contract Persistence**: Contract state is preserved across page refreshes
- **Automatic Cleanup**: Contract is removed from local storage after successful dispersion

## Getting Started

1. **Connect Your Wallet**: Click the wallet connection button in the navigation bar
2. **Deploy Contract**: Click "Deploy Contract" to create a new contract for dispersion
3. **Enter Addresses and Values**:
   - For multiple values: Enter addresses and values in any supported format
   - For same value: Enter addresses (one per line) and specify a single value
4. **Review and Disperse**: Check the parsed data and total value, then click "Disperse"

## Technical Details

- **Smart Contract**: Each dispersion operation uses a dedicated smart contract
- **Child Contract System**: For each recipient address, a child contract is created to handle the token transfer
- **Decentralization Benefits**: 
  - Each child contract operates independently
  - If one child contract fails, others can still succeed
  - Distributes transaction load across the network
  - Enhances network resilience and security
- **Local Storage**: Contract addresses are stored in browser local storage
- **Transaction Tracking**: All transactions are tracked with hashes for verification
- **Error Handling**: Comprehensive error handling for wallet connection, contract deployment, and transactions

## Requirements

- A Monad-compatible wallet
- Sufficient MON balance for the dispersion operation
- Modern web browser with JavaScript enabled

## Notes

- Each dispersion operation requires a new contract deployment
- Contract state is preserved if the page is refreshed
- After a successful dispersion, the contract is automatically removed from local storage
- The deploy button is disabled when a contract is already deployed
- The system creates one child contract per recipient address, promoting decentralization 
