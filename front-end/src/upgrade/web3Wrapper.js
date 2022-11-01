import React from 'react';
import { Web3Modal} from '@web3modal/react';
import { chains, providers } from '@web3modal/ethereum';
import config from './config';


const _chain = config.production?chains.binanceSmartChain:chains.binanceSmartChainTestnet;

const _config = {
  projectId: config.PROJECTID,
  theme: 'dark',
  accentColor: 'default',
  ethereum: {
    appName: 'Shield Pact',
    chains:[_chain],
    providers:[providers.walletConnectProvider({ProjectId:config.PROJECTID})]
  }
}


const Web3Container = ({children})=>{
  return (
    <>
      {children}
      <Web3Modal config={_config} />
    </>
  )
}
export default Web3Container;
