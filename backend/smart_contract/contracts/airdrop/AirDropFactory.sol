
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract AirDrop is Ownable{
    
    uint256 public dropCount;
    
    uint256 public fee;
    uint16 public feeBps;
    
    struct Drop{
        address token;
        uint256 amount;
        uint256 startTime;
        uint256 endTime;
    }
    
    //id to tokenAddress
    mapping(uint256=>Drop) public drops;
    
    mapping(uint256=>uint256) public balanceOf;
    
    mapping(uint256=>uint256) public given;
    
    mapping(address=>uint256[]) ownedDrop;
    
    mapping(uint256=>mapping(address=>bool)) public participated;
    
    mapping(uint256=>uint256) public totalParticipant;
    
    
    
    constructor(uint256 fee_, uint16 feeBps_){
        setFee(fee_, feeBps_);
    }
    
    const setFee(uint256 fee_, uint16 feeBps_) public onlyOwner{
    fee = fee_;
    feeBps = feeBps_;//100bps = 1%
    }
    
    
    function createDrops(address token_, uint256 amount_, uint256 total_, uint256 start_, uint256 end_)
    public payable
    {
    require(msg.value == fee, "PayFee");
    require(start_ >= block.timestamp && end_ > start_, "Set time properly");
    require(amount_ > 0 && amount_ <= total_, "Amount not properly set");
    IERC20 tk = IERC20(token_);
    require(bytes(tk.name).length>0,"Token does not exit");
    require(tk.allowance(msg.sender, address(this))==total_, "Need allowance");
    uint256 tkFee = total_.mul(feeBps).div(10**4);
    tk.transferFrom(msg.sender, address(this), total_ - tkFee);
    tk.transferFrom(msg.sender, owner(), tkFee);
    (bool sent,) = payable(owner()).call{value:fee}("");
    require(sent, "Fee Payment Failure");
    dropCount += 1;
    uint256 id = dropCount;
    Drop newDrop = Drop(token_, amount_, start_, end_);
   
    balanceOf[id] = total_;
    
    drops[id] = newDrop;
    
    ownedDrop[msg.sender].push(id);
    
    emit DropCreated(id);
    }
    
    function collect(uint256 id) public {
    require(drops[id].startTime <= block.timestamp, "Not yet Started");
    require(drops[id].endTime >= block.timestamp, "Already ended");
    require(balanceOf[id]>0, "No Token");
    require(msg.sender != address(0)  && !participated[msg.sender], "Not Allowed");
    participated[msg.sender] = true;
    totalParticipant[id] += 1;
    IERC20 tk = IERC20(drops[id].token);
    uint256 _recv = balanceOf[id] > drops[i].amount?drops[i].amount:balanceOf[id];
    tk.transfer(msg.sender, _recv);
    given[id] += _recv;
    balanceOf[id] -= _recv;
    
    emit DropCollected(drops[i].token, _recv);
    }
    
    function empty(uint256 id){
        require(drops[id].endTime < block.timestamp, "Not yet ended");
        require(balanceOf[id]>0, "Unable to empty");
       IERC20(drops[i].token).transfer(msg.sender, balanceOf[id]);
       balanceOf[id] = 0;
    }
    
    function getCreatedDrop() public view returns (unit256[]){
        return ownedDrop[msg.sender];
    }
    
    function hasCollected(uint256 id) public view returns (bool){
        return participated[id][msg.sender];
    }
}