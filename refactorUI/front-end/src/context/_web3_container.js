import React from 'react';
import {ethers} from "ethers";
import { Web3Modal} from '@web3modal/react';
import { chains, providers } from '@web3modal/ethereum';
import { NFTStorage} from 'nft.storage';
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

const explorer = 'https://testnet.bscscan.com/tx/'
const viewExplorer = (txHash)=>`${explorer}${txHash}`;

const NFTConfig = {
  address: contractConfig.nft.address,
  abi: contractConfig.nft.abi,
};

const MarketConfig = {
  address: contractConfig.market.address,
  abi: contractConfig.market.abi,
};

const TokenConfig = {
  address: contractConfig.token.address,
  abi: contractConfig.token.abi,
};


const nftMintContract = new ethers.Contract(NFTConfig.address,NFTConfig.abi);
const marketContract = new ethers.Contract(MarketConfig.address,MarketConfig.abi);
const tokenContract = new ethers.Contract(TokenConfig.address,TokenConfig.abi);

function needSigner(_signer){
  if(!_signer)
      throw Error("Need a signer");
}

async function addToMarket(_signer, itemId, price, isBNB, onUpdate, onSuccess, onError){
    
    try{
      needSigner(_signer);
      price = ethers.utils.parseEther(price);
      if(!price)
        throw Error("Invalid Price");
      onUpdate("Loading Market");
      const nft = await nftMintContract.connect(_signer);
      const market = await marketContract.connect(_signer);
      
      onUpdate(`Checking Market Appoval`);
      let approved = await nft.getApproved(itemId);
      
      if(approved !== market.address){
        onUpdate(`Market Requesting Approval`);
        let nftApproveResult = await nft.approve(market.address, itemId);
        let reciept  = await nftApproveResult.wait();
        if(reciept.events[0].args.approved !== marketContract.address)
          throw Error("Market Not Approved");
      }

      onUpdate(`Adding to Market ID=> ${itemId}`);
      let result = await market.sellItem(itemId, price, isBNB);
      
      let reciept = await result.wait();
      onSuccess(`Added in Market ID=> ${itemId}`);
    }catch(e){
      console.log(e);
      onError(e.reason??e.message??"Error occured");
    }
}

async function createNFT(_signer, _data, _price, _isBNB, onUpdate, toNext, onSuccess, onError){
  try{
    needSigner(_signer);
    onUpdate("Connecting to NFT");
    const nft = await nftMintContract.connect(_signer);
    if(!nft)
      throw Error("Unable to connect to contract");
    
    onUpdate(`Uploading to IPFS`);
    const ipfsResult = await IpfsStoreNFT(_data);

    onUpdate(`Minting NFT with CID=> ${ipfsResult.ipnft}`);
    let result = await nft.mint(ipfsResult.ipnft);
    let reciept = await result.wait();
    let itemId = reciept.events[1].args.itemId;
    if(!itemId)
      throw Error("Could not mint nft");
    // onUpdate(`Minted with ID=> ${itemId}`);
    toNext("Do you want to add to market",()=>onSuccess(`Minted with ID=> ${itemId}`),
            async()=>await addToMarket(_signer, itemId, _price, 
                        _isBNB, onUpdate, onSuccess, onError));
  }catch(e){
    console.log(e);
    onError(e.reason??e.message??"Error occured");
  }

  //add to maerket here optional
}

async function __buy(_signer, buyerAddress, nft, market, itemId, buyProp, onUpdate, onSuccess, onError){
  try{
      let reciept;
      if(buyProp.isBNB){
        onUpdate(`Purchasing NFT with ${ethers.utils.formatEther(buyProp.price)}BNB`);
        let result = await market.purchaseItemBNB(itemId,{value:buyProp.price});
        reciept = await result.wait();
      }
      else{
        onUpdate("connecting to token contract");
        let buyerToken = await tokenContract.connect(_signer);
        onUpdate("Approving Market to spend Token");
        let result = await buyerToken.approve(market.address, buyProp.price);
        await result.wait();
        onUpdate(`Purchasing NFT with ${ethers.utils.formatEther(buyProp.price)}BUSD`);
        result = await market.purchaseItemBUSD(itemId);
        reciept = await result.wait();
      }
      onSuccess("Succssful",()=>window.open(viewExplorer(reciept.transactionHash),'_blank'));
  }catch(e){
    onError(e.reason??e.message??"Error occured");
  }
}

