//<script src="https://cdn.jsdelivr.net/npm/ipfs-http-client/dist/index.min.js"></script>
//required


const NFT_ABI = [];
const NFT_ADDRESS = "";
const NFT_CHAINID = 0;


// //infura ID
// const projectId = '1qmt...XXX';
// const projectSecret = 'xxdsd';


const __NFT = function(){
}

__NFT.prototype.config = {
	abi:NFT_ABI,
	network:{
		//chainId:address,
		[NFT_CHAINID]:NFT_ADDRESS,
	},
	default:NFT_CHAINID
};

__NFT.prototype.init = async function(requiredSignerChainId){
	this._signer = helperLib.getSigner();
	this._contract = await helperLib.getContract(this.config,requiredSignerChainId);
	this.Ipfsclient = new IClient();
}

__NFT.prototype.__createNFT = async function(itemName, itemURI){
	return await this._contract.mintNFT(itemName, itemURI);
}

__NFT.prototype.createNFT = async function(itemName, fileObj){
	let itemURI = await uploadFileIPFS(client, fileObj);
	return await this.__createNFT(itemName, itemURI);
}

__NFT.prototype.removeNFT = async function(itemId){
	return await this._contract.burnNFT(itemId);
}

__NFT.prototype.infoNFT = async function(itemId){
	return await this._contract.infoNFT(itemId);
}

__NFT.prototype.myNFT = async function(){
	return await this._contract.myNFT();
}

__NFT.prototype.totalNFT = async function(){
	return await this._contract.totalSupply();
}

__NFT.prototype.setBaseURI = async function(uri){
	return await this._contract.setURI(uri);
}

__NFT.prototype.getBaseURI = async function(){
	return await this._contract.baseURI();
}

__NFT.prototype.nftURI = async function(item){
	return await this._contract.tokenURI();
}

const IPFS_HOST = 'https://ipfs.filebase.io/ipfs/'

const IClient = function(){
}

IClient.prototype.init = function(){
	const auth =
	'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

	this._client = ipfsClient.create({
		host: IPFS_HOST,//'ipfs.infura.io',
		port: 5001,
		protocol: 'https',
		headers: {
			authorization: auth,
		},
	});
}


IClient.prototype.uploadFileIPFS = async function(fileObj){
	let added = await client.add(fileObj);
	return added.path;
}

IClient.prototype.getFileUrl = (baseURI, hash)=>{
	let url = ([baseURI, hash]).join('/');
	return url;
}