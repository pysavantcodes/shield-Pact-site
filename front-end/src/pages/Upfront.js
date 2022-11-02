
const INIT_TIME = {hour:0, min:0, sec:0};
function CountDown =(end)=>{
  const [state, setState] = useState(INIT_TIME);
  
  const update = useCallback((data)=>{
    setState(state=>{...state,...data});
  });
  
  usEffect(
    let k;
    (()=>{
      let newday = Date.now();
      if(newday>end){
        update(INIT_TIME);
        return;
      }
      let d = new Date(Date.now()-end);
      update({day:d.getDate(), hour:d.getHours(), min:d.getMinutes(), sec:d.getSeconds()})
    })()
    return ()=>clearTimeout(k);
    );
  return (
    <div>{state.day}:{state.hour}:{state.min}:{state.sec}</div>
    );
}

async function getTokenInfo(address){
  
}

async function getCreatedTokens(){
  
}

async function createToken(signer, data, onUpdate, onSuccess, onError, onNext){
  try{
    
  }catch (e){
    
  }
}

async function uploadPadToIpfs(){
  
}

async function getCreatedPad(){
  try {
    /* code */
  } catch (e) {}
}

async functiona tokenCalculate(){
  
}

async function createPad(signer){
  
}

async function completeLauch(){
  
}

async function claimLpToken(){
  
}


//solidity
bool enableWhiteList;
mapping (address => bool) whiteList;
uint256 totalParticipant;

modifier memberOfWhiteList(){
  require(whiteList[msg.sender], "not yet whitelisted");
  _;
}


function addToWhiteList() public onlyOwner{
  if(!whiteList[mag sender]){
    totalParticipant += 1;
    whiteList[mag sender] = true
  }
}

function removeFromWhiteList() public onlyOwner{
  if(whiteList[mag sender]){
    totalParticipant -= 1;
    whiteList[mag sender] = false;
  }
}