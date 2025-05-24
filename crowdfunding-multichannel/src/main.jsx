import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ChainId, DAppProvider, MetamaskConnector, Polygon } from '@usedapp/core'
import { BrowserRouter } from 'react-router-dom'

// const config = {
//   // readOnlyChainId: ChainId.Mainnet,
//   readOnlyChainId: 80002,
//   readOnlyUrls: {
//     [ChainId.Mainnet]: 'https://polygon-amoy.drpc.org'
//   }
// }

// OLD
const config = {
  readOnlyChainId: Polygon.chainId,
  readOnlyUrls: {
    [Polygon.chainId]: Polygon.rpcUrl,
    80002: 'https://polygon-amoy.drpc.org'
  },
  connectors: {
    metamask: new MetamaskConnector(),
  }
}

// const config = {
//   readOnlyChainId: 80002, // Polygon Amoy Testnet
//   readOnlyUrls: {
//     80002: 'https://polygon-amoy.drpc.org'
//   },
//   connectors: {
//     metamask: new MetamaskConnector(),
//   },
//   networks: [80002],
//   autoConnect: true
// };


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DAppProvider config={config}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </DAppProvider>
  </StrictMode>,
)
