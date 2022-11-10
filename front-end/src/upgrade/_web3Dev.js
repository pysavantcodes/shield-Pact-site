import React, {useEffect, useCallback} from 'react';
import { Web3ReactProvider, useWeb3React, initializeConnector} from '@web3-react/core';
import { MetaMask } from '@web3-react/metamask'
import { WalletConnect, URI_AVAILABLE } from '@web3-react/walletconnect'
import Buffer from 'buffer'
import utf8 from 'utf8'
//console.log(Buffer.from);

window.Buffer = Buffer;
console.log(utf8);
window.utf8 = utf8;
const [metaMask, metaMaskHooks] = initializeConnector((actions) => new MetaMask(actions));

const [walletConnect, walletConnectHooks] = initializeConnector(
  (actions) =>
    new WalletConnect(
      actions,
      {
        chainId:56,
        rpcMap: {56:"https://bsc-dataseed.binance.org"},
      },
    )
);

console.log(walletConnect);
const connectors = [
  [metaMask, metaMaskHooks],
  [walletConnect, walletConnectHooks]
];


function ConnectButton({connector, hook}) {
  const { useChainId, useAccounts, useError, useIsActivating, useIsActive, useProvider, useENSNames } = hook;

  const chainId = useChainId()
  const accounts = useAccounts()
  const isActivating = useIsActivating()

  const isActive = useIsActive()

  const provider = useProvider()

  // log URI when available
  // useEffect(() => {
  //   connector.events.on(URI_AVAILABLE, (uri) => {
  //     console.log(`uri: ${uri}`);
  //   });
  // }, []);

  // attempt to connect eagerly on mount
  /*useEffect(() => {
    connector.connectEagerly().catch(() => {
      console.debug('Failed to connect eagerly to walletconnect')
    });
  }, []);*/

  const _click = useCallback(()=>{
    if(isActivating)
      return
    if(!isActive)
      connector.activate(56);
    else
      connector.deactivate();
  },[isActive, isActivating]);

  return (
    <>
      <p>chainId : {chainId} </p>
      <p>accounts : {accounts} </p>
      <p>isActivating : {isActivating} </p>
      <p>isActive : {isActive} </p>
     
  
      <button onClick={_click}>{isActivating?"connecting":isActive?"connect":"disconnect"}</button>
    </>
  )
}



const Web3Wrapper = ({children})=>{
  console.log(metaMask);
  console.log(metaMaskHooks);
  
  return (
    <>
      <ConnectButton connector={walletConnect} hook={walletConnectHooks}/>
      <Web3ReactProvider connectors={connectors}/>
    </>
    );
}


export default Web3Wrapper;