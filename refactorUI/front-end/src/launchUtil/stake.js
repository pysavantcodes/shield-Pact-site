import {ethers} from "ethers";

const {parseEther, formatEther} = ethers.utils;
const defaultProvider = new ethers.providers.JsonRpcProvider(
  "https://bsc-testnet.nodereal.io/v1/e9a36765eb8a40b9bd12e680a1fd2bc5",
  { name: "binance", chainId: 97 }
);


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


const bonusTokenAddr =  "0xF570EFf7f847B09D1119B9a80590F10e6f458b96"
const stakeTokenAddr  = "0xa54451DabB24E5F52ea7afaAFb55389C8AF03AFd"
const bonusAddr = "0xF570EFf7f847B09D1119B9a80590F10e6f458b96";
const bnbAddr = "0x58c3Fa358165DE45c208fFdE19895341dA78c341";
const stakeAddr = "0x6f2326E0cB5def734Cee56fbFb9401D1F982447C"

const explorer = 'https://testnet.bscscan.com/tx/'
const viewExplorer = (txHash)=>`${explorer}${txHash}`;

const stakeABI = [
	/*`struct Stake{
        uint256 id;
        address sTk;
        address bTk;
        uint256 amount;
        uint256 endTime;
        uint256 reward;
    }`,
    `struct Interest{
    	uint256 reward;
    	uint256 totalRewardAmount;
    	uint256 duration;
    }`,*/
    "function stakeInterest(address, address) public view returns(tuple(uint256 reward, uint256 totalRewardAmount, uint256 duration) Interest)",
    "function stakeBNB(address) public payable",
    "function claim(uint256) public",
    "function getOwnedStake() public view returns(uint256[])",
    `function bank(address, uint256) public view returns(tuple( 
    	uint256 id,
        address sTk,
        address bTk,
        uint256 amount,
        uint256 endTime,
        uint256 reward))`

]
const getStake = (provider)=>new ethers.Contract(stakeAddr, stakeABI, provider);

const listStakeCenters = async (provider)=>{
	let stake = getStake(provider||defaultProvider);
	let result = await stake.stakeInterest(bnbAddr, bonusTokenAddr);
	return result;
}

const ownedStake = async(signer)=>{
	if(!signer)
		return function*(){};
	//console.log(signer);
	let address = await signer.getAddress();
	let stake = getStake(signer);
	const allStake = await stake.getOwnedStake();
	//console.log(allStake);
	return async function*(){
		for(let _id of allStake){
			yield stake.bank(address, _id); 
		}
	}
}

const stakeBNB = async(signer, amount, _handler)=>{

	try{
		if(!signer)
			return _handler.failed("signer Required");
		_handler.process("connecting");
		let stake = getStake(signer);
		_handler.process("Staking");
		let result = await stake.stakeBNB(bonusTokenAddr, {value:parseEther(amount)});
		let reciept = await result.wait();
		_handler.success(`Staked ${''}BNB`,()=>window.open(viewExplorer(reciept.transactionHash),'_blank'));
		
	}catch(e){
		_handler?.failed(e?.error?.data?.message ?? e.message ?? e?.reason ?? "Error Occured");	
	}
}

const claimBNB = async(signer, id, _handler)=>{
	try{
		if(!signer)
			return _handler.failed("signer Required");
		_handler.process("connecting");
		let stake = getStake(signer);
		_handler.process("Claiming");
		let result = await stake.claim(id);
	
		let reciept = await result.wait();
		_handler.success(`Claimed ${''}BNB + ${''}Bonus Token`,()=>window.open(viewExplorer(reciept.transactionHash),'_blank'));
	}catch(e){
		_handler?.failed(e?.error?.data?.message ?? e.message ?? e?.reason ?? "Error Occured");
	}
}

export {stakeBNB, claimBNB, ownedStake, listStakeCenters};