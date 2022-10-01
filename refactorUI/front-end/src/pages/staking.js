import React from 'react';
import './staking.css';

const StakingSection = ()=>{
    return (
        <div className="staking-cont">
        <h1 className="head">Staking</h1>
        {Array(3).fill(0).map(x=><Stake/>)}
    </div>
    );
}


const Stake = ()=>{
    return (
    <div className="stake">
        <div className="left">
            <div className="img">
                <img src="/resources/20220921_105230.png" alt=""/>

            </div>
            <div className="text">
                <h4>SHIEDLCOIN - BNB Pool [2x]</h4>
                <h1>APR 0%</h1>
                <p>0 SHIELDCOIN/day <br/> Stake SHIELDCOIN/BNB LP and EARN SHIELDCOIN</p>
            </div>
        </div>
        <div className="action">
            <div className="buttons">
                <div className="depo">
                    <p>Available Stake</p>
                    <h4>0</h4>
                    <button className="btn">Exchange</button><br/>
                    <button className="btn-border">Deposit</button>
                </div>
                <div className="widthdraw">
                    <p>My Stake</p>
                    <h4>0</h4>
                    <button className="btn">Liquidity</button><br/>
                    <button className="btn-border">Withdrawal</button>
                </div>
            </div>
            <div className="earned">
                <p>Earned</p>
                <h2>0.0 SHIELDCOIN</h2>
                <button className="btn" disabled>Claim</button>
            </div>
        </div>
    </div>
    );
}

export default StakingSection;