import React,{useState, useCallback, useEffect} from 'react';
import styled from 'styled-components';
import {useSigner} from '@web3modal/react';
import {FormButton} from '../../components/buttons';
import {FaAngleRight} from "react-icons/fa";
import upload from './upload.svg';
import upload_bg from './up_bg.jpg';

import {createNFT} from '../../context/_web3_container';

const fgColor = "#acacac";

const TitleWrapper = styled.div`
	justify-content:space-between;
	padding:1.5rem 5rem;
	border:solid 1px #ffffff14;
	border-left:none;
	border-right:none;
	font-size:1.15rem;

	&,.nav
	{
		display:flex;
		align-items:center;
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

const UploadSection = ({db, updateFile, loading})=>{
	return (
	<UploadSectionWrapper>
		<div>
			<h3>Upload file</h3>
			<p>choose your file to upload</p>
		</div>
		<Upload {...{db, updateFile, loading}}/>
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

const Upload = ({db, updateFile, loading})=>{
	return (
	<UploadWrapper htmlFor="upload-file">		
		<img id="bg" src={db['imagePath'] || upload_bg} alt="file"/>
		<div className="box_content"style={{visibility:db["imagePath"]?"hidden":"visible"}}>
			<img src={upload} alt="upload"/>
			<h2>Choose a File</h2>
			<p>PNG, GIF, WEBP, <br/> Max 10MB</p>
		</div>
		<input id="upload-file" type="file" onChange={updateFile} accept="image/*" disabled={loading}/>
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


const FormContainer = ({db, updateDB, setShow, onSubmit, loading})=>{
	return (
	<FormWrapper>
		<TextInput title="Product Name" name="name" placeholder="e. g. `Digital Awesome Game`"  {...{db, updateDB, loading}}/>
		<TextAreaInput title="Description" name="description" placeholder="“After purchasing the product you can get item...”"  {...{db, updateDB}}/>
		<GroupField>
			<TextInput title="Item Price in $" name="price" placeholder="e. g. `20$`"  {...{db, updateDB, loading}}/>
			<TextInput title="Size" name="size" placeholder="e. g. `Size`"  {...{db, updateDB, loading}}/>
			<TextInput title="Properties" name="extra" placeholder="e. g. `Properties`"  {...{db, updateDB, loading}}/>
		</GroupField>
		<FormButtonWrapper>
			<FormButton onClick={setShow}>Preview</FormButton>
			<FormButton onClick={onSubmit}>Submit Item</FormButton>
		</FormButtonWrapper>
	</FormWrapper>
	);
}

//`<TextInput title="Royalty" name="Royality" placeholder="e. g. `20%`"  {...{db, updateDB}}/>`

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


const TextInput = ({title, name, placeholder,  db, updateDB, loading})=>{
	return (
	<Field>
		<label htmlFor={`form-elt-${name}`}>{title}</label>
		<input id={`form-elt-${name}`} type="text" name={name} 
		placeholder={placeholder} onKeyUp={updateDB} defaultValue={db[name]} disabled={loading}/>
	</Field>
	);
}

const CheckButton = ({title, name, onClick, loading})=>{
	return (
	<Field>
		<label htmlFor={`form-elt-${name}`}>{title}</label>
		<input id={`form-elt-${name}`} type="checkbox" name={name} onClick={onClick} placeholder="Agree and Continue" disabled={loading}/>
	</Field>
	);
}


const TextAreaInput = ({title, name, placeholder, rows=5, db, updateDB, loading})=>{
	return (
	<Field>
		<label htmlFor={`form-elt-${name}`}>{title}</label>
		<textarea rows={rows} id={`form-elt-${name}`} type="text" name={name} 
			placeholder={placeholder} onKeyUp={updateDB} defaultValue={db[name]} disabled={loading}/>
	</Field>
	);
}



const Main = ()=>{
	const [db, setDB] = useState({name:'', description:'',price:'', size:'', extra:''});
	const [_show, _setShow] = useState(false);
	const [loading, setLoading] = useState(false);
	const [status, setStatus] = useState();
	
	const updateDB = useCallback((e)=>{
		setDB(state=>({...state,[e.target.name]:e.target.value}));
	},[setDB]);
	
	const reader = new FileReader();
	
	reader.onloadend = (data)=>{
		setDB(state=>({...state,imagePath:data?.target.result}));
	}

	const updateFile = (e)=>{
		if(e.target.files[0]){
			setDB(state=>({...state,image:e.target.files[0]}));
			reader.readAsDataURL(e.target.files[0]);
		}
	}

	const {data:_signer} = useSigner();

	const onSubmit = async()=>{
		if(!_signer){
			alert("Signer not available");
			return
		}

		if(loading){
			alert("Loading");
			return
		}

		const cleanDb = {name:db.name, description:db.description, properties:{extra:db.extra, size:db.size}, image:db.image};
		for(let k of Object.keys(cleanDb)){
			if(!cleanDb[k]){
				console.log("Not complete");
				return false;
			}
		}	
		setLoading(true);
		console.log("Creating");
		await createNFT(_signer, cleanDb, db.price, setStatus,setStatus,()=>{setLoading(false)})
	}

	useEffect(()=>{
		if(status === "SUCCESS"){
		alert("Transaction Successful");
		setStatus(null);
		}

		if(status === "FAILED"){
			alert("Transaction Failed");
			setStatus(null);
		}
	},[status]);
	

	return (
	<>
	<Title/>
	<Container onClick={e=>{_show&&_setShow(false)}}>
		<UploadSection {...{db, updateFile, loading}}/>
		<FormContainer {...{db, updateDB, onSubmit, loading, setShow:(()=>_setShow(Object.keys(db).length!==0))}}/>
	</Container>
	{_show && <Preview db={db}/>}
	{loading && <Transaction status={status}/>}
	</>
	);
}



const ModalWrapper = styled.div`
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
    color:#fff;
`;

const PreviewWrapper = styled(ModalWrapper)`
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

const TransactionWrapper = styled(ModalWrapper)``;

const Transaction = ({status})=>{
	return (
	<TransactionWrapper>
		{status}
	</TransactionWrapper>
	);
}



const Preview = ({db})=>{
	console.log(db);
	return (
		<PreviewWrapper>
			<table>
				<tbody>
					{Object.entries(db).map(x=>x[0].indexOf('image')!==-1?'':<tr><td>{x[0].toUpperCase()}</td><td>{x[1].toString()}</td></tr>)}
				</tbody>
			</table>
		</PreviewWrapper>
	)
}


export default Main;