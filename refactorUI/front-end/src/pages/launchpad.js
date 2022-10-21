import React, {useState, useEffect, useRef, useMemo} from "react";
import "./launchpad.css";
import {Link} from "react-router-dom";
import * as Fa from "react-icons/fa";
import {useSigner} from '@web3modal/react';
import useModal from "../components/customModal/useModal";
import defaultController, {statusCreate} from "../components/customModal/controller";
import {createLaunchPad, createdPads, launchPadInfo, tokenInfo, purchase, listLaunchPad, launchInfo} from '../launchUtil/main';
import  {IpfsStoreBlob, IpfsGetBlob} from '../context/_web3_container';

//List Token

const Container = () => {
  const [launchPadList, setLaunchPadList] = useState([]);
  const {data:signer} = useSigner();
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
        <Link style={{textDecoration:"underline"}} to="/createtoken">Create a Token</Link><br/>
        <Link style={{textDecoration:"underline"}} to="/createlaunchpad">Create LaunchPad</Link>
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
      launchInfo(provider, address).then(setState).then(()=>{
        Promise.all([tokenInfo(provider, state.tokenAddress), IpfsGetBlob(state.cid)]).then(d=>{
          setT(d[0]);
          setD(d[1]);
          console.log(d[1]);
        })
      });
  },[address, provider]);


  return (

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
        <p>{state.capped} </p>
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




