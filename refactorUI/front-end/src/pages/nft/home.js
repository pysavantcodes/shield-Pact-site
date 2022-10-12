import React,{useState, useEffect, useMemo, useCallback} from "react";
import {useAccount, useSigner} from '@web3modal/react';
import "./style.css";
import img from "./Restorer-amico (1).png";
import Card from "../../components/card";
import {NavLink} from "react-router-dom";
import Fake from "../../context/fake.json";
import {listNFT, myNFT, toggleForSale, addToMarket, buyNFT} from '../../context/_web3_container';
import OptionController,{optionAt} from '../../components/cardOption';
import useOptionModal from '../../components/customModal/useModal';



const Container = () => {
  const { address, isConnected } = useAccount();
  const {data:provider} = useSigner();
  const {View:OptionView, update:optionUpdate} = useOptionModal({Controller:OptionController});

  const close = useMemo(()=>optionAt.reset(optionUpdate),[optionUpdate])

  const actionUpdateList = useMemo(() => [value=>optionAt.process(optionUpdate, value),
                                  (value,explorer)=>optionAt.success(optionUpdate, value, {explorer}),
                                   value=>optionAt.failed(optionUpdate, value),
                                   (value, Proceed)=>optionAt.info(optionUpdate, value, {Proceed})], [optionUpdate]);

  const _toggleMarketSubmit = useCallback(
                (id)=>
                      async ()=>await toggleForSale(provider, id, ...actionUpdateList),
                      [provider, actionUpdateList]
                );

  const _addToMarketSubmit = useCallback((itemId, price, isBNB)=>addToMarket(provider,itemId, price, isBNB,...actionUpdateList),[provider, actionUpdateList]);

  const _addToMarket = useCallback(({itemId})=>()=>optionAt.addToMarket(optionUpdate, {itemId}, {submit:_addToMarketSubmit}),[_addToMarketSubmit, optionUpdate]);
  
  const _about = useCallback(cardProp=>()=>
          optionAt.about(optionUpdate,cardProp),[optionUpdate]);

  const _buy = useCallback((itemId)=>()=>buyNFT(provider, address, itemId, ...actionUpdateList),[provider, actionUpdateList, address]);
  
  const handler = useCallback(cardProp=>
                      ()=>optionAt.home(optionUpdate, cardProp, {toggleMarket:_toggleMarketSubmit, addToMarket:_addToMarket, about:_about, buy:_buy}),[optionUpdate, _toggleMarketSubmit, _addToMarket])

  return (
  
    <div className="body">
      <OptionView/>
      <div className="container">
        <div>
          <div className="txt">
            <h2 className="title">
              Discover Digital Art, Collect and Sell Your Specific NFTs.
            </h2>
            <p>
              Partner with one of the world’s largest retailers to showcase your
              brand and products.
            </p>
            <div className="button-group">
              <button className="btn"><NavLink style={{color:"white"}} to={`/nft/${isConnected?"create":"explore"}`}>{(isConnected?"Create":"Explore")} NFT</NavLink></button>


            </div>
          </div>
        </div>
        <div className="img">
          <img src={img} alt="Slider Images" />
        </div>
      </div>

      <div className="rn-live-bidding-area rn-section-gapTop">
        <div>
         {isConnected?
            <>
              <h3 className="title">Created NFT</h3>
                 <Generate {...{address, provider, funcFactory:myNFT, onClick:handler}}/>
              </>
            :''}
            <br/>
          <h3 className="title">Live Bidding</h3>
            {!isConnected && 
              <div className="product-grid">
                {Fake.map((d,i)=><Card {...d} price={Math.round(Math.random()*73+5)} key={i} onClick={handler}/>)}
              </div>
            }
             {isConnected && <Generate {...{address, provider, funcFactory:listNFT, onClick:handler}}/>}
        </div>
      </div>

      <Newest/>

      <Explore/>

    </div>

  );
};


