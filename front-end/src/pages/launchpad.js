import React, {useState, useEffect, useRef, useMemo} from "react";
import "./launchpad.css";
import {Link} from "react-router-dom";
import * as Fa from "react-icons/fa";
import {useSigner} from '@web3modal/react';
import useModal from "../components/customModal/useModal";
import defaultController, {statusCreate} from "../components/customModal/controller";
import launchLib from '../upgrade/launch';
import tokenLib from '../upgrade/create_token';
import {IpfsStoreBlob, IpfsGetBlob, useQSigner} from '../upgrade/web3Helper';

const {createLaunchPad, createdPads, launchPadInfo, purchase, listLaunchPad, launchInfo} = launchLib;
const {tokenInfo} = tokenLib;

//List Token
const Container = () => {
  const [launchPadList, setLaunchPadList] = useState([]);
  const {data:signer} = useQSigner();
  const [created, setCreated] = useState([]);
  
  useEffect(()=>{
    (async function(){
      let db = [];
      for await (let d of listLaunchPad(signer)){
        db.push(d);
        setLaunchPadList(db);
      }
    })();
  },[signer])

  useEffect(() => {
    if(signer)
      createdPads(signer).then(setCreated);
  }, [signer])

  return (
  
    <div className="launchpad">
      <section className="--full-page">
        <button className="btn" style={{margin:"0",fontSize:"12px", marginRight:"8px"}}><Link style={{color:"white"}} to="/createtoken">Create a Token</Link></button>
        <button className="btn" style={{margin:"0",fontSize:"12px"}}><Link style={{color:"white"}} to="/createlaunchpad">Create Launchpad</Link></button>
   
        <h1>Launched Token View</h1>
      {created?.length>0 ?
        <div>
          <span>Created Pads</span>
          {created.map(x=><TokenView provider={signer} address={x}/>)}
        </div>:""}
      
        <div>
          <span>All Pads</span>
          {launchPadList.map(x=><TokenView provider={signer} address={x}/>)}
        </div>
      </section>
     
    </div>
 
  );
};


const TokenView = ({provider, address})=>{
  const [state, setState] = useState({});
  const [t,setT] = useState({});
  const [d, setD] = useState({});

  useEffect(()=>{
      launchInfo(provider, address).then((_state)=>{
       
        setState(_state);
        return Promise.all([tokenInfo(_state.tokenAddress), IpfsGetBlob(_state.cid)]).then(d=>{
          console.log(d)
          setT(d[0]);
          setD(d[1]);
          console.log(d[1]);
        })
      });
  },[address, provider]);

  
  return (
  !state.tokenAddress?
  <div>Loading Launchpad</div>:
  <div className="launchpadInfoContainer">
    <Link to={`/launchdetails/${address}`}>
    <div className="tokenhead">
      <img src={d.logo} />

      <div className="ri">
        <h4>{t.name}</h4>
        <div className="ics">
         
         <a href={d.website}><Fa.FaInternetExplorer id="ic" /></a>
          <a href={d.social}><Fa.FaInstagram id="ic" /></a>
          <a href={d.twitter}><Fa.FaTwitter id="ic" /></a>
        </div>
        <div className="details">
          <p className="wallet">{state.complete?"Closed":"Open"}</p>
          <p className="wallet">{state.baseTk}</p>
        </div>
      </div>
    </div>
    <p style={{ fontSize: "16px" }}>
     {d.desc}
    </p>
    <div className="rates">
      <div>
        <span>Swap Rate</span>
        <p>1 {state.baseTk} = {state.presale}{t.symbol} </p>
      </div>
      <div>
        <span>Cap</span>
        <p>{state.capped} {state.baseTk}</p>
      </div>
      <div>
        <span>Access</span>
        <p>Public </p>
      </div>
    </div>
    <div className="progvalup">
      <span>Progress</span>
      <span>Participant <p>{state.participant}</p></span> 
    </div>
      <progress value={(state.presaleAmount - state.remaining)/state.presale} max={state.presaleAmount/state.presale} />
    <div className="progval">
      <p>{(state.presaleAmount - state.remaining)/state.presale}/{state.presaleAmount/state.presale}</p>
    </div>
    </Link>
  </div>
    );
}


export default Container;




