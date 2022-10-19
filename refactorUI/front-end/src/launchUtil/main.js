import {ethers} from "ethers";


const defaultProvider = new ethers.providers.JsonRpcProvider(
  "https://bsc-dataseed.binance.org/",
  { name: "binance", chainId: 56 }
);

const explorer = 'https://testnet.bscscan.com/tx/'
const viewExplorer = (txHash)=>`${explorer}${txHash}`;

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

const tokenFactoryABI= [
	"function createToken(string memory name, string memory symbol, uint8 decimals, uint256 totalSupply) public payable",
	"function createdToken() public view returns (address[] memory)",
	"function getRecievedFee() public view returns (uint256)",
	"function withdrawFee() public",
	"function fee() public view returns (uint256)",
	"function allTokens(uint256) public view returns (address)",
	"event TokenCreated(address creator, address token)",
    "event FeeWithdrawn(uint256 amount)"
];

const tokenFactoryAddress  = "0x00910c9cBe37dbC92462eE32E7C15621144AF206";

const getTokenContract = (provider, address)=>new ethers.Contract(address, tokenABI, provider);

const getTokenFactoryContract = (signer)=>new ethers.Contract(tokenFactoryAddress, tokenFactoryABI, signer);


const tokenInfo = async (provider, address)=>{
	const token = getTokenContract(provider||defaultProvider, address);
	const info  = {};
	info.name = await token.name(); 
	info.symbol = await token.symbol();
	info.decimals = Number(await token.decimals());
	info.totalSupply = Number(await token.totalSupply());
	try{
		info.owner = await token.owner();
	}catch(e){
		info.owner = null;//not all contracts have owner
	}
	return info;
}

const createToken = async (signer, tokenData,  _handler)=>{
	try{
		if(!signer)
			return _handler.failed("No signer");
		_handler.process("Connceting to Contract");
		const factory = getTokenFactoryContract(signer);
		
		const fee = await factory.fee();//get Fee to be paid
		
		_handler.process(`Creating Token fee=> ${ethers.utils.formatEther(fee)} is required to be paid`);
		const result = await factory.createToken(tokenData.name, tokenData.symbol, +tokenData.decimals, ethers.utils.parseUnits(tokenData.totalSupply, +tokenData.decimals),{value:fee})
		const reciept = await result.wait();
		const newTokenAddress = reciept.events[(reciept.events.length - 1)].args.token;
		_handler.success(`Created Contract Address => ${newTokenAddress}`,()=>window.open(viewExplorer(reciept.transactionHash),'_blank'));
		return newTokenAddress; 
	}
	catch(e){
		_handler?.failed(e?.data?.message ?? e.message ?? e?.reason ?? "Error Occured");
	}
	
}

const createdTokens = async (provider)=>{
	const token = getTokenFactoryContract(provider||defaultProvider);
	return await token.createdToken();
}


const LaunchPadFactoryAddress  ="0xd71ECBA016468D576f0c8cD229CcdD7976991f87";
const busdAddress = "0x83d29B5abc19f51F62C446f19c8d185f77F05DEe";
const admin = "0x712196554d705f00396b9cB7D8384D225E92DF1b";

const LaunchPadFactoryABI = [
	"function fee() public view returns (uint256)",
	"function feePercent() public view returns (uint8)",
	"function lengthOfAllPads() public view returns (uint256)",
	"function totalTokenNeeded(uint256 _capped, uint256 _saleRate, uint256 _dexRate, uint256 _dexPercent) public view returns (uint256, uint256, uint256, uint256)",
	"function createdPad() public view returns (address[] memory)",
	`function createPad(address token_,
	    bool payTypeIsBNB,
	    uint256 _preSaleRate,
	    uint256 _dexSaleRate,
	    uint8 _dexPercent,
	    uint256 _capped,
	    uint256[] memory MinMaxBuy,
	    uint256[] memory _startEndTime,
	    uint256 _lpLockPeriod,
	    string memory _CID,
	    bool _enableWhiteList) public payable`,
	"event PadCreated(address creator, address pad)",
   	"event FeeWithdrawn(uint256 amount)"
];

const getLaunchPadFactoryContract = (provider)=>new ethers.Contract(LaunchPadFactoryAddress, LaunchPadFactoryABI, provider);

const {parseEther} = ethers.utils;


