import {ethers} from "ethers";
import { Web3Modal, useSigner} from '@web3modal/react';
import { chains, providers } from '@web3modal/ethereum';
import { NFTStorage, File } from 'nft.storage';
import axios from "axios";
import contractConfig from './contract';

const PROJECTID = '5f0a0c1eda156a9eade6dfcf6dbc0cea'; //this would be remove later
const NFT_STORAGE_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDEyQjhiNzkxQzkxMDNlMUNEMDU0RWU0Nzc5MkQ2NDY3OTQ0YjFkYTUiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2NTA0MTIzNTQwMywibmFtZSI6IlNISUVMRENPSU4ifQ.bBacconKCT3IaZkLAUPpss7BIdZBjcU0QTIvqRHS9XQ';

const config = {
  projectId: PROJECTID,
  theme: 'dark',
  accentColor: 'default',
  ethereum: {
    appName: 'web3Modal',
    chains:[chains.binanceSmartChainTestnet],
    providers:[providers.walletConnectProvider({ProjectId:PROJECTID})]
  }
}


const Web3Container = ({children})=>{
  return (
    <>
      {children}
      <Web3Modal config={config} />
    </>
  )
}

const nftstorage = new NFTStorage({ token: NFT_STORAGE_KEY});

async function IpfsStoreNFT({name, description, image, properties}) {
  console.log({name, description, image, properties})
  //call client.store, passing in the image & metadata
    return await nftstorage.store({
        name,
        description,
        image,
        properties
    });
}

const baseURI = 'https://nftstorage.link/ipfs/';
function IpfsgetURI(cid){
  return baseURI + cid +'/metadata.json';
}

async function IpfsGetNFT(cid){
  const result = await axios.get(IpfsgetURI(cid));
  return result.data;
}

const convertIpfs = (url)=>url.replace('ipfs://', baseURI);

const viewExplorer = ()=>``

const NFTConfig = {
  address: contractConfig.nft.address,
  abi: contractConfig.nft.abi,
};

const MarketConfig = {
  address: contractConfig.market.address,
  abi: contractConfig.market.abi,
};

const nftMintContract = new ethers.Contract(NFTConfig.address,NFTConfig.abi);
const marketContract = new ethers.Contract(MarketConfig.address,MarketConfig.abi);

async function createNFT(_signer, _data, _price, onUpdate, onError, done){
  console.log(arguments);
  try{
    let price = ethers.utils.parseEther(_price);
    if(!price)
        throw Error("Invalid Price");
    onUpdate(`Price is => ${price}`);

    const nft = await nftMintContract.connect(_signer);
    const market = await marketContract.connect(_signer);
    if(!(nft && market))
      throw Error("Unable to connect to contract")
    onUpdate("Connected to Contract");
    
    const ipfsResult = await IpfsStoreNFT(_data);
    onUpdate(`Uploaded with CID=> ${ipfsResult.ipnft}`);

    let result = await nft.mint(ipfsResult.ipnft);
    let reciept = await result.wait();
    let itemId = reciept.events[1].args.itemId;
    if(!itemId)
      throw Error("Could not mint nft");
    onUpdate(`Minted with ID=> ${itemId}`);


    let nftApproveResult = await nft.approve(market.address, itemId);
    reciept  = await nftApproveResult.wait();
    if(reciept.events[0].args.approved !== marketContract.address)
      throw Error("Market Not Approved");
    onUpdate(`Market approved on ID=> ${itemId}`);

    result = await market.sellItem(itemId, price);
    reciept = await result.wait();
    // if(reciept.events[0].args.productId != itemId)
    //   throw Error(`${reciept.events[0].args.productId} != ${itemId}`);
    onUpdate(`Added to Market ID=> ${itemId}`);
    onUpdate("SUCCESS");
  }catch(e){
    console.log(e);
    onError?.(e.reason??e);
    onUpdate("FAILED");
  }
  finally{
    done?.();
  }
}

/*async function getProduct(_provider, _setData, _reFetch){
  if(!_reFetch){
     let _data = localStorage.getItem("_TEMP_NFT");
     if(_data){
        let nftData = JSON.parse(_data);
        if(nftData)
          _setData(nftData);
     }
  }
 
  try{
    const market = await marketContract.connect(_provider);
    let productId = await market.allProducts();
  }catch(e){
    _setData(null);

  }
}*/

async function itemInfo(nft, market, _address, _id){
  let productInfo;
  try{
    productInfo = await market.productInfo(_id);
    //console.log(productInfo);
  }catch(e){
   // console.log(e);
    console.log("Not avialable in Market");
  }
   let result = await nft.itemInfo(_id);
   let isOwner = await nft.isOwnerOf(_address, _id);
   let ipfsData = await IpfsGetNFT(result.cid);
   
   return {...result, ...ipfsData,image:convertIpfs(ipfsData.image), forSale:productInfo?.forSale, price:productInfo && ethers.utils.formatEther(productInfo.price), isOwner};
}

async function listNFT(_provider, _address){
  const nft = await nftMintContract.connect(_provider);
  const market = await marketContract.connect(_provider);
  const total = await nft.totalSupply();
 
  console.log("Market=> ",await nft.itemInfo(9))
  
  let j = total<50?total:50;

  async function* generate(){
    for(let i=j; i>1; i--){
      let item = await itemInfo(nft, market, _address, i);
      yield item;
    }
  }
  return generate;
}


export default Web3Container;

export {IpfsStoreNFT, IpfsGetNFT, convertIpfs, NFTConfig, MarketConfig, createNFT, listNFT};