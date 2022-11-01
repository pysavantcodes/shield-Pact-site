import React,{useState, useCallback, useMemo, useEffect} from 'react';

import {useAccount, useSigner} from '@web3modal/react';
import launchLib from '../upgrade/launch';
import tkLib from '../upgrade/create_token';
import nftLib from '../upgrade/nft';
import * as helper from '../upgrade/web3Helper';
import OptionController,{optionAt} from './cardOption';
import useOptionModal from './customModal/useModal';
import {Button} from './buttons';


const {withdrawBNB, withdrawBUSD} = nftLib;
const {withdrawTokenFee} = tkLib;
const {withdrawLaunchFee} = launchLib;


const Withdraw = ()=>{
  const [owner, setOwner] = useState();
  const {data:signer} = useSigner();
  const {address} = useAccount();


  useEffect(()=>{
    setOwner(helper.isAdmin(address));
  },[address]);

  const {View:OptionView, update:optionUpdate} = useOptionModal({Controller:OptionController});
  const actionUpdateList = useMemo(() => ({process:value=>optionAt.process(optionUpdate, value),
                                  success:(value,explorer)=>optionAt.success(optionUpdate, value, {explorer}),
                                   failed: value=>optionAt.failed(optionUpdate, value),
                                   info:(value, Proceed)=>optionAt.info(optionUpdate, value, {Proceed})}), [optionUpdate]);

    const _withdrawBNB = useCallback(async()=>withdrawBNB(signer,actionUpdateList),[signer]);
    const _withdrawBUSD = useCallback(async()=>withdrawBUSD(signer, actionUpdateList),[signer]);
    const _withdrawTokenFee = useCallback(async ()=>withdrawTokenFee(signer, actionUpdateList),[signer]);
   	const _withdrawLaunchFee = useCallback(async ()=>withdrawLaunchFee(signer, actionUpdateList),[signer]);

   const withdraw = useCallback(()=>optionAt.info(optionUpdate, "Withdraw Interest", 
                      {"NFT BNB":_withdrawBNB, "NFT BUSD":_withdrawBUSD,
                      "Token Fee":_withdrawTokenFee, "Launch Fee":_withdrawLaunchFee}),
                                [optionUpdate, _withdrawBNB, _withdrawBUSD, 
                                _withdrawTokenFee, _withdrawLaunchFee]);

     return {Button:()=>owner?<Button onClick={withdraw}>Withdraw</Button>:"",View:OptionView};
}

export default Withdraw;