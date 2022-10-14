import React from "react";
import styled,{keyframes, css} from "styled-components";
import {FaCheckSquare, FaInfoCircle, FaTimesCircle, FaSpinner} from "react-icons/fa";

const fgColor="#111111";

const subColor="#ac50d7";

const bgColor = "#fefcff";

const __loadingFrames = keyframes`
	${Array(26).fill(0).map((x,i)=>`${i*4}%{background-image:linear-gradient(90deg,${subColor}, ${subColor} ${i*4}%, ${fgColor} ${i*4}%, ${fgColor});}`).join(' ')}	
`;

const loading = css`
			animation-name:${__loadingFrames};
			animation-duration:2.5s;
			animation-delay:50ms;
			animation-iteration-count:infinite;
			animation-direction:alternate-reverse
			`;

const _spinFrames = keyframes`
	from{
		transfrom:rotate(0deg);
	}

	to{
		transform:rotate(360deg);
	}
`



const Wrapper = styled.div`
	position:fixed;
	display:grid;
	place-items:center;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	z-index:999;
	width:${props=>props.block?"100%":"auto"};
	height:${props=>props.block?"100%":"auto"};

	/*backdrop-filter: blur(8px);*/
	/*background-color:rgba(125,125,125,0.9);*/

	#appModal{
		width:25rem;
		max-width:90vmin;

		padding:1.5rem;
		background-color:${bgColor};
		color:${fgColor};
		border-radius:0.5rem;
		box-shadow:0 0 1px 3px ${props=>props.baseColor??subColor}, inset 0 0 4px 4px ${fgColor};

		display:flex;
		flex-direction:column;
		gap:0.75rem;
		text-align:center;
		font-size:1.1rem;
		word-break: break-word;
		header{
			font-weight:bold;
			font-size:1.3rem;
			color:${props=>props.baseColor??subColor};

			svg{
				margin-top:0.5rem;
				font-size:3rem;
			}
		}

		footer{
			font-size:1.1rem;
			text-decoration:underline;
		}

		button#action{
			align-self:center;
			padding:0.5rem 1.75rem;
			font-size:1.2rem;
			background-color:${props=>props.baseColor??subColor};
			color:${bgColor};
			border-radius:1rem;
			box-shadow:1px 2px 2px 2px #6d6d6d;
			font-weight:bold;

			&:hover{
				background-color:${bgColor};
				color:${props=>props.baseColor??subColor};
			}

			&:active{
				transform:scale(0.95);
			}
		}

		#actionGroup{
			display:grid;
			gap:.5rem;
			justify-content:space-evenly;
		}

		main{
			white-space: break-spaces;
		}
	}
`;

const BASECOLOR = {success:"#50d76b",fail:"#EE3236", info:"#3c4278", default:subColor}
const modalWrapName = "__MOdalZxedjj12384_back_of_9500bbfjjeiiw3iiwoo3uuenn";

const ProcessLoader = styled.div`
	width:80%;
	height:0.5rem;
	margin:auto;
	margin-top:1rem;
	border-radius:1rem;
	${loading}
`
const SpinLoader = styled(FaSpinner)`
	font-size:2rem;
	animation-name:${_spinFrames};
	animation-duration:0.75s;
	animation-iteration-count:infinite;
	animation-timing-function: steps(8);

`
const getRand = ()=>(~~(Math.random()*777)%2);

const Base = ({header, content, footer, baseColor, loader, handlers, icon, block=true, ClickOutSideModalFunc=()=>{}})=>{
	//console.log(handlers);	
	return (
		<Wrapper className={modalWrapName} block={block} baseColor={baseColor} onClick={ClickOutSideModalFunc}>
			<section id="appModal">
				<header id="process">
					{icon && <div>{icon}</div>}
					{header && <div>{header}</div>}
					{loader && (content?.length%2==0?<SpinLoader/>:<ProcessLoader/>)}
				</header>
				
				<main>{content}</main>

				{handlers && <div id="actionGroup">
					 {Object.entries(handlers).map(([name, func])=>func && <button key={name} id="action" onClick={func}>{name??"Action"}</button>)}
				</div>}

				{footer && <footer>{footer}</footer>}
			</section>
		</Wrapper>
	); 
}

const Process = ({content, ...rest})=>{
	return <Base loader={true} header="Processing..." content={content??"Currently Running"} {...rest}/>
}

const Success = ({content, ...rest})=>{
	return <Base header="Successful" content={content??"Completed"} icon={<FaCheckSquare/>} 
					baseColor={BASECOLOR.success} {...rest}/>
}

const Failed = ({content, ...rest})=>{
	return <Base header="Failed" content={content??"An Error Occured"} icon={<FaTimesCircle/>} 
					baseColor={BASECOLOR.fail} {...rest}/>
}

const Info = ({content, ...rest})=>{
	return <Base header="Information" content={content??"get Informed Now"} icon={<FaInfoCircle/>} 
					baseColor={BASECOLOR.info} {...rest}/>
}

export {Info, Success, Failed, Process, Base, BASECOLOR, modalWrapName};