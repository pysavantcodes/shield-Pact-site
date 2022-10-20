import React from "react";
import { useState } from "react";
import "./staking.css";

const Container = () => {
  const [displayStake, setDisplayStake] = useState(false);
  const displayStakeContainer = (e)=>{
    if(document.getElementById("stake").value == "Unstake"){
        setDisplayStake(false)
    }else{
        setDisplayStake(true)
    }
  }
  return (
    <section className="stakingContainer">
      <h1>Staking</h1>
      <h3>Maximize yield by staking SUSHI for xSUSHI</h3>
      <p>
        For every swap on the exchange on every chain, 0.05% of the swap fees
        are distriibuted as SUSHI proportional to your share of SushiBar. When
        your SUSHI is staked into the Sushibar you will receive xSUSHI in return
        for voting rights and a fully composable token that can interact with
        other protocols. Your xSUSHI is continuously compounding, when you
        unstake you will receive all the originally deposited SUSHI and any
        additional from fees.{" "}
      </p>
      <div className="apr">
        <div className="left">
          <h3>Staking APR</h3>
          <button className="btn">View Stats</button>
        </div>
        <div className="right">
          <h3>5.20%</h3>
          <p>Yesterday's APR</p>
        </div>
      </div>
      <div className="select">
        <p style={{ margin: "1rem 0" }}>Select an Option</p>
        <select onChange={(e)=>displayStakeContainer()} id="stake">
          <option value="Stake">Stake</option>
          <option value="Unstake">Unstake</option>
        </select>
      </div>
      {displayStake ? (
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
};

export default Container;
