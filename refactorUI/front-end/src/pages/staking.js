import React from "react";
import { useState, useMemo, useEffect } from "react";
import {ethers} from 'ethers';
import "./staking.css";
import {useSigner} from '@web3modal/react';
import {stakeBNB, claimBNB, ownedStake, listStakeCenters} from '../launchUtil/stake';
import useModal from "../components/customModal/useModal";
import defaultController, {statusCreate} from "../components/customModal/controller";

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
        When your BNB is staked receive BTS in return
        for voting rights and a fully composable token that can interact with
        other protocols.
      </p>
      
      <StakeCenter signer={signer} handler={actionUpdateList}/>
      <ListStake signer={signer} handler={actionUpdateList}/>
    </section>
  );
};


const StakeCenter = ({signer, handler})=>{
  const [state, setState] = useState();
  const [info, setInfo]  = useState({});
  
  useEffect(()=>{
    listStakeCenters(signer).then(setInfo);
  });

  
  const _click = (e)=>{
    e.preventDefault();

    if(!state){
      handler.failed("No Input");
      return;
    }
    
    stakeBNB(signer, state, handler);
  }
  return(
     <div className="stake">
          <h3>
            Stake BNB <span className="wallet">1 BNB = {Number(info.reward??0)} BTS</span>
            <p>Total Reward Available {ethers.utils.formatEther(info.totalRewardAmount??0)}BTS</p>
          </h3>
          <p>Duration: {Number(info.duration??0)/60} mins</p>
          <p>Interest Recieve: {(+state||0)*Number(info.reward)}</p>
          <div className="input">
            <input type="number" placeholder="0.00" onKeyUp={(e)=>setState(e.target.value)}/>
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
        db= [...db, data]; 
        setState(db);
      }
    })();
  },[signer])

  const _click = (id)=>()=>{
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
      {state.map((x,i)=>
              <tr key={i} cellSpacing="10px">
                <td>{Number(x.id)}</td>
                <td>BNB</td>
                <td>Bonus Token</td>
                <td>{ethers.utils.formatEther(x.amount)}</td>
                <td>{ethers.utils.formatEther(x.reward)}</td>
                <td>{(new Date(Number(x.endTime)*1000)).toLocaleString()}</td>
                <td>
                  <button className="btn" onClick={_click(x.id)}>Claim</button>
                </td>
              </tr>)}
    </tbody>
  </table>
  </>
  );
}


const yuu=()=>{
   return (
    <section className="stakingContainer">
    <View/>
      <h1>Staking</h1>
      <h3>Maximize yield by staking SUSHI for xSUSHI</h3>
      <p>
        When your BNB is staked receive xSUSHI in return
        for voting rights and a fully composable token that can interact with
        other protocols.
      </p>
      <div className="apr">
        <div className="left">
         {/*<h3>Staking APR</h3>
          <button className="btn">View Stats</button>*/}
        </div>
        <div className="right">
          {/*<h3>5.20%</h3>
          <p>Yesterday's APR</p>*/}
        </div>
      </div>
      <div className="select">
       {/*} <p style={{ margin: "1rem 0" }}>Select an Option</p>
        <select onChange={(e)=>displayStakeContainer()} id="stake">
          <option value="Stake">Stake</option>
          <option value="Unstake">Unstake</option>
        </select>*/}
      </div>
      {false ? (
        <div className="stake">
          <h3>
            Stake SUSHI <span className="wallet">1 xSUSHI = 1.1664 SUSHI</span>
          </h3>
          <div className="input">
            <input type="number" placeholder="0.00 SUSHI" />
            <p>Balance: 2.617</p>
          </div>
          <button className="btn">Approve</button>
        </div>
      ) : (
        <div className="stake">
          <h3>
            Unstake <span className="wallet">1 xSUSHI = 1.1664 SUSHI</span>
          </h3>
          <div className="input">
            <input type="number" placeholder="0.00 xSUSHI" />
            <p>Balance: 4.33</p>
          </div>
          <button className="btn">Confirm Withdrawal</button>
        </div>
      )}

      <div className="stats">
        <div>
          <h3>Balance</h3>
          <p>0 xSUSHI</p>
        </div>
        <div>
          <h3>Unstaked</h3>
          <p>2.16 SUSHI</p>
        </div>
        <button className="btn" disabled>
          Your SushiBar Stats
        </button>
      </div>
    </section>
  );  
}

export default Container;
