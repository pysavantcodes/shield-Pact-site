import React,{useState, useCallback} from 'react';
import {Navigate} from "react-router-dom";
import styled from 'styled-components';
import {useSigner, useAccount} from '@web3modal/react';

import Title from "../../components/nft/title";
import Form from "../../components/nft/form";

import {createNFT} from '../../context/_web3_container';

import useInfoModal from "../../components/customModal/useModal";
import InfoModalController, {statusCreate} from "../../components/customModal/controller";

const reader = new FileReader();

const Main = ()=>{
	const [db, setDB] = useState({name:'', description:'',price:'', isBNB:false /*,size:'', extra:''*/});
	
	const updateDB = useCallback((e)=>{
		setDB(state=>({...state,[e.target.name]:e.target.value}));
	},[setDB]);

	const onCheck = useCallback((e)=>{
		setDB(state=>({...state,[e.target.name]:e.target.checked}));
	},[setDB])

	const {isConnected} = useAccount();
	
	reader.onloadend = useCallback(
		data=>
			setDB(state=>({...state,imagePath:data?.target.result}))
	,[setDB]);

	const updateFile = useCallback((e)=>{
		if(e.target.files[0]){
			setDB(state=>({...state,image:e.target.files[0]}));
			reader.readAsDataURL(e.target.files[0]);
		}
	},[setDB]);

	const {data:_signer} = useSigner();

	const {View:InfoApp, update:infoUpdate, status:infoStatus} = useInfoModal({Controller:InfoModalController});
	console.log(_signer);
	const onSubmit = async ()=>{
		if(infoStatus.action){
			console.log("Loading");
			return;
		}

		if(!_signer){
			statusCreate.failed(infoUpdate, "Signer not available",{close:statusCreate.reset(infoUpdate)});
			return;
		}

		const cleanDb = {name:db.name, description:db.description, /*properties:{extra:db.extra, size:db.size},*/ image:db.image};
		for(let k of Object.keys(cleanDb)){
			if(!cleanDb[k]){
				statusCreate.info(infoUpdate,"Not complete",{close:statusCreate.reset(infoUpdate)});
				return;
			}
		}

		statusCreate.process(infoUpdate, "Creating");
	
		await createNFT(_signer, cleanDb, db.price, (value)=>statusCreate.process(infoUpdate, value),
					(value)=>statusCreate.success(infoUpdate, value, {close:statusCreate.reset(infoUpdate)}),
					(value)=>statusCreate.failed(infoUpdate, value, {close:statusCreate.reset(infoUpdate)})
					);
		
	}

	const onPreview = ()=>{
		if(infoStatus.action){
			console.log("Loading");
			return;
		}

		if(Object.keys(db).length!==0)
			statusCreate.info(infoUpdate,<Preview db={db}/>,{close:statusCreate.reset(infoUpdate)});
	}

	return (
	(isConnected||true) ?
		(<>
			<InfoApp/>
			<Title/>
			<Form {...{db, loading:infoStatus.action, updateFile, updateDB, onSubmit, onCheck, onPreview}}/>
		</>)
		:(<Navigate to="/nft/home"/>)
	
	);
}

const PreviewWrapper = styled.div`
	table{
		margin:auto;
		font-size:1rem;
		text-align:left;
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
					{Object.entries(db).map(x=>x[0].indexOf('image')!==-1?'':<tr><td>{x[0].toUpperCase()}</td><td>{x[1].toString()}</td></tr>)}
				</tbody>
			</table>
		</PreviewWrapper>
	)
}


export default Main;
