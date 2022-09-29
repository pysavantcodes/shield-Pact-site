// <script src="https://cdn.jsdelivr.net/npm/web3modal@1.9.9/dist/index.min.js"></script>
//   <script src="https://cdnjs.cloudflare.com/ajax/libs/ethers/5.7.1/ethers.umd.min.js" integrity="sha512-nhTUaJWcf19KPfEAol6WNtSUx/DKaGE1jc9hL6kMBVMigUtu4whc+cA65oq5vZALC7HlgxzW1w2/cV+GIH6T+A==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
//   <script src="https://cdn.jsdelivr.net/npm/@walletconnect/web3-provider@1.8.0/dist/umd/index.min.js"></script>
//   <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.27.2/axios.min.js" integrity="sha512-odNmoc1XJy5x1TMVMdC7EMs3IVdItLPlCeL5vSUPN2llYKMJ2eByTTAIiiuqLg+GdNr9hF6z81p27DArRFKT7A==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
//   <script src="https://cdnjs.cloudflare.com/ajax/libs/uuid/8.2.0/uuidv4.min.js" integrity="sha512-W6Yf3E7UBUKz5LqkjOHga4hkDX3huRhAvV8I6MFuZ0zX+5ttmVldY8nz9q26SwBItFrb9XSKNMiWEsKg8rDmXg==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
//   <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js" integrity="sha512-E8QSvWZ0eCLGk4km3hxSsNmGWbLtSCSUcewDQPQWZF6pEU8GlT8a5fF32wOl1i8ftdMhssTrF/OhyGWwonTcXA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>

//MUST BE ADDED TO PAGE

/***********/
const CHAT_ABI = [
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "userName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "privKey",
          "type": "string"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "user",
          "type": "address"
        }
      ],
      "name": "CreatedUser",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "user",
          "type": "address"
        }
      ],
      "name": "KeyChanged",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_id",
          "type": "address"
        }
      ],
      "name": "accountExist",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "key",
          "type": "string"
        }
      ],
      "name": "changeKey",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "userName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "privKey",
          "type": "string"
        }
      ],
      "name": "createUser",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getKey",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_id",
          "type": "address"
        }
      ],
      "name": "getName",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalAccounts",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]; 

const CHAT_ADDRESS = '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707';
const CHAT_CHAINID = 31337;
const CHAT_API_URL = 'http://localhost:3000/api/chat';
/*************/

const AES = CryptoJS.AES;

function __CipherLib(){
}

__CipherLib.prototype.createCipher = (secret, value)=>AES.encrypt(value, secret).toString();

__CipherLib.prototype.encrypt = (userId, userKey, expires)=>{
	let _txt = v4();
	let db = {userId, _txt, expires:Date.now() + (expires||60*60*1000)};
	let _hash = AES.encrypt(userKey,JSON.stringify(db));
	return {_id:userId, _hash, _txt};
}

window.CipherLib = new __CipherLib();


const createHttpClient= (apiUrl)=> axios.create({baseURL: apiUrl, withCredentials:true});

function apiClient(){
	if(this===window)
		throw Error("To be called with new keyword");
}

apiClient.prototype.init = (_apiUrl)=>{
	this.apiUrl = _apiUrl;
	this.client= createHttpClient(apiUrl);
}


apiClient.prototype.endPoint = {
	clean: '/clean',//for testnot to be implemented
	createAccount:'/create-account',
	authAccount:'/auth',
	addFriend:'/add-friend',
	getInfo:'/account-info',
	sendMessage:'/send-message',
	getAccounts:'/accounts',
	newMessageInfo:'/new-message-info',
	readNewMessage:'/read-messages',
	paginateMessage:'/paginate-message',
	allMessage:'/all-message',
};

apiClient.prototype.__internalCreateAccount = async (userName, userKey)=>{
	let userId = helper.getSigner().address;
	let result = await this.client.post(this.endPoint.createAccount,{userName, userId, userKey});
	return result.data;
}

apiClient.prototype.createAccount = async(userName)=>{
	//create account in blockchain first
	let tx = await chatContract.createUser(userName, v4());//key generated by default
	let userKey = await chatContract.getKey();
	return await this.__internalCreateAccount(userName, userKey);
}

apiClient.prototype.authAccount = async ()=>{
	let userKey = await chatContract.getKey();
	let userId = helper.getSigner().address;
	let data = CipherLib.createCipher(userId, userKey);
	result = await this.client.post(this.endPoint.authAccount,data);
	return result.data;
}

apiClient.prototype.clean = async function(){
	result = await this.client.get(this.endPoint.clean);
	return result.data?.done;
}

apiClient.prototype.addFriend = async function(friendId){
	result = await this.client.post(this.endPoint.addFriend, {friendId});
	return result.data;
}

