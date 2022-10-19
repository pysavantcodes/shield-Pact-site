import React, {useState, useCallback, useRef, useMemo} from "react";
import "./launchpad.css";
import * as Fa from "react-icons/fa";
import {useSigner} from '@web3modal/react';
import useModal from "../components/customModal/useModal";
import defaultController, {statusCreate} from "../components/customModal/controller";
import {createLaunchPad, createdTokens, tokenInfo} from '../launchUtil/main';
import  {IpfsStoreBlob, IpfsGetBlob} from '../context/_web3_container';

const Container = ()=>{
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
		console.log(db.get("isBNB"));
		const cleanData = {}
		cleanData.tokenAddress = db.get("tokenAddress");
		cleanData.isBNB = +db.get("isBNB")==1;
		cleanData.presale = +db.get("presale");
		cleanData.dexsale = +db.get("dexsale");
		cleanData.whitelist = +db.get("whitelist")==1;
		cleanData.capped = +db.get("capped");
		cleanData.minbuy = db.get("minbuy");
		cleanData.maxbuy = db.get("maxbuy");
		cleanData.dexpercent = +db.get("dexpercent");
		cleanData.lockup = +db.get("lockup");
		cleanData.starttime = Math.floor(Date.parse(db.get("starttime"))/1000);
		cleanData.endtime = Math.floor(Date.parse(db.get("endtime"))/1000);
		
		const info = {}
		info.logo = db.get("logo");
		info.desc = db.get("desc");
		info.website = db.get("web");
		info.twitter = db.get("twitter");
		info.social = db.get("social");
		actionUpdateList.process("Uploading details to ipfs");
		try{
			cleanData.cid = await IpfsStoreBlob(info);
		}catch(e){
			actionUpdateList.failed(`Failed to upload details to ipfs:${e.message}`);
		}
		await createLaunchPad(signer, cleanData, actionUpdateList);
	}

	return (
	<>
		<View/>
		<form style={{padding:"1.5rem"}} ref={_form}>
			<Form1/>
			<Form2/>
			<Form3 onSubmit={onSubmit}/>
		</form>
	</>
	)
}


const Form1 = ()=>{
	return (
	<div className="launchpadInfoContainer">
	      <h1>Token Info</h1>
	      <label htmlFor="rate">
	        Token Address
	        <input id="rate" type="text" placeholder="your token address" name="tokenAddress" required/>
	        <p>Creation pool fee: {2}BNB</p>
	      </label>

	      <label htmlFor="whitelist">Whitelist</label>
	      <br/>
	      <label htmlFor="_bnb">
	        <input type="radio" id="_bnb"name="isBNB" value={1} defaultChecked/>
	        BNB
	      </label>
	      <br/>

	      <label htmlFor="_busd">
	        <input type="radio" id="_busd" name="isBNB" value={0}/>
	        BUSD
	      </label>
	      <p>token investor will pay this token type</p>
	</div>
	);
}

const Form2 = ()=>{
  return (
	    <div className="launchpadInfoContainer">
	      <h1>LaunchPad Info</h1>
	      <label htmlFor="rate">
	        Presale Rate
	        <input id="rate" type="number" placeholder="200" name="presale" required/>
	        <p>If i spend 1BNB how many tokens will i receive?</p>
	      </label>
	      <label htmlFor="drate">
	        DEXsale Rate
	        <input id="drate" type="number" placeholder="150" name="dexsale" required/>
	        <p>If i swap 1BNB how many tokens will i receive on dex?</p>
	      </label>
	      <p>Presale must be greater than Dexsale</p>
	      <label htmlFor="whitelist">Whitelist</label>
	      <label htmlFor="disable">
	        <input type="radio" id="disable" name="whitelist" value={0} defaultChecked/>
	        Disable
	      </label>

	      <label htmlFor="enable">
	        <input type="radio" id="enable" name="whitelist" value={1}/>
	        Enable
	      </label>
	      <p>You can enable/disable whitelist</p>
	      <br />

	      <label htmlFor="capped">
	        Capped (BNB)
	        <input type="text" name="capped" id="capped" placeholder="500" required/>
	      </label>

	      <label htmlFor="minbuy">
	        Minimum Buy (BNB)
	        <input type="text" name="minbuy" id="minbuy" placeholder="0.01" defaultValue={0.01} required/>
	      </label>
	      <label htmlFor="maxbuy">
	        Maximum Buy (BNB)
	        <input type="text" name="maxbuy" id="maxbuy" placeholder="0.1" defaultValue={0.1} required/>
	      </label>
	      <label htmlFor="router">
	        Router
	        <select name="router">
	          <option>PancakeSwap</option>
	        </select>
	      </label>
	      <label htmlFor="liquidity">
	        Pancake Swap Liquidity (%)
	        <input type="number" id="liquidity" name="dexpercent" placeholder="80" min="50" max="100" defaultValue={80} required/>
	      </label>

	      <label htmlFor="time">
	        Select Start Time and End Time (UTC)
	        <label htmlFor="start">
	          Start time (UTC)
	          <input type="date" id="start" name="starttime" required/>
	        </label>
	        <label htmlFor="end">
	          End time (UTC)
	          <input type="date" id="end" name="endtime" required/>
	        </label>
	      </label>
	      <label htmlFor="lockup">
	        Liquidity Lockup (days)
	        <input type="number" id="lockup" placeholder="30" name="lockup" required defaultValue={30}/>
	      </label>
	      
	      {/*<div className="buttons">
	        <button className="btn-border">Back</button>
	        <button className="btn">Next</button>
	      </div>*/}
	    </div>
	
  );
}

const Form3 = ({onSubmit})=>{
  return (
     <div className="launchpadInfoContainer">
      <h1>LaunchPad Additional Info</h1>
      <label htmlFor="logo">
        Logo Url
        <input
          id="logo"
          type="text"
          placeholder="https://ping.jrel/img.png"
          name="logo"
        />
        <p>
          Url must end with image supported extensions
          (.png,.jpg,.gif,.jpeg){" "}
        </p>
      </label>

      <label htmlFor="web">
        Website
        <input
          type="text"
          id="web"
          name="web"
          placeholder="https://site.com"
        />
      </label>
      <label htmlFor="twitter">
        Twitter
        <input
          type="text"
          id="twitter"
          name="twitter"
          placeholder="https://twitter.com/user"
        />
      </label>
      <label htmlFor="social">
        Social
        <input
          type="text"
          id="social"
          name="social"
          placeholder="https://instagram.com/user"
        />
      </label>
      <label htmlFor="desc">
        Description
        <textarea id="desc" rows="6" placeholder="Describe the token..." name="desc"/>
      </label>
      
      <div className="button">
      	<br/>
     	<button className="btn" onClick={onSubmit}>submit</button>
  	  </div>
    </div>
  );
}


export default Container;
