import React,{useState, useCallback, useMemo} from 'react';
import {Navigate} from "react-router-dom";
import styled from 'styled-components';
import {useSigner, useAccount, useProvider} from '@web3modal/react';

import Title from "../../components/nft/title";
import Form from "../../components/nft/form";

import nftLib  from '../../upgrade/nft';

import useInfoModal from "../../components/customModal/useModal";
import InfoModalController, {statusCreate} from "../../components/customModal/controller";

const {createNFT} = nftLib;

const reader = new FileReader();

const Main = ()=>{
	const [db, setDB] = useState({name:'', description:'',price:'', isBNB:false});
	
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

  	const actionUpdateList = useMemo(() => ({process:value=>statusCreate.process(infoUpdate, value),
                                  success:(value,explorer)=>statusCreate.success(infoUpdate, value, {explorer}),
                                   failed:value=>statusCreate.failed(infoUpdate, value),
                                   info:(value, Proceed)=>statusCreate.info(infoUpdate, value, {Proceed}),
                               		next:(value, No, Yes)=>statusCreate.info(infoUpdate, value, {No, Yes})}), [infoUpdate]);
	const onSubmit = async ()=>{
		if(infoStatus.action){
			//console.log("Loading");
			return;
		}

		// if(!_signer){
		// 	statusCreate.failed(infoUpdate, "Signer not available");
		// 	return;
		// }

		const cleanDb = {name:db.name, description:db.description, image:db.image};
		for(let k of Object.keys(cleanDb)){
			if(!cleanDb[k]){
				actionUpdateList.info("Not complete");
				return;
			}
		}

		await createNFT(_signer, cleanDb, db.price, db.isBNB, actionUpdateList);
		
	}

	const onPreview = ()=>{
		if(infoStatus.action){
			//console.log("Loading");
			return;
		}

		if(Object.keys(db).length!==0)
			actionUpdateList.info(<Preview db={db}/>);
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
					{Object.entries(db).map(x=>(x[0].indexOf('image')===-1&&x[0].indexOf('isBNB')===-1)?<tr key={x[0]}><td>{x[0].toUpperCase()}</td><td>{x[1].toString()+(x[0].toLowerCase()=='price'?(db.isBNB?' BNB':' BUSD'):'')}</td></tr>:'')}
				</tbody>
			</table>
		</PreviewWrapper>
	)
}


export default Main;
