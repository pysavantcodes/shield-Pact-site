import React, {useState} from "react";
import {Outlet, NavLink} from "react-router-dom";
import styled,{css} from 'styled-components';
import {FaAngleRight} from "react-icons/fa";
import {Button} from '../buttons';
import logo from './logo.png';

import { useConnectModal, useDisconnect, useAccount, useNetwork } from '@web3modal/react';

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
	justify-content:space-between;
	padding:1rem 5rem;
	font-size:1.25rem;
	position:sticky;
	top:0;
	border-bottom: 1px solid #ffffff14;
	background-color: #1515218c;
	backdrop-filter: blur(10px);
	z-index:2;

	&, .title_menu_container,
	.title, .menu
	{
		${flex}
	}

	.title_menu_container{
		gap:1rem;
	}

	.title{
		font-weight:bold;
		border-right:solid 1px #ffffff14;
		padding-right:1rem;
		color:#fff;

		font-size:20px;

		img{
			width:3rem;
			height:auto;
		}
	}

	.menu{
		gap:1.4rem;

		font-size:17px;
	}

	@media (max-width:900px){
		flex-direction:column;

		.title_menu_container{
			flex-direction:column;
		}

		.menu{
			margin-bottom:1rem;
			font-size:15px;
		}
		.title{
			border-right:none;
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
		${flex}
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

	@media (max-width:900px){
		padding:1.5rem 2rem;
	}

`

const Header = ()=>{
	return(
	<HeaderWrapper>
		<div className="title_menu_container">
			<div className="title">
				<img src={logo} alt="nft-logo"/>
				ShieldPact NFT
			</div>
			<div className="menu">


				<NavLink to="/nft">Home</NavLink>
				<NavLink to="explore">Explore</NavLink>
				<NavLink to="create">Create NFT</NavLink>

			</div>
		</div>
		<ConnectSection/>
	</HeaderWrapper>
	);
}

const Title = ()=>{
	return (
		<TitleWrapper>
			<h1>CreateNFT</h1>
			<div className="nav">
				<span>Home</span>
				<FaAngleRight/>
				<span>CreateNFT</span>
			</div>
		</TitleWrapper>
	)
}


const ConnectSection = ()=>{
	const {open:connect} = useConnectModal();
	const { address, isConnected } = useAccount();

	const disconnect = useDisconnect();
	const chains = useNetwork();
	console.log(chains);
	return(
		<ConnectWrapper>
			<Button onClick={isConnected?disconnect:connect}>{isConnected?"Disconnect":"Connect"} Wallet</Button>
			<br/><small>{address}</small>
		</ConnectWrapper>
	);
}



const ConnectWrapper = styled.div`
	position:relative;
	small{
		color:#fff;
		text-decoration:underline;
		position:absolute;
		right:0;
		top:100%;
	}
`

const Layout = ()=>{
	return (
	<LayoutWrapper>
		<Header/>
		<Title/>
		<Outlet/>
	</LayoutWrapper>
	);
}

export default Layout;
