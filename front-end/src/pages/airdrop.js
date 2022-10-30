import React, {useState, useCallback, useRef, useMemo} from "react";
import "./launchpad.css";
import * as Fa from "react-icons/fa";
import {useSigner} from '@web3modal/react';
import useModal from "../components/customModal/useModal";
import defaultController, {statusCreate} from "../components/customModal/controller";

import {IpfsStoreBlob, IpfsGetBlob} from '../upgrade/web3Helper';
import airDropLib from '../upgrade/air';

const {createDrop} = airDropLib;

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
		
		const cleanData = {};

		cleanData.token = db.get('tokenAddress');
		cleanData.rate = db.get("rate");
		cleanData.amount = db.get("amount");
		if(+cleanData.rate>+cleanData.amount)
			return actionUpdateList.failed("Rate > Total");
		console.log(db.get("starttime"));
		cleanData.starttime = Math.floor(Date.parse(db.get("starttime"))/1000);
		cleanData.endtime = Math.floor(Date.parse(db.get("endtime"))/1000);

		const info = {}
		info.logo = db.get("logo");
		info.desc = db.get("desc");
		info.website = db.get("web");
		info.social = db.get("social");
		actionUpdateList.process("Uploading details to ipfs");
		try{
			cleanData.cid = await IpfsStoreBlob(info);
		}catch(e){
			actionUpdateList.failed(`Failed to upload details to ipfs:${e.message}`);
		}
		await createDrop(signer, cleanData, actionUpdateList);
	}

	return (
	<>
		<View/>
		<form style={{padding:"1.5rem"}} ref={_form}>
			<AirForm onSubmit={onSubmit}/>
		</form>
	</>
	)
}


const AirForm = ({onSubmit})=>{
	return (
	<div className="launchpadInfoContainer">
	      <h1>Create Air Drop</h1>
	      <label htmlFor="rate">
	        Token Address
	        <input id="rate" type="text" placeholder="your token address" name="tokenAddress" required/>
	        <p>Creation fee:0.5BNB+ 1% airdrop token</p>
	      </label>

	    <label htmlFor="rate">
	        Collect Rate
	        <input id="rate" type="number" placeholder="0" name="rate" required/>
	        <p>Each wallet will recieve once</p>
	      </label>

	    <label htmlFor="amount">
	        Total Airdrop Amount
	        <input id="amount" type="number" placeholder="0" name="amount" required/>
	        <p>Total Amount available for airDrop</p>
	    </label>

     <label htmlFor="time">
        Select Start Time and End Time (UTC)
        <label htmlFor="start">
          Start time (UTC)
          <input type="datetime-local" id="start" name="starttime" required/>
        </label>
        <label htmlFor="end">
          End time (UTC)
          <input type="datetime-local" id="end" name="endtime" required/>
        </label>
      </label>

      <div className="launchpadInfoContainer">
      <h1>AirDrop Additional Info</h1>
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

    </div>


      <div className="button">
      	<br/>
     	<button className="btn" onClick={onSubmit}>submit</button>
  	  </div>
	</div>
	);
}

export default Container;
