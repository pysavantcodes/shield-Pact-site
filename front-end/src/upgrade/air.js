import * as helper from './web3Helper';
import * as contract from './contract';
import config from './config';

const airDropAddress = config.airDropAddress;//"0x2F0dD0492B0D3d0dc694d7BbA491C7d9aBA8fE18";

const getAirDrop = (signer) => helper.getContract(airDropAddress, contract.airDropABI, signer || helper.defaultProvider);

const plug = {};

const createDrop =async (signer, data, _handler)=>{
  helper.needSigner(signer);
  _handler.process("Preparaing");
  const tk  = await helper.fetchToken(data.token, signer);
  const _data = {...data};
  _data.amount = tk.parse(_data.amount);
  _data.rate = tk.parse(_data.rate);
  //console.log(_data);
  if(Number(await tk._token.allowance(await signer.getAddress(), airDropAddress))<Number(_data.amount)){
    _handler.process(`Request approval of ${data.amount}${tk.symbol}`);
    let res = await tk._token.approve(airDropAddress, _data.amount);
    await res.wait();
  }
  const air = getAirDrop(signer);
  const fee = await air.fee();
  _handler.process(`Creating AirDrop with fee ${helper.formatEther(fee)} BNB`);
  //console.log("Time=>",_data.starttime, _data.endtime);
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


plug.dropInfo = async (id, signer)=>{
  console.log("di=>",id);
  const air = getAirDrop(signer||helper.defaultProvider);
  const [_result,  ..._d] = await Promise.all([
    air.drops(id),
    air.totalParticipant(id),
    air.balanceOf(id),
    air.given(id),
    air.hashes(id)
    ]);

  const result = {..._result};
  result.id = Number(id);
  result.totalParticipant  = Number(_d[0]);
  result.tk = await helper.fetchToken(result.token);
  result.balance = result.tk.format(_d[1]);
  result.given = result.tk.format(_d[2]);
  result.cid = _d[3];
  result.amount = result.tk.format(result.amount);
  result.startTime = (new Date(result.startTime*1000)).toLocaleString();
  result.endTime = (new Date(result.endTime*1000)).toLocaleString();
  return result;
}


plug.collect = async(signer, id, _handler)=>{
  helper.executeTask(
      async()=>{
        helper.needSigner(signer);
        _handler.process("Recieving AirDrop");
        const air = getAirDrop(signer);
        const result = await air.collect(id);
        return (await result.wait()).transactionHash;
      },
      (tx)=>_handler.success("Recieved", (tx)=>helper.explorerWindow(tx)),
      _handler?.failed
    );
}

plug.empty = async(signer, id, _handler)=>{
  helper.executeTask(
      async()=>{
        helper.needSigner(signer);
        _handler.process("Emptyinh AirDrop");
        const air = getAirDrop(signer);
        const result = await air.empty(id);
        return (await result.wait()).transactionHash;
      },
      (tx)=>_handler.success("Recieved", (tx)=>helper.explorerWindow(tx)),
      _handler?.failed
    );
}


plug.listDrop = async(signer)=>{
  const air = getAirDrop(signer||helper.defaultProvider);
  const count = Number(await air.dropCount());

  return async function*(){
    for(let i = count; i>0; i--){
      yield plug.dropInfo(Number(i));
    }
  }
}

plug.createdDrop = async(signer)=>{
  console.log(signer);
  const air = getAirDrop(signer);
  const list = await air.getCreatedDrop();

  return async function*(){
    for(const i of list){
      yield plug.dropInfo(i, signer);
    }
  }
}
export default plug;