const createLaunchPad = async (signer, d, _handler)=>{
	try{
		if(!signer)
			return _handler.failed("No signer");
		_handler.process("Connecting to Contract");
		const factory = getLaunchPadFactoryContract(signer);

		_handler.process("Getting amount of token needed");
		
		
		const totalTokenNeeded = await factory.totalTokenNeeded(d.capped, d.presale, d.dexsale, d.dexpercent);
		console.log("total =>",totalTokenNeeded);
		_handler.process(`Need ${totalTokenNeeded[0]} amount of token for presale`);
		
		const token_contract= getTokenContract(signer, d.tokenAddress);
		let decimals = Number(await token_contract.decimals())
		
		let tokenAmount = (amount)=>ethers.utils.parseUnits(amount, decimals);

		let result = await token_contract.approve(factory.address, tokenAmount(totalTokenNeeded[0]));
		
		await result.wait();

		const fee = await factory.fee();//get Fee to be paid
		
		_handler.process(`Creating Token fee=> ${ethers.utils.formatEther(fee)} is required to be paid`);
		//																													since both busd and bnb are 18decimals
		result = await factory.createPad(d.tokenAddress, d.isBNB, d.presale, d.dexsale, d.dexpercent, d.capped, [parseEther(d.minbuy), parseEther(d.maxbuy)], [d.starttime, d.endtime], d.lockup, d.cid, d.whitelist, {value:fee});

		const reciept = await result.wait();
		
		const newAddress = reciept.events[reciept.events.length - 1].args.pad;
		_handler.success(`Created LaunchPad Address => ${newAddress}`,()=>window.open(viewExplorer(reciept.transactionHash),'_blank'));
		return newAddress; 
	}
	catch(e){
		_handler?.failed(e?.data?.message ?? e.message ?? e?.reason ?? "Error Occured");
	}
}

const LaunchPadABI = [
	"function capped() public view returns(address)",
	"function saleToken() public view returns(address)",
	"function buyToken() public view returns(address)",
	"function infoHash() public view returns(string memory)",
	"function tokenForPreSale() public view returns(uint256)",
	"function tokenForDexSale() public view returns(uint256)",
	"function preSaleRate() public view returns(uint256)",
	"function dexSaleRate() public view returns(uint256)",
	"function payType() public view returns(uint8)",
	"function startTime() public view returns(uint256)",
	"function endTime() public view returns(uint256)",
	"function dexPercent() public view returns(uint256)",
	"function LpTokenLockPeriod() public view returns(uint256)",
	"function minPurchasePrice() public view returns(uint256)",
	"function maxPurchasePrice() public view returns(uint256)",
	"function totalParticipant() public view returns(uint256)",
	"function totalSale() public view returns(uint256)",
	"function enableWhiteList() public view returns(address)",
	"function calculateToken(uint256 amount) public view returns(uint256)",
	"function owner() public view returns(address)",
	"function remainingToken() public view returns(uint256)",
	"function investedAmount(address) public view returns(uint256)",
	"function purchaseTokenByBNB() payable public",
	"function purchaseTokenByToken(uint256 amount) public",
	]


const getLaunchPadContract = (provider, address)=>new ethers.Contract(address, LaunchPadABI, provider);

const launchPadInfo = async(provider, address)=>{
	
	const launch = getLaunchPadContract(provider||defaultProvider, address);
	console.log(launch)
	console.log(await launch.owner())
	let db = {};
	db.tokenAddress = await launch.saleToken();
	db.baseTk = (await launch.payType())==0?"BNB":"BUSD";
	db.presaleAmount = Number(await launch.tokenForPreSale());
	db.dexsaleAmount = Number(await launch.tokenForDexSale());
	db.presale = Number(await launch.preSaleRate());
	db.dexsale = Number(await launch.dexSaleRate());
	db.capped = Math.floor(db.presaleAmount/db.presale) //Number(await launch.capped());
	db.dexpercent = Number(await launch.dexPercent());
	db.lockup = Number(await launch.LpTokenLockPeriod());
	db.starttime = (new Date(Number(await launch.startTime())*1000)).toLocaleString();
	db.endtime = (new Date(Number(await launch.endTime())*1000)).toLocaleString();
	db.minbuy = 0//Number(await launch.minPurchasePrice());
	db.maxbuy = 0//Number(await launch.maxPurchasePrice());
	db.cid = await launch.infoHash();
	db.remaining = Number(await launch.remainingToken());
	db.purchased = Number(await launch.investedAmount(await provider.getAddress()))
	return db;
}

const createdPads = async(provider)=>{
	const pads = getLaunchPadFactoryContract(provider||defaultProvider);
	return await pads.createdPad();
} 

const purchase = async(provider, address, amount, symbol,_handler)=>{
	try{
		const launch = getLaunchPadContract(provider||defaultProvider, address);
		const baseTk = (await launch.payType())==0;
		let result;

		if(baseTk){
			let price = parseEther(amount);
			let value = await launch.calculateToken(price);
			_handler.process(`purchasing ${value}${symbol||''} for ${price}`);
			result = launch.purchaseTokenByBNB({value:price});
		}else{
			const token  = getTokenContract(provider, await launch.buyToken());
			let price = parseEther(amount, Number(await token.decimals()));
			let value = await launch.calculateToken(price);
			_handler.process(`purchasing ${value}${symbol||''} for ${price}`);
			result = await launch.purchaseTokenByToken({value:price});
		}
		let reciept = await result.wait();
		_handler.success("Successful",()=>window.open(viewExplorer(reciept.transactionHash),'_blank'));
	}catch(e){
		_handler?.failed(e?.data?.message ?? e.message ?? e?.reason ?? "Error Occured");
	}
}

// handler.success("Successful",()=>window.open(viewExplorer(reciept.transactionHash),'_blank'));
export {createToken, tokenInfo, createdTokens, createLaunchPad, createdPads, launchPadInfo};