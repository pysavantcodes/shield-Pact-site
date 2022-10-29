import {ethers} from "ethers";
import { NFTStorage} from 'nft.storage';
import axios from "axios";

import config from './config';

import * as contract from './contract';

export const {parseEther, formatEther, parseUnits, formatUnits} = ethers.utils;

export const getRPCProvider = ({rpc,attr})=>
  new ethers.providers.JsonRpcProvider(rpc ,attr);

const BNB_TESTNET = {
  rpc:"https://data-seed-prebsc-1-s1.binance.org:8545",
  attr: { name: "binance", chainId: 97 }
}

const testnetProvider = getRPCProvider(BNB_TESTNET);

export const defaultProvider = testnetProvider;

const _nftstorage = new NFTStorage({ token: config.NFT_STORAGE_KEY});

export const IpfsStore = ({name, description, image, properties}) =>
  _nftstorage.store({
        name,
        description,
        image,
        properties
    });

export const IpfsStoreBlob = data=>{
    const bp = new Blob([JSON.stringify(data)]);
    return _nftstorage.storeBlob(bp);
}


export const IpfsStatus = async cid=>{
  try{
    await _nftstorage.check(cid);
  }catch(e){
    return false
  }
  return true;
}

export const IpfsGetBlob = async cid=>{
    const result = await axios.get( config.baseIPFSURI + cid);
    return result.data;
}

const IpfsgetURI = cid=>
  config.baseIPFSURI + cid +'/metadata.json';

export const IpfsGet  = async cid=>{
  const result = await axios.get(IpfsgetURI(cid));
  return result.data;
}

export const convertIpfs = (url)=>url.replace('ipfs://', config.baseURI);

export const viewExplorer = (txHash)=>`${config.explorer}${txHash}`;

export const explorerWindow = (tx)=>window.open(viewExplorer(tx),'_blank');

export const getContract = (addr, abi, provider = defaultProvider)=>new ethers.Contract(addr, abi, provider);


export const executeTask = (_run, _successHandler, _errHandler)=>
  _run()
    .then(_successHandler??console.log)
    .catch((e)=>{(_errHandler??console.log)(e?.error?.data?.message ?? e?.data?.message ?? e.message ?? e?.reason ?? "Error Occured");
      console.log('Error=>',e);
  });

class Token{
  constructor(addr, _provider){
    this._addr = addr;
    this._token = getContract(addr, contract.tokenABI, _provider);
  }
  
  async init(){
    const [name, symbol, decimals] = await Promise.all([
     this._token.name(),
     this._token.symbol(),
     this._token.decimals()
     ]);
    this.name = name;
    this.symbol = symbol;
    this.decimals = decimals;
  }
  
  parse(n){
    return parseUnits(n,this.decimals);
  }
  
  format(s){
    return formatUnits(s,this.decimals);
  }
  
  async connect(p){
    this._token = await this._token.connect(p);
    return this._token;
  }
  
 }
  
export const fetchToken = async (addr,p)=>{
  const tk = new Token(addr,p||defaultProvider);
  await tk.init();
  return tk;
}

export const getToken = (addr, p)=>{
  return getContract(addr, contract.tokenABI, p||defaultProvider);
}

export const needSigner = (_signer)=>{
  if(!_signer)
      throw Error("Need a signer");
}

export const getBusd = (_signer)=>getToken(config.busdAddress, _signer);


export const percentToBps = (num)=>Math.floor(num*100);

export const bpsToPercent = (num, _f=2)=>(Number(num)/100).toFixed(_f);

export const isAdmin = (addr)=>config.admin===addr;