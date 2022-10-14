const ethers = require('ethers');

const {ChainId, Token, TokenAmount, Pair, Fetcher, Route, Trade, TradeType, Percent}  = require('@pancakeswap-libs/sdk-v2');


//BNB BUSD CAKE BTCB => common bases first five
const token_list = require('./token_list');

const allToken = token_list.map(d=>new Token(d.chainId, d.address, d.decimals, d.symbol, d.name));

const provider = new ethers.providers.JsonRpcProvider(
  "https://bsc-dataseed.binance.org/",
  { name: "binance", chainId: 56 }
);

const getRawTokenById  = (id)=>token_list[id];
const getToken = (id)=>allToken[id];

let pairDB = {};
const setPair = (_pair)=>{
	pairDB = {...pairDB,..._pair};
};

const getPairKey = (tokens)=>tokens.map(t=>t.name).sort().join('/');

const getPairsCache = async (provider, tokens, _pairDB, setPair)=>{
    let key = getPairKey(tokens);
    console.log(_pairDB);
    if(!_pairDB[key] || _pairDB[key].length==0){
      let pair = await makePair(provider, tokens);
      setPair({[key]:pair});
      return pair;
    }
    return _pairDB[key];
}

const getPairs = async (provider, tokens)=>{
    let pair = await makePair(provider, tokens);
    return pair;
}


const baseToken = allToken.slice(0,4);

const fetchPair = async (provider, tokens)=>{
	let pair = await Fetcher.fetchPairData(tokens[0], tokens[1], provider);
	return pair;
} 

const makePair = async(provider, tokens)=>{
	let pairList = [];
  try{
    let pair = await fetchPair(provider, tokens);
    pairList.push(pair);
    //console.log('Fetched Pair for =>',getPairKey(tokens));
  }catch(e){
  //	console.log("Error=>",e.message??e.reason??e);
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
				let pair = await fetchPair(provider, [tokens[j], baseToken[k]]);
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

const run = async (_inputValue, inputId, outputId, _slipPercent)=>{
	const inputValue = _inputValue.toString();
	//convert ETH to WEI
	const inputAmountMax = ethers.utils.parseEther(inputValue);

	//getToken
	const tokens = [getToken(inputId), getToken(outputId)]
	const pairs = await getPairs(provider, tokens, pairDB, setPair);
	
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

// run(5, q_in, q_out, slipPercent);

// run(11, 44, 49, slipPercent);

// run(23, 18, 32,slipPercent);



const tokenABI = [
  "function allowance(address owner, address spender) external view returns (uint256);",
  "function approve(address spender, uint256 amount) external returns (bool);",
  "function balanceOf(address account) external view returns (uint256);"
  ];

const routerABI = [
  "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)",
  "function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",
  "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)"
  ];


const routerAddress = '';
const routerContract = {};//new ethers.Contract(routerAddress, routerABI);

const exchangeNetwork = async(signer, inputToken, outputToken, inputValue, outputValue, deadlineInMinute, path)=>{
  
  const deadline = Math.floor(Date.now()/1000) + deadlineInMinute*60;
  
  const myAddress = await signer.getAddress();
  
  const router= await routerContract.connect(signer);
  
  let result;
  let reciept;
  
  if(inputToken.symbol === "ETH"){
    //swapExactETHForTokens
    result = router.swapExactETHForTokens(outputValue, path, myAddress, deadline, {value:inputValue});
  }
  else{
    const tokenContract = new ethers.Contract(inputToken.address, tokenABI, signer);
    let approveResult = tokenContract.approve(router.address, inputValue);
    let approveReciept = await approveResult.wait();
    let _func;
    
    if (outputToken === "ETH"){
    	//swapExactTokensForETH
    	_func = router.swapExactTokensForETH;
    }
    else{
    	//swapExactTokensForTokens
    	_func = router.swapExactTokensForTokens;
    }

    result = _func(inputValue, outputValue, path, myAddress, deadline);
  }
  reciept = await result.wait();
  return reciept;
}


module.exports = {exTrade, getToken, getPairsCache, getPairs, makeTrade};