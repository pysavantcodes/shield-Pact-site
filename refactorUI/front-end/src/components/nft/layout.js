import React, {useState, useEffect, useMemo, useCallback} from "react";
import {Outlet, NavLink} from "react-router-dom";
import styled,{css} from 'styled-components';
import { FaWallet } from "react-icons/fa";
import {Button} from '../buttons';
import logo from './logo.png';

import { useConnectModal, useDisconnect, useAccount, useSigner} from '@web3modal/react';
import {ownerOfMarket, withdrawBNB, withdrawBUSD} from '../../context/_web3_container';
import OptionController,{optionAt} from '../../components/cardOption';
import useOptionModal from '../../components/customModal/useModal';


const fgColor = "#acacac";
const bgColor = "#1d1d1d";

const LayoutWrapper = styled.section`
	background-color:${bgColor};
	color:${fgColor};

	a{
		color:${fgColor};
		
		&:hover{
			color:#fff;
		}
	}
`;

const flex = css`
	display:flex;
	align-items:center;
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
  

  .hamburger, .home {
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
    .home {
      display: block;
      position: absolute;
      left: 30px;
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
const Header = ()=>{
	const {open:connect} = useConnectModal();
	const { address, isConnected } = useAccount();
	const disconnect = useDisconnect();

	const [owner, setOwner] = useState();
	const {data:signer} = useSigner();

	useEffect(()=>{
		(async function(){setOwner(await ownerOfMarket(signer, address))})();
	},[address, signer]);
	const {View:OptionView, update:optionUpdate} = useOptionModal({Controller:OptionController});
	const actionUpdateList = useMemo(() => [value=>optionAt.process(optionUpdate, value),
                                  (value,explorer)=>optionAt.success(optionUpdate, value, {explorer}),
                                   value=>optionAt.failed(optionUpdate, value),
                                   (value, Proceed)=>optionAt.info(optionUpdate, value, {Proceed})], [optionUpdate]);

    const _withdrawBNB = useCallback(async()=>withdrawBNB(signer,...actionUpdateList),[signer]);
    const _withdrawBUSD = useCallback(async()=>withdrawBUSD(signer, ...actionUpdateList),[signer]);

  	const withdraw = useCallback(()=>optionAt.info(optionUpdate, "Withdraw Interest", 
  										{withdrawBNB:_withdrawBNB, withdrawBUSD:_withdrawBUSD}),
  															[optionUpdate, _withdrawBNB, _withdrawBUSD]);

	const dropDown = ()=>{
      document.querySelector(".menu").classList.toggle("drop")
      document.querySelector(".dropBtn").classList.toggle("drop");
    }

  

  return (
    <HeaderWrapper>
      <div className="title_menu_container">
        <NavLink className="home" to="/"><FaHome /></NavLink>
        <div className="title">
          <img src={logo} alt="nft-logo" />
          ShieldPact NFT MarketPlace
        </div>

        <div className="menu">
          <NavLink to="/nft/home">Home</NavLink>
          <NavLink to="/nft/explore">Explore</NavLink>
          {isConnected && <NavLink to="/nft/create">Create NFT</NavLink>}
        </div>
        <GiHamburgerMenu onClick={()=>dropDown()} className="hamburger" />
      </div>
      <ConnectSection {...{address, connect, isConnected, disconnect, owner, withdraw}}/>
    </HeaderWrapper>
  );
}

const toggleDisplay = () => {
  document.getElementById("small").classList.toggle("small");
};

const ConnectSection = ({address, connect, isConnected, disconnect, owner, withdraw})=>{
	
	return(
		<ConnectWrapper className="dropBtn">
			{owner && <Button onClick={withdraw}>Withdraw</Button>}
			<Button onClick={isConnected?disconnect:connect}>{isConnected?"Disconnect":"Connect"} Wallet</Button>
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
}



const ConnectWrapper = styled.div`
	position:relative;
	display:flex;
	justify-content:center;
	align-items:center;
	gap:.75rem;
	/*small{
		color:#fff;
		text-decoration:underline;
		position:absolute;
		right:0;
		top:100%;
	}*/
	.walletDrop{
		text-align:center;
	}
	small{
		color:#fff;
		font-size:10px;
		background:#111;
		padding:3px;
		border-radius:5px;
		margin-top:2px;
	}
	
	@media (max-width:900px){
		flex-direction:column;
	}
`

const Layout = ()=>{
	return (
	<>
		<LayoutWrapper>
			<Header/>
			<Outlet/>
		</LayoutWrapper>
	</>
	);
}

export default Layout;
