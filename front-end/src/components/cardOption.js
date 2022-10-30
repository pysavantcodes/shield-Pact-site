import styled from 'styled-components';
import {statusType, statusCreate, defaultSection, customActionCreate, createController} from './customModal/controller';

import {Info, Success, Failed, Process, Base, BASECOLOR} from './customModal/model';

const ComponentWrap = (Section, header)=>({handlers, content, ClickOutSideModalFunc})=>{
	return <Base header={header} content={<Section {...handlers} {...content}/>} baseColor={BASECOLOR.default}
					ClickOutSideModalFunc={ClickOutSideModalFunc}/>
}

//constant
const HOME = 'Home';

const HomeContainer = styled.ul`
	display:flex;
	flex-direction:column;
	gap:1rem;
	list-style:none;
	margin:auto;
	padding:auto;

	li{
		padding:0.5rem 0rem;
		border:solid 1px #111;
		border-radius:10px;
		font-size:1.25rem;
		box-shadow:0px 3px 3px #333;
		font-weight:bold;
		cursor:pointer;

		&:active{
			transform:scale(0.95);
		}
	}
`;

const _Home = (props)=>{
	//console.log(props)
	return (
		<HomeContainer>
	{props.isOwner &&
		<>	
			<li onClick={props.addToMarket(props)}>{props.price?"Change Price":"AddToMarket"}</li>
			{props.price && <li onClick={props.toggleMarket(props.itemId)}>ToggleMarket</li>}
		</>
	}
		{props.price && props.forSale && !props.isOwner && <li onClick={props.buy(props.itemId)}>Buy</li>}
		<li onClick={props.about(props)}>About</li>
		</HomeContainer>
	);
}

const Home = ComponentWrap(_Home, "Selet Option");

const ADDTOMARKET = "AddToMarket";

const AddToMarketContainer = styled.form`
	display:flex;
	flex-direction:column;
	gap:1rem;
	padding:0.75rem;
	border: solid 1px #0b0b12;
	border-radius:0.5rem;

	input, button{
		font-size:1.25rem;
		padding:0.5rem;
		border:solid 1px #111;
		color:#0b0b12;
	}

	input[type='checkbox']{
		appearance:auto;
		width:1.25rem;
		height:1.25rem;
	}
	
	label{
		display:flex;
		gap:0.25rem;
		align-items:center;
		cursor:pointer;
	}

	button{
		padding:0.5rem 0rem;
		border-radius:5px;
		font-size:1.15rem;
		box-shadow:0px 3px 3px #333;
		font-weight:bold;
		cursor:pointer;

		&:active{
			transform:scale(0.95);
		}
	}
`;

const  _AddToMarket= (props)=>{
	
	const onSubmit = (e)=>{
		e.preventDefault();
		props.submit(props.itemId, e.target.elements.price.value, e.target.elements.isBNB.checked);
	}

	return (
		<AddToMarketContainer onSubmit={onSubmit}>
			<input name="price" placeholder="Price" type="text"/>
			<label><input type="checkbox" name="isBNB"/><span>isBNB</span></label>
			<button>Submit</button>
		</AddToMarketContainer>
	);
}

const AddToMarket = ComponentWrap(_AddToMarket,"Enter Price");



const ABOUT = "About"

const AboutContainer = styled.div`
	*{
		color:black;
	}
`
const  _About= (props)=>
	<AboutContainer>
		<div>
			<b>Name: </b>
			<span>{props.name}</span>
		</div>
		<br/>
		<div>
			<b>Description: </b><br/>
			<span>{props.description}</span>
		</div>
	</AboutContainer>

const About = ComponentWrap(_About);



const Buy = ()=>{
	return <div>{"Loading"}</div>
}


const options = {
	...defaultSection,
	Home,
	AddToMarket,
	Buy,
	About
};


const optionAt = {...statusCreate, home:customActionCreate(HOME), addToMarket:customActionCreate(ADDTOMARKET),
					 about:customActionCreate(ABOUT)};

const optionController = createController(options);

export default optionController;

export {optionAt};