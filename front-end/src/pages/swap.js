import React,{useState, useEffect, useReducer, useCallback, useMemo} from 'react';
import {ethers} from 'ethers';
import {useQSigner} from '../upgrade/web3Helper';
import {useSigner} from '@web3modal/react';
import Swap from '../components/swap-modal/swap';
import {exTrade, getToken, getPairs, makeTrade, swapExchangeNetwork, getTokenList, addToken} from '../upgrade/swap/main';
import defaultController,{statusCreate} from '../components/customModal/controller';
import useModal from '../components/customModal/useModal';
import {Base} from '../components/customModal/model';

const exchangeNetwork = swapExchangeNetwork;

const TICKER = 10000;//every 10 seconds

const useGetTokenList = ()=>{
  const [db, setDB] = useState([]);

  useEffect(()=>{
    getTokenList().then(setDB);
  },[]);

  return db;
}

const SwapContainer  = ()=>{
  const rawToken = useGetTokenList();
	const {data:signer} = useSigner();

	//output display
	const [oV, setOv] = useState();
  const [price, setPrice] = useState(0);
	
	//form field
	const [iV, setIv] = useState();
  const [tokens, setTokens] = useReducer((state, action)=>{setOv();return {...state, ...action}},{first:0, second:1});
	const [slip, setSlip] = useState(0);
	const [deadline, setDeadline] = useState(1);

	//pairs and trade
	const [pairs, setPairs] = useState([]);
	const [trade, setTrade] = useState();
	const [status, setStatus] = useState("Idle");

  //convert ETH to WEI
  const inputAmountMax = useMemo(()=>ethers.utils.parseEther(iV?.length>0?iV:'0'),[iV]);

  const _tokens = useMemo(()=>[getToken(tokens.first), getToken(tokens.second)],[tokens]);
  //console.log(_tokens);
  //Pairs update
  //every 20sec

  useEffect(()=>{
    let ktimeout;
    let initialToken = _tokens;
    setPrice();
    setPairs(null);

    async function run(){
      let pairs = await getPairs(_tokens);
      if(pairs.length !==0 || initialToken !== _tokens){
        setPairs(pairs);
      }
      else{
        setStatus("---->>>---->>>----->>>---");
      }
      ktimeout = setTimeout(run, TICKER);//get pairs update
    }
    run();
    return ()=>{clearTimeout(ktimeout);}
  },[_tokens]);

  useEffect(()=>{
       if(inputAmountMax<=0)
          return;
        setStatus("Loading");

        if(pairs?.length > 0){
          let _trade = makeTrade(pairs, inputAmountMax, _tokens)[0];
          if(_trade){
            setOv(exTrade(_trade, slip)[0].toSignificant(8));
            setPrice(`${_trade.executionPrice.toSignificant(8)} ${_tokens[1].symbol} per ${_tokens[0].symbol}`);
            setStatus(`Paths: ${_trade.route.path.map(t=>t.symbol).join(' > ')}`); 
            setTrade(_trade);
          }
        }
      },
      [_tokens, inputAmountMax, pairs, slip]);

  const _setIv = useCallback((d)=>{
      if(d.length === 0){
        setOv();
        setIv();
        setPrice();
        return;
      }
      setIv(d);
      },[]);

  const [active, setActive] = useState();

  const {View, update} = useModal({Controller:defaultController});
  const actionUpdateList = useMemo(() => ({process:value=>statusCreate.process(update, value),
                                  success:(value,explorer)=>statusCreate.success(update, value, {explorer}),
                                   failed:value=>statusCreate.failed(update, value),
                                   info:(value, Proceed)=>statusCreate.info(update, value, {Proceed})}), [update]);

  const _cancel = ()=>{
    setActive(false);
    statusCreate.reset(update);
  }

  const _addToken = useCallback((addr, logo)=>{
    addToken(addr,logo, actionUpdateList);
  },[actionUpdateList]);

  const _swap = useCallback(async()=>{
  setActive(false);
  if(!trade){
    actionUpdateList.failed("Can not trade");
    return;
  }else if(!signer){
    actionUpdateList.failed("Signer Needed");
    return;
  }else if(!iV || !oV){
    actionUpdateList.failed("Amount not completed");
    return;
  }
  let path = trade.route.path.map(t=>t.address);
  //console.log(trade.route.path)
  
  await exchangeNetwork(signer, ..._tokens,iV, oV, deadline, path, actionUpdateList);
  },[signer, _tokens, iV, oV, deadline, trade, actionUpdateList]);
  
	return (
		<>
    {!active && <Swap {...{addToken:_addToken,rawToken, iV, oV, setOv, tokens, setTokens, setIv:_setIv, slip, setSlip, deadline, setDeadline, price, status, submit:()=>setActive(true)}}/>}
    {active && <Base content={`Ready To Swap\n${iV??0} ${_tokens[0].symbol} \nfor mininum of \n
    ${oV??0} ${_tokens[1].symbol} \n<=> \n Deadline: in next ${deadline}minute\n
    Slippage: ${slip}%`} handlers={{Cancel:_cancel,Proceed:_swap}}/>}
    <View/>
    </>
  );
}


export default SwapContainer;