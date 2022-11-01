import * as helper from './web3Helper';
import * as contract from './contract';
import config from './config';

const tokenFactoryAddress = config.tokenFactoryAddress;//"0x0AED08168aE1Aa0E363877D34BD7b094Bc7e4f0b";

const getTokenFactory = (signer)=>
					helper.getContract(tokenFactoryAddress, 
						contract.tokenFactoryABI, 
						signer||helper.defaultProvider);

const plug = {};

const getTokenInfo = async (provider, address)=>{
	const token = await helper.fetchToken(address, provider);
	const info  = {};
	info.name = token.name; 
	info.symbol = token.symbol;
	info.decimals = Number(token.decimals);
	info.totalSupply = token.format(await token._token.totalSupply());
	try{
		info.owner = await token._token.owner();
	}catch(e){
		info.owner = null;//not all contracts have owner
	}
	return info;
}

plug.createdTokens = async (signer)=>{
	const tf = getTokenFactory(signer);
	return await tf.createdToken();
}

const __tokenType = {
  standard:0,
  reflect:1,
  liquid:2
}

const __createToken = async(factory, fee, __type, {name, symbol, decimals, totalSupply, taxBps, liqBps})=>{
  let result;
  console.log(__type);
  console.log(name, symbol, decimals, totalSupply, taxBps, liqBps)
  switch(__type){
    case __tokenType.reflect:
      result = await factory.createReflectToken(name, symbol, decimals, totalSupply,{value:fee});
      break;
    case __tokenType.liquid:
      result = await factory.createLiquidToken(name, symbol, decimals, totalSupply, taxBps, liqBps, {value:fee});
      break;
    default:
      result = await factory.createStandardToken(name, symbol, decimals, totalSupply,{value:fee});
      break;
  }
  //console.log("Result ",result);
  const reciept = await result.wait();
  //return reciept.events[(reciept.events.length - 1)].args.token;//created token address
  return reciept.transactionHash;
}

const createToken = async (signer, tokenData,  _handler)=>{
  	helper.needSigner(signer);
	
	const factory = getTokenFactory(signer);
		
	const fee = await factory.fee();//get Fee to be paid
	_handler.process(`Creating Token ${helper.formatEther(fee)}BNB is required to be paid`);

	const _data = {...tokenData};
	_data.decimals = +_data.decimals;
	_data.totalSupply = helper.parseUnits(_data.totalSupply, _data.decimals);
	_data.taxBps = helper.percentToBps(+_data.tax||0);
	_data.liqBps = helper.percentToBps(+_data.liq||0);

	const newTokenAddress = await __createToken(factory, fee, +tokenData.type, _data);
	
	return newTokenAddress; 
}

plug.createToken = (signer, data, _handler)=>{
  helper.executeTask(
  ()=>createToken(signer, data, _handler),
  tx=>_handler?.success("Token Created",()=>helper.explorerWindow(tx)),
  _handler?.failed
  );
}


plug.__withdrawFee = async(_signer, _handler, getFactory)=>{
	helper.needSigner(_signer);

	const factory = getFactory(_signer);

	_handler.process("Preparing");

	if(await factory.owner() !== await _signer.getAddress()){
		throw Error("Only owner allowed");
		//return;
	}

	const _allFee = await factory.getRecievedFee();
	
	if(Number(_allFee)===0){
		throw Error("No fee to withdraw");
	}

	const next = ()=>{
		helper.executeTask(
			async ()=>{
				_handler.process("Withdrawing");
				let result = await factory.withdrawFee();
				let reciept = await result.wait();
				return reciept.transactionHash;
			},
			(tx)=>_handler.success("Successful",()=>helper.explorerWindow(tx)),
			_handler?.failed
		)
	}
	_handler.info(`Do you want to Withdraw Fee ${helper.formatEther(_allFee)}BNB`,next);
}

plug.withdrawTokenFee = (_signer, _handler)=>{
	helper.executeTask(
		()=>plug.__withdrawFee(_signer, _handler, getTokenFactory),
		()=>{},
		_handler?.failed
	);
}

plug.factoryOwner = ()=>{
	return getTokenFactory().owner();
}

plug.tokenInfo = async (_address)=>getTokenInfo(null, _address);

export default plug;