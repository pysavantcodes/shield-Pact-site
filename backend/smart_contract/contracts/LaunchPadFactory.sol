pragma solidity 0.8.15;
//SPDX-License-Identifier: UNLICENSED


import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./LaunchPad.sol";

contract LaunchPadFactory is Ownable{
    using SafeMath for uint256;
   //Fee
    uint256 public fee;
    uint8 public feePercent;
    //fee Reciever is the owner of the Factory

    //Dex Router e.g PancakeSwap
    address dexRouter;

    //Creator to Tokens
    mapping(address => address[]) private creatorPad;
    
    //All Tokens
    address[] public allPads;

    address bnbAltToken;
    
    event PadCreated(address creator, address pad);
   	event FeeWithdrawn(uint256 amount);
    
    modifier paidFee(){
        require(msg.value == fee, "Fee must be paid before creation");
        _;
    }

    constructor(uint256 _fee, uint8 _feePercent, address _altToken, address _router){
        setFee(_fee);
        setFeePercent(_feePercent);
        setBNBAltToken(_altToken);
        setDexRouter(_router);
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

    function setFeePercent(uint8 _percent) public onlyOwner{
        require(_percent > 0,"Percent <= 0");
        feePercent = _percent;
    }
    
    
    function createPad(address token_,
                    bool payTypeIsBNB,
                    uint256 _preSaleRate,
                    uint256 _dexSaleRate,
                    uint8 _dexPercent,
                    uint256 _capped,//fund to be raised
                    uint256[] memory MinMaxBuy,//lowest 7 highest amount of token purchase
                    uint256[] memory _startEndTime,
                    uint256 _lpLockPeriod,
                    string memory _CID,
                    bool _enableWhiteList
                        ) public paidFee payable{
        require(token_ != address(0),"Token can not be zero");
        require(bytes(IERC20(token_).name()).length != 0, "Token does not exist");

        (uint256 totalToken,,,) = totalTokenNeeded(_capped, _preSaleRate, _dexSaleRate, _dexPercent);
    
       
        LaunchPad newPad = new LaunchPad(owner(), feePercent, dexRouter, bnbAltToken);
     
        newPad.setToken(token_);
        newPad.setPayType(payTypeIsBNB);
        newPad.setPurchaseRate(_capped, _preSaleRate, _dexSaleRate, _dexPercent);//extimate all purchase
        newPad.setPurchaseLimit(MinMaxBuy[0], MinMaxBuy[1]);//set upeer and lower buy limit
        newPad.setPeriod(_startEndTime[0], _startEndTime[1]);//set period of purchase
        newPad.setInfo(_CID);//set launch description
        newPad.setLpLock(_lpLockPeriod);//set lock period of lpToken
        newPad.setEnableWhiteList(_enableWhiteList);

        address newPadAddress = address(newPad);
        require(totalToken <= IERC20(token_).allowance(msg.sender, address(this)), "Allowance needed");
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
     *dexPercent => percentage of funds raised to be used for liquidity
     *Add percent fee of raised amount as token to be bought
     */
    function totalTokenNeeded(uint256 _capped, uint256 _saleRate, uint256 _dexRate, uint256 _dexPercent) 
    public view 
    returns (uint256, uint256, uint256, uint256)
    {
        uint256 _SaleToken = _saleRate.mul(_capped);
        uint256 _DexToken = _capped.mul(_dexRate).mul(_dexPercent).div(100);
        uint256 _feePrice = _capped.mul(feePercent).div(100);
        uint256 _FeeToken = _feePrice.mul(_saleRate);
        uint256 _NeededToken = _SaleToken +  _DexToken + _FeeToken;  
        return (_NeededToken, _SaleToken, _DexToken, _feePrice);
    }
   
}