import {ethers} from 'ethers';
import axios from 'axios';

import {Token, TokenAmount, Fetcher, Trade, Percent} from '@pancakeswap-libs/sdk-v2';

//BNB BUSD CAKE BTCB => common bases first five
import token_list from './token_list';


import * as helper from '../web3Helper';

import {swapABI} from '../contract';


//MAINNET CHAINID USED
//const allToken = token_list.map(d=>new Token(d.chainId, d.address, d.decimals, d.symbol, d.name));


const provider = /*helper.defaultProvider*/ new ethers.providers.JsonRpcProvider(
  "https://bsc-dataseed.binance.org/",
  { name: "binance", chainId: 56 }
);


/**Addres ro deployed **/
const __tokenServerAddr = "http://localhost:4000";
/**address to deployd*/


let __tokenList = [...token_list];

let fetched = false;

const getTokenList = async ()=>{
	if(token_list.length === __tokenList.length){
		try{
			const {data} = await axios.get(__tokenServerAddr);
			if(data[data.length-1].address !== __tokenList[__tokenList.length-1].address){
				__tokenList = [...__tokenList, ...data];
			}
		}catch(e){
			console.log("Network=>", e)
		}
	}
	return __tokenList;
}

getTokenList();


const __token = (d)=>new Token(d.chainId??56, d.address, d.decimals, d.symbol, d.name);

const _getWrapToken = (id)=>__token(__tokenList[id]);


const getRawTokenById  = (id)=>__tokenList[id];

const getToken = (id)=>_getWrapToken(id);

let pairDB = {};

const setPair = (_pair)=>{
	pairDB = {...pairDB,..._pair};
};

const getPairKey = (tokens)=>tokens.map(t=>t.name).sort().join('/');

const getPairsCache = async (tokens, _pairDB, setPair)=>{
    let key = getPairKey(tokens);
    console.log(_pairDB);
    if(!_pairDB[key] || _pairDB[key].length==0){
      let pair = await makePair(tokens);
      setPair({[key]:pair});
      return pair;
    }
    return _pairDB[key];
}

const getPairs = async (tokens)=>{
    let pair = await makePair(tokens);
    return pair;
}

const baseToken = Array(4).fill(0).map((x,i)=>_getWrapToken(i+1));//slice(1,5).map();

const fetchPair = async (tokens)=>{
	let pair = await Fetcher.fetchPairData(tokens[0], tokens[1], provider);
	return pair;
} 

const makePair = async(tokens)=>{
	let pairList = [];
  try{
    let pair = await fetchPair(tokens);
    pairList.push(pair);
    //console.log('Fetched Pair for =>',getPairKey(tokens));
  }catch(e){
  //console.log("Error=>",e.message??e.reason??e);
  	console.log("No pair for =>",getPairKey(tokens));
  //	console.log('------------');
  }

  if(!pairList[0]){
  	for(let k = 0; k<baseToken.length;k++){
  		try{
  			if(tokens.includes(baseToken[k])){
  				continue;
  			}

	  		let temp_pair = [];
			for(let j = 0; j<2; j++){
				let pair = await fetchPair([tokens[j], baseToken[k]]);
				temp_pair.push(pair);
			}
			pairList = pairList.concat(temp_pair);
			//console.log('Fetched Base', baseToken[k].name);
		}catch(e){
				//console.log("Error=>",e.message??e.reason??e);
				//console.log('------------');
				console.log('Skipped Base=>',baseToken[k].name);
  			//	console.log('------------');
		}
    }
  }
  return pairList;
}


const makeTrade = (pairs,inputValue,tokens)=>{
  const trade = Trade.bestTradeExactIn(pairs, new TokenAmount(tokens[0], inputValue), tokens[1]);
  return trade
}

const exTrade = (trade, _percent)=>{//from 0.5 => 10
  let slipagePercent = new Percent(_percent*10,1000);
  let outputValue = trade.minimumAmountOut(slipagePercent);
  return [outputValue, slipagePercent];
}

