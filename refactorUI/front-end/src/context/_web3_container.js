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
  return baseURI + 'bafyreiabu3jxuomajy3yb7qyhp6d4elwe3goioypai4hdn37ubjfenyzyy' +'/metadata.json';
}

async function IpfsGetNFT(cid){
  const result = await axios.get(IpfsgetURI(cid));
  return result.data;
}

const convertIpfs = (url)=>url.replace('ipfs://', baseURI);

const NFTConfig = {
  address: contractConfig.nft.abi.address,
  abi: contractConfig.nft.abi,
};

const MarketConfig = {
  address: contractConfig.market.address,
  abi: contractConfig.market.abi,
};

const createNFT = async (_signer, _nftContract, _marketContract, data, price,  update)=>{
  update("storing in ipfs");
  console.log(data);
  let ipfsResult = await IpfsStoreNFT(data);
  update(ipfsResult);
  console.log(_nftContract);
  let nftResult = await _nftContract({args:[ipfsResult.ipnft], functionName:"mint", signer:_signer});
  console.log(nftResult);
  let reciept = await nftResult.wait();
  update({ipfs:ipfsResult, itemId:reciept.events[1].args.itemId});
  await addToMarket(_signer, _nftContract, _marketContract, reciept.events[1].args.itemId, price, update);
  return true;
}

const addToMarket = async(_signer, _nftContract, _marketContract, itemId, price, update)=>{
  let nftApproveResult = await _nftContract({args:[MarketConfig.address, itemId], functionName:"approve"});;
  update("Approving")
  await nftApproveResult.wait();
  price = ethers.utils.parseEther(price||'0.15');
  let result = await _marketContract({args:[itemId, price],functionname:"sellItem", signer:_signer});
  update("Adding to market at price ", price);
  let reciept = await result.wait();
  update("done");
  return reciept.events[0].args.approved == MarketConfig.address;
}


const getNFT = ()=>{

}

const updateDetailNFT = ()=>{

}

export default Web3Container;

export {IpfsStoreNFT, IpfsGetNFT, convertIpfs, createNFT, addToMarket, NFTConfig, MarketConfig};