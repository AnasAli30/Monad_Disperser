import React from 'react';
import ReactDOM from 'react-dom/client';
import { createAppKit } from '@reown/appkit/react';
import { EthersAdapter } from '@reown/appkit-adapter-ethers';
import { arbitrum, mainnet ,monadTestnet} from '@reown/appkit/networks';
import App from './App';
import './index.css';

// Replace the hardcoded project ID with the environment variable
const projectId = import.meta.env.VITE_PROJECT_ID;

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
    connectMethodsOrder: ['wallet'],
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
