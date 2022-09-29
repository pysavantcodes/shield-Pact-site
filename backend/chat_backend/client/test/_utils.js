// <script src="https://cdn.jsdelivr.net/npm/web3modal@1.9.9/dist/index.min.js"></script>
//   <script src="https://cdnjs.cloudflare.com/ajax/libs/ethers/5.7.1/ethers.umd.min.js" integrity="sha512-nhTUaJWcf19KPfEAol6WNtSUx/DKaGE1jc9hL6kMBVMigUtu4whc+cA65oq5vZALC7HlgxzW1w2/cV+GIH6T+A==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
//   <script src="https://cdn.jsdelivr.net/npm/@walletconnect/web3-provider@1.8.0/dist/umd/index.min.js"></script>
//Need to be imported

const INFURA_ID = "a6441c54b62c47519b6eaac2a8a59abc";//to be hidden later 
//should be remove before deploying

const providerOptions = {
  binancechainwallet: {
    package: true
  },
   walletconnect: {
    package: WalletConnectProvider.default, // required
    options: {
      infuraId: INFURA_ID, // required
      rpc: {
          97: "https://data-seed-prebsc-1-s1.binance.org:8545/",
        },
    }
  }
};


const web3Modal = new Web3Modal.default({
  cacheProvider: false, // optional
  providerOptions // required
});


const connectWallet = async ()=>{
  const instance = await web3Modal.connect();
  window._instance = instance;
}

const initW3 = ()=>{
  const provider = new ethers.providers.Web3Provider(_instance);
  window._ets = provider;
}

const getSigner = async ()=>{
  const signer = await _ets.getSigner();
  window._signer = signer;
}

const initialize =  async ()=>{
  await connectWallet();
  initW3();
  await getSigner();
  return _signer.getAddress();
}

