
//id to be made privatelater
const RPC = {
		infuraId:"a6441c54b62c47519b6eaac2a8a59abc",
	  rpc: {
	   97:"https://data-seed-prebsc-2-s3.binance.org:8545/",
	   56: "https://bsc.nodereal.io",
	  },
	};
	
let clientAddress = '';

async function createConnection(){
	const provider = new WalletConnectProvider.default(RPC);
	await provider.enable();
	window._provider = provider;	
}

async function closeConnection(){
	await _provider.disconnect()
}

async function initW3(){
const _ets = new providers.Web3Provider(_provider)
	window._ets = _ets;
}

async function connect(){
  await createConnection();
  await initW3();
  const signer = await _ets.getSigner();
  window._signer = signer;
  const address = await _signer.getAddress();
  alert (`You wallet address is ${address}`);
} 