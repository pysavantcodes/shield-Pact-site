
import { Web3Modal, useSigner} from '@web3modal/react';
import { chains, providers } from '@web3modal/ethereum';

const PROJECTID = '5f0a0c1eda156a9eade6dfcf6dbc0cea'; //this would be remove later

const config = {
  projectId: PROJECTID,
  theme: 'dark',
  accentColor: 'default',
  ethereum: {
    appName: 'web3Modal',
    chains:[chains.binanceSmartChainTestnet],
    providers:[providers.walletConnectProvider({ProjectId:PROJECTID})]
  }
}


const Web3Container = ({children})=>{
  return (
    <>
      {children}
      <Web3Modal config={config} />
    </>
  )
}


const CreateNFT = ()=>{
  const {data:signer} = useSigner();
};


const getNFT = ()=>{

}

const updateDetailNFT = ()=>{

}

export default Web3Container;