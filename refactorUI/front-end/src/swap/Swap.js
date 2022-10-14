
const getTokenById  = (id)=>token_list[id];


const swapInit = (iTk, oTk)=>{
  const inputTokenProp = getTokenById(iTk);
  const outputTokenProp = getTokenById(oTk);
  
  //Token
  const inputToken = new Token();
  const outputToken = new Token();
  
  //pair
  const pair = Fetcher.fetchPairData(inputToken, outputToken, provider);
  
  //getting route
  const route = new Route([pair], inputToken);
  
  const trade = new Trade(route, new TokenAmount(inputToken, inputValue, TradeType.EXACT_OUTPUT);
  
  const slippagePercent = new Percent(5,1000);
  
  const outputValue = trade.minimumOutput(slippagePercent);

}

const routerABI = [
  "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts);",
  "function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)
  external
  returns (uint[] memory amounts);",
  "function swapExactTokensForTokens(
  uint amountIn,
  uint amountOutMin,
  address[] calldata path,
  address to,
  uint deadline
) external returns (uint[] memory amounts);", "
  ];
const routerAddress = ;
const routerContract = new ethers.Contract(routerAddress, routerContract);
const exchange = async(signer)=>{
  const contract = await routerContract.connect(signer);
  
  
}