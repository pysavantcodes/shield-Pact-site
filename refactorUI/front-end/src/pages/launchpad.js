import React, {useState, useEffect} from "react";
import "./launchpad.css";

import * as Fa from "react-icons/fa";
import {useSigner} from '@web3modal/react';
import useModal from "../components/customModal/useModal";
import defaultController, {statusCreate} from "../components/customModal/controller";
import {createLaunchPad, createdPads, launchPadInfo, tokenInfo} from '../launchUtil/main';
import  {IpfsStoreBlob, IpfsGetBlob} from '../context/_web3_container';

//List Token

const Container = () => {
  const [launchPadList, setLaunchPadList] = useState([]);
  const {data:signer} = useSigner();
  useEffect(() => {
    if(signer)
      createdPads(signer).then(setLaunchPadList);
  }, [signer])
  return (
    <div className="launchpad">
      <section className="--full-page">
        <h1>Launched Token View</h1>
        <ul>
          {launchPadList.map(x=><li key={x}>{x}</li>)}
        </ul>
       {launchPadList.length>0 && <TokenPreSale provider={signer} address={launchPadList[1]}/>}
      </section>
    </div>
  );
};


const TokenPreSale = ({provider, address})=>{
  const [p, setP] = useState({});
  const [d, setD] = useState({});
  const [t, setT] = useState({});

  useEffect(()=>{
      launchPadInfo(provider,address).then(d=>{
        console.log(d);
        setP({...d, address});
        
        Promise.all([tokenInfo(provider, d.tokenAddress), IpfsGetBlob(d.cid)]).then(d=>{
          setT(d[0]);
          setD(d[1]);
          console.log(d[1]);
        })

      });
  },[provider, address])

  return (
  <div className="launchpadInfoContainer">
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
            <p>Token for Liquidity</p>
            <span>{p.dexsaleAmount} {t.symbol}</span>
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
        <div className="countdown">
          <p>01</p>
          <p>23</p>
          <p>49</p>
          <p>22</p>
        </div>
        <progress value={(p.presaleAmount - p.remaining)/p.presale} max={p.presaleAmount/p.presale} />
        <div className="progval">
          <p>{(p.presaleAmount - p.remaining)/p.presale}{p.baseTk}</p>
          <p>{p.presaleAmount/p.presale}{p.baseTk}</p>
        </div>
        <label htmlFor="amount">
          Amount(max: {p.maxbuy}{p.baseTk})
          <input type="number" id="amount" placeholder="0.0" />
        </label>
        <button className="btn">Buy with {p.baseTk}</button>
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

const TokenView = ()=>{
  return (
  <div className="launchpadInfoContainer">
    <div className="tokenhead">
      <img src="https://assets.coingecko.com/coins/images/1060/large/icon-icx-logo.png?1547035003" />

      <div className="ri">
        <h4>BSCPAD</h4>
        <div className="ics">
          <Fa.FaFacebook id="ic" />
          <Fa.FaInstagram id="ic" />
          <Fa.FaTwitter id="ic" />
          <Fa.FaGithub id="ic" />
          <Fa.FaDiscord id="ic" />
          <Fa.FaTelegram id="ic" />
          <Fa.FaReddit id="ic" />
        </div>
        <div className="details">
          <p className="wallet">Closed</p>
          <p className="wallet">BUSD</p>
        </div>
      </div>
    </div>
    <p style={{ fontSize: "16px" }}>
      BSCPAD is the first launchpad dedicated to launching projects on
      binance smart chain
    </p>
    <div className="rates">
      <div>
        <span>Swap Rate</span>
        <p>1 BUSD = 50 BSCPAD </p>
      </div>
      <div>
        <span>Cap</span>
        <p>525000 </p>
      </div>
      <div>
        <span>Access</span>
        <p>Private </p>
      </div>
    </div>
    <div className="progvalup">
      <span>Progress</span>
      <span>Participant <p>1091</p></span> 
    </div>
    <progress value={1000} max={1000} />
    <div className="progval">
      <p>100.00%</p>
      <p>525000.000/525000</p>
    </div>
  </div>
    );
}


export default Container;




