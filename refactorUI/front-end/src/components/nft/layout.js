import React, {useState} from "react";
import {Outlet, NavLink} from "react-router-dom";
import styled,{css} from 'styled-components';

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
		img{
			width:3rem;
			height:auto;
		}
	}

	.menu{
		gap:1.4rem;
	}
`;



const Header = ()=>{
	return(
	<HeaderWrapper>
		<div className="title_menu_container">
			<div className="title">
				<img src={logo} alt="nft-logo"/>
				ShieldPact NFT
			</div>
			<div className="menu">
				<NavLink to="/nft/home">Home</NavLink>
				<NavLink to="/nft/explore">Explore</NavLink>
				<NavLink to="/nft/create">Create NFT</NavLink>
			</div>
		</div>
		<ConnectSection/>
	</HeaderWrapper>
	);
}




const ConnectSection = ()=>{
	const {open:connect} = useConnectModal();
	const { address, isConnected } = useAccount();

	const disconnect = useDisconnect();
	
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
		<Outlet/>
	</LayoutWrapper>
	);
}

export default Layout;