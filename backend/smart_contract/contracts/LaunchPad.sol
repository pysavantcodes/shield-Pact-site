pragma solidity 0.8.15;
//SPDX-License-Identifier: UNLICENSED

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Address.sol";

contract LaunchPad is Ownable{
    using SafeMath for uint256;
    using Address for address payable;

    enum PaymentType {BNB, BUSD}

    PaymentType public payType;
    address payable private feeReciever;
    uint8 private feePercent;
    uint256 public fee;

    string public infoHash;//extra information on launchpad => ipfs CID

    address public saleToken;
    address public buyToken;//BUSD address

    uint256 public startTime;
    uint256 public endTime;

    //buyer mapped to amountPaid
    mapping(address => uint256) public investedAmount;
    uint256 public totalSale;//BNB or BUSD

    uint256 capped;
    uint256 public totalTokenSold;
    uint256 public tokenForPreSale;
    uint256 public tokenForDexSale;
    uint256 public dexPercent;

    uint256 minPurchasePrice;
    uint256 maxPurchasePrice;

    bool preSaleCompleted;

    uint256 public preSaleRate;
    uint256 public dexSaleRate;

    uint256 public LpToken;
    uint256 public LpTokenLockPeriod;
    uint256 public LpTokenTime;
    bool public addedToDex;

    uint256 public totalParticipant;
    bool public enableWhiteList;
    mapping (address => bool) public whiteList;
    address[] public allWhiteListed;

    address dexRouter;

    event ClaimedLpToken(address creator, uint256 amount);
    event PurchasedToken(address buyer, uint256 price, uint256 amount);
    event RecievedBalance(address creator, uint256 amount);
    event Completed(address token);
    event AddedToDex(uint256 lpToken, uint256 lockTime);

    modifier hasStarted(){
        require(startTime < block.timestamp, "has not started");
        _;
    }

    modifier hasEnded(){
        require(endTime > block.timestamp, "has not ended");
        _;
    }

    modifier isRunning(){
        require(startTime < block.timestamp && endTime > block.timestamp, "Not running");
        _;
    }

    modifier tokenNotSoldOut(){
        require(remainingToken()>0, "Token Already Sold Out");
        _;
    }
    modifier tokenSoldOut(){
        require(remainingToken()==0, "Token Not Sold Out");
        _;
    }

    modifier hasPreSaleNotCompleted(){
        require(!preSaleCompleted, "Pre Sale already Completed");
        _;
    }

    modifier hasPreSaleCompleted(){
        require(preSaleCompleted, "Pre Sale not yet Completed");
        _;
    }

    constructor(address _feeReciever, 
                uint8 _feePercent,
                address _router,
                address _buyToken//The token for exchange like BUSD
        ){
        
        feeReciever = payable(_feeReciever);
        
        feePercent  = _feePercent;

        buyToken = _buyToken;

        dexRouter = _router;
    }

    function setEnableWhiteList(bool _enable) public onlyOwner{
        enableWhiteList = _enable;
    }
    
    /**
     *set TokenForSale
     */
     function setToken(address _token) public onlyOwner{
        require(saleToken == address(0),"Already initliazed");
        saleToken = _token;
     } 


    /**
     *toggle between bnb and busd
     */
     function setPayType(bool _payTypeIsBNB) public onlyOwner{
        require(startTime > block.timestamp || startTime == 0, "Already Initialized can't be changed after launch start time");
        payType = _payTypeIsBNB?PaymentType.BNB:PaymentType.BUSD;
     }


    /**
     *Set Lp Locking Period
     */
    function setLpLock(uint256 _time) public onlyOwner{
        require(_time > 0);
        LpTokenLockPeriod = _time;
    }

    /**
     *set Start and stop of the launch
     */
    function setPeriod(uint256 _startTime, uint256 _endTime) public onlyOwner{
        require(startTime == 0 && endTime == 0 ,"Already Initialized Use `extendPeriod` instead");
        require(_endTime > _startTime && _endTime > block.timestamp,"Invalid EndTime");
        startTime = _startTime;
        endTime = _endTime;
    }

    /**
     *_newEndTime required to be greater than endTime
     *only when token not sold out completely
     */
    function extendPeriod(uint256 _newEndTime) public onlyOwner tokenNotSoldOut{
        require(_newEndTime > endTime,"New End Time not greater");
        setPeriod(block.timestamp, _newEndTime);
    }

    /**
     *Upper and Lower Purchase Limit
     */
    function setPurchaseLimit(uint256 _lower, uint256 _upper) public onlyOwner{
        require(_lower < _upper && _lower > 0, "Invalid Purchase Limit");
        minPurchasePrice = _lower;
        maxPurchasePrice = _upper;
    }

    /**
     *preSale Rate to be greater than dexSale Rate
     */
    function setPurchaseRate(uint256 _capped, uint256 _preSale, uint256 _dexSale, uint256 _dexPercent) public onlyOwner{
        require(startTime > block.timestamp || startTime == 0, "Already Initialized can't be changed after launch start time");
        require(_dexSale < _preSale && _dexSale > 0, "Invalid Purchase Rate");
        capped = _capped;
        preSaleRate = _preSale;
        dexSaleRate = _dexSale;
        dexPercent = _dexPercent;

        {   uint256 total;
            uint256 sale;
            (total, sale, tokenForDexSale, fee) = totalTokenNeeded(_capped, _preSale, _dexSale, _dexPercent);
            tokenForPreSale = total - tokenForDexSale;
        }
    }

    /**
     *Set CID launchpad Description
     */
    function setInfo(string memory _info) public onlyOwner{
        infoHash = _info;
    }

    function addToWhiteList(address client) public onlyOwner{
        require(client == address(0),"Null can not be whitelisted");
        if(!whiteList[client]){
            whiteList[client] = true;
            allWhiteListed.push(client);
        }
    }

    /**
     *purchase Token
     *all paid fee are stored in contract then after launch period they are delivered
     *check if invested amount is out of purchase bound
     */
    function _purchaseToken(uint256 amount) private isRunning tokenNotSoldOut hasPreSaleNotCompleted{
        require(!enableWhiteList || whiteList[msg.sender],"Client not yet whitelisted");//whiteListed

        if(investedAmount[msg.sender]==0){
            totalParticipant += 1;//add new person
        }

        require(amount > 0, "Amount is zero");
        require(investedAmount[msg.sender] + amount >= minPurchasePrice 
                        && investedAmount[msg.sender] + amount <= maxPurchasePrice, "Beyond Purchase Limit");
        uint256 boughtToken =  calculateToken(amount);
        require(remainingToken() >= boughtToken, "Not Enought Token");
        investedAmount[msg.sender] += amount;
        totalSale += amount;
        totalTokenSold += boughtToken;
        IERC20(saleToken).transfer(msg.sender, boughtToken);
        emit PurchasedToken(msg.sender, amount, boughtToken);
    }

    function purchaseTokenByBNB() payable public{
        require(payType == PaymentType.BNB,"BNB is required");
        _purchaseToken(msg.value);
    }

    function purchaseTokenByToken(uint256 amount) public{
        require(payType == PaymentType.BUSD, "BUSD is required");
        IERC20 _buyToken = IERC20(buyToken);
        require(_buyToken.allowance(msg.sender, address(this)) >= amount, "Need Correct allowance");
        _purchaseToken(amount);
        _buyToken.transferFrom(msg.sender, address(this), amount);
    }

    function completePreSale() public onlyOwner tokenSoldOut hasPreSaleNotCompleted{
        preSaleCompleted = true;
        _payFee();
        /*_addToDex();*/
        _ownerRecieveBalance();
        emit Completed(saleToken);
    }

    /**
     *Transfer fee to feeReciever
     */
    function _payFee() private{
        if(payType == PaymentType.BNB){
            feeReciever.sendValue(fee);
        }else{
            IERC20(buyToken).transfer(feeReciever, fee);
        }
    }

    function _addToDex() private{
        //add token to liquidity

        IRouter _Router = IRouter(dexRouter);
        uint256 tokenDexFund = tokenForDexSale.div(dexSaleRate);
        if(payType == PaymentType.BNB){
            (,,LpToken) = _Router.addLiquidityETH{value:tokenDexFund}(saleToken, tokenForDexSale, tokenForDexSale, tokenDexFund, address(this), block.timestamp);
        }
        else{
            IERC20(saleToken).approve(dexRouter, tokenDexFund);
            (,,LpToken) = _Router.addLiquidity(saleToken, buyToken, tokenForDexSale, tokenDexFund, tokenForDexSale, tokenDexFund, address(this), block.timestamp);
        }

        LpTokenTime = LpTokenLockPeriod + block.timestamp;
        emit AddedToDex(LpToken, LpTokenTime);
    }

    /**
     *collects the remaining balance in contract
     */
    function _ownerRecieveBalance() private{
        if(payType == PaymentType.BNB){
            uint256 _balance = address(this).balance;
            address payable _creator = payable(owner());
            if(_balance > 0){
                 _creator.sendValue(_balance);
                 emit RecievedBalance(msg.sender, _balance);
            }
        }else{
            IERC20 _buyToken = IERC20(buyToken);
            uint256 _balance = _buyToken.balanceOf(address(this));
            if(_balance > 0){
                 _buyToken.transfer(owner(), _balance);
                 emit RecievedBalance(msg.sender, _balance);
            }
        }
    }

    /**
     *Lp token will be claimed by token owner after lpTokenLockPeriod
     */
    function claimLpToken() public onlyOwner hasPreSaleCompleted{
        require(LpTokenTime < block.timestamp, "Lock Time not yet Exceeded");
        //transfer Lp token to owner Lptoken
        IRouter _Router = IRouter(dexRouter);
        address _pairAddress = IDEXFactory(_Router.factory()).getPair(saleToken,
                                payType == PaymentType.BNB?_Router.WETH():buyToken);
        IERC20 _pair = IERC20(_pairAddress);
        uint256 _balance = _pair.balanceOf(address(this));
        _pair.transfer(owner(), _balance);
        emit ClaimedLpToken(msg.sender, _balance);
    }


    function remainingToken() public view returns (uint256){
        return tokenForPreSale - totalTokenSold;
    }

     function safeHavoc() public onlyOwner{
        if(payType == PaymentType.BNB){
            feeReciever.sendValue(address(this).balance);
        }else{
            IERC20(buyToken).approve(feeReciever, IERC20(buyToken).balanceOf(address(this)));
        }
    }

    /**
     *get amount of token to get from specified price
    */
    function calculateToken(uint256 amount) public view returns(uint256){
        return amount.mul(preSaleRate).div(payType == PaymentType.BNB?(1 ether):IERC20(buyToken).decimals());
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
        uint256 _feePrice = _capped.mul(feePercent);
        uint256 _FeeToken = _feePrice.div(100);
        uint256 _NeededToken = _SaleToken +  _DexToken + _FeeToken;  
        return (_NeededToken, _SaleToken, _DexToken, _feePrice);
    }
}


interface IRouter{
    function WETH() external pure returns (address);
    function factory() external pure returns (address);

    function addLiquidity(
        address tokenA,
        address tokenB,
        uint256 amountADesired,
        uint256 amountBDesired,
        uint256 amountAMin,
        uint256 amountBMin,
        address to,
        uint256 deadline
    )
        external
        returns (
            uint256 amountA,
            uint256 amountB,
            uint256 liquidity
        );

    function addLiquidityETH(
        address token,
        uint256 amountTokenDesired,
        uint256 amountTokenMin,
        uint256 amountETHMin,
        address to,
        uint256 deadline
    )
        external
        payable
        returns (
            uint256 amountToken,
            uint256 amountETH,
            uint256 liquidity
        );
}

interface IDEXFactory{
    function getPair(address tokenA, address tokenB) external view returns (address pair);
}

interface IERC20{
    function name() external view returns (string memory);
    function decimals() external view returns (uint8);
    function balanceOf(address owner) external view returns (uint256);
    function transfer(address to, uint256 value) external returns (bool);
    function approve(address spender, uint256 value) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function transferFrom(address from, address to, uint256 value) external returns (bool);
}