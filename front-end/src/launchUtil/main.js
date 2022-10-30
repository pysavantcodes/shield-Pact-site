import {ethers} from "ethers";


const defaultProvider = new ethers.providers.JsonRpcProvider(
  "https://bsc-testnet.nodereal.io/v1/e9a36765eb8a40b9bd12e680a1fd2bc5",
  { name: "binance", chainId: 97 }
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
    "event FeeWithdrawn(uint256 amount)",
    "function owner() public view returns (address)"
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
	info.totalSupply = ethers.utils.formatUnits(await token.totalSupply(), info.decimals);
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


const LaunchPadFactoryAddress  ="0x764186E075ff01135fd9E611a24E3c1DF60C513B";
const busdAddress = "0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee";
const admin = "0x712196554d705f00396b9cB7D8384D225E92DF1b";

const LaunchPadFactoryABI = [
	"function fee() public view returns (uint256)",
	"function feePercent() public view returns (uint8)",
	"function lengthOfAllPads() public view returns (uint256)",
	"function totalTokenNeeded(uint256 _capped, uint256 _saleRate, uint256 _dexRate, uint8 _dexPercent) public view returns (uint256, uint256, uint256, uint256)",
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
   	"event FeeWithdrawn(uint256 amount)",
   	"function withdrawFee() public",
   	"function getRecievedFee() public view returns (uint256)",
   	"function owner() public view returns (address)",
   	"function allPads(uint256) public view returns(address)"
];

const getLaunchPadFactoryContract = (provider)=>new ethers.Contract(LaunchPadFactoryAddress, LaunchPadFactoryABI, provider);

const {parseEther} = ethers.utils;


let createTokenAmount = async(_addr)=>{
	const contract = getTokenContract(defaultProvider, _addr);
	const _decimals = await contract.decimals();
	
	function tokenAmount(amount){
		return ethers.utils.parseUnits(amount, _decimals);
	}

	function tokenRaw(amount){
		return ethers.utils.formatUnits(amount, _decimals);
	}
	return {tokenAmount, tokenRaw};
};

const listLaunchPad = async function*(signer){
	const factory = getLaunchPadFactoryContract(signer||defaultProvider);
	let lent = Number(await factory.lengthOfAllPads());
	if(lent == 0)
		return;
	for(let i=lent - 1;i>=0;i--){
		yield factory.allPads(i);
	}
}

const createLaunchPad = async (signer, _d, _handler)=>{
	try{
		if(!signer)
			return _handler.failed("No signer");
		_handler.process("Connecting to Contract");
		const factory = getLaunchPadFactoryContract(signer);

		_handler.process("Getting amount of token needed");
		
		const d = {..._d};
		let {tokenAmount, tokenRaw} = await createTokenAmount(d.tokenAddress);

		d.capped = tokenAmount(d.capped);
		d.presale = tokenAmount(d.presale);
		d.dexsale = tokenAmount(d.dexsale);
		d.minbuy = parseEther(d.minbuy);
		d.maxbuy = parseEther(d.maxbuy);
		console.log(d.capped)
		const totalTokenNeeded = await factory.totalTokenNeeded(d.capped, d.presale, d.dexsale, d.dexpercent);
		console.log(totalTokenNeeded);
		_handler.process(`Need ${tokenRaw(totalTokenNeeded[0])} amount of token for presale`);
		
		const token_contract = getTokenContract(signer, d.tokenAddress);
		let result = await token_contract.approve(factory.address, totalTokenNeeded[0]);
		
		await result.wait();

		const fee = await factory.fee();//get Fee to be paid
		
		_handler.process(`Creating Token fee=> ${ethers.utils.formatEther(fee)} is required to be paid`);
		//																													since both busd and bnb are 18decimals
		result = await factory.createPad(d.tokenAddress, d.isBNB, d.presale, d.dexsale, 
						d.dexpercent, d.capped, [d.minbuy, d.maxbuy], 
						[d.starttime, d.endtime], d.lockup, d.cid, d.whitelist, {value:fee});

		const reciept = await result.wait();
		
		const newAddress = reciept.events[reciept.events.length - 1].args.pad;
		_handler.success(`Created LaunchPad Address => ${newAddress}`,()=>window.open(viewExplorer(reciept.transactionHash),'_blank'));
		return newAddress; 
	}
	catch(e){
		_handler?.failed(e?.error?.data?.message ?? e.message ?? e?.reason ?? "Error Occured");
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
	"function preSaleCompleted() public view returns(bool)",
	"function completePreSale() public"
	]


const getLaunchPadContract = (provider, address)=>new ethers.Contract(address, LaunchPadABI, provider);

const launchPadInfo = async(provider, address)=>{
	
	const launch = getLaunchPadContract(provider||defaultProvider, address);
	
	let db = {};
	db.tokenAddress = await launch.saleToken();
	let {tokenAmount, tokenRaw} = await createTokenAmount(db.tokenAddress);
	db.baseTk = (await launch.payType())==0?"BNB":"BUSD";
	db.presaleAmount = tokenRaw(await launch.tokenForPreSale());
	db.dexsaleAmount = tokenRaw(await launch.tokenForDexSale());
	db.participant = Number(await launch.totalParticipant());
	db.presale = tokenRaw(await launch.preSaleRate());
	db.dexsale = tokenRaw(await launch.dexSaleRate());
	db.capped = tokenRaw(await launch.capped());
	db.dexpercent = Number(await launch.dexPercent());
	db.lockup = Number(await launch.LpTokenLockPeriod());
	db.starttime = (new Date(Number(await launch.startTime())*1000)).toLocaleString();
	db.endtime = (new Date(Number(await launch.endTime())*1000)).toLocaleString();
	db.minbuy = tokenRaw(await launch.minPurchasePrice());
	db.maxbuy = tokenRaw(await launch.maxPurchasePrice());
	db.cid = await launch.infoHash();
	db.remaining = tokenRaw(await launch.remainingToken());
	db.complete = await launch.preSaleCompleted();
	db.purchased = await launch.investedAmount(await provider?.getAddress());
	if(db.purchased>0)
		db.purchased = tokenRaw(db.purchased);
	else
		db.purchased = Number(db.purchased);
	db.owner = await launch.owner();
	console.log(db)
	return db;
}


const launchInfo = async(provider, address)=>{
	const launch = getLaunchPadContract(provider||defaultProvider, address);

	let db = {};
	db.tokenAddress = await launch.saleToken();
	let {tokenAmount, tokenRaw} = await createTokenAmount(db.tokenAddress);
	db.baseTk = (await launch.payType())==0?"BNB":"BUSD";
	db.cid = await launch.infoHash();
	db.presale = tokenRaw(await launch.preSaleRate());
	db.presaleAmount = tokenRaw(await launch.tokenForPreSale());
	db.remaining = tokenRaw(await launch.remainingToken());
	db.participant = Number(await launch.totalParticipant());
	db.capped = tokenRaw(await launch.capped());
	db.cid = await launch.infoHash();
	db.complete = await launch.preSaleCompleted();
	return db
}

const completePreSale = async (provider, address, _handler)=>{
	try{
		_handler.process("Ending");
		const launch = getLaunchPadContract(provider, address);
		let result = await launch.completePreSale();
		await result.wait();
		_handler.success("Done");
	}catch(e){
		_handler?.failed(e?.data?.message ?? e.message ?? e?.reason ?? "Error Occured");
	}
}

const createdPads = async(provider)=>{
	const pads = getLaunchPadFactoryContract(provider||defaultProvider);
	return await pads.createdPad();
} 

const purchase = async(provider, address,  amount, t,_handler)=>{
	try{
		if(!provider)
			return _handler.failed("No signer");
		const launch = getLaunchPadContract(provider||defaultProvider, address);
		const baseTk = (await launch.payType())==0;
		let result;
		
		if(baseTk){
			let price = parseEther(amount);
			let value = ethers.utils.formatUnits(await launch.calculateToken(price), t.decimals);
			_handler.process(`purchasing ${value}${t.symbol||''} for ${amount}BNB`);
			result = launch.purchaseTokenByBNB({value:price});
		}else{
			const tkAddress = await launch.buyToken();
			const token  = getTokenContract(provider, tkAddress);

			let price = parseEther(amount);

			_handler.process(`seeking approval ${amount}BUSD`);
			result = await token.approve(launch.address, price);
			await result.wait();
			let value = ethers.utils.formatUnits(await launch.calculateToken(price), t.decimals);
			_handler.process(`purchasing ${value}${t.symbol||''} for ${amount}BUSD`);
			console.log(price);
			result = await launch.purchaseTokenByToken(price);
		}
		let reciept = await result.wait();
		_handler.success("Successful",()=>window.open(viewExplorer(reciept.transactionHash),'_blank'));
	}catch(e){
		_handler?.failed(e?.data?.message ?? e.message ?? e?.reason ?? "Error Occured");
	}
}

const withdrawLaunchFee = async (_signer, _handler)=>{
	try{
		if(!_signer)
			return _handler.failed("No signer");
		_handler.process("Preparing");
		const factory = getLaunchPadFactoryContract(_signer);
		if(await factory.owner() !== await _signer.getAddress()){
			_handler.failed("Only owner allowed");
			return;
		}

		const _allFee = await factory.getRecievedFee();
		if(Number(_allFee)===0){
			_handler.failed("No fee to withdraw");
			return;
		}
		async function next(){
			try{
				_handler.process("Withdrawing");
				let result = await factory.withdrawFee();
				let reciept = await result.wait();
				_handler.success("Successful",()=>window.open(viewExplorer(reciept.transactionHash),'_blank'));
			}catch(e){
				_handler?.failed(e?.data?.message ?? e.message ?? e?.reason ?? "Error Occured");
			}
		}
		_handler.info(`Do you want to Withdraw Fee ${ethers.utils.formatEther(_allFee)}BNB`,next);
	}catch(e){
		_handler?.failed(e?.data?.message ?? e.message ?? e?.reason ?? "Error Occured");
	}
}

const withdrawTokenFee = async (_signer, _handler)=>{
	try{
		if(!_signer)
			return _handler.failed("No signer");
		_handler.process("Preparing");
		const factory = getTokenFactoryContract(_signer);
		if(await factory.owner() !== await _signer.getAddress()){
			_handler.failed("Only owner allowed");
			return;
		}
		
		const _allFee = await factory.getRecievedFee();
		if(Number(_allFee)===0){
			_handler.failed("No fee to withdraw");
		}
		async function next(){
			try{
				_handler.process("Withdrawing");
				let result = await factory.withdrawFee();
				let reciept = await result.wait();
				_handler.success("Successful",()=>window.open(viewExplorer(reciept.transactionHash),'_blank'));
			}catch(e){
				_handler?.failed(e?.data?.message ?? e.message ?? e?.reason ?? "Error Occured");
			}
		}

		_handler.info(`Do you want to Withdraw Fee ${ethers.utils.formatEther(_allFee)}BNB`,next);
	}catch(e){
		_handler?.failed(e?.data?.message ?? e.message ?? e?.reason ?? "Error Occured");
	}
}


// handler.success("Successful",()=>window.open(viewExplorer(reciept.transactionHash),'_blank'));
export {createToken, tokenInfo, createdTokens, createLaunchPad, createdPads, launchPadInfo, withdrawTokenFee, withdrawLaunchFee, purchase, listLaunchPad, launchInfo, completePreSale};