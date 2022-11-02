import React,{useRef} from "react";
import styled from 'styled-components';
import "./swap.css";
import { MdSwapVert } from "react-icons/md";

const Swap = ({addToken, rawToken, iV, oV, setOv, tokens, setTokens, setIv, slip, setSlip, deadline, setDeadline, price, status, submit}) => {
 
  return (
    <div className="modal-bg">
      <div className="modal">
        <h3>Swap</h3>
        <AddAddress _click={addToken}/>
        <div className="swap-top">
          <div className="text">
            <input type="number" defaultValue={iV} onKeyUp={(e)=>setIv(e.target.value)} placeholder="0.0"/>
            <p></p>
          </div>
          <Token rawToken={rawToken} prev={tokens.second} value={tokens.first} setValue={e=>setTokens({first:+e.target.value})}/>
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
              <input type="number" value={oV} disabled={true} placeholder="0.0"/>
              <p></p>
            </div>
            <Token rawToken={rawToken} prev={tokens.first} value={tokens.second} setValue={e=>setTokens({second:+e.target.value})}/>
          </div>
          <br />
          <p id="price" style={{fontSize:"1.25rem"}}>{price??'---'}</p>
          <button onClick={submit}>Review Swap</button>
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

  img{
    width:30px;
    height:auto;
  }
`;

const Token = ({rawToken, prev, value, setValue})=>{
 
  return (
    <SelectBox className="token">
      <img src={rawToken[value]?.logoURI||"hello.png"}/>
      <select onChange={setValue}>
        {rawToken?.map((v,i)=>i !== prev && <option key={v.name??"--"} value={i} selected={i === value}>{v.name??"--"}</option>)}
      </select>
    </SelectBox>
  );
}


const AddAddress = ({_click})=>{
  const _input = useRef();
  const _logo = useRef();

  return (
    <div style={{display:"flex",gap:"1rem"}}>
      <input ref={_input} type="text" placeholder="Token address"/>
      <input ref={_logo} type="text" placeholder="logo"/>
      <button style={{padding:"0.25rem",width:"auto"}}onClick={()=>_click(_input.current.value, _logo.current.value)}>add</button>
    </div>
  );
}

export default Swap;
