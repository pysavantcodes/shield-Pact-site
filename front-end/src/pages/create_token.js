import React,{useRef, useMemo, useEffect, useState} from "react";
import {useSigner, useAccount} from '@web3modal/react';
import useModal from "../components/customModal/useModal";
import defaultController, {statusCreate} from "../components/customModal/controller";
import tokenLIB from '../upgrade/create_token';

const {createToken, createdTokens, tokenInfo, withdrawTokenFee, factoryOwner} = tokenLIB;

const CreateTokenModal = () => {
	const [_type, setType] = useState(0);
	const _form = useRef();

	const {View, update} = useModal({Controller:defaultController});

	const actionUpdateList = useMemo(() => ({process:value=>statusCreate.process(update, value),
                                  success:(value,explorer)=>statusCreate.success(update, value, {explorer}),
                                   failed:value=>statusCreate.failed(update, value),
                                   info:(value, Proceed)=>statusCreate.info(update, value, {Proceed})}), [update]);
	

	const {data:signer} = useSigner();
	const {address} = useAccount();
	const [isOwner, setOwner] = useState();

	useEffect(()=>{
		if(signer && address){
			factoryOwner().then(d=>setOwner(d===address));
		}
	},[signer, address])
	

	const onSubmit = async (e)=>{
		e.preventDefault();
		_form.current?.reportValidity();
		if(!_form.current.checkValidity()){
			statusCreate.failed(update, "Fill Form Correctly");
			return;
		}

		const db = new FormData(_form.current);

		const cleanData = ["name","symbol","decimals","totalSupply", "type", "tax", "liq"].reduce((acc, d)=>({...acc, [d]:db.get(d)}),{});
		
		await createToken(signer, cleanData, actionUpdateList);
	}

	const _withdrawTokenFee = async(e)=>{
		await withdrawTokenFee(signer, actionUpdateList);
	} 

  return (
  	<>
	    <div style={{padding:"1.5rem"}}>
	      <div className="token-modal">
	      	{isOwner && <button onClick={_withdrawTokenFee}>withdrawTokenFee</button>}
	      	<form ref={_form}>
		        <h3>Create Token</h3>
		        <label htmlFor="type">Token Type
		        <select name="type" onChange={(e)=>setType(+e.target.value)}>
		            <option value={0} selected>Standard Token</option>
		            <option value={1}>Reflection Token</option>
		            <option value={2}>Liquid Minting Token</option>
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
		        <label htmlFor="tax">{_type!==2?'':"tax Percent"}
		        <input name="tax" type={_type!==2?"hidden":"number"} placeholder="Ex: 0.00" defaultValue={0} required/>
		        </label>
		        <label htmlFor="liq">{_type!==2?'':"liquid Percent"}
		        <input name="liq" type={_type!==2?"hidden":"number"} placeholder="Ex: 0.00" defaultValue={0} required/>
		        </label>
		        <p><strong>{_type!==2?'':"taxPercent + liquidPercent not more than 25%"}</strong></p>
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
			{tokens?.map(d=><TokenShow key={d} tkAddress={d}/>)}
			</tbody>
		</table>
	</>
	);
}

const TokenShow = ({tkAddress})=>{
	const [data, setData] = useState();
	
	useEffect(()=>{
		tokenInfo(tkAddress).then(setData).catch(console.log);
	},[tkAddress]);
	
	return (
		<tr>
			<td>{tkAddress}</td>
			{tokenFields.map((k)=><td key={k}>{data && data[k]}</td>)}
		</tr>
	);
}
export default CreateTokenModal;