const genFunc = (_funcFactory)=>async (_signer, _address, status, setStatus, setData)=>{
  if(!_signer || status === "LOADING" || status === "COMPLETED")
    return;

  try{
    setStatus("LOADING");
    const _func = await _funcFactory(_signer, _address);
    const pack = _func();
    let db = [];
 
    for await(let data of pack){
      db.push(data);
      setData(db);
    }
    setStatus("COMPLETED");
  }catch(e){
    setStatus("ERROR");
  }
};

  const Generate = ({provider, address, funcFactory, onClick})=>{
  const [status, setStatus]= useState();
  const [data, setData] = useState([]);


  useEffect(()=>{
    genFunc(funcFactory)(provider, address, status, setStatus, setData);
  },[provider, address]);


  return (
  <>
    <div className="product-grid">
      {data.map((d,i)=><Card {...d} key={i} onClick={onClick}/>)}
    </div>
    {status==="LOADING" && <h2 style={{textAlign:'center'}}>Loading....</h2>}
    {status==="ERROR" && <h2 style={{textAlign:'center'}} onClick={()=>window.location.reload()}>Reload</h2>}
  </>
  );
}

const Newest = ()=>{
  (<div className="rn-new-items rn-section-gapTop">
        <div>
          <div className="row mb--50 align-items-center">
            <h3 className="title mb--0">Newest Items</h3>

            <div className="view-more-btn text-start text-sm-end">
              <a className="btn-transparent" href="#">
                VIEW ALL
              </a>
            </div>
          </div>
          <div className="product-grid">
            <Card />
            <Card />
            <Card />
            <Card />
            <Card />
          </div>
        </div>
      </div>)
}

const Explore = ()=>{
  (<div className="rn-product-area rn-section-gapTop">
        <div>
          <h3 className="title mb--0">Explore Product</h3>

          <div className="default-exp-wrapper default-exp-expand">
            <div className="inner">
              <div className="filter-select-option">
                <label className="filter-leble">LIKES</label>
                <select>
                  <option data-display="Most liked">Most liked</option>
                  <option value="1">Least liked</option>
                </select>
              </div>

              <div className="filter-select-option">
                <label className="filter-leble">Category</label>
                <select>
                  <option data-display="Category">Category</option>
                  <option value="1">Art</option>
                  <option value="1">Photograph</option>
                  <option value="2">Metaverses</option>
                  <option value="4">Potato</option>
                  <option value="4">Photos</option>
                </select>
              </div>

              <div className="filter-select-option">
                <label className="filter-leble">Collections</label>
                <select>
                  <option data-display="Collections">Collections</option>
                  <option value="1">BoredApeYachtClub</option>
                  <option value="2">MutantApeYachtClub</option>
                  <option value="4">Art Blocks Factory</option>
                </select>
              </div>

              <div className="filter-select-option">
                <label className="filter-leble">Sale type</label>
                <select>
                  <option data-display="Sale type">Sale type</option>
                  <option value="1">Fixed price</option>
                  <option value="2">Timed auction</option>
                  <option value="4">Not for sale</option>
                  <option value="4">Open for offers</option>
                </select>
              </div>

              <div className="filter-select-option">
                <label className="filter-leble">Starting Price</label>
                <div className="price_filter s-filter clear">
                  <form action="#" method="GET">
                    <div id="slider-range"></div>
                    <div className="slider__range--output">
                      <div className="price__output--wrap">
                        <div className="price--output">
                          <input
                            placeholder="20.00"
                            type="text"
                            id="amount"
                            readOnly
                          />
                        </div>
                        <div className="price--filter">
                          <button className="btn btn-primary btn-small">
                            Filter
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          <div className="product-grid">
            <Card {...Fake[0]}/>
            <Card {...Fake[1]}/>
            <Card {...Fake[2]}/>
            <Card {...Fake[3]}/>
          </div>
        </div>
      </div>)
}

export default Container;