apiClient.prototype.getInfo = async function(id){
	let result =  await this.client.get(this.endPoint.getInfo, {params: {id} });
	return result.data;
}

apiClient.prototype.getAccounts = async function(){
	let result = await this.client.get(this.endPoint.getAccounts);
	return result.data;
}

apiClient.prototype.sendMessage = async function(to, body){
	let {data} = await this.client.post(this.endPoint.sendMessage, {to, body});
	return data;
}

apiClient.prototype.newMessageInfo = async function(){
	let {data} = await this.client.get(this.endPoint.newMessageInfo);
	return data;
}

apiClient.prototype.readNewMessage = async function(){
	let {data} = await this.client.get(this.endPoint.readNewMessage);
	return data;
}

apiClient.prototype.paginateMessage = async function(to, pstart, plimit, beginTime){
	let {data} = await this.client.get(this.endPoint.paginateMessage,{params:{to, pstart, plimit, beginTime}});
	return data;
}

apiClient.prototype.allMessage = async function(pstart, plimit, beginTime){
	let {data} = await this.client.get(this.endPoint.paginateMessage,{params:{pstart, plimit, beginTime}});
	return data;
}


window.chatApiClient = new apiClient();


const helperLib = Object.create(null);

helperLib.cacheContract = {};

helperLib.getContract = async(contractObj, requiredSignerChainId)=>{
  console.log(contractObj)
	let chainId = await helperLib.getNetworkChainId();
	 requiredSignerChainId = requiredSignerChainId ?? (contractObj.network[chainId]?chainId:contractObj.default);
	if(requiredSignerChainId !== chainId){
		console.log(`The contract not deployed to network with ChainId=>${chainId}`);
		return null;
	}
	let contract =  new ethers.Contract(contractObj.address, contractObj.abi, _signer);
	contract = await Contract.deployed();
	return contract;
}


helperLib.getNetwork = async ()=>{
  return await _ets.getNetwork();
}

helperLib.getNetworkChainId = async()=>{
  let network = await helperLib.getNetwork();
	return network.chainId;
}

helperLib.getSigner = ()=>{
	return _signer;
}

helperLib.getProvider = ()=>{
	return _ets;
}

helperLib.rampNetwork = async(callback=(()=>{}))=>{
  let href = `https://buy.ramp.network/?userAddress=${helperLib.getSigner()?.address}" target="_blank">`;
  callback(href, window.open(href,'_target'));
}


const INFURA_ID = "a6441c54b62c47519b6eaac2a8a59abc";//WOULD BE MADE HIDDEN;



const providerOptions = {
  binancechainwallet: {
    package: true
  },
   walletconnect: {
    package: WalletConnectProvider.default, // required
    options: {
      infuraId: INFURA_ID, // required
      // rpc: {
      //     97: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      //   },/*Not Important SInce binance not yet supported on infura*/
    }
  }
};


const web3Modal = new Web3Modal.default({
  cacheProvider: false, // optional
  providerOptions // required
});


helperLib.connectWallet = async ()=>{
  const instance = await web3Modal.connect();
  window._instance = instance;

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

helperLib.initW3 = ()=>{
  const provider = new ethers.providers.Web3Provider(_instance);
  window._ets = provider;
}

helperLib.__getSigner = async()=>{
  const signer = await _ets.getSigner();
  window._signer = signer;
}

helperLib.init =  async ()=>{
  await helperLib.connectWallet();
  helperLib.initW3();
  await helperLib.__getSigner();
  return _signer.getAddress();
}


function _ChatContract(){}

_ChatContract.prototype.config = {
	abi:CHAT_ABI,
	network:{
		[CHAT_CHAINID]:CHAT_ADDRESS,
	},
	default:CHAT_CHAINID,
};

_ChatContract.prototype.init = async function(requiredSignerChainId){
  console.log(this)
	this._signer = helperLib.getSigner();
	this._contract = await helperLib.getContract(this.config,requiredSignerChainId);
}

_ChatContract.prototype.getKey = async function(){
	return await this._contract.getKey();
}

_ChatContract.prototype.changeKey = async function(key){
	return await this._contract.getKey(key);
}

_ChatContract.prototype.createUser = async function(uName, key){
	return await this._contract.createUser(uName, key);
}

_ChatContract.prototype.getName = async function(_id){
	return await this._contract.getName(_id);
}
///add event
_ChatContract.prototype.on = async function(event, handler){
  return await this._contract.on(event, handler);
}
//remove event
_ChatContract.prototype.off = async function(event){
  return await this._contract.off(event);
}




window.chatContract = new _ChatContract();


const INIT = async ()=>{
	let address = await helperLib.init();
	await window.chatContract.init();
	window.chatApiClient.init(CHAT_API_URL);
  return address;
}