import React, {useState, useEffect, useRef, useMemo} from "react";
import "./launchpad.css";
import {useParams} from "react-router-dom";
import * as Fa from "react-icons/fa";
import {useSigner} from '@web3modal/react';
import useModal from "../components/customModal/useModal";
import defaultController, {statusCreate} from "../components/customModal/controller";
import * as helper from '../upgrade/web3Helper';
import launchLib from '../upgrade/launch';
import tokenLib from '../upgrade/create_token';

const {createLaunchPad, createdPads, launchPadInfo, purchase, listLaunchPad, launchInfo, completePreSale} = launchLib;
const {tokenInfo} = tokenLib;

const Container  = ()=>{
	const {data:signer} = helper.useQSigner();
	const {addr} = useParams();
	return (
	<div className="launchpad">
      <section className="--full-page">
        <h1>Launched Details for {addr}</h1>
       <TokenPreSale provider={signer} address={addr}/>
      </section>
    </div>
	);
}


const TokenPreSale = ({provider, address})=>{
  const [p, setP] = useState({});
  const [d, setD] = useState({});
  const [t, setT] = useState({});
  const amount_input = useRef();
  useEffect(()=>{
      launchPadInfo(provider,address).then(d=>{
        //console.log(d);
        setP({...d, address});
        
        Promise.all([tokenInfo(d.tokenAddress), helper.IpfsGetBlob(d.cid)]).then(d=>{
          setT(d[0]);
          setD(d[1]);
          console.log(d);
        })

      });
  },[provider, address])

  const {View, update} = useModal({Controller:defaultController});


  const actionUpdateList = useMemo(() => ({process:value=>statusCreate.process(update, value),
                                  success:(value,explorer)=>statusCreate.success(update, value, {explorer}),
                                   failed:value=>statusCreate.failed(update, value),
                                   info:(value, Proceed)=>statusCreate.info(update, value, {Proceed})}), [update]);


  const purchaseBTN = ()=>{
    purchase(provider, address, amount_input.current.value, actionUpdateList);
  }

  const completePreSaleBTN = async ()=>{
  	let myAddr = await provider?.getAddress();
  	//console.log(p.owner);
  	//console.log(myAddr);

  	if(await myAddr !== p.owner){
  		actionUpdateList.failed("Not Priviledge");
  		return;
  	}
  	completePreSale(provider, address, actionUpdateList);
  }

  return (
  <div className="launchpadInfoContainer">
      <View/>
      <h1>Token Presale</h1>
      <div className="presale">
        <div className="name-icon">
          <img src={d.logo}/>
          <h4>{t.name} Presale</h4>
        </div>
        <div className="ics">
          <a href={d.website}><Fa.FaInternetExplorer id="ic" /></a>
          <a href={d.social}><Fa.FaInstagram id="ic" /></a>
          <a href={d.twitter}><Fa.FaTwitter id="ic" /></a>
        </div>
        <p>
          {d.desc}
        </p>
        <ul>
          <li>
            <p>Presale Address</p>
            <span>{p.address}</span>
          </li>
          <li>
            <p>Token Name</p>
            <span>{t.name}</span>
          </li>
          <li>
            <p>Token Symbol</p>
            <span>{t.symbol}</span>
          </li>
          <li>
            <p>Token Decimals</p>
            <span>{t.decimals}</span>
          </li>
          <li>
            <p>Token Address</p>
            <span>{p.tokenAddress}</span>
          </li>
          <li>
            <p>Total Supply</p>
            <span>{t.totalSupply} {t.symbol}</span>
          </li>
          <li>
            <p>Token for Presale</p>
            <span>{p.presaleAmount} {t.symbol}</span>
          </li>
          <li>
            <p>Presale Rate</p>
            <span>1 {p.baseTk} = {p.presale} {t.symbol}</span>
          </li>
          <li>
            <p>Listing Rate</p>
            <span>1 {p.baseTk} = {p.dexsale} {t.symbol}</span>
          </li>
          <li>
            <p>Capped</p>
            <span>{p.capped} {p.baseTk}</span>
          </li>
          
          {/*<li>
            <p>Unsold Tokens</p>
            <span>Burn</span>
          </li>
        */}
          <li>
            <p>Presale Start Time</p>
            <span>{p.starttime}</span>
          </li>
          <li>
            <p>Presale End Time</p>
            <span>{p.endtime}</span>
          </li>
          <li>
            <p>Listing On</p>
            <span>
              <a href="#">Pankcakeswap</a>
            </span>
          </li>
          <li>
            <p>Liquidity Percent</p>
            <span>{p.dexpercent}%</span>
          </li>
          <li>
            <p>Liquidity Lockup Time</p>
            <span>{p.lockup} days after pool ends.</span>
          </li>
        </ul>
      </div>

      <div className="start">
        <p>Presale starts in</p>
        {/*<div className="countdown">
          <p>01</p>
          <p>23</p>
          <p>49</p>
          <p>22</p>
        </div>*/}
        <progress value={(p.presaleAmount - p.remaining)/p.presale || 0} max={p.presaleAmount/p.presale || 0} />
        <div className="progval">
          <p>{(p.presaleAmount - p.remaining)/p.presale || 0}{p.baseTk}</p>
          <p>{p.presaleAmount/p.presale || 0}{p.baseTk}</p>
        </div>
        <label htmlFor="amount">
          Amount(max: {p.maxbuy}{p.baseTk})
        </label>
         <input ref={amount_input} type="number" id="amount" placeholder="0.0" min={p.minbuy} max={p.maxbuy}/>
        {p.completed||<button className="btn" onClick={purchaseBTN}>Buy with {p.baseTk}</button>}
        {p.completed||<button className="btn" onClick={completePreSaleBTN}>Complete</button>}
        <ul>
          <li>
            <p>Minimum Buy</p>
            <span>{p.minbuy}{p.baseTk}</span>
          </li>
          <li>
            <p>Maximum Buy</p>
            <span>{p.maxbuy}{p.baseTk}</span>
          </li>
          <li>
            <p>You Purchased</p>
            <span>{p.purchased}{p.baseTk}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Container;