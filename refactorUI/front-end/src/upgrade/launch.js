import * as helper from './web3Helper';
import * as contract from './contract';
import tkLib from './create_token';

const launchFactoryAddress = "0x9c74ce055F8843Fb7762899fB76dc7DA8A17ACaD";//"0x00910c9cBe37dbC92462eE32E7C15621144AF206";

const getLaunchFactory = (signer)=>
					helper.getContract(launchFactoryAddress, 
						contract.launchFactoryABI, 
						signer||helper.defaultProvider);

const getLaunchPad = (_addr, _signer)=>helper.getContract(_addr, contract.launchPadABI, _signer||helper.defaultProvider);

const plug = {};

plug.withdrawLaunchFee = (_signer, _handler)=>{
	helper.executeTask(
		()=>tkLib.__withdrawFee(_signer, _handler, getLaunchFactory),
		()=>{},
		_handler?.failed
	);
}


const LaunchFeeOption = [//tokenfeeBps and BnbfeeBps
            [0,500],
            [200,200],
            [0,300]
        ]

const createLaunchPad = async (signer, _d, _handler)=>{
	helper.needSigner(signer);


	const factory = getLaunchFactory(signer);

	_handler.process("Getting amount of token needed");
	
	const d = {..._d};

	let _token = await helper.fetchToken(d.tokenAddress, signer);

	d.capped = helper.parseEther(d.capped);
	d.presale = _token.parse(d.presale);
	d.dexsale = _token.parse(d.dexsale);
	d.minbuy = helper.parseEther(d.minbuy);
	d.maxbuy = helper.parseEther(d.maxbuy);
	d.dexBps = helper.percentToBps(+d.dexpercent);
	console.log(d.dexBps);
	d.bnbFeeBps = LaunchFeeOption[+d.type||0][1];
	d.tkFeeBps = LaunchFeeOption[+d.type||0][0];
	console.log(d);
	console.log(d.capped)
	const totalTokenNeeded = await factory.totalTokenNeeded(d.capped, d.presale, d.dexsale, d.dexBps, d.bnbFeeBps, d.tkFeeBps);
	console.log(_token.format(totalTokenNeeded));
	_handler.process(`Need ${_token.format(totalTokenNeeded)} amount of token for presale`);
	
	const token_contract = _token._token;
	let result = await token_contract.approve(launchFactoryAddress, totalTokenNeeded);
	
	await result.wait();

	const fee = await factory.fee();//get Fee to be paid
	
	_handler.process(`Creating Token fee=> ${helper.formatEther(fee)} is required to be paid`);
	
	
	try{//since both busd and bnb are 18decimals
		result = await factory.pank(+d.type||0, d.tokenAddress, [d.isBNB, d.whitelist], [d.dexBps ,d.lockup], [d.capped, d.presale, d.dexsale, d.minbuy, d.maxbuy, d.starttime, d.endtime],
					d.cid);
	}catch(e){
		console.log(e);
		throw e;
	}
	const reciept = await result.wait();
	
	const newAddress = reciept.events[reciept.events.length - 1].args.pad;

	return newAddress; 
}


plug.createLaunchPad = (signer, data, _handler)=>{
	helper.executeTask(
		()=>createLaunchPad(signer, data, _handler),
		(tx)=>_handler.success(`LaunchPad Created`,()=>helper.explorerWindow(tx)),
		e=>{_handler?.failed(e);console.log(e)}
	);
}

plug.listLaunchPad = async function*(signer){
	const factory = getLaunchFactory(signer);
	let lent = Number(await factory.lengthOfAllPads());
	if(lent === 0)
		return;
	for(let i=lent - 1;i>=0;i--){
		yield factory.allPads(i);
	}
}


