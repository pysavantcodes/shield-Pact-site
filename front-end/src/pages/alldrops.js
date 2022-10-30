import React, {useState, useEffect, useCallback, useMemo} from "react";
import "./launchpad.css";
import {Link} from "react-router-dom";
import {useSigner} from '@web3modal/react';
import useModal from "../components/customModal/useModal";
import defaultController, {statusCreate} from "../components/customModal/controller";
import airDropLib from '../upgrade/air';
import {IpfsStoreBlob, IpfsGetBlob} from '../upgrade/web3Helper';

const {collectDrop, listDrop, createdDrop, collect, empty} = airDropLib;

//List Token
const Container = () => {
  const {data:signer} = useSigner();

  const {View, update} = useModal({Controller:defaultController});

  const actionUpdateList = useMemo(() => ({process:value=>statusCreate.process(update, value),
                                  success:(value,explorer)=>statusCreate.success(update, value, {explorer}),
                                   failed:value=>statusCreate.failed(update, value),
                                   info:(value, Proceed)=>statusCreate.info(update, value, {Proceed})}), [update]);

  return (
  
    <div className="launchpad">
      <View/>
      <section className="--full-page">
        <button className="btn" style={{margin:"0",fontSize:"12px", marginRight:"8px"}}><Link style={{color:"white"}} to="/createtoken">Create a Token</Link></button>
        <button className="btn" style={{margin:"0",fontSize:"12px"}}><Link style={{color:"white"}} to="/createAirdrop">Create AirDrop</Link></button>
  
        <CreatedDrop signer={signer} handler={actionUpdateList}/>

        <AllDropsAVail signer={signer} handler={actionUpdateList}/>
      </section>
     
    </div>
 
  );
};


const AllDropsAVail = ({signer, handler})=>{
  const [dropList, setDropList] = useState([]);

   useEffect(()=>{
    (async function(){
      if(!signer)
        return;
      const drops = await listDrop(signer);
      let  db = []
      for await(const info of drops()){
        db = [...db, info];
        setDropList(db);
      }
    })();
  },[signer])

  return (
    dropList.length==0?
    "":
    <div>
    <h1>Available Drops</h1>
    {dropList.map(x=><Drop data={x} signer={signer} handler={handler} _func={collect} _funcName="Collect"/>)}
    </div>
  )
}


const CreatedDrop = ({signer, handler})=>{
  const [dropList, setDropList] = useState([]);

   useEffect(()=>{
    (async function(){
      if(!signer)
        return;
      const drops = await createdDrop(signer);
      let  db = []
      for await(const info of drops()){
        let ipfsResult
        try{
          ipfsResult =  await IpfsStoreBlob(info.cid).catch(console.log);
        }catch(e){
          console.log(e);
        }
        db = [...db, {...info,_info:ipfsResult}];
        setDropList(db);
      }
    })();
  },[signer])

  return (
    dropList.length==0?
    "":
    <div>
    <h1>Created Drops</h1>
    {dropList.map(x=><Drop data={x} signer={signer} handler={handler} _func={empty} _funcName="Empty"/>)}
    </div>
  )
}

const Drop = ({signer, data, handler, _func, _funcName})=>{
  

 const _click = useCallback(
  ()=>{
    _func(signer, +data.id, handler)
  },
  [signer, data, _func]
  )

  return (
    <div>
      <table>
        <tbody>
        {data._info?
        <>
          <tr>
            <td columnspan="2">
              <h2>Description</h2>
              <img src={data._info.logo} width={200} height={200}/>
              <div>{data._info.desc}</div>
            </td>
          </tr>
          <tr>
            <td><a href={data._info.web}>Website</a></td>
             <td><a href={data._info.social}>Social</a></td>
          </tr> 
        </>:""}     
          <tr>
            <td>Token Name</td>
            <td>{data.tk.name}</td>
          </tr>
          <tr>
            <td>Recieving Amount</td>
            <td>{data.amount} {data.tk.symbol}</td>
          </tr>
          <tr>
            <td>Available Amount</td>
            <td>{data.balance} {data.tk.symbol}</td>
          </tr>
          <tr>
            <td>Collected Capacity</td>
            <td>{data.given} {data.tk.symbol}</td>
          </tr>
          <tr>
            <td>Total Participant</td>
            <td>{data.totalParticipant}</td>
          </tr>
          <tr>
            <td>StartTime</td>
            <td>{data.startTime}</td>
          </tr>
          <tr>
            <td>EndTime</td>
            <td>{data.endTime}</td>
          </tr>
          <tr>
            <td columnspan="2">
              <button class="btn" onClick={_click}>{_funcName}</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  );
}


export default Container;