import React from "react";
import {Link} from "react-router-dom";
import './swap.css';

const SwapSection = ()=>{
    return (
        <div className="card">
            <h1 id="swaptxt">Swap</h1>
            <p id="link">Trade tokens in an instant <br/> <Link href="#">Or try Pancakeswap</Link></p>
            <div className="from">
                <div className="txt">
                    <p>From</p>
                    <p><span>Balance: 0.0 BUSD</span></p>
                </div>
                <div className="value">
                    <input type="number" placeholder="0.0"/>
                    <h2><img id="busd" src="/resources/binance-usd-busd-logo.png" alt=""/>BUSD</h2>
                </div>
            </div>
            <div className="icon-cont">
                <div className="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-arrow-down"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg></div>
            </div>

            <div className="to">
                <div className="txt">
                    <p>To</p>
                    <p><span>Balance: 0.0 ShieldCoin</span></p>
                </div>
                <div className="value">
                    <h1>0.0</h1>
                    <h2><img src="/resources/output-onlineimagetools.png" alt=""/>ShieldCoin</h2>
                </div>

            </div>
            <div className="price">
                <h3>Price</h3>
                <p>0 BUSD per ShieldCoin</p>
            </div>
            <div className="tolerance">
                <h3>Slippage Tolerance</h3>
                <p>0.1%</p>
            </div>
            <button id="swap" className="btn">Connect Wallet</button>
        </div>
    );
}

export default SwapSection;