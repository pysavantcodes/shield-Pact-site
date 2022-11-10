import React, { useState, useEffect } from "react";
import { Outlet, NavLink, useLocation} from "react-router-dom";
import styled, { css } from "styled-components";
import { FaWallet, FaTimes, FaBars} from "react-icons/fa";
import {AiOutlineMenu} from 'react-icons/ai';
import {VscVmConnect} from "react-icons/vsc";
import { GiHamburgerMenu } from "react-icons/gi";
import { Button } from "./buttons";
import logo from "./nft/logo.png";
import loadingGif from "./loading.gif";
import {useQSigner, useQProvider} from "../upgrade/web3Helper"

import {
  useConnectModal,
  useDisconnect,
  useAccount,
  useNetwork,
} from "@web3modal/react";

import withdraw from './_withdraw';


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

const ConnectSection = () => {
  const { open: connect } = useConnectModal();
  const { status, isConnected } = useAccount();
  const disconnect = useDisconnect();
  const provider = useQProvider();


  return (
    <ConnectWrapper className="dropBtn">
      <Button onClick={isConnected ? disconnect : connect}>
        {status}
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
    color: #fff;
    font-size: 1.15rem;

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
    font-size:1.1rem;

    a{
      color:#fff;
      font-weight:bold;

      &:hover, &.active{
        color:#9404d8;
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
  

   .extra{
    .submenu{
      display:grid;
      visibility:hidden;
      gap:1.5rem;
      position:absolute;
      top:5rem;
      transform:translateX(-25%);
      background-color:#1515218c;
      padding:2rem;
    }

    &:hover .submenu{
      visibility:visible;
    }
  }

  @media screen and (max-width:896px){
    #logo_title{
      display:none;
    }

    label[for="__signal"]{
      display:grid;
    }

    #menu{
      gap:1rem;
      justify-content:space-between;
      position:fixed;
      top:5rem;
      left:0;
      height:calc(100vh - 5rem);
      flex-direction:column;
      padding:2rem 0rem 2rem 1rem;
      background-color: #151521;
      overflow:hidden;
      overflow-y:auto;


      a{
        display:block;
        width:100%;
        padding:1rem 3rem;
        border-radius:1rem 0rem 0rem 1rem;

        &:hover, &.active{
          padding:0.75rem 2rem 0.75rem 4rem;
        }

        &:hover, &.active{
          color:#151521;
          background-color:#fff;
        }
      }
    }

    #__signal:checked ~ #menu{
      display:none;
    }

    .extra{
      & div:first-child{
        display:none;
      }

      .submenu{
        display:grid;
        visibility:visible;
        gap:1rem;
        justify-content:space-between;
        position: relative;
        top:0rem;
        transform:none;
        background-color:transparent;
        padding:0rem;
      }
    }

  }
`;


const Menu = ()=>{
  const {pathname:loc} = useLocation();
  console.log(loc)
  const {Button:WithdrawBTN, View:WithdrawView} = withdraw();

  return(
      <>
        <HeaderWrapper>
          <label htmlFor="__signal">
            <AiOutlineMenu size="2rem" weight="800" color="#fff"/>
          </label>
          <div id="title">
              <img src={logo} alt="nft-logo" />
              <span id="logo_title">Shield<span style={{textTransform:"uppercase"}}>{loc.split('/')[1]}</span></span>
          </div>
          <input id="__signal" type="checkbox" defaultChecked/>
          <div id="menu">
              <a href="/nft">Explore NFT</a>
              <NavLink reloadDocument to="/launchpad">LaunchPad</NavLink>
              <NavLink reloadDocument to="/staking">Staking</NavLink>
              <NavLink reloadDocument to="/swap">Swap</NavLink>
              <NavLink reloadDocument to="/airdrop">AirDrop</NavLink>

              <div className="extra">
                <div to="#">Create</div>
                <div className="submenu">
                  <NavLink reloadDocument to="/createtoken">Create Token</NavLink>
                  <NavLink reloadDocument to="/createlaunchpad">Create Launch</NavLink>
                  <NavLink reloadDocument to="/createAirdrop">Create AirDrop</NavLink>
                </div>
              </div>

              <WithdrawBTN/>
          </div>
          <ConnectSection/>
        </HeaderWrapper>
        <WithdrawView/>
      </>
  );
}

const LoadingWrapper = styled.div`
  position:fixed;
  top:0;
  left:0;
  height:100vh;
  width:100vw;
  display:grid;
  place-items:center;
  background:#fff;
  z-index:500;


  img{
  	width:30vmin;
  	height:30vmin;
  }

  p{
    text-align:center;
    color:#000 !important;
    font-size:20px;
  }
`;

const LoadingPage  = ()=>{
  const {status, ...rest} = useAccount();
  console.log(status,"==",rest);
  return (
  status?.indexOf("connecting") === -1 && window.navigator.onLine?
  "":
  <LoadingWrapper>
    <div>
      <img src={loadingGif}/>
      <p><b>{window.navigator.onLine?"Loading...":"You are Offline waiting for connection"}</b></p>
    </div>
   </LoadingWrapper>
  )
}


const Layout = () => {
  return (
    <LayoutWrapper>
      <Menu/>
      <Outlet/>
      <LoadingPage/>
    </LayoutWrapper>
  );
};

export default Layout;