const test = async (_inputValue, inputId, outputId, _slipPercent)=>{
	const inputValue = _inputValue.toString();
	//convert ETH to WEI
	const inputAmountMax = ethers.utils.parseEther(inputValue);

	//getToken
	const tokens = [getToken(inputId), getToken(outputId)]
	const pairs = await getPairs(tokens, pairDB, setPair);
	
	console.log();
	if(pairs.length == 0){
		console.log(`+++>>>>>No pairs for => ${tokens[0].name}=>${tokens[1].name}`)
		console.log('-------------------');
		return;
	}else{
		console.log(`===>>${tokens[0].name}=>${tokens[1].name}<<===`);
	}
	
	const trades = makeTrade(pairs, inputAmountMax, tokens);
	
	console.log("Trade Input = ", trades[0].inputAmount.toSignificant(6));
	for(let trade of trades){
		console.log();
		const [outputAmountMin, slipagePercent]  = exTrade(trade, _slipPercent);
		console.log(`slipPercent=> `, slipagePercent.toSignificant(4));
		console.log(`Paths => `,trade.route.path.map(t=>t.symbol).join(' > '));
		console.log("OutputAmountMin =>", outputAmountMin.toSignificant(6));
		console.log("Execution Price", trade.executionPrice.toSignificant(18));
		console.log("Trade Output = ", trade.outputAmount.toSignificant(6));
		console.log();
		console.log('-----------');
	}
	//console.log("slippageTolerance =>", slippageTolerance.toSignificant(3));
}


// const q_in = 5;
// const q_out = 11;
// const slipPercent = 5;

// test(5, q_in, q_out, slipPercent);

// test(11, 44, 49, slipPercent);

// test(23, 18, 32,slipPercent);



const tokenABI = [
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function balanceOf(address) public view returns (uint256)"
  ];

const routerABI = [
  "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)",
  "function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",
  "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)"
  ];


const routerAddress = '0x10ED43C718714eb63d5aA57B78B54704E256024E';
const routerContract = new ethers.Contract(routerAddress, routerABI);

const exchangeNetwork = async(signer, inputToken, outputToken, _inputValue, _outputValue, deadlineInMinute, path, handler)=>{
  
  try{
    const deadline = Math.floor(Date.now()/1000) + deadlineInMinute*60;
    let inputValue = ethers.utils.parseEther(_inputValue);
    let outputValue = ethers.utils.parseEther(_outputValue);
    handler.process("Connecting to Router");
    const myAddress = await signer.getAddress();
    
    const router= await routerContract.connect(signer);
    
    let result;
    let reciept;
    
    if(inputToken.symbol === "WBNB"){
      //swapExactETHForTokens
      let acc_balance = await signer.getBalance();

      if(acc_balance<inputValue)
          throw Error("Not Sufficient Acc. Balance");
      handler.process("Swapping BNB for Token");
      result = await router.swapExactETHForTokens(outputValue, path, myAddress, deadline, {value:inputValue});
    }
    else{
      handler.process("Connecting to Token Contract");
      
      const tokenContract = new ethers.Contract(inputToken.address, tokenABI, signer);
      /*const tokenContract = await tokenContractBase.connect(signer);*/
      handler.process("Checking Allowance");
      
      let acc_balance = await tokenContract.balanceOf(myAddress);
      alert(acc_balance);
      if(acc_balance<inputValue)
          throw Error("Not Sufficient Acc. Balance");
      
      let allowance  = await tokenContract.allowance(myAddress, router.address);
      
      if(allowance<inputValue){
        handler.process("Router requesting approval");
        let approveResult = await tokenContract.approve(router.address, inputValue);
        let approveReciept = await approveResult.wait();
      }
      let _func;
      
      if (outputToken.symbol === "WBNB"){
      	//swapExactTokensForETH
        handler.process("Swapping Token for BNB");
      	_func = router.swapExactTokensForETH;
      }
      else{
      	//swapExactTokensForTokens
        handler.process("Swapping Token for Token");
      	_func = router.swapExactTokensForTokens;
      }

      result = await _func(inputValue, outputValue, path, myAddress, deadline);
    }
    reciept = await result.wait();
    handler.success("Successful",()=>helper.explorerWindow(reciept.transactionHash));
    return reciept;
  }catch(e){

    handler?.failed(e?.data?.message ?? e.message ?? e?.reason ?? "Error Occured");
    console.log(e);
  }
}


