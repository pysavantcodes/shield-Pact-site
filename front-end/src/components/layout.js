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

import {
  useConnectModal,
  useDisconnect,
  useAccount,
  useNetwork,
  useProvider
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
  const provider = useProvider();

  useEffect(() => {
    provider?.on("network",(_new, _old)=>{
      if(_old){
        window.location.reload();
      }
    });

    provider?.on("changed",(id)=>{
      console.log("changed");
      console.log(id);
      window.location.reload();
    });

    provider?.on("error",(id)=>{
      console.log("error");
      console.log(id);
    });

    return () => {
      provider?.off("network");
      provider?.off("changed");
    };
  }, [provider])

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
      position:sticky;
      top:5rem;
      left:0;
      /*height:calc(100vh - 5rem);*/
      height:100%;
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

const Menu = ({children})=>{
  const loc = useLocation();

  return(
      <HeaderWrapper>
        <label htmlFor="__signal">
          <AiOutlineMenu size="2rem" weight="800" color="#fff"/>
        </label>
        <div id="title">
            <img src={logo} alt="nft-logo" />
            <span id="logo_title">Shield {loc.pathname.split('/')[1]}</span>
        </div>
        <input id="__signal" type="checkbox" defaultChecked/>
        <div id="menu">
            <NavLink to="/nft">Explore NFT</NavLink>
            <NavLink to="/launchpad">LaunchPad</NavLink>
            <NavLink to="/staking">Staking</NavLink>
            <NavLink to="/swap">Swap</NavLink>
            <NavLink to="/airdrop">AirDrop</NavLink>

            <div className="extra">
              <div to="#">Create</div>
              <div className="submenu">
                <NavLink to="/createtoken">Create Token</NavLink>
                <NavLink to="/createlaunchpad">Create Launch</NavLink>
                <NavLink to="/createAirdrop">Create AirDrop</NavLink>
              </div>
            </div>
        </div>
        <ConnectSection/>
      </HeaderWrapper>
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
    width:50px;
    height:50px;
  }
`;

const LoadingPage  = ()=>{
  const {status} = useAccount();
 
  return (
  status?.indexOf("connecting") == -1?
  "":
  <LoadingWrapper>
    <img src={loadingGif}/>
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
