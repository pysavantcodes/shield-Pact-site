import * as helper from './web3Helper';
import * as contract from './contract';
import config from './config';

//NFT deployed address
const nftAddress = config.nftAddress;//"0x9df5A067273096A4fa38CFF9dB33161355Cb6154";
const marketAddress = config.marketAddress;//"0x57EB5a1AcaC54071062aF2289945954cb12C8a84";

const getNft = (_signer)=>helper.getContract(nftAddress, contract.nftABI, _signer);

const getMarket = (_signer)=>helper.getContract(marketAddress, contract.marketABI, _signer);

const plug = {};

const addToMarket = async (_signer, itemId, price, isBNB, _handler)=>{
  helper.needSigner(_signer);
  const nft = getNft(_signer);
  const market = getMarket(_signer);
  _handler?.process(`Checking Market Appoval`);
  let approved = await nft.getApproved(itemId);
 
  if(approved !== market.address){
    _handler?.process(`Market Requesting Approval`);
    let nftApproveResult = await nft.approve(market.address, itemId);
    let reciept  = await nftApproveResult.wait();
    if(reciept.events[0].args.approved !== marketAddress)
      throw Error("Market Not Approved");
  }
  
  _handler?.process(`Adding to Market ID=> ${itemId}`);
  
  let result = await market.sellItem(itemId, price, isBNB);
    
  let reciept = await result.wait();
  return reciept.transactionHash;
}

plug.addToMarket = (_signer, itemId, price, isBNB, _handler)=>{
  //clean data here
  helper.executeTask(
    ()=>addToMarket(_signer, itemId, helper.parseEther(price), isBNB, _handler),
    (r)=>_handler?.success(`Added To Market`, ()=>helper.explorerWindow(r)),
    _handler?.failed);
}

const createNFT = async (_signer, _data, _handler)=>{
  helper.needSigner(_signer);
  console.log("hello");
  _handler?.process("Connecting to NFT");
  const nft = getNft(_signer);
  _handler?.process(`Uploading to IPFS`);
  
  const ipfsResult = await helper.IpfsStore(_data);

  _handler?.process(`Minting NFT with CID=> ${ipfsResult.ipnft}`);
  
  let result = await nft.mint(ipfsResult.ipnft);
  
  let reciept = await result.wait();
  
  let itemId = reciept.events[reciept.events.length-1].args.itemId;
  if(!itemId)
    throw Error("Could not mint nft");
  
  return [reciept.transactionHash, itemId];
}

plug.createNFT = (_signer, _data, _price, _isBNB, _handler)=>{
  console.log(_handler)
  helper.executeTask(
  ()=>createNFT(_signer, _data, _handler),
   ([r,itemId])=>
    _handler?.next("Do you want to add to market", 
          ()=>_handler?.success(`Minted successfully`, ()=>helper.explorerWindow(r)), 
        ()=>plug.addToMarket(_signer, itemId, _price,_isBNB, _handler)),
  _handler?.failed);
}


const toggleForSale = async(_signer, _id, _handler)=>{
    helper.needSigner(_signer);
    _handler?.process("Connecting...");
    const market = getMarket(_signer);
    _handler?.process("Toggle Item Sales...");
    const result = await market.toggleForSale(_id);
    return (await result.wait()).transactionHash;
}

plug.toggleForSale = (_signer, _id, _handler)=>{
  console.log('JJk',_handler);
  helper.executeTask(
    ()=>toggleForSale(_signer, _id, _handler),
    ()=>_handler?.success("Done"),
    _handler?.failed
   );
}


const __buyNFT = async (_signer, itemId, buyProp, _handler)=>{
  
  helper.needSigner(_signer);
  const market = getMarket(_signer);
  
  let reciept;
  
  if(buyProp.isBNB){
    _handler?.process(`Purchasing NFT with ${helper.formatEther(buyProp.price)}BNB`);
    let result = await market.purchaseItemBNB(itemId,{value:buyProp.price});
    reciept = await result.wait();
  }
  else{
    _handler?.process(`Approving Market to spend To ${helper.formatEther(buyProp.price)} BUSD`);
    let buyerToken = helper.getToken(await market.busdAddress(), _signer);
    let result = await buyerToken.approve(market.address, buyProp.price);
    await result.wait();
    _handler?.process(`Purchasing NFT with ${helper.formatEther(buyProp.price)}BUSD`);
    result = await market.purchaseItemBUSD(itemId);
    reciept = await result.wait();
  }
  return reciept.transactionHash;
}

