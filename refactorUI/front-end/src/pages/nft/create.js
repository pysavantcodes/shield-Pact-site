import React,{useState, useCallback} from 'react';
import styled from 'styled-components';
import {FormButton} from '../../components/buttons';
import upload from './upload.svg';
import upload_bg from './up_bg.jpg';

import {useSigner, useContractWrite} from '@web3modal/react';

import {IpfsStoreNFT, IpfsGetNFT, createNFT, MarketConfig, NFTConfig} from '../../context/_web3_container';

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
		<img id="bg" src={db['imagePath'] || upload_bg} alt="file"/>
		<div className="box_content"style={{visibility:db["imagePath"]?"hidden":"visible"}}>
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
			<TextInput title="Item Price in $" name="price" placeholder="e. g. `20$`"  {...{db, updateDB}}/>
			<TextInput title="Size" name="size" placeholder="e. g. `Size`"  {...{db, updateDB}}/>
			<TextInput title="Properties" name="extra" placeholder="e. g. `Properties`"  {...{db, updateDB}}/>
		</GroupField>
		
		<CheckButton name="putonsale"/>
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
	const [db, setDB] = useState({name:'', description:'',price:'', size:'', extra:''});
	const [_show, _setShow] = useState(false);
	const [loading, setLoading] = useState(false);
	const [status, setStatus] = useState({})

	const updateDB = useCallback((e)=>{
		setDB(state=>({...state,[e.target.name]:e.target.value}));
	},[setDB]);
	const reader = new FileReader();
	reader.onloadend = (data)=>{
		setDB(state=>({...state,imagePath:data?.target.result}))
	};
	const updateFile = (e)=>{
		if(e.target.files[0]){
			setDB(state=>({...state,image:e.target.files[0]}));
			reader.readAsDataURL(e.target.files[0]);
		}
	}

	const {data:_signer} = useSigner();

	const {write:nftContract } = useContractWrite({
	  addressOrName: NFTConfig.address,
	  contractInterface: NFTConfig.abi,
	});

	const {write:marketContract } = useContractWrite({
	  addressOrName: MarketConfig.address,
	  contractInterface: MarketConfig.abi,
	});

	const onSubmit = async()=>{
		try{
			const cleanDb = {name:db.name, description:db.description, properties:{extra:db.extra, size:db.size}, image:db.image};
			for(let k of Object.keys(cleanDb)){
				if(!cleanDb[k]){
					console.log("Not complete");
					return false;
				}
			}
			if(loading)
				return
			setLoading(true);
			let result = await createNFT(_signer, nftContract, marketContract, cleanDb, db.price, console.log);
			window.IpfsStoreNFT = IpfsStoreNFT;
			window.IpfsGetNFT = IpfsGetNFT;
		}catch(e){
			console.log(e);
		}
		setLoading(false);
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
	console.log(db);
	return (
	<PreviewWrapper>
		<table>
			<tbody>
				{Object.entries(db).map(x=>x[0].indexOf('image')!=-1?'':<tr><td>{x[0].toUpperCase()}</td><td>{x[1].toString()}</td></tr>)}
			</tbody>
		</table>
	</PreviewWrapper>
	)
}


export default Main;