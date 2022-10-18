import React,{useRef, useMemo, useEffect, useState} from "react";
import {useSigner} from '@web3modal/react';
import useModal from "../components/customModal/useModal";
import defaultController, {statusCreate} from "../components/customModal/controller";
import {createToken, createdTokens, tokenInfo} from '../launchUtil/main';

const CreateTokenModal = () => {

	const _form = useRef();

	const {View, update} = useModal({Controller:defaultController});

	const actionUpdateList = useMemo(() => ({process:value=>statusCreate.process(update, value),
                                  success:(value,explorer)=>statusCreate.success(update, value, {explorer}),
                                   failed:value=>statusCreate.failed(update, value),
                                   info:(value, Proceed)=>statusCreate.info(update, value, {Proceed})}), [update]);
	const {data:signer} = useSigner();

	const onSubmit = async (e)=>{
		e.preventDefault();
		_form.current?.reportValidity();
		if(!_form.current.checkValidity()){
			statusCreate.failed(update, "Fill Form Correctly");
			return;
		}

		const db = new FormData(_form.current);

		const cleanData = ["name","symbol","decimals","totalSupply"].reduce((acc, d)=>({...acc, [d]:db.get(d)}),{});
		
		await createToken(signer, cleanData, actionUpdateList);
	}

  return (
  	<>
	    <div style={{padding:"1.5rem"}}>
	      <div className="token-modal">
	      	<form ref={_form}>
		        <h3>Create Token</h3>
		        <label htmlFor="type">Token Type
		        <select name="type">
		            <option value="Standard Token">Standard Token</option>
		        </select>
		        </label>
		        <label htmlFor="name">Name
		        <input name="name" type="text" placeholder="Ex: Ethereum" required/>
		        </label>
		        <label htmlFor="symbol">Symbol
		        <input name="symbol" type="text" placeholder="Ex: ETH" required/>
		        </label>
		        <label htmlFor="decimals">Decimals
		        <input name="decimals" type="number" placeholder="Ex: 18" defaultValue={18} required/>
		        </label>
		        <label htmlFor="supply">Total supply
		        <input name="totalSupply" type="number" placeholder="Ex: 10000000000" defaultValue={10000000000} required/>
		        </label>
		        <button className="btn" onClick={onSubmit}>Create Token</button>
		    </form>
		    <br/>
		    <br/>
		    <br/>
		    <TokenList provider={signer}/>
	      </div>
	    </div>
	   	<View/>
	</>
  );
};

const tokenFields=  ["name","symbol","decimals","totalSupply"];

const TokenList = ({provider})=>{
	const [tokens, setTokenList] = useState();

	useEffect(() => {
		if(!provider)
			return
		if(!tokens){
			(async function(){
				let data= await createdTokens(provider);
				setTokenList(data);
			})();		
		}		
	},[provider, tokens]);
	return (
	provider &&
	<>
		{tokens && <h1>Created Token</h1>}
		<table border={2} cellSpacing={20}>
			<thead>
				<tr>
					<td>TOKEN ADDRESS</td>
					{tokenFields.map(d=><td key={d}>{d.toUpperCase()}</td>)}
				</tr>
			</thead>
			<tbody>
			{tokens?.map(d=><TokenShow provider={provider} key={d} tkAddress={d}/>)}
			</tbody>
		</table>
	</>
	);
}

const TokenShow = ({provider, tkAddress})=>{
	const [data, setData] = useState();
	console.log(tkAddress);
	useEffect(()=>{
		if(!provider)
			return
		tokenInfo(provider, tkAddress).then(setData);
	},[provider, tkAddress])
	
	return (
		<tr>
			<td>{tkAddress}</td>
			{tokenFields.map((k)=><td key={k}>{data && data[k]}</td>)}
		</tr>
	);
}
export default CreateTokenModal;
