import React from "react";
import {Outlet, Link} from "react-router-dom";
//import './style.css';


const Layout = ()=>{
	return(
	<>
    	<section className="--full-page">
            <MenuSection/>
            <main>
               <HeaderSection/>
                <section>
                    <Outlet/>
                </section>
            </main>
        </section>
       	<BottomNav/> 
        <ConnectWalletSection/>
    </>
	);
}

const HeaderSection = ()=>{
	return (
	 <header>
        <nav>
            <div className="left">
                <img src="/resources/output-onlineimagetools.png" alt=""/>
            </div>
            <div className="right">
                <p>Login</p>
                <button  className="btn">Connect Wallet</button>
            </div>
        </nav>
    </header>
	);
}

const MenuSection = ()=>{
	return (
		<aside>
            <div className="logo">
                <img src="/resources/output-onlineimagetools.png" alt=""/>
                <p className="logo-text">ShieldPact</p>
            </div>
            <div className="pages">
                <p>Menu</p>
                <ul>
                    <li ><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-layout"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
                        <Link to="#">Home</Link>
                    </li>
                    <li className="active" ><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-refresh-cw"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
                        <Link to="#">Swap</Link>
                    </li>
                    <li><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-codesandbox"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="7.5 4.21 12 6.81 16.5 4.21"></polyline><polyline points="7.5 19.79 7.5 14.6 3 12"></polyline><polyline points="21 12 16.5 14.6 16.5 19.79"></polyline><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                        <Link to="/nftpage/index.html">NFT</Link>
                    </li>
                    <li ><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-database"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>
                        <Link to="#">Staking</Link>
                    </li>
                    <li ><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-send"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                        <Link to="#">LaunchPad</Link>
                    </li>
                </ul>
            </div>
        </aside>
	);
}


const BottomNav = ()=>{
	return (
	<section className="bottom-nav">
        <div  className="swap active">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-refresh-cw"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
            <p>Swap</p>
        </div>

        <div className="nft">
            <Link style={{color: '#fff', textDecoration:'none'}} to="/nftpage/index.html">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-codesandbox"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="7.5 4.21 12 6.81 16.5 4.21"></polyline><polyline points="7.5 19.79 7.5 14.6 3 12"></polyline><polyline points="21 12 16.5 14.6 16.5 19.79"></polyline><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                <p>NFT</p>
            </Link>
        </div>

        <div  className="home">
            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-layout"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
            <p>Home</p>
        </div>

        <div  className="staking">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-database"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>
            <p>Staking</p>
        </div>

        <div  className="launch">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-send"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            <p>LaunchPad</p>
        </div>
    </section>
	);
}


const ConnectWalletSection = ()=>{
	return (
	<div className="connect-wallet-modal-bg">
	    <div className="connect-wallet-modal">
            <div className="top">
                <h3>Connect Wallet</h3>
                <p >+</p>
            </div>
            <div className="wallets">
                <div  className="metamask">
                    <img src="https://cdn.iconscout.com/icon/free/png-512/metamask-2728406-2261817.png" alt=""/>
                    <h4>Meta Mask</h4>
                    <p>Connect with MetaMask Wallet</p>
                </div>
                <div className="walletconnect">
                    <img src="https://cdn.unstoppabledomains.com/bucket/images/logos/wallet-connect-logo.svg" alt=""/>
                    <h4>Wallet Connect</h4>
                    <p>Connect with Wallet Connect</p>
                </div>
            </div>
            <div className="bottom">
                <p>Haven't got a crypto wallet yet?</p>
                <button className="btn-border"><Link style={{textDecoration: 'none', color:'#a943d8'}} href="https://pancake.guide/shieldcoin">Learn How to Connect</Link></button>
            </div>
        </div>
    </div>
	);
}

export default Layout;