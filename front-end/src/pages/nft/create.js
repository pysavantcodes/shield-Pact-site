import React,{useState, useCallback} from 'react';
import {useNavigate} from "react-router-dom";
import {useAccount} from from '@web3modal/react';
import styled from 'styled-components';
import {FormButton} from '../../components/buttons';
import upload from './upload.svg';
import upload_bg from './up_bg.jpg';
import {useContractWrite, useWaitForTransaction, useAccount} from '@web3modal/react';
import {NFTConfig, MarketConfig} from '../../context/_web3_container';
const fgColor = "#acacac";

const Container = styled.div`
	font-size:1.1rem;
	display:flex;
	width:100%;
	align-items:center;
	justify-content:center;
	padding:5rem 7rem;
	gap:2rem;
	margin:auto;

	@media (max-width:1000px){
		flex-direction:column;
		gap:1rem;
		padding:5rem 3rem;
	}
`

const UploadSectionWrapper = styled.div`
	display:grid;
	gap:2rem;
	align-content:flex-start;
	padding:1rem 0rem;
	width:50%;
	

	h3{
		color:#fff;
	}

	@media (max-width:1000px){
		width:100%;
		
	}
`

const UploadSection = ({db, updateFile})=>{
	return (
	<UploadSectionWrapper>
		<div>
			<h3>Upload file</h3>
			<p>choose your file to upload</p>
		</div>
		<Upload {...{db, updateFile}}/>
		<div>
			<h1>Note:</h1>
			<p>Service fee: <b>2.5%</b></p>
			<p>You will recieve: <b>25.00ETH $50,000</b></p>
		</div>
	</UploadSectionWrapper>
	);
}


const UploadWrapper = styled.label`
	display:grid;
	place-items:center;
	text-align:center;
	border:dashed 2px ${fgColor};
	border-radius:3px; 
	position:relative;
	margin:auto;
	cursor:pointer;
	

	@media (max-width: 1000px){
		width:100%;
	}

	img#bg{
		width:100%;
		height:auto;
	}

	.box_content{
		position:absolute;
		transition:.5s;
	}

	&:hover .box_content{
			transform:scale(0.8);
	}

	input{
		display:none;
	}
`;

const Upload = ({db, updateFile})=>{
	return (
	<UploadWrapper htmlFor="upload-file">		
		<img id="bg" src={db['file'] || upload_bg} alt="file"/>
		<div className="box_content"style={{visibility:db["file"]?"hidden":"visible"}}>
			<img src={upload} alt="upload"/>
			<h2>Choose a File</h2>
			<p>PNG, GIF, WEBP, <br/> Max 10MB</p>
		</div>
		<input id="upload-file" type="file" onChange={updateFile} accept="image/*"/>
	</UploadWrapper>
	)
}

const FormWrapper = styled.div`
	display:flex;
	flex-direction:column;
	gap:15px;
	padding:3rem 2rem;
	background-color: #111111;
	border-radius:10px;
	width:50%;

	@media (max-width:1000px){
		width:100%;
	}
`


const FormContainer = ({db, updateDB, setShow, onSubmit})=>{
	return (
	<FormWrapper>
		<TextInput title="Product Name" name="name" placeholder="e. g. `Digital Awesome Game`"  {...{db, updateDB}}/>
		<TextAreaInput title="Description" name="description" placeholder="“After purchasing the product you can get item...”"  {...{db, updateDB}}/>
		<GroupField>
			<TextInput title="Item Price in $" name="dollerValue" placeholder="e. g. `20$`"  {...{db, updateDB}}/>
			<TextInput title="Size" name="size" placeholder="e. g. `Size`"  {...{db, updateDB}}/>
			<TextInput title="Properties" name="properties" placeholder="e. g. `Properties`"  {...{db, updateDB}}/>
		</GroupField>
		<TextInput title="Royalty" name="Royality" placeholder="e. g. `20%`"  {...{db, updateDB}}/>
		<CheckButton name="putonsale"/>
		<FormButtonWrapper>
			<FormButton onClick={setShow}>Preview</FormButton>
			<FormButton onClick={onSubmit}>Submit Item</FormButton>
		</FormButtonWrapper>
	</FormWrapper>
	);
}