const swapAddress = "0xd2c95dD3709BB4531cEE0C8C3EDE3819f6505974";

const getSwap = (signer)=>helper.getContract(swapAddress, swapABI, signer);

const swapExchangeNetwork = async(signer, inputToken, outputToken, _inputValue, _outputValue, deadlineInMinute, path, handler)=>{
  
  try{
    const deadline = Math.floor(Date.now()/1000) + deadlineInMinute*60;
    let inputValue = ethers.utils.parseEther(_inputValue);
    let outputValue = ethers.utils.parseEther(_outputValue);
    handler.process("Connecting to Swap");
    
    const router= getSwap(signer);
    
    const fee = await router.fee();
    console.log(fee);
    
    let result;
    let reciept;
    
    if(inputToken.symbol === "WBNB"){
      //swapExactETHForTokens
      let acc_balance = await signer.getBalance();

      if(acc_balance<inputValue)
          throw Error("Not Sufficient Acc. Balance");
      handler.process(`Swapping BNB for Token : charges ${helper.formatEther(fee)}`);
      result = await router.swapExactETHForTokens(outputValue, path,  deadline, {value:(inputValue + fee)});
    }
    else{
      handler.process("Connecting to Token Contract");
      
      const tokenContract = helper.getToken(inputToken.address, signer);
      /*const tokenContract = await tokenContractBase.connect(signer);*/
      handler.process("Checking Allowance");
      const myAddress = await signer.getAddress();
      let acc_balance = await tokenContract.balanceOf(myAddress);
      
      if(acc_balance<inputValue)
          throw Error("Not Sufficient Acc. Balance");
      
      let allowance  = await tokenContract.allowance(myAddress, router.address);
      
      if(allowance<inputValue){
        handler.process("Router requesting approval");
        let approveResult = await tokenContract.approve(router.address, inputValue);
        let approveReciept = await approveResult.wait();
      }

      let _func;
      
      if (outputToken.symbol === "WBNB"){
        //swapExactTokensForETH
        handler.process(`Swapping Token for BNB  :charges ${helper.formatEther(fee)}`);
        _func = router.swapExactTokensForETH;
      }
      else{
        //swapExactTokensForTokens
        handler.process(`Swapping Token for Token : charges ${helper.formatEther(fee)}`);
        _func = router.swapExactTokensForTokens;
      }

      result = await _func(inputValue, outputValue, path, deadline, {value:fee});
    }
    reciept = await result.wait();
    handler.success("Successful",()=>helper.explorerWindow(reciept.transactionHash));
    return reciept;
  }catch(e){

    handler?.failed(e?.data?.message ?? e.message ?? e?.reason ?? "Error Occured");
    console.log(e);
  }
}

const addToken = (addr,logo, _handler)=>{
	addr = addr.trim();
	helper.executeTask(
		async ()=>{
			if(addr=="" || logo=="")
				throw Error("Correct Input");
			if(__tokenList.filter(x=>x.address===addr.trim()).length!=0)
				throw Error("Already Exist")
			_handler.process("Fetching Token info");
			let tk;
			try{
				tk = await helper.fetchToken(addr,provider);
			}catch(e){
				console.log(e);
				throw Error("Token Does not exist");	
			}
			_handler.process(`Checking for pair on ${tk.name}`)
			const list = await makePair([__token({address:addr,...tk}),...baseToken]);
			console.log(list)
			if(list.length===0)
				throw Error("Pair does notn exist");

			_handler.process(`Adding`);
			let {name, decimals, symbol} = tk;
			try{
				const result = await axios.post(__tokenServerAddr,{name, decimals, symbol, address:addr, logoURI:logo});
        console.log(result);
				return result;
			}catch(e){
				throw Error(e.response.data.msg);
			}
		},
		({data})=>{_handler.success(`Added ${data.name}`); setTimeout(window.location.reload, 5000);},
		_handler.failed
	)
	

}

export {exTrade, getToken, getPairsCache, getPairs, makeTrade, exchangeNetwork, swapExchangeNetwork, getTokenList, addToken};