plug.launchPadInfo = async(provider, address)=>{
	
	const launch = getLaunchPad(address, provider);
	
	let db = {};
	db.tokenAddress = await launch.saleToken();
	let _token = await helper.fetchToken(db.tokenAddress);
	db.baseTk = Number(await launch.payType())===0?"BNB":"BUSD";
	db.presaleAmount = _token.format(await launch.tokenForPreSale());
	db.participant = Number(await launch.totalParticipant());
	db.presale = _token.format(await launch.preSaleRate());
	db.dexsale = _token.format(await launch.dexSaleRate());
	db.capped = helper.formatEther(await launch.capped());
	db.dexpercent = helper.bpsToPercent(await launch.dexBps());
	db.lockup = Number(await launch.LpTokenLockPeriod());
	db.starttime = (new Date(Number(await launch.startTime())*1000)).toLocaleString();
	db.endtime = (new Date(Number(await launch.endTime())*1000)).toLocaleString();
	db.minbuy = helper.formatEther(await launch.minPurchasePrice());
	db.maxbuy = helper.formatEther(await launch.maxPurchasePrice());
	db.cid = await launch.infoHash();
	db.remaining = _token.format(await launch.remainingToken());
	db.complete = await launch.preSaleCompleted();
	db.purchased = await launch.investedAmount(await provider?.getAddress());
	if(db.purchased>0)
		db.purchased = _token.format(db.purchased);
	else
		db.purchased = Number(db.purchased);
	db.owner = await launch.owner();
	console.log(db)
	return db;
}


plug.launchInfo = async(provider, address)=>{
	const launch = getLaunchPad(address, provider);
	
	let db = {};
	db.tokenAddress = await launch.saleToken();
	let _token = await helper.fetchToken(db.tokenAddress);
	db.baseTk = Number(await launch.payType())===0?"BNB":"BUSD";
	db.presale = _token.format(await launch.preSaleRate());
	db.presaleAmount = _token.format(await launch.tokenForPreSale());
	db.remaining = _token.format(await launch.remainingToken());
	db.participant = Number(await launch.totalParticipant());
	db.capped = _token.format(await launch.capped());
	db.cid = await launch.infoHash();
	db.complete = await launch.preSaleCompleted();
	return db
}


const completePreSale = async (provider, address, _handler)=>{
	_handler.process("Ending");
	const launch = getLaunchPad(address, provider);
	let result = await launch.completePreSale();
	await result.wait();
}


plug.completePreSale = (provider, address, _handler)=>{
	helper.executeTask(
		()=>completePreSale(provider, address, _handler),
		()=>_handler.success("Done"),
		_handler?.failed
	)
}

plug.createdPads = (provider)=>{
	const pads = getLaunchFactory(provider);
	return pads.createdPad();
} 

const purchase = async(provider, address,  amount, _handler)=>{
	helper.needSigner(provider);
	const launch = getLaunchPad(address, provider);
	const baseTk = Number(await launch.payType())===0;
	let result;
	
	const sToken = await helper.fetchToken(await launch.saleToken(), provider);

	if(baseTk){
		let price = helper.parseEther(amount);
		let value = sToken.format(await launch.calculateToken(price));
		_handler.process(`purchasing ${value}${sToken.symbol||''} for ${amount}BNB`);
		result = launch.purchaseTokenByBNB({value:price});
	}else{

		const token  = helper.getToken(await launch.buyToken(), provider);

		let price = helper.parseEther(amount);

		_handler.process(`seeking approval ${amount}BUSD`);
		result = await token.approve(launch.address, price);
		await result.wait();
		let value = sToken.format(await launch.calculateToken(price), token.decimals);
		_handler.process(`purchasing ${value}${sToken.symbol||''} for ${amount}BUSD`);
		//console.log(price);
		result = await launch.purchaseTokenByToken(price);
	}
	let reciept = await result.wait();
	return reciept.transactionHash;
}

plug.purchase = (provider, address,  amount, _handler)=>{
	helper.executeTask(
		()=>purchase(provider, address,  amount, _handler),
		(tx)=>_handler.success("Successful",()=>helper.explorerWindow(tx)),
		_handler?.failed
	);
}

plug.extend = (provider, address, _date, _handler)=>{
	helper.executeTask(
		async ()=>{
			helper.needSigner(provider);
			const launch = getLaunchPad(address, provider);
			const result = await launch.extend(Math.floor(+_date/1000));
			await result.wait();
		},
		()=>_handler.success("Successful"),
		_handler?.failed
	);
}
export default plug;