const FormButtonWrapper = styled.div`
	display:grid;
	grid-template-columns:0.35fr 0.65fr;
	gap:1rem;
	@media (max-width:600px){
		display:flex;
		flex-direction:column;
		gap:1rem;
	}
`

const GroupField = styled.div`
	display:flex;
	gap:1rem;
	align-items:center;
	@media (max-width:1000px){
		flex-direction:column;
		gap:2rem;
	}
`;

const Field = styled.div`
	width:100%;
	display:flex;
	flex-direction:column;
	gap:5px;
	
	label{
		cursor:pointer;
	}

	input[type="checkbox"]{
		width:fit-content;
	}

	input[type="text"], textarea{
		padding:15px;
		border-radius:5px;
		background-color: #1d1d1d;
		border:solid 2px #ffffff14;
		color:#fff;
		width:100%;
		font-size:1rem;
		&:focus{
			border-color:#a750cf;
		}
	}
`;


const TextInput = ({title, name, placeholder,  db, updateDB})=>{
	return (
	<Field>
		<label htmlFor={`form-elt-${name}`}>{title}</label>
		<input id={`form-elt-${name}`} type="text" name={name} 
		placeholder={placeholder} onKeyUp={updateDB} defaultValue={db[name]}/>
	</Field>
	);
}

const CheckButton = ({title, name, onClick})=>{
	return (
	<Field>
		<label htmlFor={`form-elt-${name}`}>{title}</label>
		<input id={`form-elt-${name}`} type="checkbox" name={name} onClick={onClick} placeholder="Agree and Continue"/>
	</Field>
	);
}


const TextAreaInput = ({title, name, placeholder, rows=5, db, updateDB})=>{
	return (
	<Field>
		<label htmlFor={`form-elt-${name}`}>{title}</label>
		<textarea rows={rows} id={`form-elt-${name}`} type="text" name={name} 
			placeholder={placeholder} onKeyUp={updateDB} defaultValue={db[name]}/>
	</Field>
	);
}



const Main = ()=>{
	const {isConnected} = useAccount();
	const [db, setDB] = useState({});
	const [_show, _setShow] = useState(false)
	const updateDB = useCallback((e)=>{
		setDB(state=>({...state,[e.target.name]:e.target.value}));
	},[setDB]);
	const navigate = useNavigate();

	useEffect(()=>{
		console.log("Nvigate")
		navigate('/nft/home');
	},[isConnected])

	const reader = new FileReader();

	reader.onloadend = (data)=>{
		setDB(state=>({...state,file:data?.target.result}))
	};

	const updateFile = (e)=>{
		if(e.target.files[0]){
			reader.readAsDataURL(e.target.files[0])
		}
	}

	let { data, error, isLoading, write } = useContractWrite(createNFTConfig);

	const onSubmit = async ()=>{
		let _data = await IpfsStoreNFT({name:db.name, description:db.decsription, image:db.file, properties:sb.properties})
    	let awaitawait write({functionName: 'mint', args:[ipfsResult.ipfns]});
    	const { receipt, isWaiting } = useWaitForTransaction({ hash: data?.hash })
    	update(reciept.events[1].args.itemId, "Added to blockchain Successfully");;
	}

	return (
	<>
	<Container onClick={e=>{_show&&_setShow(false)}}>
		<UploadSection {...{db, updateFile}}/>
		<FormContainer {...{db, updateDB, onSubmit, setShow:(()=>_setShow(Object.keys(db).length!==0))}}/>
	</Container>
	{_show && <Preview db={db}/>}
	</>
	);
}


const PreviewWrapper = styled.div`
	padding:2rem;
	position:fixed;
	z-index:3;
	width:75vmin;
	margin:auto;
	background: #1515218c;
	border-radius:10px;
	backdrop-filter: blur(10px);
	transform: translate(-50%,-50%);
    top: 50%;
    left: 50%;

	table{
		margin:auto;
		font-size:1.5rem;

		td{
			padding:0.25rem 0rem;

			&:first-child{
				padding-right:3rem;
			}
		}
	}
`;

const Preview = ({db})=>{
	return (
	<PreviewWrapper>
		<table>
			<tbody>
				{Object.entries(db).map(x=><tr><td>{x[0].toUpperCase()}</td><td>{x[1]}</td></tr>)}
			</tbody>
		</table>
	</PreviewWrapper>
	)
}


export default Main;