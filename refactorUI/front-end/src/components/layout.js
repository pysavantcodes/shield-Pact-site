import React, { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import styled, { css } from "styled-components";
import { FaWallet } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { Button } from "./buttons";
import logo from "./nft/logo.png";
import useLocation from "react-router-dom"

import {
  useConnectModal,
  useDisconnect,
  useAccount,
  useNetwork,
} from "@web3modal/react";

const fgColor = "#acacac";
const bgColor = "#1d1d1d";

const LayoutWrapper = styled.section`
  background-color: ${bgColor};
  color: ${fgColor};
  z-index:999999999999999;

  a {
    color: ${fgColor};

    &:hover {
      color: #fff;
    }
  }
`;

const flex = css`
  display: flex;
  align-items: center;
`;

const HeaderWrapper = styled.header`
  justify-content: space-between;
  padding: 1rem 5rem;
  font-size: 1.25rem;
  position: sticky;
  top: 0;
  border-bottom: 1px solid #ffffff14;
  background-color: #1515218c;
  backdrop-filter: blur(10px);
  z-index: 2;
  overflow: hidden;

  &,
  .title_menu_container,
  .title,
  .menu {
    ${flex}
  }

  .title_menu_container {
    gap: 1rem;
  }

  .title {
    font-weight: bold;
    border-right: solid 1px #ffffff14;
    padding-right: 1rem;
    color: #fff;

    font-size: 20px;

    img {
      width: 3rem;
      height: auto;
    }
  }

  .menu {
    gap: 1.4rem;

    font-size: 17px;
  }

  button {
    margin-right: 0.5rem;
  }
  

  .hamburger {
    display: none;
  }

  .drop {
      display: none;
    }

  @media (max-width: 1200px) {
    flex-direction: column;
    padding: 1rem 2rem;
    .title_menu_container {
      flex-direction: column;
    }
    .btn {
      margin-right: 0rem;
    }

    .menu {
      margin-bottom: 1rem;
      font-size: 15px;
    }
    .title {
      border-right: none;
    }
    
    .hamburger {
      display: block;
      position: absolute;
      right: 30px;
      top: 30px;
      cursor: pointer;
    }
  }
`;

const TitleWrapper = styled.div`

    display:flex;

	justify-content:space-between;
	padding:1.5rem 5rem;
	border:solid 1px #ffffff14;
	border-left:none;
	border-right:none;

	font-size:1.15rem;

	font-size:17px;
	align-items:center;


	&,.nav
	{
		display:flex;
	}


	h1{
		font-size:17px;
		margin-bottom:0;
	}


	h1, span:last-child{
		color:#fff;
	}

	.nav{
		gap:1rem;

		span:last-child{
			font-weight:bold;
			font-size:1.1rem;
		}
	}

		font-size:15px;
		span:last-child{
			font-weight:bold;
			font-size:15px;
		}
	}

	@media (max-width:1200px){
		padding:1.5rem 2rem;
	}

  

`;
const Header = () => {
  const { open: connect } = useConnectModal();
  const { address, isConnected } = useAccount();
  const disconnect = useDisconnect();
  const chains = useNetwork();
  console.log(chains);

  // const [drop, setDrop] = useState(false);
  // console.log(window.screen.width)
  // const dropDown = ()=>{
  //   if (drop == false){
  //     setDrop(true)
  //   }else{
  //     setDrop(false)
  //   }
  // }
  // if(window.screen.width < 1200){
  //   console.log("yess")
  //   if (drop == false) {
  //     document.querySelector(".drop").style.display = "none";
  //     document.querySelector(".dropBtn").style.display = "none";
  //   } else {
  //     document.querySelector(".drop").style.display = "flex";
  //     document.querySelector(".dropBtn").style.display = "block";
  //   }
    
  // }else{
  //   document.querySelector(".drop").style.display = "flex";
  //     document.querySelector(".dropBtn").style.display = "block";
  // }

  const dropDown = ()=>{
      document.querySelector(".menu").classList.toggle("drop")
      document.querySelector(".dropBtn").classList.toggle("drop");
    }

  
  const location = useLocation();
  return (
    <HeaderWrapper>
      <div className="title_menu_container">
        <div className="title">
          <img src={logo} alt="nft-logo" />
          Shield <span style={{textTransform:"capitalize"}}> {(location.pathname).replace("/"," ")}</span>
        </div>
        <div className="menu">
	{/*<NavLink to="/">Home</NavLink>*/}
          <NavLink to="/">LaunchPad</NavLink>
          {/*<NavLink to="/staking">Staking</NavLink>*/}
          <NavLink to="/swap">Swap</NavLink>
          <NavLink to="/nft">NFT</NavLink>
        </div>
        <GiHamburgerMenu onClick={()=>dropDown()} className="hamburger" />
      </div>
      <ConnectSection {...{ address, connect, isConnected, disconnect }} />
    </HeaderWrapper>
  );
};

const toggleDisplay = () => {
  document.getElementById("small").classList.toggle("small");
};

const ConnectSection = ({ address, connect, isConnected, disconnect }) => {
  return (
    <ConnectWrapper className="dropBtn">
      <Button onClick={isConnected ? disconnect : connect}>
        {isConnected ? "Disconnect" : "Connect"} Wallet
      </Button>
      {address && <Button onClick={()=>window.open(`https://buy.ramp.network/?userAddress=${address}`,'_blank')}>Ramp Network</Button>}
      {/*<br/><small>{address}</small>*/}
      {isConnected && (
        <div class="walletDrop">
          <div onClick={() => toggleDisplay()} className="wallt">
            <FaWallet id="wallet" />
            <span>&#9660;</span>
          </div>

          <small id="small">{address}</small>
        </div>
      )}
    </ConnectWrapper>
  );
};

const ConnectWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  /*small{
		color:#fff;
		text-decoration:underline;
		position:absolute;
		right:0;
		top:100%;
	}*/
  .walletDrop {
    text-align: center;
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  small {
    display: block;
    color: #fff;
    font-size: 10px;
    background: #111;
    border-radius: 5px;
    margin-top: 2px;
    width: 0px;
    padding: 0;
    overflow: hidden;
  }

  .small {
    padding: 3px;
    width: 100%;
  }

  .wallt {
    color: white;
    font-size: 15px;
    border: 1px solid white;
    padding: 8px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    margin-right: 0.3rem;
  }

  .wallt span {
    font-size: 10px;
    margin-left: 0.3rem;
    opacity: 0.7;
  }

  @media (max-width: 1200px) {
    flex-direction: column;
    .walletDrop {
      margin-top: 0.5rem;
    }
  }

  @media (max-width: 317px) {
    .walletDrop {
      flex-direction: column;
    }
  }
`;

const Layout = () => {
  return (
    <LayoutWrapper>
      <Header />
      <Outlet />
    </LayoutWrapper>
  );
};

export default Layout;
