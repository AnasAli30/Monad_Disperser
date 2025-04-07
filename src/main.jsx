import React from 'react';
import ReactDOM from 'react-dom/client';
import { createAppKit } from '@reown/appkit/react';
import { EthersAdapter } from '@reown/appkit-adapter-ethers';
import { arbitrum, mainnet ,monadTestnet} from '@reown/appkit/networks';
import App from './App';
import './index.css';

// 1. Get projectId
const projectId = '3c76f181698781d2991464f97c01b88d';

// 2. Set the networks

const networks = [monadTestnet];

// 3. Create a metadata object
const metadata = {
  name: 'Monad Token Disperser',
  description: 'A powerful token disperser for the Monad ecosystem',
  url: window.location.origin,
  icons: ['https://assets.reown.com/reown-profile-pic.png']
};

// 4. Create AppKit instance
createAppKit({
  adapters: [new EthersAdapter()],
  networks,
  metadata,
  projectId,
  features: {
    analytics: true
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
