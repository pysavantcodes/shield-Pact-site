import * as helper from './web3Helper';
import * as contract from './contract';

const airDropAddress = "0xc09FD3423c63281DafE8609e3BDd8eCfEdE14ED6";

const getAirDrop = (signer) => helper.getContract(airDropAddress, contract.airDropABI, signer || helper.defaultProvider);

const plug = {};

const createDrop =async (signer, data, _handler)=>{
  helper.needSigner(signer);
  _handler.process("Preparaing");
  const tk  = await helper.fetchToken(data.token, signer);
  const _data = {...data};
  _data.amount = tk.parse(_data.amount);
  _data.rate = tk.parse(_data.rate);
  console.log(_data);
  if(Number(await tk._token.allowance(await signer.getAddress(), airDropAddress))<Number(_data.amount)){
    _handler.process(`Request approval of ${data.amount}${tk.symbol}`);
    let res = await tk._token.approve(airDropAddress, _data.amount);
    await res.wait();
  }
  const air = getAirDrop(signer);
  const fee = await air.fee();
  _handler.process(`Creating AirDrop with fee ${helper.formatEther(fee)} BNB`);
  let result = await air.createDrops(_data.token, _data.rate, _data.amount, _data.starttime, _data.endtime, _data.cid, {value:fee});
  return (await result.wait()).transactionHash;
}

plug.createDrop = (signer, _data, _handler)=>{
  helper.executeTask(
    ()=>createDrop(signer, _data, _handler),
    (tx)=>_handler?.success("Created", ()=>helper.explorerWindow(tx)),
    _handler?.failed
    );
}


plug.dropInfo = async (signer, id)=>{
  const air = getAirDrop(signer);
  const [result,  ..._d] = await Promise.all([
    air.drops(id),
    air.totalParticipant(id),
    air.balanceOf(id),
    air.given(id)
    ]);
  result.totalParticipant  = _d[0];
  result.tk = await helper.fetchToken(result.token);
  result.balance = await result.tk._token.balanceOf(await signer.getAddress());
  
  return result;
}


export default plug;
