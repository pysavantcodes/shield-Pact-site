import helper from './Web3Helper';
import contract from './contract';

const airDropAddress = "";

const getAirDrop = (signer) => helper.getContract(airDropAddress, contract.airDropABI, signer || helper.defaultProvider);

const plug = {};

const createDrop = (signer, data, _handler)=>{
  helper.needSigner(signer);
  _handler.process("Preparaing");
  const tk  = await helper.fetchToken(data.token);
  const _data = {...data};
  _data.amount = tk.parse(_data.amount);
  _data.total = tk.parse(_data.total);
  _handler.process(`Request approval of ${amount}{tk.symbol}`);
  tk._token.approve(airDropAddress, _data.amount);
  const air = getAirDrop(signer);
  const fee = await air.fee();
  _helper.process(`Creating AirDrop with fee ${helper.formatEther(fee)} BNB`);
  let result = air.createDrop(_data.token, _data.amount, _data.total, _data.start, _data.end, {value:fee});
  return (await result.wait()).transactionHash;
}

plug.createDrop = (signer, _data, _handler)=>{
  helper.executeTask(
    ()=>createDrop(signer, _data, _handler),
    (tx)=>_handler?.success("Created", ()=>helper.explorerWindow(tx)),
    _handler?.failed
    );
}


plug.dropInfo = (signer, id)=>{
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