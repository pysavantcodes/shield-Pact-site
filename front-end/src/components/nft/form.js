import React from 'react';
import styled from 'styled-components';
import {FormButton} from '../buttons';
import upload from './upload.svg';
import upload_bg from './up_bg.jpg';
import check_svg from './check.svg';
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

const FormContainer = ({db, updateDB, onPreview, onSubmit, onCheck, loading})=>{
	return (
	<FormWrapper>
		<TextInput title="Product Name" name="name" placeholder="e. g. `Digital Awesome Game`"  {...{db, updateDB, loading}}/>
		<TextAreaInput title="Description" name="description" 
				placeholder="“After purchasing the product you can get item...”"  {...{db, updateDB, loading}}/>
		<GroupField>
			<TextInput title="Item Price in $" name="price" placeholder="e. g. `20$`"  {...{db, updateDB, loading}}/>
			{/*<TextInput title="Size" name="size" placeholder="e. g. `Size`"  {...{db, updateDB, loading}}/>
			<TextInput title="Properties" name="extra" placeholder="e. g. `Properties`"  {...{db, updateDB, loading}}/>*/}
		</GroupField>
		<CheckButton title="isBNB" name="isBNB" onCheck={onCheck}/>
		<FormButtonWrapper>
			<FormButton onClick={onPreview} disabled={loading}>Preview</FormButton>
			<FormButton onClick={onSubmit} disabled={loading}>Submit Item</FormButton>
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
		padding:12px;
		width:0;
		height:0;
		background-size:75%;
		background-position:center;
		background-repeat:no-repeat;
		cursor:pointer;

		&:checked{
			background-color:#111;
			background-image:url(${check_svg});
			
		}
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

const CheckWrap = styled(Field)`
	flex-direction:row;
`;

const CheckButton = ({title, name, onCheck, loading})=>{
	
	return (
	<CheckWrap>
		<label htmlFor={`form-elt-${name}`}>{title}</label>
		<input id={`form-elt-${name}`} type="checkbox" name={name} onChange={onCheck} placeholder="Agree and Continue" disabled={loading}/>
	</CheckWrap>
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

const Wrapper = ({db, loading, updateFile, updateDB, onSubmit, onCheck, onPreview})=>{
	return (
	<Container>
		<UploadSection {...{db, updateFile, loading}}/>
		<FormContainer {...{db, updateDB, onSubmit, loading, onCheck, onPreview}}/>
	</Container>
	);
}

export default Wrapper;