pragma solidity 0.8.15;
//SPDX-License-Identifier: UNLICENSED


import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./IERC20.sol";
import "./launch/LaunchPadLib.sol";
import "./launch/LaunchPad.sol";

contract LaunchPadFactory is Ownable{
    using SafeMath for uint256;
    
   //Fee
    uint256 public fee;
    //fee Reciever is the owner of the Factory

    //Dex Router e.g PancakeSwap
    address dexRouter;

    //Creator to Tokens
    mapping(address => address[]) private creatorPad;
    
    //All Tokens
    address[] public allPads;

    address bnbAltToken;
    
    //constant tokenfeeBps and BnbfeeBps
    uint16[2][3] public feeOption;/* = [
                                    [0,500],//0% and 5%=>500/10000
                                    [200,200],
                                    [0,300]
                                ];*/

    event PadCreated(address creator, address pad);
   	event FeeWithdrawn(uint256 amount);
    
    modifier paidFee(){
        require(msg.value == fee, "Fee must be paid before creation");
        _;
    }

    constructor(uint256 _fee, address _altToken, address _router){
        setFee(_fee);
        setBNBAltToken(_altToken);
        setDexRouter(_router);
       // feeOption = new uint16[2][](3);
        feeOption[0] = [0,500];
        feeOption[1] = [200,200];
        feeOption[2] = [0,300];
    }
    
    function setDexRouter(address _dexRouter) public onlyOwner{
        dexRouter = _dexRouter;
    }

    function setBNBAltToken(address _altToken) public onlyOwner{
        require(_altToken != address(0), "Alternative BNB Token address cannot be null");
        bnbAltToken = _altToken;
    }

    function setFee(uint256 _fee) public onlyOwner{
        require(_fee > 0, "Amount <= 0");
        fee = _fee;
    }

    function createPad(
        uint8 _launchType,
        address token_,
        bool payTypeIsBNB,
        uint256 _capped,
        //fund to be raised
        uint16 _dexBps,
        uint256[] memory _preDexRate,
        uint256[] memory MinMaxBuy,
        //lowest 7 highest amount of token purchase
        uint256[] memory _startEndTime,
        uint32 _lpLockPeriod,
        string memory _CID,
        bool _enableWhiteList
        )public paidFee payable{
        require(token_ != address(0),"Token can not be zero");
        require(bytes(IERC20(token_).name()).length != 0, "Token does not exist");
        
        uint16[2] storage _launchFee = feeOption[_launchType];

        uint256 totalToken = totalTokenNeeded(
                                _capped,
                                _preDexRate[0],
                                _preDexRate[1],
                                _dexBps,
                                _launchFee[1],
                                _launchFee[0]
                            );
    
        LaunchPad newPad = new LaunchPad(owner(), dexRouter, bnbAltToken, _launchFee[1], _launchFee[0]);
     
        newPad.setToken(token_);
        newPad.setPayType(payTypeIsBNB);
        newPad.setPurchaseRate(_capped, _preDexRate[0], _preDexRate[1], _dexBps);//extimate all purchase
        newPad.setPurchaseLimit(MinMaxBuy[0], MinMaxBuy[1]);//set upeer and lower buy limit
        newPad.setPeriod(_startEndTime[0], _startEndTime[1]);//set period of purchase
        newPad.setInfo(_CID);//set launch description
        newPad.setLpLock(_lpLockPeriod);//set lock period of lpToken
        newPad.setEnableWhiteList(_enableWhiteList);

        address newPadAddress = address(newPad);
        (totalToken <= IERC20(token_).allowance(msg.sender, address(this)), "Allowance needed");
        IERC20(token_).transferFrom(msg.sender, newPadAddress, totalToken);
        newPad.transferOwnership(msg.sender);
        allPads.push(newPadAddress);
        creatorPad[msg.sender].push(newPadAddress);
        emit PadCreated(msg.sender, newPadAddress);
    }
    
    function createdPad() public view returns (address[] memory){
        return creatorPad[msg.sender];
    }

     function getRecievedFee() public view onlyOwner returns (uint256){
        return address(this).balance;
    }
    
    function withdrawFee() public onlyOwner{
        uint256 feeAmount  = getRecievedFee();
        require(feeAmount > 0, "No Fee to Withdraw");
        address payable reciever = payable(owner());
        (bool success,) = reciever.call{value:feeAmount}("");
        require(success, "Failed");
        emit FeeWithdrawn(feeAmount);
    }

    function lengthOfAllPads() public view returns (uint256){
        return allPads.length;
    }

    /** 
     *capped amount => fund to be raised
     *dexBps => percentage of funds raised to be used for liquidity
     *feeBps for bnb and token
     */
    function totalTokenNeeded(
    uint256 capped_,
    uint256 saleRate_,
    uint256 dexRate_,
    uint16 dexBps_,
    uint16 bnbFeeBps_,
    uint16 tkFeeBps_)
    public view
    returns (uint256)
    {
        return LaunchPadLib.totalTokenSold(
        capped_, saleRate_, dexRate_, dexBps_, bnbFeeBps_, tkFeeBps_);
    }
}