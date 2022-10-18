
const ethers  = require('ethers');


const defaultProvider = null;


function uploadToIPFS(){}


const tokenABI = [
	"function name() external view returns (string)",
	"function symbol() external view returns (string)",
	"function decimals() external view returns (uint8)",
	"function totalSupply() external view returns (uint256)",
	"function balanceOf(address account) external view returns (uint256)",
	"function allowance(address owner, address spender) external view returns (uint256)",
	"function approve(address spender, uint256 amount) external returns (bool)",
	"function owner() public view returns (address)"
];

const getTokenContract = (provider, address)=>new ethers.Contract(address, tokenABI, provider);

const tokenInfo = async (provider, address)=>{
	const token = getTokenContract(provider||defaultProvider, address);
	const tokenInfo  = {};
	tokenInfo.name = await token.name(); 
	tokenInfo.symbol = await token.symbol();
	tokenInfo.decimals = await token.decimals();
	tokenInfo.totalSupply = await token.totalSupply();
	tokenInfo.owner = await token.owner();
	return tokenInfo;
}

const tokenFactoryAddress  = "";

const tokenFactoryABI= [
	"function createToken(string memory name, string memory symbol, uint8 decimals, uint256 totalSupply) public paidFee payable",
	"function createdToken() public view returns (address[] memory)",
	"function getRecievedFee() public view onlyOwner returns (uint256)",
	"function withdrawFee() public onlyOwner"
];

const getTokenFactoryContract = (signer)=>new ethers.Contract(tokenFactoryAddress, tokenFactoryABI, signer);;

const createToken = async (signer, name, symbol, decimals, totalSupply)=>{
	const factory = getTokenFactoryContract(signer);
	const fee = await factory.fee();//get Fee to be paid
	const result = await factory.createToken(name, symbol, decimals,{value:fee})
	const reciept = result.wait();

	const newTokenAddress = reciept.events[reciept.events.length - 1].args.token;
	return newTokenAddress; 
}


function createLaunchPad(){

}

module.exports = {createToken, tokenInfo};