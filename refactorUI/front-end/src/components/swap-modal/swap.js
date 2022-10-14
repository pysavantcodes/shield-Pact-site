import React from "react";
import styled from 'styled-components';
import "./swap.css";
import { MdSwapVert } from "react-icons/md";
import rawToken from '../../swap/token_list';

const Swap = ({iV, oV, setOv, tokens, setTokens, setIv, slip, setSlip, deadline, setDeadline, price, status}) => {
  

  return (
    <div className="modal-bg">
      <div className="modal">
        <h3>Swap</h3>
        <div className="swap-top">
          <div className="text">
            <input type="number" onKeyUp={(e)=>setIv(e.target.value)} placeholder="0.0"/>
            <p></p>
          </div>
          <Token prev={tokens.second} value={tokens.first} setValue={e=>setTokens({first:+e.target.value})}/>
        </div>
        <div className="swap-icon">
          <div onClick={()=>setTokens({first:tokens.second,second:tokens.first})}>
            <MdSwapVert fontSize={30} color="white"/>
          </div>
        </div>
        <div className="swap-bottom">
          <p>For</p>
          <div className="sec">
            <div className="text">
              <input type="number" defaultValue={oV} disabled={true} placeholder="0.0"/>
              <p></p>
            </div>
            <Token prev={tokens.first} value={tokens.second} setValue={e=>setTokens({second:+e.target.value})}/>
          </div>
          <br />
          <p id="price">1 BNB = 430.30 SHIELD</p>
          <button>Review Swap</button>
        </div>
        <SwapSetting>
          <div className="duration">
            <label>Deadline {deadline}<small> minutes</small></label>
            <input type="range" min={1} max={20} step={1} onChange={e=>setDeadline(+e.target.value)} defaultValue={deadline}/>
          </div>
          <div className="percent">
          <label>Slippage Percent {slip}%</label>
            <input min={0} max={10} step={0.5} type="range" onChange={e=>setSlip(+e.target.value)} defaultValue={slip}/>
          </div>
        </SwapSetting>
        <InfoWrap>
          {price && <p>{price}</p>}
          <p>{status}</p>
        </InfoWrap>
      </div>
    </div>
  );
};

const InfoWrap = styled.div`
  p{
    margin:0.125rem 0rem;
    color:#111;
    text-align:center;
    font-weight:bold;
    font-size:1.35rem;
  }
`;

const SwapSetting = styled.div`
  display:flex;
  justify-content:space-evenly;
  font-size:1.2rem;
  color:#111;

  input[type="range"]{
    appearance:auto;
  }
`;

const SelectBox = styled.div`
  select{
    color:black;
    background-color:white;
    font-weight:1.3rem;
    font-weight:bold;
  }
`;

const Token = ({prev, value, setValue})=>{
  return (
    <SelectBox className="token">
      <img src={rawToken[value]}/>
      <select onChange={setValue}>
        {rawToken.map((v,i)=>i !== prev && <option key={v.name} value={i} selected={i === value}>{v.name}</option>)}
      </select>
    </SelectBox>
  );
}

export default Swap;
