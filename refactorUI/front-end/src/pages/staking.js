import React from "react";
import { useState, useMemo, useEffect, useRef} from "react";
import {ethers} from 'ethers';
import "./staking.css";
import {useSigner} from '@web3modal/react';
import * as helper from '../upgrade/web3Helper';
import  stakeLib from '../upgrade/stake';
import useModal from "../components/customModal/useModal";
import defaultController, {statusCreate} from "../components/customModal/controller";


const {stakeBNB, stakeBUSD, claimBNB, ownedStake, listStakeCenters, setStakeBNB, setStakeBUSD, stakeOwner} = stakeLib;

const Container = () => {

  const {View, update} = useModal({Controller:defaultController});

  const actionUpdateList = useMemo(() => ({process:value=>statusCreate.process(update, value),
                                  success:(value,explorer)=>statusCreate.success(update, value, {explorer}),
                                   failed:value=>statusCreate.failed(update, value),
                                   info:(value, Proceed)=>statusCreate.info(update, value, {Proceed})}), [update]);

  const {data:signer} = useSigner();

  return (
    <section className="stakingContainer">
    <View/>
      <h1>Staking</h1>
      <h3>Maximize yield by staking BNB for BTS</h3>
      <p>
        When your BNB is staked receive xSUSHI in return
        for voting rights and a fully composable token that can interact with
        other protocols.
      </p>
      
      <AllStakeCenter signer={signer} handler={actionUpdateList}/>
      <ListStake signer={signer} handler={actionUpdateList}/>
    </section>
  );
};


const AllStakeCenter = ({signer, handler})=>{
  const [info, setInfo]  = useState([]);
  const [owner, setOwner] = useState(false);
  
  useEffect(()=>{
    (async function(signer){
      if(!signer)
        return;
      //console.log(signer);
      const res = await Promise.all([stakeOwner(signer),signer?.getAddress()]);
      //console.log(res);
      setOwner(res[0]===res[1]);
    })(signer);
  },[signer]);

  useEffect(()=>{
    listStakeCenters().then(setInfo);
  });

  //console.log(info)

  return (
  <>
    <div>
      {owner?info.map(d=><UpdateStake key={d.STk} info={d} signer={signer} handler={handler}/>):''}
    </div>
    <div>
      {info.map(d=><StakeCenter key={d.sTk} info={d} signer={signer} handler={handler}/>)}
    </div>
  </>
  );
}

const StakeCenter = ({info, signer, handler})=>{
  //console.log("info ", info);
  const [state, setState] = useState();
  const _click = (e)=>{
    e.preventDefault();

    if(!state){
      handler.failed("No Input");
      return;
    }
    
    const _func = info.isBNB?stakeBNB:stakeBUSD
    _func(signer, state, handler);

  }

  //console.log("Info=> ",info.reward)

  return(
     <div className="stake">
          <h3>
            Stake {info.isBNB?"BNB":"BUSD"} <span className="wallet">1 {info.isBNB?"BNB":"BUSD"} = {Number(info.reward??0)} BTS</span>
            <p>Total Reward Available {helper.formatEther(info.totalRewardAmount??0)}BTS</p>
          </h3>
          <p>Duration: {Number(info.duration??0)/60} mins</p>
          <p>Interest Recieve: {(+state||0)*Number(info.reward)}</p>
          <div className="input">
            <input type="number" placeholder="0.00001" step="0.00001" onKeyUp={(e)=>setState(e.target.value)}/>
            {/*<p>Balance: 2.617</p>*/}
          </div>
          <button className="btn" onClick={_click}>Stake</button>
      </div>
  );
}


const ListStake = ({signer, handler})=>{
  const [state, setState] = useState([]);

  useEffect(()=>{
    (async function(){
      let db = []
      const ond = await ownedStake(signer);
      for await (let data of ond()){
        db = [...db, data]; 
        setState(db);
      }
    })();
  },[signer])

  const _click = (id)=>()=>{
    //console.log(signer);
    claimBNB(signer, id, handler);
  }
  
  return (
  <>
  {state?.length>0 && <h1>Your Stakes</h1>}
  <table style={{textAlign:"center"}}>
    <tbody>
      {state?.length>0 && 
        <tr>
        <td>Stake ID</td>
        <td>Stake Token</td>
        <td>Reward Token</td>
        <td>Amount</td>
        <td>Reward</td>
        <td>EndTime</td>
        <td></td>
        </tr>
      }
      {[...state].reverse().map((x,i)=>
              <tr key={i} cellSpacing="10px">
                <td>{Number(x.id)}</td>
                <td>BNB</td>
                <td>BTS</td>
                <td>{ethers.utils.formatEther(x.amount)}</td>
                <td>{ethers.utils.formatEther(x.reward)}</td>
                <td>{x.endTime == 0?'':(new Date(Number(x.endTime)*1000)).toLocaleString()}</td>
                <td>
                  <button className="btn" onClick={x.endTime == 0?()=>{}:_click(x.id)}>CLAIM{x.endTime == 0?"ED":""}</button>
                </td>
              </tr>)}
    </tbody>
  </table>
  </>
  );
}

const UpdateStake = ({signer, info, handler})=>{
  const _form = useRef();
  const _click = (e)=>{
    //console.log(e);
    e.preventDefault();
    helper.needSigner(signer);
    if(!_form.current.reportValidity()){
      return handler.failed("Check input");
    }

    const db = new FormData(_form.current);
    
    if(!(+db.get('total')>0 && +db.get('reward'))){
        return handler.failed("Error in Amount set");
    }

    const _func = info.isBNB?setStakeBNB:setStakeBUSD;
    //console.log("isBNB", info.isBNB);

    _func(signer, db.get('reward'), db.get('total'), Math.floor(+db.get('duration')*24*60*60)/*to seconds*/, handler);
  }
  return(
    <form ref={_form}>
    <br/>
    <br/>
    
      <h1>Update Stake for {info.isBNB?"BNB":"BUSD"}</h1>
      <label>
        <span>Reward <b>(in BTS)</b></span>
        <input type="number" name="reward" required/>
      </label>
      <br/>
      <br/>
      <label>
        <span>TotalReward <b>(in BTS)</b></span>
        <input type="number" name="total" required/>
      </label>
      <br/>
       <br/>
      <label>
        <span>Duration <b>(in days)</b></span>
        <input type="number" name="duration" step="0.000001" required/>
      </label>

      <button className="btn" onClick={_click}>Update</button>
      <br/>
      <br/>
    </form>
  );
}

export default Container;
