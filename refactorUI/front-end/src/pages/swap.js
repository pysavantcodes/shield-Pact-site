import React,{useState, useEffect, useReducer, useCallback, useMemo} from 'react';
import {ethers} from 'ethers';
import styled from 'styled-components';
import Swap from '../components/swap-modal/swap';
import SwapError from '../components/swap-modal/swapError';
import SwapSuccess from '../components/swap-modal/swapSuccess';
import {exTrade, getToken, getPairs, makeTrade} from '../swap/main';

const _default_provider = new ethers.providers.JsonRpcProvider(
  "https://bsc-dataseed.binance.org/",
  { name: "binance", chainId: 56 }
);

const getProvider = (_provider)=>{
  return _provider??_default_provider;
}

const TICKER = 10000;//every 10 seconds

const SwapContainer  = ()=>{
	//const {data:signer} = useSigner();
	const signer = null;

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
	//const [trade, setTrade] = useState();
	const [status, setStatus] = useState("Idle");

  //convert ETH to WEI
  const inputAmountMax = useMemo(()=>ethers.utils.parseEther(iV?.length>0?iV:'0'),[iV]);

  const _tokens = useMemo(()=>[getToken(tokens.first), getToken(tokens.second)],[tokens]);

  //Pairs update
  //every 20sec
  useEffect(()=>{
    let ktimeout;
    let initialToken = _tokens;
    setPrice();
    setPairs(null);

    async function run(){
      let pairs = await getPairs(getProvider(signer), _tokens);
      if(pairs.length !=0 || initialToken !== _tokens){
        setPairs(pairs);
      }
      else{
        setStatus("---->>>---->>>----->>>---");
      }
      setTimeout(run, TICKER);//get pairs update
    }
    run();
    return ()=>clearTimeout(ktimeout)
  },[_tokens, signer]);

  useEffect(()=>{
       if(inputAmountMax<=0)
          return;
        setStatus("Loading");

        if(pairs?.length > 0){
          let trade = makeTrade(pairs, inputAmountMax, _tokens)[0];
          if(trade){
            setOv(exTrade(trade, slip)[0].toSignificant(8));
            setPrice(`${trade.executionPrice.toSignificant(8)} ${_tokens[1].symbol} per ${_tokens[0].symbol}`);
            setStatus(`Paths => ${trade.route.path.map(t=>t.symbol).join(' > ')}`);  
          }
        }
      },
      [signer,_tokens, inputAmountMax, pairs, slip]);

  const _setIv = useCallback((d)=>{
      if(d.length == 0){
        setOv();
        setIv();
        setPrice();
        return;
      }
      setIv(d);
      },[])
 
	return (
		<Swap {...{iV, oV, setOv, tokens, setTokens, setIv:_setIv, slip, setSlip, deadline, setDeadline, price, status}}/>
	);
}

const PayContainer = ()=>{
  return <SwapSuccess/>
}

const Container = ()=>{
  return (
    <>
      <SwapContainer/>
      <PayContainer/>

    </>
  )
}


export default Container;