const __wrap_buyNFT = (_signer, itemId, buyProp,  _handler)=>{
  helper.executeTask(
  ()=>__buyNFT(_signer, itemId, buyProp, _handler),
  (r)=>_handler?.success(`Purchase Successfully`, ()=>helper.explorerWindow(r)),
  _handler?.failed);
}

plug.buyNFT = (_signer, _itemId, _handler)=>{
  
  helper.executeTask(
  ()=>{
  _handler?.process("Consulting Market For Info");
  return getMarket(_signer).productInfo(_itemId)
  },
    (buyProp)=>
        _handler.info(`Proceed to purchase Item#${_itemId} \nCost: ${helper.formatEther(buyProp.price)}${buyProp.isBNB?"BNB":"BUSD"}`,
                ()=>__wrap_buyNFT(_signer, _itemId, buyProp, _handler)
                ),
    _handler?.failed
    );
}

plug.itemInfo = async(_id, _owner)=>{
 
  let productInfo;
  const market = getMarket(helper.defaultProvider);
  const nft = getNft(helper.defaultProvider);
  try{
    productInfo = await market.productInfo(_id);
  }catch(e){
    console.log("Not avialable in Market");
  }
  
  const [result, owner] = await Promise.all([
    nft.itemInfo(_id),
    _owner||nft.ownerOf(_id)
    ]);
  
  const ipfsData = await helper.IpfsGet(result.cid);
  
  return {...result, ...ipfsData,image:helper.convertIpfs(ipfsData.image), 
              forSale:productInfo?.forSale, price:productInfo && helper.formatEther(productInfo.price),
                    isBNB:productInfo?.isBNB, owner, itemId:_id};
}


plug.listNFT = async (_signer, _page=0)=>{
  const nft = getNft(helper.defaultProvider);
  const total = await nft.totalSupply();
  let j = total>20?20:total;
  async function* generate(){
    for(let i=j; i>0; i--){
      yield plug.itemInfo(i);
    }
  }
  return generate;
}

plug.myNFT = async (_signer)=>{
  
  const nft = getNft(_signer);
 
  const ownedItem = await nft.itemCreated().catch(e=>[]);
  
  const _address = await _signer.getAddress();
  
  async function* generate(){
    for(let i of ownedItem){
      console.log("my nft");
      yield plug.itemInfo(i, _address);
    }
  }
  return generate;
}

plug.ownerOfMarket = async (_signer)=>{
  if(!_signer)
    return null
  const address = await _signer.getAddress();
  const market = getMarket(_signer);
  const ownerAddress = await market.owner();
  return ownerAddress === address;
}

const withdrawBNB = async (_signer, _handler)=>{
  helper.needSigner(_signer);
  _handler?.process("Preparing");
  const market = getMarket(_signer);
  let interest = await market.totalInterestBNB();
  _handler?.process(`Request to Withdraw ${helper.formatEther(interest)}BNB`);
  let result = await market.withdrawBNB();
  let reciept = await result.wait();
  return reciept.transactionHash;
  
}

plug.withdrawBNB = async(_signer, _handler)=>{
  helper.executeTask(
    ()=>withdrawBNB(_signer, _handler),
    (r)=>_handler?.success("Successful",()=>helper.explorerWindow(r)),
    _handler?.failed
  );
}

const withdrawBUSD = async (_signer, _handler)=>{
  helper.needSigner(_signer);
  _handler?.process("Preparing");
  const market = getMarket(_signer);
  let interest = await market.totalInterestBUSD();
  _handler?.process(`Request to Withdraw ${helper.formatEther(interest)}BUSD`);
  let result = await market.withdrawBUSD();
  let reciept = await result.wait();
  return reciept.transactionHash;
}

plug.withdrawBUSD = async(_signer, _handler)=>{
  helper.executeTask(
    ()=>withdrawBUSD(_signer, _handler),
    (r)=>_handler?.success("Successful",()=>helper.explorerWindow(r)),
    _handler?.failed
  );
}



export default plug;