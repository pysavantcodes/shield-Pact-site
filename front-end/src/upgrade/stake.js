import * as helper from './web3Helper';
import * as contract from './contract';
import config from './config'

const stakeAddr = config.stakeAddr;//"0x6f2326E0cB5def734Cee56fbFb9401D1F982447C";
const bonusTokenAddr = config.bonusTokenAddr;//"0xF570EFf7f847B09D1119B9a80590F10e6f458b96";

const getStake = (provider)=>helper.getContract(stakeAddr, contract.stakeABI, provider||helper.defaultProvider);

const plug = {};

plug.listStakeCenters = async ()=>{
	let stake = getStake();
	const _wbnbAddr = stake.WBNB();
	const result =  await Promise.all([stake.stakeInterest(await stake.WBNB(), bonusTokenAddr), stake.stakeInterest(config.busdAddress, bonusTokenAddr)]);
	const data = []
	if(result[0]){
		let dt = ({...result[0]})
		dt.sTk = _wbnbAddr;
		dt.bTk = bonusTokenAddr;
		dt.isBNB = true;
		data.push(dt);
	}
	
	if(result[1]){
		let dt = ({...result[1]});
		dt.sTk = config.busdAddress;
		dt.bTk = bonusTokenAddr;
		dt.isBNB = false;
		data.push(dt);
	}

	return data;
}

plug.ownedStake = async(signer)=>{
	if(!signer)
		return function*(){};

	let address = await signer.getAddress();
	let stake = getStake(signer);
	const allStake = await stake.getOwnedStake();

	return async function*(){
		for(let _id of allStake){
			let data = {...(yield stake.bank(address, _id))};
			data.isBNB = data.sTk == config.busdAddress;
			return data;
		}
	}
}

const stakeBNB = async(signer, amount, _handler)=>{
	helper.needSigner(signer);
	let stake = getStake(signer);
	const _amount = helper.parseEther(amount);
	_handler.process("Checking Balance");
	const _bal = await signer.getBalance();
	//console.log(_bal,"=",+_amount);
	if(Number(_bal) < Number(_amount)){
		throw Error("Insuffient Balance");
	}
	_handler.process("Staking");
	let result = await stake.stakeBNB(bonusTokenAddr, {value:_amount});
	let reciept = await result.wait();
	return reciept.transactionHash;
}


plug.stakeBNB = (signer, amount, _handler)=>{
	helper.executeTask(
		()=>stakeBNB(signer, amount, _handler),
		(tx)=>_handler.success(`Staked BNB`,()=>helper.explorerWindow(tx)),
		_handler?.failed
	)
}


const stakeBUSD = async(signer, amount, _handler)=>{
	helper.needSigner(signer);
	let stake = getStake(signer);
	const busdToken = helper.getToken(config.busdAddress, signer);
	const _amount = helper.parseEther(amount);
	_handler.process("Checking Balance");
	const _bal = await busdToken.balanceOf(await signer.getAddress());
	//console.log(_bal,"=",+_amount);
	if(Number(_bal) < Number(_amount)){
		throw Error("Insuffient Balance");
	}
	_handler.process(`Requesting approval for ${amount} BUSD`)
	let result = await busdToken.approve(stakeAddr, _amount);
	await result.wait();
	_handler.process("Staking");
	result = await stake.stakeToken(config.busdAddress,bonusTokenAddr, _amount);
	let reciept = await result.wait();
	return reciept.transactionHash;
}


plug.stakeBUSD = (signer, amount, _handler)=>{
	helper.executeTask(
		()=>stakeBUSD(signer, amount, _handler),
		(tx)=>_handler.success(`Staked BUSD`,()=>helper.explorerWindow(tx)),
		_handler?.failed
	);
}


const claimBNB = async(signer, id, _handler)=>{
	helper.needSigner(signer);
	let stake = getStake(signer);
	_handler.process("Claiming");
	let result = await stake.claim(id);
	let reciept = await result.wait();
	return reciept.transactionHash;
}


plug.claimBNB = (signer, id, _handler)=>{
	helper.executeTask(
		()=>claimBNB(signer, id, _handler),
		(tx)=>_handler.success(`Claimed Stake + Bonus`,()=>helper.explorerWindow(tx)),
		_handler?.failed
	);
}

plug.claimBUSD = plug.claimBNB;

const setStakeBNB = async (_signer, _reward, _totalRewardAmount, _duration, _handler)=>{
	helper.needSigner(_signer);
	let stake = getStake(_signer);
	_handler.process("Preparing");
	const token =  await helper.fetchToken(bonusTokenAddr, _signer);
	//console.log(token);
	_handler.process(`Requesting approval for ${_totalRewardAmount} ${token.symbol}`);
	let result = await token._token.approve(stakeAddr, token.parse(_totalRewardAmount));
	await result.wait();
	_handler.process("Updating Staking...");
	result = await stake.setStakeableBNB(bonusTokenAddr, helper.parseEther("1"),
			token.parse(_reward), token.parse(_totalRewardAmount), _duration);
	return (await result.wait()).transactionHash;
}

plug.setStakeBNB = (signer, _reward, _totalRewardAmount, _duration, _handler)=>{
	helper.executeTask(
		()=>setStakeBNB(signer, _reward, _totalRewardAmount, _duration, _handler),
		(tx)=>_handler.success(`Updated`,()=>helper.explorerWindow(tx)),
		_handler?.failed
	);
}


const setStakeBUSD = async (_signer, _reward, _totalRewardAmount, _duration, _handler)=>{
	helper.needSigner(_signer);
	//console.log("IN busd");
	//console.log("config=>",config.busdAddress);
	let stake = getStake(_signer);
	_handler.process("Preparing");
	const token =  await helper.fetchToken(bonusTokenAddr, _signer);
	//console.log(token);
	_handler.process(`Requesting approval for ${_totalRewardAmount} ${token.symbol}`)
	let result = await token._token.approve(stakeAddr, token.parse(_totalRewardAmount));
	await result.wait();
	_handler.process("updating Staking...");
	//console.log("Reward+>", token.parse(_reward))
	result = await stake.setStakeable(config.busdAddress, bonusTokenAddr, helper.parseEther("1"),
		token.parse(_reward), token.parse(_totalRewardAmount), _duration);
	return (await result.wait()).transactionHash;
}

plug.setStakeBUSD = (signer, _reward, _totalRewardAmount, _duration, _handler)=>{
	helper.executeTask(
		()=>setStakeBUSD(signer, _reward, _totalRewardAmount, _duration, _handler),
		(tx)=>_handler.success(`Updated`,()=>helper.explorerWindow(tx)),
		_handler?.failed
	);
}

plug.stakeOwner = (signer)=>getStake(signer).owner();

export default plug;