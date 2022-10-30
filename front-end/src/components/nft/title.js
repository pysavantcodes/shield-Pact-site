import React from 'react';
import styled from 'styled-components';
import {FaAngleRight} from "react-icons/fa";

const TitleWrapper = styled.div`
	
	display:flex;
	justify-content:space-between;
	padding:1.5rem 5rem;
	border:solid 1px #ffffff14;
	border-left:none;
	border-right:none;



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

	@media (max-width:900px){
		padding:1.5rem 2rem;
	}

`

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


export default Title;