async function buyNFT(_signer, address, _itemId, onUpdate, onSuccess, onError, toNext){
    try{
      needSigner(_signer);
      onUpdate("Connecting to Market");
      const buyMarket = await marketContract.connect(_signer);
      const nft = await nftMintContract.connect(_signer);
      
      onUpdate("Consulting Market For Info");
      let buyProp = await buyMarket.productInfo(_itemId);
      toNext(`Proceed to purchase Item#${_itemId} \nCost: ${ethers.utils.formatEther(buyProp.price)}${buyProp.isBNB?"BNB":"BUSD"}`,
        ()=>__buy(_signer,address, nft, buyMarket, _itemId, buyProp, onUpdate, onSuccess, onError));

    }catch(e){
      onError(e.reason??e.message??"Error occured");
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

async function itemInfo(nft, market, _address, _id, isOwner){
  let productInfo;

  try{
    productInfo = await market.productInfo(_id);
    //console.log(productInfo);
  }catch(e){
   // console.log(e);
    console.log("Not avialable in Market");
  }
  //console.log(_id)
   let result = await nft.itemInfo(_id);
   isOwner = isOwner ?? await nft.isOwnerOf(_address, _id);
   let ipfsData = await IpfsGetNFT(result.cid);
   
   return {...result, ...ipfsData,image:convertIpfs(ipfsData.image), forSale:productInfo?.forSale, price:productInfo && ethers.utils.formatEther(productInfo.price), isBNB:productInfo?.isBNB, isOwner, itemId:_id};
}

async function listNFT(_provider, _address, _page=0){
  const nft = await nftMintContract.connect(_provider);
  const market = await marketContract.connect(_provider);
  const total = await nft.totalSupply();
  let j = total>20?20:total;
  async function* generate(){
    for(let i=j; i>0; i--){
      let item = await itemInfo(nft, market, _address, i);
      yield item;
    }
  }
  return generate;
}

async function toggleForSale(_provider, _id, onUpdate, onSuccess, onError){
  try{
    needSigner(_provider);
    onUpdate("Connecting...");
    const market = await marketContract.connect(_provider);
    onUpdate("Toggle Item Sales...");
    const result = await market.toggleForSale(_id);
    await result.wait();
    onSuccess("Done");
  }
  catch(e){
    onError(e.reason??e.message??"Error occured");
  }
}

async function myNFT(_provider, _address){
  const nft = await nftMintContract.connect(_provider);
  const market = await marketContract.connect(_provider);
  const total = await nft.totalSupply();
  const ownedItem = await nft.itemCreated();

  async function* generate(){
    for(let i of ownedItem){
      let item = await itemInfo(nft, market, _address, i, true);
      yield item;
    }
  }
  return generate;
}

async function ownerOfMarket(_signer, address){
  const market = await marketContract.connect(_signer);
  const ownerAddress = await market.owner();
  return ownerAddress === address;
}

async function withdrawBNB(_signer, onUpdate, onSuccess, onError){
  try{
    needSigner(_signer);
    const market = marketContract.connect(_signer);
    let interest = await market.totalInterestBNB();
    onUpdate(`Request to Withdraw ${ethers.utils.formatEther(interest)}BNB`);
    let result = await market.withdrawBNB();
    let reciept = await result.wait();
    onSuccess("Successful",()=>window.open(viewExplorer(reciept.transactionHash),'_blank'));
  }catch(e){
    onError(e.reason??e.message??"Error occured");
  }
}

async function withdrawBUSD(_signer, onUpdate, onSuccess, onError){
  try{
    needSigner(_signer);
    const market = marketContract.connect(_signer);
    let interest = await market.totalInterestBUSD();
    onUpdate(`Request to Withdraw ${ethers.utils.formatEther(interest)}BUSD`);
    let result = await market.withdrawBUSD();
    let reciept = await result.wait();
    onSuccess("Successful",()=>window.open(viewExplorer(reciept.transactionHash),'_blank'));
  }catch(e){
    onError(e.reason??e.message??"Error occured");
  }
}

export default Web3Container;

export {IpfsStoreNFT, IpfsGetNFT, convertIpfs, NFTConfig, MarketConfig, createNFT, listNFT, myNFT,
      toggleForSale, addToMarket, buyNFT, ownerOfMarket, withdrawBNB, withdrawBUSD};