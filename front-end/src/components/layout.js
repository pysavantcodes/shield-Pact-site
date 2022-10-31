import React, { useState } from "react";
import { Outlet, NavLink, useLocation} from "react-router-dom";
import styled, { css } from "styled-components";
import { FaWallet, FaTimes, FaBars} from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { Button } from "./buttons";
import logo from "./nft/logo.png";

import {
  useConnectModal,
  useDisconnect,
  useAccount,
  useNetwork,
} from "@web3modal/react";

const fgColor = "#acacac";
const bgColor = "#1d1d1d";

const LayoutWrapper = styled.div`
  background-color: ${bgColor};
  color: ${fgColor};
`;

const flex = css`
  display: flex;
  align-items: center;
`;

const _HeaderWrapper = styled.header`
  justify-content: space-between;
  padding: 1rem 5rem;
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
          Shield <span style={{textTransform:"capitalize"}}> {(location.pathname).split("/")[1]}</span>
        </div>
        <div className="menu">
	{/*<NavLink to="/">Home</NavLink>*/}
          <NavLink activeClassName="active" to="/launchpad">LaunchPad</NavLink>
          {/*<NavLink to="/staking">Staking</NavLink>*/}
          <NavLink activeClassName="active" to="/swap">Swap</NavLink>
          <NavLink activeClassName="active" to="/nft">NFT</NavLink>
          <NavLink activeClassName="active" to="/airdrop">AirDrop</NavLink>
        </div>
        <GiHamburgerMenu onClick={()=>dropDown()} className="hamburger" />
      </div>
      <ConnectSection/>
    </HeaderWrapper>
  );
};

const toggleDisplay = () => {
  document.getElementById("small").classList.toggle("small");
};

const ConnectSection = () => {
  const { open: connect } = useConnectModal();
  const { address, isConnected } = useAccount();
  const disconnect = useDisconnect();

  return (
    <ConnectWrapper className="dropBtn">
      <Button onClick={isConnected ? disconnect : connect}>
        {isConnected ? "Disconnect" : "Connect"}
      </Button>
    </ConnectWrapper>
  );
};

const ConnectWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;


const HeaderWrapper = styled.header`
  justify-content: space-between;
  position: sticky;
  top: 0;
  border-bottom: 1px solid #ffffff14;
  z-index: 2;
  padding: 0.5rem;
  height:5rem;
  backdrop-filter: blur(10px);
  background-color: #1515218c;

  &,
  #title,
  #menu {
    ${flex}
  }


  #title {
    font-weight: bold;
    border-right: solid 1px #ffffff14;
    padding-right: 1rem;
    color: #fff;

    font-size: 20px;

    img {
      width: 3rem;
      height: auto;
    }

    span{
      text-transform:capitalize;
    }
  }

  #menu {
    gap: 2rem;
    
    a{
      color:#fff;
      font-weight:bold;

      &:hover, &.active{
        color:#151521;
      }

       &.active{
        color:#9404d8;
       }
    }
  }
  
  #__signal{
    display:none;
  }

  label[for="__signal"]{
    display:none;
  }
  

  @media screen and (max-width:896px){
    
    label[for="__signal"]{
      display:grid;
    }

    #menu{
      position:fixed;
      top:5rem;
      left:0;
      height:calc(100vh - 5rem);
      flex-direction:column;
      padding:3rem 0rem 1rem 1rem;
      background-color: #151521;

      a{
        display:block;
        width:100%;
        padding:1rem 4rem;
        border-radius:0.75rem 0rem 0rem 0.75rem;

        &:hover, &.active{
          padding:1rem 2rem 1rem 6rem
        }

        &:hover, &.active{
          background-color:#fff;
        }
      }
    }

    #__signal:checked ~ #menu{
      display:none;
    }
  }

`;

const Menu = ()=>{
  const loc = useLocation();
  console.log(loc);
  return(
    <HeaderWrapper>
      <div id="title">
          <label for="__signal">
            <FaBars size="2rem" weight="800" color="#fff"/>
          </label>
          <img src={logo} alt="nft-logo" />
          Shield <span>{loc.pathname.split('/')[1]}</span>
      </div>
      <input id="__signal" type="checkbox" defaultChecked/>
      <div id="menu">
          <NavLink to="/launchpad">LaunchPad</NavLink>
          <NavLink to="/staking">Staking</NavLink>
          <NavLink to="/swap">Swap</NavLink>
          <NavLink to="/nft">NFT</NavLink>
          <NavLink to="/airdrop">AirDrop</NavLink>
      </div>
      <ConnectSection/>
    </HeaderWrapper>
  );
}


const Layout = () => {
  return (
    <LayoutWrapper>
      <Menu/>
      <Outlet />
    </LayoutWrapper>
  );
};

export default Layout;
