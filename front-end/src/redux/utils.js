//import {dispatch} from '@reduxjs/toolkit';

const INFURA_ID = "a6441c54b62c47519b6eaac2a8a59abc";//WOULD BE MADE HIDDEN;

const providerOptions = {
  binancechainwallet: {
    package: true
  },
   walletconnect: {
    package: window.WalletConnectProvider.default, // required
    options: {
      infuraId: INFURA_ID, // required
      // rpc: {
      //     97: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      //   },/*Not Important SInce binance not yet supported on infura*/
    }
  }
};


const web3Modal = new window.Web3Modal.default({
  cacheProvider: false, // optional
  providerOptions // required
});

const helperLib = Object.create(null);


helperLib.initInstance = async function(state){
  const instance = await web3Modal.connect();
  // Subscribe to accounts change
  instance.on("accountsChanged", (accounts) => {
      console.log("accountsChanged")
    });

    // Subscribe to chainId change
    instance.on("chainChanged", (chainId) => {
      console.log("chainChanged")
    });

    // Subscribe to provider connection
    instance.on("connect", ({chainId}) => {
      console.log("connect")
    });

    // Subscribe to provider disconnection
    instance.on("disconnect", ({code, message}) => {
      console.log("disconnect");
    });

    state._instance = instance;
}

helperLib.initW3 = function(state){
  const provider = new window.ethers.providers.Web3Provider(state._instance);
  state._ets = provider;
}

helperLib.initSigner = async function(state){
  const signer = await this._ets.getSigner();
  state._signer = signer;
}

helperLib.initAddress = async function(state){
  let addr = await state._signer.getAddress();
  state._address = addr;
}

helperLib.init =  async function(state){
  try{
	  await helperLib.initInstance(state);
	  helperLib.initW3(state);
	  await helperLib.initSigner(state);
	  await helperLib.initAddress(state);
	}
	catch(e){
		console.log("Error=> ",e)
	}
}

export default helperLib;