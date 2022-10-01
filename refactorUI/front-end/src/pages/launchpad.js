import React from 'react';
import './launchpad.css';

const LaunchPadSection =  ()=>{
    return (
    <div className="staking-cont">
        <h1 className="head">LaunchPad</h1>
        <Stake/>
        <Stake/>
    </div>
    );
}

const Stake = ()=>{
    return (
    <div className="stake">
        <div className="left">
            <div className="img">
                <img src="/resources/20220921_104004.png" alt=""/>

            </div>
            <div className="text">
                <h4>SHIEDLCOIN GOLD TOKEN (SHIELDGOLD)</h4>
                <h2>1 SHIELDGOLD = 0.538 SHIELD COIN</h2>
                <p><span>Offering Starts</span>: Thu, Jul 21, 2022, 4:00 PM UTC</p>
                <p><span>Offering Ends</span>: Tue, Jul 26, 2022, 4:00 PM UTC</p>
                <p><span>Claim Starts</span>: Wed, Jul 27, 2022, 4:00 PM UTC</p>
                <div className="progress">
                    <progress max="100" value="119"></progress>
                    <p id="progress">110%</p>
                </div>
                <p>Total Raised: 6,408,554.575 SHIELDCOIN</p>
            </div>
        </div>
        <div className="action">
            <div className="txt">
                <div className="row">
                    <div>
                        <span>Target Raise Amount</span>
                        <p>5,380,000 SHIELDCOIN</p>
                    </div>
                    <div>
                        <span>Target Offer Amount</span>
                        <p>10,000,000 SHIELDCOIN</p>
                    </div>
                </div>
                <div className="row">
                    <div>
                        <span>My Deposit Amount</span>
                        <p>SHIELDCOIN</p>
                    </div>
                    <div>
                        <span>Claim Amount</span>
                        <p>SHIELDGOLD</p>
                    </div>
                    <div>
                        <span>Refund Amount</span>
                        <p>SHIELDCOIN</p>
                    </div>
                </div>
            </div>
            <div className="claim">
                <button className="btn">Claim & Refund</button>
            </div>
        </div>
    </div>
    );
}

export default LaunchPadSection;