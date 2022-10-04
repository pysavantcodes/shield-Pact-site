
const helperLib = Object.create(null);

helperLib.cacheContract = {};

helperLib.getContract = async function(contractObj, requiredSignerChainId){
  console.log(contractObj)
	let chainId = await this.helperLib.getNetworkChainId();
	 requiredSignerChainId = requiredSignerChainId ?? (contractObj.network[chainId]?chainId:contractObj.default);
	if(requiredSignerChainId !== chainId){
		console.log(`The contract not deployed to network with ChainId=>${chainId}`);
		return null;
	}
  console.log(`Chain ID => ${chainId}`);
	let contract =  new window.ethers.Contract(contractObj.network[chainId], contractObj.abi, this._signer);
	contract = await contract.deployed();
  console.log(contract);
	return contract;
}


helperLib.getNetwork = async function(){
  return await this._ets.getNetwork();
}

helperLib.getNetworkChainId = async function(){
  let network = await helperLib.getNetwork();
	return network.chainId;
}

helperLib.getSigner = function(){
	return this._signer;
}

helperLib.getProvider = function(){
	return this._ets;
}

helperLib.getAddress = function(){
  return this._clientAddr;
}

helperLib.rampNetwork = async(callback=(e=>{}))=>{
  let href = `https://buy.ramp.network/?userAddress=${helperLib.getSigner()?.address}" target="_blank">`;
  callback(href, window.open(href,'_target'));
}


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


helperLib.connectWallet = async function(){
  const instance = await web3Modal.connect();
  this._instance = instance;
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
}

helperLib.initW3 = function(){
  const provider = new window.ethers.providers.Web3Provider(this._instance);
  this._ets = provider;
}

helperLib.__getSigner = async function(){
  const signer = await this._ets.getSigner();
  this._signer = signer;
}

helperLib.__getAddress = async function(){
  let clientAddress = await this._signer.getAddress()
  this._clientAddr = clientAddress
  return clientAddress;
}

helperLib.init =  async function(){
  await helperLib.connectWallet();
  helperLib.initW3();
  await helperLib.__getSigner();
  return await helperLib.__getAddress();
}

export default helperLib;
